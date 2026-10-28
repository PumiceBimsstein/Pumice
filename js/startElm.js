// startElm.js
const DB_NAME = "bookReaderDB";
const STORE_NAME = "kv";
const DATA_KEY = "bookReaderData";

let cachedDb = null;

// IndexedDB接続を取得（再利用）
function getDbConnection() {
    if (cachedDb) return Promise.resolve(cachedDb);
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };
        request.onsuccess = (e) => {
            cachedDb = e.target.result;
            resolve(cachedDb);
        };
        request.onerror = (e) => reject(e);
    });
}

// DBから保存データを読み込み
async function getSavedData() {
    try {
        const db = await getDbConnection();
        return new Promise((resolve) => {
            const tx = db.transaction(STORE_NAME, "readonly");
            const store = tx.objectStore(STORE_NAME);
            const req = store.get(DATA_KEY);
            req.onsuccess = () => resolve(req.result || null);
            req.onerror = () => resolve(null);
        });
    } catch (err) {
        console.error("[IndexedDB] Failed to open DB:", err);
        return null;
    }
}


// ブラウザの容量不足時による自動消去を防止する（永続化ストレージ要求）
async function requestPersistentStorage() {
    if (navigator.storage && navigator.storage.persist) {
        try {
            const isPersisted = await navigator.storage.persist();
            console.log(`[Storage] 永続化ストレージ状態: ${isPersisted ? "有効 (自動消去から保護されています)" : "通常 (ブラウザの自動管理)"}`);
        } catch (err) {
            console.warn("[Storage] 永続化リクエスト失敗:", err);
        }
    }
}


async function initializeApp() {
    // 1. Service Worker の登録
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js').catch((err) => {
            console.warn('[SW] Registration failed:', err);
        });
    }

    // 2. 保存データの読み込み
    const rawData = await getSavedData();
    let savedData = null;
    if (typeof rawData === "string") {
        try {
            savedData = JSON.parse(rawData);
        } catch (e) {
            console.error("[JSON] Corrupted data string:", e);
            savedData = rawData; // Elm側デコーダーで判定させる
        }
    } else {
        savedData = rawData;
    }

    // 乱数の種（Seed）
    const seedArray = Array.from(crypto.getRandomValues(new Uint32Array(4)));

    // 3. Elm アプリ初期化
    const app = Elm.Main.init({
        node: document.getElementById('app'),
        flags: {
            storageData: savedData,
            seed: seedArray
        }
    });

    if (window.initFileHandlers) initFileHandlers(app);
    if (window.initGlobalPorts) initGlobalPorts(app);
    if (typeof setupSyncScroll === 'function') setupSyncScroll(app);
    if (typeof CMEditor !== 'undefined') CMEditor.setupSyncScroll(app);

    return app;
}

window.elmAppPromise = initializeApp();
