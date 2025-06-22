// The placeholder will be replaced at build time with the actual hashed filenames.

const PRECACHE_ASSETS = (() => {
  try {
    return __PRECACHE_ASSETS__;
  } catch {
    return [];
  }
})();

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('v1').then(cache => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

const cacheFirst = async (request) => {
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }
  return fetch(request);
};


self.addEventListener('fetch', event => {
  // if dev, skip cache
  if (process.env.NODE_ENV === 'development') {
    return event.respondWith(fetch(event.request));
  }
  event.respondWith(cacheFirst(event.request));
});
