// VV Birthday Bash 2026 — Service Worker
const CACHE = ‘vv-bash-v1’;
const PRECACHE = [’./’, ‘./index.html’, ‘./manifest.json’, ‘./icons/icon-192.png’];

self.addEventListener(‘install’, e => {
e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener(‘activate’, e => {
e.waitUntil(
caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
.then(() => self.clients.claim())
);
});

self.addEventListener(‘fetch’, e => {
if (e.request.method !== ‘GET’) return;
const url = new URL(e.request.url);
if (url.hostname.includes(‘firebase’) || url.hostname.includes(‘googleapis’) || url.hostname.includes(‘rapidapi’) || url.hostname.includes(‘onesignal’)) {
e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
return;
}
e.respondWith(
caches.match(e.request).then(cached => {
const network = fetch(e.request).then(res => {
if (res.ok) caches.open(CACHE).then(c => c.put(e.request, res.clone()));
return res;
});
return cached || network;
})
);
});

self.addEventListener(‘push’, e => {
const data = e.data ? e.data.json() : {};
e.waitUntil(
self.registration.showNotification(data.title || ‘VV Birthday Bash’, {
body: data.body || ‘’,
icon: ‘./icons/icon-192.png’,
badge: ‘./icons/icon-192.png’,
data: { url: data.url || ‘./’ },
vibrate: [200, 100, 200]
})
);
});

self.addEventListener(‘notificationclick’, e => {
e.notification.close();
e.waitUntil(clients.openWindow(e.notification.data.url || ‘./’));
});
