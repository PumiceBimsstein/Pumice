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
    // requestAnimationFrameでページ遷移を待ってからスクロールさせている
    if (app.ports.scrollToIndex) {
        app.ports.scrollToIndex.subscribe((headingText) => {
            requestAnimationFrame(() => {
                const headings = document.querySelectorAll('h1, h2, h3');
                const target = Array.from(headings)
                    .find(el => el.textContent.includes(headingText));

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

    // 目次のハイライト項目へスクロール追従
    // if (app.ports && app.ports.scrollToTocHeading) {
    //     app.ports.scrollToTocHeading.subscribe(() => {
    //         requestAnimationFrame(() => {
    //             const tocArea = document.getElementById('toc-area');
    //             if (tocArea) {
    //                 const activeItem = tocArea.querySelector('.border-l-4');
    //                 if (activeItem) {
    //                     activeItem.scrollIntoView({
    //                         behavior: 'smooth',
    //                         block: 'start'
    //                     });
    //                 }
    //             }
    //         });
    //     });
    // }

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


function saveToDB(data) {
    const request = indexedDB.open("bookReaderDB", 1);
    request.onsuccess = (e) => {
        const db = e.target.result;
        const tx = db.transaction("kv", "readwrite");
        const store = tx.objectStore("kv");
        store.put(data, "bookReaderData");
    };
}