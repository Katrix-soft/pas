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
        this.vapidPublicKey = res.public_key.trim();
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
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      console.warn('⚠️ ServiceWorker no disponible en navigator.');
      return;
    }

    try {
      // 1. Obtener la clave VAPID pública del backend
      console.log('🔄 Solicitando clave VAPID pública al backend FastAPI...');
      const publicKey = await this.fetchVapidPublicKey();
      if (!publicKey) {
        console.error('❌ Error grave: La VAPID_PUBLIC_KEY retornada por el backend está vacía.');
        return;
      }

      // 2. Registrar y esperar a que el Service Worker esté 100% LISTO y ACTIVO
      console.log('🔄 Registrando y esperando activación del Service Worker (/sw.js)...');
      await navigator.serviceWorker.register('/sw.js');
      const reg = await navigator.serviceWorker.ready;

      if (!reg || !reg.pushManager) {
        console.error('❌ Error: reg.pushManager no está disponible en este dispositivo/navegador.');
        return;
      }

      // 3. Obtener suscripción activa o crear una nueva con try/catch explícito
      let subscription: PushSubscription | null = null;
      try {
        subscription = await reg.pushManager.getSubscription();
      } catch (getErr) {
        console.warn('⚠️ Error al consultar getSubscription():', getErr);
      }

      if (!subscription) {
        console.log('🔑 Convirtiendo VAPID_PUBLIC_KEY a Uint8Array...');
        const convertedKey = urlBase64ToUint8Array(publicKey);
        console.log(`🔑 Key VAPID convertida (${convertedKey.length} bytes):`, convertedKey);

        console.log('📲 Invocando reg.pushManager.subscribe()...');
        try {
          subscription = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedKey
          });
          console.log('✅ reg.pushManager.subscribe() exitoso:', subscription);
        } catch (subErr: any) {
          console.error('❌ ERROR GRAVE al ejecutar reg.pushManager.subscribe():', subErr);
          alert(`⚠️ No se pudo suscribir el celular al servicio de Push: ${subErr?.message || subErr}`);
          return;
        }
      } else {
        console.log('ℹ️ Se encontró una PushSubscription activa existente:', subscription);
      }

      if (!subscription) {
        console.error('❌ La suscripción PushSubscription obtenida es nula.');
        return;
      }

      const subJson = subscription.toJSON();
      console.log('📲 PushSubscription objeto JSON obtenido:', subJson);

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
          console.log('✅ ¡ÉXITO! Suscripción VAPID guardada en backend FastAPI:', res);
        },
        error: (err) => {
          console.error('❌ Error enviando POST /api/v1/push/subscribe al backend:', err);
        }
      });

    } catch (err: any) {
      console.error('❌ Excepción general en suscribirDispositivoBackend():', err);
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
