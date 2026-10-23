const DB_NAME = "bookReaderDB";
const STORE_NAME = "kv";
const DATA_KEY = "bookReaderData";

// DB操作用のヘルパー（Promiseベース）
function getSavedData() {
    return new Promise((resolve) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = (e) => {
            e.target.result.createObjectStore(STORE_NAME);
        };
        request.onsuccess = (e) => {
            const db = e.target.result;
            const tx = db.transaction(STORE_NAME, "readonly");
            const store = tx.objectStore(STORE_NAME);
            const getReq = store.get(DATA_KEY);
            getReq.onsuccess = () => resolve(getReq.result || null);
            getReq.onerror = () => resolve(null);
        };
        request.onerror = () => resolve(null);
    });
}

async function initializeApp() {

    const rawData = await getSavedData();
    const savedData = typeof rawData === "string" ? JSON.parse(rawData) : rawData;
    const seedArray = Array.from(crypto.getRandomValues(new Uint32Array(4)));

    const app = Elm.Main.init({
        node: document.getElementById('app'),
        flags: {
            storageData: savedData,
            seed: seedArray
        }
    });

    // 既存のポート初期化関数の呼び出し
    if (window.initFileHandlers) initFileHandlers(app);
    if (window.initGlobalPorts) initGlobalPorts(app);
    if (typeof setupSyncScroll === 'function') setupSyncScroll(app);
    if (typeof CMEditor !== 'undefined') CMEditor.setupSyncScroll(app);

    return app;
}

window.elmAppPromise = initializeApp();