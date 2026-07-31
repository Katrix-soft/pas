// Service Worker para Notificaciones Push Pop estilo WhatsApp & Android/iOS
self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});

// Escuchar notificaciones Push remotas desde el servidor VAPID
self.addEventListener('push', function(event) {
  let data = { title: 'JC Broker PAS', body: 'Nueva notificación de la cartera.', link: '/dashboard' };
  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (e) {
    if (event.data) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body || data.mensaje || 'Nueva notificación de la cartera.',
    icon: '/assets/icons/icon-192x192.png',
    badge: '/assets/icons/icon-192x192.png',
    vibrate: [300, 100, 300, 100, 300],
    tag: data.id || ('jc-pas-push-' + Date.now()),
    renotify: true,
    requireInteraction: true,
    data: { url: data.link || data.url || '/dashboard' }
  };

  event.waitUntil(self.registration.showNotification(data.title || data.titulo || 'JC Broker PAS', options));
});

// Escuchar mensajes locales postMessage desde la aplicación web
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, options, delayMs } = event.data;
    
    // Asegurar rutas absolutas para icon y badge
    if (options) {
      options.icon = options.icon || '/assets/icons/icon-192x192.png';
      options.badge = options.badge || '/assets/icons/icon-192x192.png';
    }

    if (delayMs && delayMs > 0) {
      setTimeout(() => {
        self.registration.showNotification(title, options);
      }, delayMs);
    } else {
      self.registration.showNotification(title, options);
    }
  }
});

// Manejador de clics en la notificación de la persiana nativa del celular
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  if (event.action === 'close') return;

  const targetUrl = event.notification.data ? event.notification.data.url : '/dashboard';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (let i = 0; i < clientList.length; i++) {
        let client = clientList[i];
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
