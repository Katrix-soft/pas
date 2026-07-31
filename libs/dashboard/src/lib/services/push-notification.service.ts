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
  
  // Flag estricto: Se establece en true ÚNICAMENTE cuando POST /api/v1/push/subscribe responde HTTP 200 OK
  isSubscribedBackend = signal<boolean>(false);
  isSubscribing = signal<boolean>(false);
  subscriptionError = signal<string | null>(null);

  countdownSecs = signal<number>(0);
  vapidPublicKey = '';

  constructor() {
    if (typeof window !== 'undefined') {
      this.isHttps.set(window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
      if ('Notification' in window) {
        this.pushPermissionStatus.set(Notification.permission);
      }
      this.fetchVapidPublicKey();
      this.checkExistingSubscriptionStatus();
    }
  }

  async fetchVapidPublicKey(): Promise<string> {
    if (this.vapidPublicKey) return this.vapidPublicKey;
    try {
      const res = await firstValueFrom(this.http.get<{ public_key: string }>('/api/v1/push/vapid-public-key'));
      if (res && res.public_key) {
        this.vapidPublicKey = res.public_key.trim();
        console.log('🔑 Key VAPID Pública cargada del backend:', this.vapidPublicKey);
      }
    } catch (err) {
      console.warn('⚠️ No se pudo obtener la llave VAPID del backend:', err);
    }
    return this.vapidPublicKey;
  }

  async checkExistingSubscriptionStatus() {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg && reg.pushManager) {
        const sub = await reg.pushManager.getSubscription();
        if (sub && Notification.permission === 'granted') {
          // Re-sincronizar con el backend
          const subJson = sub.toJSON();
          const payload = {
            endpoint: subJson.endpoint,
            keys: {
              p256dh: subJson.keys?.['p256dh'] || '',
              auth: subJson.keys?.['auth'] || ''
            }
          };
          this.http.post('/api/v1/push/subscribe', payload).subscribe({
            next: () => {
              this.isSubscribedBackend.set(true);
              console.log('✅ Suscripción PWA existente re-verificada en backend FastAPI (HTTP 200 OK)');
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

  // FLUJO OBLIGATORIO EN ORDEN ESTRICTO
  async solicitarPermisoYSuscribir(): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      alert('Tu navegador o dispositivo no soporta Notificaciones Push.');
      return false;
    }

    this.isSubscribing.set(true);
    this.subscriptionError.set(null);

    try {
      // 1. Pedir permiso con Notification.requestPermission()
      console.log('PASO 1: Solicitando permiso con Notification.requestPermission()...');
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
        alert('Permiso de notificaciones denegado en el dispositivo.');
        this.isSubscribing.set(false);
        return false;
      }

      // 2. Obtener la clave VAPID pública
      console.log('PASO 2: Obtener VAPID_PUBLIC_KEY del backend...');
      const publicKey = await this.fetchVapidPublicKey();
      if (!publicKey) {
        throw new Error('No se pudo obtener la VAPID_PUBLIC_KEY del servidor.');
      }

      // 3. Esperar el SW con await navigator.serviceWorker.ready
      console.log('PASO 3: Esperar Service Worker con await navigator.serviceWorker.ready...');
      await navigator.serviceWorker.register('/sw.js');
      const reg = await navigator.serviceWorker.ready;

      if (!reg || !reg.pushManager) {
        throw new Error('reg.pushManager no está disponible en este navegador.');
      }

      // 4. Llamar a pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(vapidKey) })
      console.log('PASO 4: Llamar a reg.pushManager.subscribe() con Uint8Array VAPID key...');
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
        console.error('❌ Error en reg.pushManager.subscribe():', subErr);
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

      // 5. Hacer POST /api/v1/push/subscribe con el objeto suscripción
      console.log('PASO 5: Enviando POST /api/v1/push/subscribe al backend:', payload);
      const res = await firstValueFrom(this.http.post<any>('/api/v1/push/subscribe', payload));
      console.log('✅ Backend respondió 200 OK a /api/v1/push/subscribe:', res);

      // SOLO DESPUÉS DE QUE EL SUBSCRIBE RESPONDA 200, HABILITAR EL BOTÓN
      this.isSubscribedBackend.set(true);
      this.isSubscribing.set(false);

      this.emitirAlertaLocal({
        id: 'push-granted-' + Date.now(),
        titulo: '🔔 Suscripción Push VAPID Guardada',
        mensaje: '¡Éxito! Tu dispositivo quedó registrado en la base de datos para recibir notificaciones nativas en persiana.',
        tipo: 'cartera',
        icon: 'notifications_active',
        remitente: 'JC PAS PUSH 200 OK',
        hora: 'Ahora'
      });

      return true;

    } catch (err: any) {
      console.error('❌ FLUJO DE SUSCRIPCIÓN FALLÓ:', err);
      this.isSubscribedBackend.set(false);
      this.isSubscribing.set(false);
      this.subscriptionError.set(err?.message || 'Error en flujo de suscripción');
      alert('⚠️ Error en suscripción VAPID: ' + (err?.message || err));
      return false;
    }
  }

  async emitirAlerta(alerta: PushPopAlert, delayMs: number = 0) {
    // 1. Mostrar Toast emergente en pantalla siempre
    this.emitirAlertaLocal(alerta);

    // 2. Si no hay suscripción guardada en el backend, no llamar a send-notification
    if (!this.isSubscribedBackend()) {
      console.warn('⚠️ No se llama a send-notification porque no existe suscripción VAPID activa guardada en backend.');
      return;
    }

    // 3. Disparar notificaciones VAPID vía Backend FastAPI a Google FCM / Apple Push
    this.http.post('/api/v1/push/send-notification', {
      titulo: alerta.titulo,
      mensaje: alerta.mensaje,
      tipo: alerta.tipo,
      link: alerta.link || '/dashboard'
    }).subscribe({
      next: (res: any) => {
        console.log('✅ Push VAPID enviado desde backend FastAPI a Google/Apple:', res);
      },
      error: (err) => {
        console.warn('⚠️ Error en send-notification backend:', err);
        this.dispararLocalServiceWorker(alerta, delayMs);
      }
    });
  }

  private emitirAlertaLocal(alerta: PushPopAlert) {
    this.activeToast.set(alerta);

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        const audioCtx = new AudioContextClass();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      }
    } catch (e) {}

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try { navigator.vibrate([200, 100, 200, 100, 250]); } catch (e) {}
    }

    setTimeout(() => {
      if (this.activeToast()?.id === alerta.id) {
        this.activeToast.set(null);
      }
    }, 6500);
  }

  private async dispararLocalServiceWorker(alerta: PushPopAlert, delayMs: number = 0) {
    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.getRegistration();
        const options = {
          body: alerta.mensaje,
          icon: '/assets/icons/icon-192x192.png',
          badge: '/assets/icons/icon-192x192.png',
          tag: alerta.id || ('jc-pas-' + Date.now()),
          renotify: true,
          requireInteraction: true,
          vibrate: [300, 100, 300, 100, 300],
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

  probarPersianaAndroidConCuentaRegresiva(alerta: PushPopAlert) {
    this.countdownSecs.set(4);
    
    const interval = setInterval(() => {
      const current = this.countdownSecs();
      if (current > 1) {
        this.countdownSecs.set(current - 1);
      } else {
        clearInterval(interval);
        this.countdownSecs.set(0);
      }
    }, 1000);

    this.emitirAlerta(alerta, 3500);
  }
}
