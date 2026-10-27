// sw.js - オフラインキャッシュと高速起動
const CACHE_NAME = 'pumice-cache-v1';
const ASSETS = [
    './',
    './index.html',
    './startElm.js',
    './script.js',
    './file_handler.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS))
            .then(() => self.skipWaiting()) // 保存完了後に即座に待機状態をスキップ
    );
});

// 古いキャッシュの除去
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => {
                return Promise.all(
                    keys.filter((key) => key !== CACHE_NAME)
                        .map((key) => caches.delete(key)) // 古いキャッシュがあれば削除
                );
            })
            .then(() => self.clients.claim()) // 開いている画面を即座に新しいSWの管理下に置く
    );
});

// ネット接続があれば最新を取得・なければキャッシュを使う
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                // 通信成功時：画面に最新版を返しつつ、裏でキャッシュも最新データに更新
                if (networkResponse && networkResponse.status === 200) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return networkResponse;
            })
            .catch(() => {
                // 通信失敗時（オフライン）：保存されている直前のキャッシュを返却
                return caches.match(event.request);
            })
    );
});
