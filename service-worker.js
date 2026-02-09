const CACHE_NAME = "form-check-app-v1";
const urlsToCache = [
  "index.html",
  "exercises.html",
  "check.html",
  "progress.html",
  "guide.html",

  "common.css",
  "tabbar.css",
  "index.css",
  "exercises.css",
  "check.css",
  "progress.css",
  "guide.css",

  "check.js",
  "progress.js",

  "start.png",
  "icon-192.png",
  "icon-512.png"
];

// インストール（キャッシュ登録）
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// リクエスト取得
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// 新バージョンのキャッシュ削除
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    })
  );
});
