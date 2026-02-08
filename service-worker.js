const CACHE_NAME = "selftraining-cache-v1";
const URLS_TO_CACHE = [
  "index.html",
  "exercises.html",
  "exercise-detail.html",
  "check.html",
  "result.html",
  "progress.html",
  "guide.html",
  "style.css",
  "tabbar.css",
  "card.css",
  "camera.css",
  "script.js",
  "exercises.js",
  "analysis.js",
  "progress.js",
  "result.js",
  "icon-152.png",
  "icon-192.png",
  "icon-512.png",
  "manifest.json"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(URLS_TO_CACHE))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request))
  );
});
