const CACHE = 'countdown';
const cacheable = [
  './',
  './index.html',
  './sw.js',
  './index.js',
  './manifest.json',
  './main.css',
  './sounds.mp3',
  './img/192.png',
  './img/512.png',
  './img/rgb/192.png',
  './LCDBOLD/font.css',
  './LCDBOLD/LCDBOLD.eot',
  './LCDBOLD/LCDBOLD.ttf',
  './LCDBOLD/LCDBOLD.woff',
];

/* Invoke the default fetch capability to
 * pull a resource over the network and use
 * that to update the cache.
 */
async function updateCache(request) {
  const c = await caches.open(CACHE);
  const response = await fetch(request);
  return c.put(request, response);
}

/* Retrieve a requested resource from the cache
 * or return a resolved promise if its not there.
 */
async function handleFetch(request) {
  const c = await caches.open(CACHE);
  const cachedCopy = await c.match(request);
  return cachedCopy || Promise.reject(new Error('no-match'));
}

/* All GET requests are first served from
 * the cache, before an attempt is made to
 * update the cache.
 */
function interceptFetch(evt) {
  evt.respondWith(handleFetch(evt.request));
  evt.waitUntil(updateCache(evt.request));
}

/* Installing the service worker involves
 * preparing an populating the cache, here.
 */
async function prepareCache(evt) {
  const c = await caches.open(CACHE);
  c.addAll(cacheable);
}

// install the event listsner so it can run in the background.
self.addEventListener('install', prepareCache);
self.addEventListener('fetch', interceptFetch);
