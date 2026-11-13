// sw.js - オフラインキャッシュと高速起動
const CACHE_NAME = 'pumice-cache-v1';

// index.html で読み込んでいる全ファイルを漏れなく指定
const PRE_CACHE_ASSETS = [
    './',
    './index.html',
    './favicon.svg',

    // CSS
    './dist/output.css',
    './dist/custom_highlight.bundle.css',
    './css/searchHighlight.css',

    // JavaScript（ライブラリ & Web Components）
    './dist/custom_highlight.bundle.js',
    './js/katex_renderer.js',
    './dist/codemirror_editor.bundle.js',
    './js/file_handler.js',
    './lib/jszip.min.js',
    './lib/FileSaver.min.js',

    // アプリ本体
    './main.js',
    './js/startElm.js',
    './js/script.js'
];


self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(async (cache) => {
            for (const url of PRE_CACHE_ASSETS) {
                try {
                    await cache.add(url);
                } catch (err) {
                    console.warn(`[SW] キャッシュスキップ (${url}):`, err);
                }
            }
        }).then(() => self.skipWaiting())
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

    // A. 画面の再読み込み（F5）時の処理
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                    return response;
                })
                .catch(async () => {
                    // サーバー切断時
                    const cache = await caches.open(CACHE_NAME);
                    return (await cache.match('./index.html')) || (await cache.match('./'));
                })
        );
        return;
    }

    // B. スクリプトやパーツの読み込み
    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                if (networkResponse && networkResponse.status === 200) {
                    const clone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, clone);
                    });
                }
                return networkResponse;
            })
            .catch(() => {
                return caches.match(event.request);
            })
    );
});