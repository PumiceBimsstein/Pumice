window.elmAppPromise.then(app => {
    
    console.log('[DEBUG] Elm アプリが初期化されました。ポートの登録を開始します。');

    // 新しい本のIDを作成
    if (app.ports.requestCreate) {
        app.ports.requestCreate.subscribe((tag) => {
            app.ports.incomingMsg.send({
                tag: tag,
                id: crypto.randomUUID()
            });
        });
    }


    // IndexedDBへ保存
    if (app.ports.saveToStorage) {
        app.ports.saveToStorage.subscribe(data => {
            saveToDB(data);
        });
    }


    // 見出しにスクロール
    if (app.ports.scrollToIndex) {
        app.ports.scrollToIndex.subscribe((targetIndex) => {
            requestAnimationFrame(() => {
                // page-view-area 内の見出しを対象にする
                const headings = document.querySelectorAll('#page-view-area h1, #page-view-area h2, #page-view-area h3');
                const idx = parseInt(targetIndex, 10);
                const target = !isNaN(idx) ? headings[idx] : null;

                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }



    // 最上部へスクロール
    if (app.ports.scrollToTop) {
        app.ports.scrollToTop.subscribe(function() {
            const area = document.getElementById('page-view-area');
            if (area) {
                area.scrollTop = 0;
            }
        });
    }


    if (app.ports && app.ports.scrollToTocHeading) {
        app.ports.scrollToTocHeading.subscribe(() => {
            requestAnimationFrame(() => {
                const tocArea = document.getElementById('toc-area');
                if (tocArea) {
                    const activeItem = tocArea.querySelector('.border-l-4');
                    if (activeItem) {
                        const containerRect = tocArea.getBoundingClientRect();
                        const itemRect = activeItem.getBoundingClientRect();

                        // 要素が #toc-area の表示範囲外（上または下）にあるか判定
                        const isOutside =
                            itemRect.top < containerRect.top ||
                            itemRect.bottom > containerRect.bottom;

                        // 範囲外にある場合のみ最上部（start）へスクロール
                        if (isOutside) {
                            activeItem.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                        }
                    }
                }
            });
        });
    }

    let draggedIdx = null;

    document.addEventListener('dragstart', (e) => {
        if (e.target.dataset && e.target.dataset.index !== undefined) {
            draggedIdx = parseInt(e.target.dataset.index);
            e.dataTransfer.effectAllowed = 'move';
        }
    });

    document.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    document.addEventListener('drop', (e) => {
        e.preventDefault();
        const dropTarget = e.target.closest('[data-index]');
        if (dropTarget && draggedIdx !== null) {
            const targetIdx = parseInt(dropTarget.dataset.index);
            if (draggedIdx !== targetIdx) {
                app.ports.incomingMsg.send({
                    tag: "ReorderPages",
                    from: draggedIdx,
                    to: targetIdx
                });
            }
        }
        draggedIdx = null;
    });

});


// function saveToDB(data) {
//     const request = indexedDB.open("bookReaderDB", 1);
//     request.onsuccess = (e) => {
//         const db = e.target.result;
//         const tx = db.transaction("kv", "readwrite");
//         const store = tx.objectStore("kv");
//         store.put(data, "bookReaderData");
//     };
// }

// script.js の saveToDB を更新
let isWriting = false;
let pendingData = null;

async function saveToDB(data) {
    pendingData = data;
    if (isWriting) return;
    isWriting = true;

    try {
        const db = await (typeof getDbConnection === 'function' 
            ? getDbConnection() 
            : new Promise((res, rej) => {
                const req = indexedDB.open("bookReaderDB", 1);
                req.onsuccess = (e) => res(e.target.result);
                req.onerror = (e) => rej(e);
            }));

        while (pendingData !== null) {
            const dataToWrite = pendingData;
            pendingData = null;

            await new Promise((resolve, reject) => {
                const tx = db.transaction("kv", "readwrite");
                const store = tx.objectStore("kv");
                const req = store.put(dataToWrite, "bookReaderData");
                req.onsuccess = () => resolve();
                req.onerror = (e) => reject(e);
            });
        }
    } catch (err) {
        console.error("[IndexedDB] Save error:", err);
    } finally {
        isWriting = false;
    }
}
