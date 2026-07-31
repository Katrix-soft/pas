import { Injectable, signal } from '@angular/core';

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

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  activeToast = signal<PushPopAlert | null>(null);
  pushPermissionStatus = signal<string>('default');
  isHttps = signal<boolean>(true);

  constructor() {
    if (typeof window !== 'undefined') {
      this.isHttps.set(window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
      if ('Notification' in window) {
        this.pushPermissionStatus.set(Notification.permission);
      }
    }
  }

  descartarToast() {
    this.activeToast.set(null);
  }

  async solicitarPermiso(): Promise<string> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      alert('Tu navegador o dispositivo no soporta la API de Notificaciones Push.');
      return 'unsupported';
    }

    if (!this.isHttps()) {
      alert('⚠️ Para recibir notificaciones nativas en la persiana de Android con la app cerrada o bloqueada, se requiere conexión cifrada HTTPS en el servidor.\n\nMientras tanto, recibirás todas las alertas en la ventana emergente dentro de la app.');
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
      this.emitirAlerta({
        id: 'push-granted-' + Date.now(),
        titulo: '🔔 Notificaciones Push Activadas',
        mensaje: '¡Excelente! Notificaciones emergentes activadas en tu dispositivo.',
        tipo: 'cartera',
        icon: 'notifications_active',
        remitente: 'JC PAS PUSH ACTIVADO',
        hora: 'Ahora'
      });
    } else if (permission === 'denied') {
      alert('Las notificaciones Push fueron denegadas en los ajustes de tu navegador o celular.');
    }

    return permission;
  }

  async emitirAlerta(alerta: PushPopAlert) {
    // 1. Activar Toast emergente en pantalla (Signal)
    this.activeToast.set(alerta);

    // 2. Reproducir tono Web Audio API
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        const audioCtx = new AudioContextClass();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime); // E5
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      }
    } catch (e) {}

    // 3. Vibrar celular si soporta
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try { navigator.vibrate([200, 100, 200, 100, 250]); } catch (e) {}
    }

    // 4. Intentar enviar a la persiana del Sistema Operativo (Android / iOS / Windows)
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      const options: any = {
        body: alerta.mensaje,
        icon: '/assets/icons/icon-192x192.png',
        badge: '/assets/icons/icon-192x192.png',
        tag: alerta.id || ('jc-pas-' + Date.now()),
        renotify: true,
        requireInteraction: true,
        vibrate: [300, 100, 300, 100, 300],
        data: { url: alerta.link || '/dashboard' }
      };

      if ('serviceWorker' in navigator) {
        try {
          let reg = await navigator.serviceWorker.getRegistration();
          if (!reg) {
            reg = await navigator.serviceWorker.register('/sw.js');
          }
          if (reg && reg.showNotification) {
            await reg.showNotification(alerta.titulo, options);
          }
        } catch (e) {
          console.warn('SW Push Notice:', e);
        }
      }
    }

    // 5. Auto ocultar el banner flotante después de 6.5 segundos
    setTimeout(() => {
      if (this.activeToast()?.id === alerta.id) {
        this.activeToast.set(null);
      }
    }, 6500);
  }
}
