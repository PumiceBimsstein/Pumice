function initFileHandlers(app) {
    if (!app || !app.ports) return;

    // ZIPエクスポート
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

    // --- 2. ブラウザのファイル開き画面遷移を防止するリスナー (2行のみ維持) ---
    window.addEventListener('dragover', e => e.preventDefault());
    window.addEventListener('drop', e => e.preventDefault());
}
