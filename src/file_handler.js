// file_handler.js

/**
 * ファイル操作に関連するすべてのポートとイベントリスナーを管理します。
 */
function initFileHandlers(app) {
    if (!app || !app.ports) return;

    // --- 共通インポート処理 ---
    const dispatchJsonImport = (data) => {
        const { type, payload } = data;

        if (type === 'book') {
            app.ports.incomingMsg.send({
                tag: "ImportBook",
                id: crypto.randomUUID(),
                payload: payload
            });
        } else if (type === 'shelf') {
            app.ports.incomingMsg.send({
                tag: "ImportShelf",
                id: crypto.randomUUID(),
                payload: payload
            });
        // [変更] 全体バックアップは payload を取り出して fileContentReceiver 経由で渡す
        // (Elm側の ImportData -> decodeModel のルートに乗せるため)
        } else if (type === 'all') {
            if (app.ports.fileContentReceiver && app.ports.fileContentReceiver.send) {
                app.ports.fileContentReceiver.send(JSON.stringify(payload));
            }
        }
    };

    // --- 1. インポート関連 (JS -> Elm) ---

    // 既存の .md, .txt ドロップ処理を維持しつつ JSON に対応
    const processors = {
        text: (file) => {
            const reader = new FileReader();
            reader.onload = e => {
                const payload = [file.name, e.target.result];
                if (app.ports.fileDropped) {
                    app.ports.fileDropped.send(payload);
                }
            };
            reader.readAsText(file);
        },
        json: (file) => {
            const reader = new FileReader();
            reader.onload = e => {
                try {
                    const data = JSON.parse(e.target.result);
                    // [変更] 有効な type を持つファイルのみ受け付ける ('all' を追加、不明な type を拒否)
                    const validTypes = ['book', 'shelf', 'all'];
                    if (!validTypes.includes(data.type)) {
                        console.warn("不明なファイル形式です。typeフィールドを確認してください:", data.type);
                        return;
                    }
                    dispatchJsonImport(data);
                } catch (err) {
                    console.error("JSON parse error:", err);
                }
            };
            reader.readAsText(file);
        }
    };

    // --- 2. エクスポート関連 (Elm -> JS) ---

    // JSONエクスポート (本、本棚、全体バックアップ共通)
    // app.ports.triggerDownload.subscribe((jsonString) => {
    //     try {
    //         const data = JSON.parse(jsonString);
    //         let outputString = jsonString;
    //         //let fileName = 'Pumice-backup.json';

    //         if (data.type === 'book') {
    //             fileName = `Pumice-book-${data.payload.title || 'export'}.json`;
    //         } else if (data.type === 'shelf') {
    //             fileName = `Pumice-category-${data.payload.name || 'export'}.json`;
    //         }  else {
    //             // [変更] type がない場合は全体バックアップとして { type: 'all', payload } の形にラップし、ファイル名に日時を追加
    //             const now = new Date();
    //             const year = now.getFullYear();
    //             const month = String(now.getMonth() + 1).padStart(2, '0');
    //             const day = String(now.getDate()).padStart(2, '0');
    //             const hours = String(now.getHours()).padStart(2, '0');
    //             const minutes = String(now.getMinutes()).padStart(2, '0');
    //             const seconds = String(now.getSeconds()).padStart(2, '0')
    //             fileName = `Pumice-backup_${year}${month}${day}-${hours}-${minutes}-${seconds}.json`;
    //             outputString = JSON.stringify({ type: 'all', payload: data });
    //         }

    //         const blob = new Blob([outputString], { type: 'application/json' });
    //         const url = URL.createObjectURL(blob);
    //         const a = document.createElement('a');
    //         a.href = url;
    //         a.download = fileName;
    //         a.click();
    //         URL.revokeObjectURL(url);
    //     } catch (e) {
    //         console.error("Export failed", e);
    //     }
    // });

    // ページのエクスポート (単一テキストファイル)
    // if (app.ports.exportFile) {
    //     app.ports.exportFile.subscribe(function(data) {
    //         const blob = new Blob([data.content], { type: 'text/plain' });
    //         const url = window.URL.createObjectURL(blob);
    //         const a = document.createElement('a');
    //         a.href = url;
    //         a.download = data.fileName;
    //         document.body.appendChild(a);
    //         a.click();
    //         setTimeout(() => {
    //             document.body.removeChild(a);
    //             window.URL.revokeObjectURL(url);
    //         }, 0);
    //     });
    // }

    // 本・本棚の ZIP エクスポート
    if (app.ports.exportZip) {
        app.ports.exportZip.subscribe(({ zipName, entries }) => {
            if (typeof JSZip === 'undefined') {
                console.error("JSZip library is not loaded.");
                return;
            }
            const zip = new JSZip();
            entries.forEach(entry => {
                zip.file(entry.path, entry.content);
            });

            zip.generateAsync({ type: "blob" }).then(content => {
                const safeZipName = zipName.replace(/[\\/:*?"<>|]/g, '_');
                if (typeof saveAs !== 'undefined') {
                    saveAs(content, `${safeZipName}.zip`);
                } else {
                    const url = URL.createObjectURL(content);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${safeZipName}.zip`;
                    a.click();
                    URL.revokeObjectURL(url);
                }
            }).catch(err => {
                console.error("Zip generation failed:", err);
            });
        });
    }


    // --- 3. インポート補助 (ファイル選択ダイアログ) ---

    if (app.ports.requestFileImport) {
        app.ports.requestFileImport.subscribe((targetType) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.multiple = true;
            input.onchange = (event) => {
                const files = Array.from(event.target.files);
                files.forEach(file => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        try {
                            const data = JSON.parse(e.target.result);
                            
                            if (!data || !data.type) {
                                alert(`「${file.name}」は形式が不正です (typeが存在しません)`);
                                return;
                            }

                            // 読み込んだデータを別関数で判定・振り分け
                            processImportByTarget(file.name, data, targetType);
                        } catch (err) {
                            alert(`「${file.name}」は正しくないJSONファイルです`);
                        }
                    };
                    reader.readAsText(file);
                });
            };
            input.click();
        });
    }

    // 判定と振分けを行うヘルパー関数
    function processImportByTarget(fileName, data, targetType) {
        // 1. targetType とファイルの data.type が一致しない場合は警告を出して中断
        if (targetType && targetType !== data.type) {
            const typeNames = {
                shelf: "本棚データ",
                book: "本データ",
                all: "全体バックアップデータ"
            };
            const expectedName = typeNames[targetType] || targetType;
            const actualName = typeNames[data.type] || data.type;

            alert(`「${fileName}」は ${actualName} です。${expectedName} のインポート場所からは読み込めません。`);
            return;
        }

        // 2. 一致している場合のポート送信処理
        if (data.type === 'all') {
            const content = JSON.stringify(data.payload || data);
            if (app.ports.fileContentReceiver && app.ports.fileContentReceiver.send) {
                app.ports.fileContentReceiver.send(content);
            }
        } else {
            dispatchJsonImport(data);
        }
    }



    // ボタン経由のインポート内容受け取り
    if (app.ports.fileContentReceiver && app.ports.fileContentReceiver.subscribe) {
        app.ports.fileContentReceiver.subscribe((jsonString) => {
            try {
                const data = JSON.parse(jsonString);
                dispatchJsonImport(data);
            } catch (e) {
                alert("データの形式が正しくありません。");
            }
        });
    }

    // --- ページインポート用 (ファイル選択ダイアログ) ---
    if (app.ports.requestPageImport) {
        app.ports.requestPageImport.subscribe(() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.txt,.md';
            input.multiple = false;
            input.onchange = (event) => {
                const file = event.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = (e) => {
                    if (app.ports.pageFileSelected) {
                        app.ports.pageFileSelected.send([file.name, e.target.result]);
                    }
                };
                reader.readAsText(file);
            };
            input.click();
        });
    }

    // --- 4. グローバルイベントリスナー ---

    window.addEventListener('dragover', e => e.preventDefault());
    window.addEventListener('drop', e => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        files.forEach(file => {
            const ext = file.name.split('.').pop().toLowerCase();
            const route = { md: processors.text, txt: processors.text, json: processors.json };
            route[ext]?.(file);
        });
    });
}
