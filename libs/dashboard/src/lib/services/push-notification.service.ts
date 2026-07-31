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
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
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
  countdownSecs = signal<number>(0);

  vapidPublicKey = '';

  constructor() {
    if (typeof window !== 'undefined') {
      this.isHttps.set(window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
      if ('Notification' in window) {
        this.pushPermissionStatus.set(Notification.permission);
      }
      this.fetchVapidPublicKey();
    }
  }

  async fetchVapidPublicKey(): Promise<string> {
    if (this.vapidPublicKey) return this.vapidPublicKey;
    try {
      const res = await firstValueFrom(this.http.get<{ public_key: string }>('/api/v1/push/vapid-public-key'));
      if (res && res.public_key) {
        this.vapidPublicKey = res.public_key;
        console.log('🔑 Key VAPID Pública cargada desde backend:', this.vapidPublicKey);
      }
    } catch (err) {
      console.warn('⚠️ No se pudo obtener la llave VAPID del backend:', err);
    }
    return this.vapidPublicKey;
  }

  descartarToast() {
    this.activeToast.set(null);
  }

  async solicitarPermiso(): Promise<string> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      alert('Tu navegador o dispositivo no soporta la API de Notificaciones Push.');
      return 'unsupported';
    }

    let permission = Notification.permission;
    try {
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
    } catch (e) {
      console.warn('Error solicitando permiso:', e);
    }

    this.pushPermissionStatus.set(permission);

    if (permission === 'granted') {
      console.log('✅ Permiso de notificaciones otorgado por el usuario. Iniciando suscripción VAPID...');
      await this.suscribirDispositivoBackend();

      this.emitirAlerta({
        id: 'push-granted-' + Date.now(),
        titulo: '🔔 Suscripción Push VAPID Activa',
        mensaje: 'Dispositivo vinculado al servidor de Push. Recibirás notificaciones nativas en la persiana de Android/iOS.',
        tipo: 'cartera',
        icon: 'notifications_active',
        remitente: 'JC PAS PUSH REAL',
        hora: 'Ahora'
      });
    } else if (permission === 'denied') {
      alert('Las notificaciones Push fueron denegadas en los ajustes de tu navegador o celular.');
    }

    return permission;
  }

  async suscribirDispositivoBackend() {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    try {
      // 1. Garantizar obtención de clave VAPID pública
      const publicKey = await this.fetchVapidPublicKey();
      if (!publicKey) {
        console.error('❌ Error: No se dispone de la VAPID_PUBLIC_KEY para suscribir.');
        return;
      }

      // 2. Obtener o registrar Service Worker
      let reg = await navigator.serviceWorker.getRegistration();
      if (!reg) {
        reg = await navigator.serviceWorker.register('/sw.js');
        await navigator.serviceWorker.ready;
      }

      if (reg && reg.pushManager) {
        // 3. Verificar si ya existe suscripción previa o crear nueva
        let subscription = await reg.pushManager.getSubscription();
        if (!subscription) {
          const applicationServerKey = urlBase64ToUint8Array(publicKey);
          subscription = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey
          });
        }

        const subJson = subscription.toJSON();
        console.log('📲 Obtenida PushSubscription del navegador:', subJson);

        const payload = {
          endpoint: subJson.endpoint,
          keys: {
            p256dh: subJson.keys?.['p256dh'] || '',
            auth: subJson.keys?.['auth'] || ''
          }
        };

        console.log('🚀 Enviando POST /api/v1/push/subscribe con el objeto:', payload);

        // 4. Enviar suscripción VAPID al backend FastAPI
        this.http.post('/api/v1/push/subscribe', payload).subscribe({
          next: (res: any) => {
            this.isSubscribedBackend.set(true);
            console.log('✅ Suscripción VAPID guardada con éxito en el backend FastAPI! Respuesta:', res);
          },
          error: (err) => {
            console.error('❌ Error guardando suscripción VAPID en backend:', err);
          }
        });
      }
    } catch (err) {
      console.error('❌ Error durante el proceso de suscripción Push VAPID:', err);
    }
  }

  async emitirAlerta(alerta: PushPopAlert, delayMs: number = 0) {
    // 1. Activar Toast emergente en pantalla (Signal)
    this.activeToast.set(alerta);

    // 2. Tono Web Audio API
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

    // 3. Vibrar celular
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try { navigator.vibrate([200, 100, 200, 100, 250]); } catch (e) {}
    }

    // 4. Disparar notificaciones VAPID vía Backend FastAPI a Google FCM / Apple Push
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      this.http.post('/api/v1/push/send-notification', {
        titulo: alerta.titulo,
        mensaje: alerta.mensaje,
        tipo: alerta.tipo,
        link: alerta.link || '/dashboard'
      }).subscribe({
        next: (res: any) => {
          console.log('✅ Push VAPID enviado desde backend FastAPI a Google/Apple:', res);
        },
        error: () => {
          this.dispararLocalServiceWorker(alerta, delayMs);
        }
      });
    }

    // 5. Auto ocultar el banner flotante después de 6.5 segundos
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
