import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface PushPopAlert {
  id: string;
  titulo: string;
  mensaje: string;
  tipo: 'siniestro' | 'cobranzas' | 'cartera';
  link?: string;
  icon: string;
  hora: string;
  remitente?: string;
  recipientRole?: 'pas' | 'admin' | 'all';
}

function setCookie(name: string, value: string, seconds: number = 3600) {
  if (typeof document === 'undefined') return;
  const d = new Date();
  d.setTime(d.getTime() + (seconds * 1000));
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${d.toUTCString()};path=/;SameSite=Lax`;
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }
  return null;
}

function deleteCookie(name: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

function generateIdempotencyKey(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function urlBase64ToUint8Array(base64String: string) {
  if (!base64String) return new Uint8Array(0);
  const cleanBase64 = base64String.trim();
  const padding = '='.repeat((4 - (cleanBase64.length % 4)) % 4);
  const base64 = (cleanBase64 + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  private http = inject(HttpClient);

  activeToast = signal<PushPopAlert | null>(null);
  pushPermissionStatus = signal<string>('default');
  isHttps = signal<boolean>(true);
  
  isSubscribedBackend = signal<boolean>(false);
  isSubscribing = signal<boolean>(false);
  subscriptionError = signal<string | null>(null);

  // Modo sensorial suave (activado por defecto para evitar sobrecarga sensorial / autismo / hipersensibilidad)
  isSensoryModeEnabled = signal<boolean>(true);

  countdownSecs = signal<number>(0);
  vapidPublicKey = '';

  private broadcastChannel: BroadcastChannel | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.isHttps.set(window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
      if ('Notification' in window) {
        this.pushPermissionStatus.set(Notification.permission);
      }
      this.fetchVapidPublicKey();
      this.checkExistingSubscriptionStatus();

      // Escuchar eventos de sonido enviados desde el ServiceWorker
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data && event.data.type === 'PLAY_NOTIFICATION_SOUND') {
            this.reproducirSonidoSensorialCalmante();
          }
        });
      }

      // BroadcastChannel para sincronizar ventanas simultáneas
      if ('BroadcastChannel' in window) {
        try {
          this.broadcastChannel = new BroadcastChannel('jc_pas_realtime_notifications');
          this.broadcastChannel.onmessage = (event) => {
            if (event.data?.type === 'EMIT_PUSH_ALERT' && event.data?.alert) {
              const alert = event.data.alert;
              const role = event.data.recipientRole || 'pas';
              this.handleIncomingAlert(alert, role);
            }
          };
        } catch (e) {}
      }
    }
  }

  async fetchVapidPublicKey(): Promise<string> {
    if (this.vapidPublicKey) return this.vapidPublicKey;
    try {
      const res = await firstValueFrom(this.http.get<{ public_key: string }>('/api/v1/push/vapid-public-key'));
      if (res && res.public_key) {
        this.vapidPublicKey = res.public_key.trim();
      }
    } catch (err) {}
    return this.vapidPublicKey;
  }

  async checkExistingSubscriptionStatus() {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg && reg.pushManager) {
        const sub = await reg.pushManager.getSubscription();
        if (sub && Notification.permission === 'granted') {
          const subJson = sub.toJSON();
          const payload = {
            endpoint: subJson.endpoint,
            keys: {
              p256dh: subJson.keys?.['p256dh'] || '',
              auth: subJson.keys?.['auth'] || ''
            }
          };
          this.http.post('/api/v1/push/subscribe', payload, {
            headers: { 'Idempotency-Key': generateIdempotencyKey() }
          }).subscribe({
            next: () => {
              this.isSubscribedBackend.set(true);
            },
            error: () => {
              this.isSubscribedBackend.set(false);
            }
          });
        }
      }
    } catch (e) {}
  }

  descartarToast() {
    this.activeToast.set(null);
  }

  async solicitarPermisoYSuscribir(): Promise<boolean> {
    if (this.isSubscribing()) return false;

    if (typeof window === 'undefined' || !('Notification' in window)) {
      alert('Tu navegador o dispositivo no soporta Notificaciones Push.');
      return false;
    }

    this.isSubscribing.set(true);
    this.subscriptionError.set(null);

    try {
      let permission = Notification.permission;
      if (permission !== 'granted') {
        permission = await new Promise<NotificationPermission>((resolve) => {
          try {
            const res = Notification.requestPermission((p) => resolve(p));
            if (res && typeof (res as any).then === 'function') {
              (res as any).then(resolve);
            }
          } catch (e) {
            resolve('denied');
          }
        });
      }

      this.pushPermissionStatus.set(permission);
      if (permission !== 'granted') {
        this.isSubscribing.set(false);
        return false;
      }

      const publicKey = await this.fetchVapidPublicKey();
      if (!publicKey) {
        throw new Error('No se pudo obtener la VAPID_PUBLIC_KEY del servidor.');
      }

      await navigator.serviceWorker.register('/sw.js?v=20260803');
      const reg = await navigator.serviceWorker.ready;
      if (reg && reg.update) {
        try { await reg.update(); } catch (e) {}
      }

      if (!reg || !reg.pushManager) {
        throw new Error('reg.pushManager no está disponible en este navegador.');
      }

      const applicationServerKey = urlBase64ToUint8Array(publicKey);
      
      let subscription: PushSubscription | null = null;
      try {
        subscription = await reg.pushManager.getSubscription();
        if (!subscription) {
          subscription = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey
          });
        }
      } catch (subErr: any) {
        throw new Error(`PushManager error: ${subErr?.message || subErr}`);
      }

      if (!subscription) {
        throw new Error('No se pudo generar el objeto PushSubscription.');
      }

      const subJson = subscription.toJSON();
      const payload = {
        endpoint: subJson.endpoint,
        keys: {
          p256dh: subJson.keys?.['p256dh'] || '',
          auth: subJson.keys?.['auth'] || ''
        }
      };

      await firstValueFrom(this.http.post<any>('/api/v1/push/subscribe', payload, {
        headers: { 'Idempotency-Key': generateIdempotencyKey() }
      }));

      this.isSubscribedBackend.set(true);
      this.isSubscribing.set(false);

      this.emitirAlerta({
        id: 'push-granted-' + Date.now(),
        titulo: '🔔 Suscripción Push Registrada',
        mensaje: 'Tu dispositivo quedó configurado para recibir notificaciones nativas en pantalla.',
        tipo: 'cartera',
        icon: 'notifications_active',
        remitente: 'JC PAS MESA OPERATIVA',
        hora: 'Ahora'
      });

      return true;

    } catch (err: any) {
      this.isSubscribedBackend.set(false);
      this.isSubscribing.set(false);
      this.subscriptionError.set(err?.message || 'Error en flujo de suscripción');
      return false;
    }
  }

  async emitirAlerta(alerta: PushPopAlert, recipientRole: 'pas' | 'admin' | 'all' = 'pas') {
    alerta.recipientRole = recipientRole;

    // Verificar preferencias ANTES de disparar cualquier cosa
    const prefs = this.getNotifPrefs();
    if (prefs.masterMuted || prefs.isDnd) return;

    // 1. Guardar en Cookie de alerta pendiente para sincronizar ventanas (incluyendo Incognito)
    try {
      setCookie('jc_pending_alert', JSON.stringify(alerta), 30);
    } catch (e) {}

    // 2. Difundir por BroadcastChannel a otras pestañas
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage({
          type: 'EMIT_PUSH_ALERT',
          alert: alerta,
          recipientRole
        });
      } catch (e) {}
    }

    // 3. Service worker → notificación nativa del SO (solo si no silenciado)
    if (prefs.sound) {
      this.dispararLocalServiceWorker(alerta);
    }
  }

  public checkAndConsumePendingAlert(currentRole: string) {
    const raw = getCookie('jc_pending_alert');
    if (raw) {
      try {
        const alerta: PushPopAlert = JSON.parse(raw);
        const recipientRole = alerta.recipientRole || 'pas';
        
        if (recipientRole === 'all' || recipientRole === currentRole) {
          deleteCookie('jc_pending_alert');
          this.emitirAlertaLocal(alerta);
        }
      } catch (e) {}
    }
  }

  private handleIncomingAlert(alerta: PushPopAlert, recipientRole: string) {
    if (recipientRole === 'all' || recipientRole === 'pas') {
      this.emitirAlertaLocal(alerta);
    }
  }

  /** Lee las preferencias del usuario desde localStorage, incluyendo DND activo */
  private getNotifPrefs(): { masterMuted: boolean; sound: boolean; vibration: boolean; isDnd: boolean } {
    try {
      const raw = localStorage.getItem('jc_notif_prefs');
      if (raw) {
        const p = JSON.parse(raw);
        const isDnd = this.checkDndActive(!!p.dndEnabled, p.dndFrom || '22:00', p.dndTo || '08:00');
        return {
          masterMuted: !!p.masterMuted,
          sound: p.sound !== false,
          vibration: p.vibration !== false,
          isDnd
        };
      }
    } catch { }
    return { masterMuted: false, sound: true, vibration: true, isDnd: false };
  }

  /** Determina si el horario actual está dentro del rango DND */
  private checkDndActive(enabled: boolean, from: string, to: string): boolean {
    if (!enabled) return false;
    try {
      const now = new Date();
      const [fH, fM] = from.split(':').map(Number);
      const [tH, tM] = to.split(':').map(Number);
      const cur = now.getHours() * 60 + now.getMinutes();
      const start = fH * 60 + fM;
      const end = tH * 60 + tM;
      // Rango que cruza medianoche (ej: 22:00 -> 08:00)
      if (start > end) return cur >= start || cur < end;
      return cur >= start && cur < end;
    } catch { return false; }
  }

  public emitirAlertaLocal(alerta: PushPopAlert) {
    const prefs = this.getNotifPrefs();

    // Si el maestro está silenciado o estamos en DND, no mostrar nada
    if (prefs.masterMuted || prefs.isDnd) return;

    this.activeToast.set(alerta);

    // Reproducir tono SENSORIAL CALMANTE solo si sound está activo
    if (prefs.sound) {
      this.reproducirSonidoSensorialCalmante();
    }

    // Vibración suave solo si está activada
    if (prefs.vibration && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try { navigator.vibrate([100, 50, 100]); } catch (e) {}
    }

    // Notificación Nativa del Sistema Operativo
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(alerta.titulo, {
          body: alerta.mensaje,
          icon: '/assets/icons/icon-192x192.png'
        });
      } catch (e) {}
    }

    setTimeout(() => {
      if (this.activeToast()?.id === alerta.id) {
        this.activeToast.set(null);
      }
    }, 8500);
  }

  /**
   * SINTETIZADOR DE AUDIO SENSORIALMENTE AMIGABLE (CEA / AUTISMO / SENSORY FRIENDLY)
   * Diseñado con tonos cálidos, frecuencias bajas, arpegio mayor tipo Marimba / Campanilla suave
   * y rampa de ataque/decaimiento envolvente para EVITAR estruendos o agudos punzantes.
   */
  public reproducirSonidoSensorialCalmante() {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const audioCtx = new AudioContextClass();

      // Arpegio armónico relajante en Do Mayor (C4 - E4 - G4 - C5)
      // Frecuencias orgánicas de baja intensidad (sin estridentismo)
      const notas = [
        { freq: 261.63, delay: 0.00, dur: 0.6 }, // Do4 (C4)
        { freq: 329.63, delay: 0.12, dur: 0.6 }, // Mi4 (E4)
        { freq: 392.00, delay: 0.24, dur: 0.7 }, // Sol4 (G4)
        { freq: 523.25, delay: 0.36, dur: 0.9 }  // Do5 (C5)
      ];

      const masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.12, audioCtx.currentTime); // Volumen controlado sin sobrecargas
      masterGain.connect(audioCtx.destination);

      notas.forEach((n) => {
        const startTime = audioCtx.currentTime + n.delay;

        // Oscilador 1: Triángulo suave (sonido tipo madera/marimba)
        const osc = audioCtx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.freq, startTime);

        // Oscilador 2: Seno armónico secundario para calidez
        const subOsc = audioCtx.createOscillator();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(n.freq * 2, startTime);

        const noteGain = audioCtx.createGain();
        // Rampa de entrada suave (30ms fade-in para evitar sobresaltos bruscos)
        noteGain.gain.setValueAtTime(0, startTime);
        noteGain.gain.linearRampToValueAtTime(0.28, startTime + 0.03);
        // Decaimiento envolvente exponencial suave
        noteGain.gain.exponentialRampToValueAtTime(0.001, startTime + n.dur);

        const subGain = audioCtx.createGain();
        subGain.gain.setValueAtTime(0, startTime);
        subGain.gain.linearRampToValueAtTime(0.08, startTime + 0.03);
        subGain.gain.exponentialRampToValueAtTime(0.001, startTime + n.dur);

        osc.connect(noteGain);
        subOsc.connect(subGain);

        noteGain.connect(masterGain);
        subGain.connect(masterGain);

        osc.start(startTime);
        subOsc.start(startTime);

        osc.stop(startTime + n.dur);
        subOsc.stop(startTime + n.dur);
      });
    } catch (e) {}
  }

  private async dispararLocalServiceWorker(alerta: PushPopAlert, delayMs: number = 0) {
    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.getRegistration();
        const options: any = {
          body: alerta.mensaje,
          icon: '/assets/icons/icon-192x192.png',
          tag: alerta.id || ('jc-pas-' + Date.now()),
          renotify: true,
          requireInteraction: true,
          vibrate: [100, 50, 100],
          data: { url: alerta.link || '/dashboard' }
        };

        if (reg && reg.active) {
          reg.active.postMessage({
            type: 'SHOW_NOTIFICATION',
            title: alerta.titulo,
            options: options,
            delayMs: delayMs
          });
        }
      } catch (e) {}
    }
  }
}
