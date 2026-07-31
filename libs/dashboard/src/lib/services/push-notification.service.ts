import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  fetchVapidPublicKey() {
    this.http.get<{ public_key: string }>('/api/v1/push/vapid-public-key').subscribe({
      next: (res) => {
        if (res && res.public_key) {
          this.vapidPublicKey = res.public_key;
        }
      },
      error: () => {}
    });
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
      // Suscribir el dispositivo en el servidor de Push (Google FCM / Apple APNs) con llaves VAPID
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
      let reg = await navigator.serviceWorker.getRegistration();
      if (!reg) {
        reg = await navigator.serviceWorker.register('/sw.js');
      }

      if (reg && reg.pushManager) {
        const applicationServerKey = urlBase64ToUint8Array(this.vapidPublicKey);
        const subscription = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: applicationServerKey
        });

        const subJson = subscription.toJSON();
        
        // Enviar suscripción VAPID a FastAPI DB
        this.http.post('/api/v1/push/subscribe', {
          endpoint: subJson.endpoint,
          keys: subJson.keys
        }).subscribe({
          next: () => {
            this.isSubscribedBackend.set(true);
            console.log('✅ Suscripción VAPID guardada en backend FastAPI!');
          },
          error: (err) => {
            console.warn('Error guardando suscripción en backend:', err);
          }
        });
      }
    } catch (err) {
      console.warn('Error al suscribir VAPID a Google/Apple Push Service:', err);
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
      // Disparar vía Backend API VAPID Push (que lo manda al Push Service real de Google/Apple)
      this.http.post('/api/v1/push/send-notification', {
        titulo: alerta.titulo,
        mensaje: alerta.mensaje,
        tipo: alerta.tipo,
        link: alerta.link || '/dashboard'
      }).subscribe({
        next: (res: any) => {
          console.log('✅ Push VAPID enviado desde backend:', res);
        },
        error: () => {
          // Fallback a Service Worker local postMessage
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
