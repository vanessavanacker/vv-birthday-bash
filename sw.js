// VV Birthday Bash 2026 — Service Worker v6
// OneSignal + Belgian flag icon generation
importScripts('https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js');

const CACHE = 'vv-bash-v6';
const PRECACHE = ['./', './index.html', './manifest.json'];

async function generateIcon(size) {
  try {
    const canvas = new OffscreenCanvas(size, size);
    const ctx = canvas.getContext('2d');
    const stripe = Math.floor(size / 3);
    ctx.fillStyle = '#1a1208'; ctx.fillRect(0, 0, stripe, size);
    ctx.fillStyle = '#FAE042'; ctx.fillRect(stripe, 0, stripe, size);
    ctx.fillStyle = '#EF3340'; ctx.fillRect(stripe * 2, 0, size - stripe * 2, size);
    const fs = Math.round(size * 0.44);
    ctx.font = `900 ${fs}px Arial, sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round'; ctx.lineWidth = Math.round(size * 0.055);
    ctx.strokeStyle = '#000000'; ctx.strokeText('VV', size / 2, size / 2);
    ctx.fillStyle = '#ffffff'; ctx.fillText('VV', size / 2, size / 2);
    const blob = await canvas.convertToBlob({ type: 'image/png' });
    return new Response(blob, { status: 200, headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public,max-age=86400' } });
  } catch (err) {
    return new Response(null, { status: 204 });
  }
}

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  const path = url.pathname;
  if (path.match(/icon-(?:192|512)\.png$/i)) {
    e.respondWith(generateIcon(path.includes('512') ? 512 : 192));
    return;
  }
  if (url.hostname.includes('firebase') || url.hostname.includes('googleapis') ||
      url.hostname.includes('rapidapi') || url.hostname.includes('onesignal') ||
      url.hostname.includes('unsplash') || url.hostname.includes('wikimedia') ||
      url.hostname.includes('irail') || url.hostname.includes('aerodatabox')) {
    e.respondWith(fetch(e.request).catch(() => new Response('', { status: 503 })));
    return;
  }
  e.respondWith(
    fetch(e.request).then(res => {
      if (res.ok) caches.open(CACHE).then(c => c.put(e.request, res.clone()));
      return res;
    }).catch(() => caches.match(e.request))
  );
});
