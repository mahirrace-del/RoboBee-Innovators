// RoboBee Innovators - Progressive Web App Service Worker
const CACHE_NAME = 'robobee-cache-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// 1. Web Push Notification Handler (When device receives remote call push)
self.addEventListener('push', (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'RoboBee AI', body: event.data.text() };
    }
  }

  const isCall = data.type === 'INCOMING_CALL' || data.isCall || data.tag === 'admin-incoming-call';
  const title = data.title || (isCall ? '📞 Incoming Call: RoboBee AI' : 'RoboBee Innovators');
  
  const options = {
    body: data.body || (isCall ? 'Executive Voice Line • Tap to Answer' : 'New notification from RoboBee'),
    icon: '/icon.png',
    badge: '/icon.png',
    vibrate: isCall ? [600, 300, 600, 300, 600, 300, 1000] : [200, 100, 200],
    tag: isCall ? 'admin-incoming-call' : 'robobee-notification',
    renotify: true,
    requireInteraction: isCall,
    silent: false,
    data: {
      url: isCall ? '/dashboard?incoming_call=true' : (data.url || '/dashboard'),
      isCall: isCall,
      reason: data.reason || 'Remote Voice Request'
    },
    actions: isCall
      ? [
          { action: 'answer', title: '📞 Answer' },
          { action: 'decline', title: '❌ Decline' }
        ]
      : []
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// 2. Notification Click Handler (Brings the PWA into full-screen view)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'decline') {
    return;
  }

  const targetUrl = (event.notification.data && event.notification.data.url) || '/dashboard?incoming_call=true';
  const isAnswer = event.action === 'answer';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If a window is already open, focus it and trigger call modal
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url.includes('/dashboard') && 'focus' in client) {
          client.postMessage({
            type: 'TRIGGER_CALL',
            reason: event.notification.data?.reason || 'System Notification Action',
            autoAccept: isAnswer
          });
          return client.focus();
        }
      }
      // If no window is open, launch a new window
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});

// 3. Client Message Handler (Called by web page when tab is in background)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_CALL_NOTIFICATION') {
    const title = event.data.title || '📞 Incoming Call: RoboBee AI';
    const options = {
      body: event.data.body || 'Executive Voice Line • Tap to Answer',
      icon: '/icon.png',
      badge: '/icon.png',
      vibrate: [600, 300, 600, 300, 600, 300, 1000],
      tag: 'admin-incoming-call',
      renotify: true,
      requireInteraction: true,
      silent: false,
      data: {
        url: '/dashboard?incoming_call=true',
        isCall: true,
        reason: event.data.reason || 'Background Incoming Call'
      },
      actions: [
        { action: 'answer', title: '📞 Answer' },
        { action: 'decline', title: '❌ Decline' }
      ]
    };
    self.registration.showNotification(title, options);
  }
});
