import { EditorView, basicSetup } from "codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { EditorState, Transaction } from "@codemirror/state";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";
import { indentWithTab } from "@codemirror/commands";
import { keymap } from "@codemirror/view";

const baseColors = {
    Light: {
        text:    "#3a3a3a", //#212121
        bg:      "#E0E0DB",
        surface: "#EBEAE4",
        border:  "#C7C6BF",
        primary: "#B03060",
        selection: "#B3D7FF",
    },
    Dark: {
        text:    "#D3D3D3", //E8E6E0
        bg:      "#1e1e1e", //0F0F0E
        surface: "#171716",
        border:  "#2A2A27",
        primary: "#C9A84C",
        selection: "#3E4451",
    },
    Magical: {
        text:    "#cec5b5",
        bg:      "#0f0f1a",
        surface: "#1a1a2e",
        border:  "#8b7355",
        primary: "#d9a74a",
        selection: "#4c4c6d",
    },
};

const highlightColors = {
    Light: {
        heading: "#8B0000",
        strong:  "#c07c17",
        code:    "#006400",
    },
    Dark: {
        heading: "#C9A84C",
        strong:  "#E8E6E0",
        code:    "#C9A84C",
    },
    Magical: {
        heading: "#d9a74a",
        strong:  "#e0d5c0",
        code:    "#c4943c",
    },
};

function buildTheme(name) {
    const c = baseColors[name] ?? baseColors.Light;
    const h = highlightColors[name] ?? highlightColors.Light;

    const mutedColors = {
        Light:   "#757570",
        Dark:    "#6B6960",
        Magical: "#8b7355",
    };
    const muted = mutedColors[name] ?? mutedColors.Light;

    const editorTheme = EditorView.theme({
        "&": { backgroundColor: c.bg, color: c.text, height: "100%" },
        ".cm-scroller": { overflow: "auto", fontFamily: '"Fira Code", monospace' },
        ".cm-content": { whiteSpace: "pre-wrap", wordBreak: "break-word" },
        ".cm-gutters": {
            backgroundColor: c.surface,
            borderRight: `1px solid ${c.border}`,
            color: muted,
            minHeight: "100%"
        },
        ".cm-activeLineGutter, .cm-activeLine": { backgroundColor: c.surface },
        ".cm-cursor": { borderLeftColor: c.text },
        // 選択範囲の色を強制的に適用（1行選択時も反映されるよう詳細度を上げる）
        "&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground": { 
            backgroundColor: `${c.selection} !important` 
        },
        "&.cm-focused .cm-content ::selection": { 
            backgroundColor: `${c.selection} !important` 
        },
        ".cm-selectionBackground": { 
            backgroundColor: `${c.selection} !important` 
        }
    });

    const highlightStyle = syntaxHighlighting(HighlightStyle.define([
        { tag: tags.heading1, color: h.heading, fontWeight: "bold", fontSize: "1.4em" },
        { tag: tags.heading2, color: h.heading, fontWeight: "bold", fontSize: "1.2em" },
        { tag: tags.heading3, color: h.heading, fontWeight: "bold", fontSize: "1.1em" },
        { tag: tags.heading4, color: h.heading, fontWeight: "bold" },
        { tag: tags.heading5, color: h.heading, fontWeight: "bold" },
        { tag: tags.heading6, color: h.heading, fontWeight: "bold" },
        { tag: tags.strong,   color: h.strong,  fontWeight: "bold" },
        { tag: tags.monospace, color: h.code, backgroundColor: h.codeBg },
    ]));

    return [editorTheme, highlightStyle];
}

class CodeMirrorEditor extends HTMLElement {
    constructor() {
        super();
        this._view = null;
        this._content = "";
        this._theme = "Light";
        this._fontSize = 16;
        this._scrollRatio = 0;
        this._isSelfScrolling = false;
        this._scrollTimeout = null;
    }

    connectedCallback() {
        if (this._view) return;

        this._view = new EditorView({
            state: this._buildState(),
            parent: this,
        });

        this._applyFontSize(this._fontSize);

        // IME確定時のイベントを監視
        this.addEventListener("compositionend", () => {
            // 確定直後にドキュメント内の全角「＃」を置換
            this._replaceZenkakuHash();
        });

        this._view.scrollDOM.addEventListener("scroll", () => {
            const dom = this._view.scrollDOM;
            const max = dom.scrollHeight - dom.clientHeight;
            const ratio = max > 0 ? dom.scrollTop / max : 0;
            this.dispatchEvent(new CustomEvent("editor-scroll", {
                detail: { ratio },
                bubbles: true,
                composed: true,
            }));
        });
    }


    // 全角「＃」を半角に置換する専用メソッド
    _replaceZenkakuHash() {
        if (!this._view) return;
        
        const docText = this._view.state.doc.toString();
        if (!docText.includes("＃")) return;

        let changes = [];
        for (let i = 0; i < docText.length; i++) {
            if (docText[i] === "＃") {
                changes.push({ from: i, to: i + 1, insert: "#" });
            }
        }

        if (changes.length > 0) {
            // 微小な遅延を入れることでIMEの確定処理との競合を完全に避ける
            setTimeout(() => {
                this._view.dispatch({
                    changes: changes,
                    annotations: Transaction.remote.of(true)
                });
            }, 10);
        }
    }


    // 数式変換ロジック: $$...$$ を ```math ... ``` に自動置換
    // _transformMathInput() {
    //     if (!this._view) return;
    //     const docText = this._view.state.doc.toString();
    //     const regex = /\$\$\s*([\s\S]+?)\s*\$\$/g;
        
    //     if (!regex.test(docText)) return;

    //     let changes = [];
    //     docText.replace(regex, (match, formula, offset) => {
    //         const replacement = `\n\`\`\`math\n${formula.trim()}\n\`\`\`\n`;
    //         changes.push({ from: offset, to: offset + match.length, insert: replacement });
    //     });

    //     if (changes.length > 0) {
    //         setTimeout(() => {
    //             this._view.dispatch({
    //                 changes: changes,
    //                 annotations: Transaction.remote.of(true)
    //             });
    //         }, 20);
    //     }
    // }

    // 数式変換ロジック: $$...$$ および \[...\] を ```math ... ``` に自動置換

    _transformMathInput() {
        if (!this._view) return;
        const docText = this._view.state.doc.toString();
        
        // 1. ブロック数式 ($$ もしくは \[)
        const blockRegex = /\$\$\s*([\s\S]+?)\s*\$\$|\\\[\s*([\s\S]+?)\s*\\\]/g;
        // 2. インライン数式 ($ もしくは \()
        const inlineRegex = /(?<!\\)\$\s*([^\$\n]+?)\s*\$|\\\(\s*([\s\S]+?)\s*\\\)/g;
        
        let changes = [];

        // ブロック変換
        let match;
        while ((match = blockRegex.exec(docText)) !== null) {
            const formula = (match[1] || match[2]).trim();
            const replacement = `\n\`\`\`math\n${formula}\n\`\`\`\n`;
            changes.push({ from: match.index, to: match.index + match[0].length, insert: replacement });
        }

        // インライン変換 (既にブロック置換が決まった箇所を避ける簡易処理)
        while ((match = inlineRegex.exec(docText)) !== null) {
            const formula = (match[1] || match[2]).trim();
            const replacement = `\`math ${formula}\``;
            changes.push({ from: match.index, to: match.index + match[0].length, insert: replacement });
        }

        if (changes.length > 0) {
            setTimeout(() => {
                const currentDoc = this._view.state.doc.toString();
                if (currentDoc === docText) {
                    this._view.dispatch({
                        changes: changes,
                        annotations: Transaction.remote.of(true)
                    });
                }
            }, 20);
        }
    }

    disconnectedCallback() {
        if (this._view) {
            this._view.destroy();
            this._view = null;
        }
    }

    // _buildState() {
    //     const extensions = [
    //         basicSetup,
    //         markdown(),
    //         EditorView.lineWrapping,
    //         keymap.of([indentWithTab]),
    //         ...buildTheme(this._theme),
    //         // 通常の文字入力時（IMEを介さない場合など）の保険としてここにも配置
    //         EditorView.updateListener.of((update) => {
    //             if (update.docChanged) {
    //                 const value = update.state.doc.toString();
                    
    //                 // IME入力中（composing）でない場合のみ、全角チェックを実行
    //                 if (!update.view.composing && value.includes("＃")) {
    //                     this._replaceZenkakuHash();
    //                 }

    //                 this.dispatchEvent(new CustomEvent("editor-change", {
    //                     detail: value,
    //                     bubbles: true,
    //                     composed: true,
    //                 }));
    //             }
    //         }),
    //     ];
    //     return EditorState.create({ doc: this._content, extensions });
    // }
    _buildState() {
        const extensions = [
            basicSetup,
            markdown(),
            EditorView.lineWrapping,
            keymap.of([indentWithTab]),
            ...buildTheme(this._theme),
            EditorView.updateListener.of((update) => {
                if (update.docChanged) {
                    const value = update.state.doc.toString();
                    
                    if (!update.view.composing) {
                        if (value.includes("＃")) {
                            this._replaceZenkakuHash();
                        }
                        // 通常入力時にも数式置換をチェック
                        if (value.includes("$$") || value.includes("\\[") || value.includes("\\")) {
                            this._transformMathInput();
                        }
                    }

                    this.dispatchEvent(new CustomEvent("editor-change", {
                        detail: value,
                        bubbles: true,
                        composed: true,
                    }));
                }
            }),
        ];
        return EditorState.create({ doc: this._content, extensions });
    }

    _applyFontSize(size) {
        if (this._view) {
            this._view.dom.style.fontSize = `${size}px`;
        }
    }

    set content(val) {
        if (typeof val !== "string") return;
        this._content = val;
        if (!this._view) return;
        const current = this._view.state.doc.toString();
        if (current === val) return;
        this._view.dispatch({
            changes: { from: 0, to: current.length, insert: val },
        });
    }

    set theme(val) {
        this._theme = val;
        if (!this._view) return;
        this._view.setState(this._buildState());
        this._applyFontSize(this._fontSize);
    }

    set fontSize(val) {
        this._fontSize = val;
        this._applyFontSize(val);
    }

    applyScrollRatio(ratio) {
        if (!this._view || ratio < 0) return;
        const dom = this._view.scrollDOM;
        const max = dom.scrollHeight - dom.clientHeight;
        if (max > 0) dom.scrollTop = ratio * max;
    }

}

if (!customElements.get("codemirror-editor")) {
    customElements.define("codemirror-editor", CodeMirrorEditor);
}


export function setupSyncScroll(app) {
    app.ports.syncScroll.subscribe(({ targetId, ratio }) => {
        console.log(`[syncScroll] 受信: targetId=${targetId}, ratio=${ratio}`);

        const tryScroll = (attempts) => {
            const el = document.getElementById(targetId);

            if (targetId === "editor-area") {
                if (el && typeof el.applyScrollRatio === "function") {
                    console.log("[syncScroll] エディタの準備完了。実行します。");
                    el.applyScrollRatio(ratio);
                } else {
                    if (!el) {
                        console.warn(`[syncScroll] エディタ要素(#${targetId})が見つかりません。試行回数: ${attempts}`);
                    } else {
                        console.warn(`[syncScroll] エディタ要素は見つかりましたが、applyScrollRatioメソッドが未定義です。試行回数: ${attempts}`);
                    }
                    
                    if (attempts < 10) { // 最大10フレーム程度待機
                        requestAnimationFrame(() => tryScroll(attempts + 1));
                    } else {
                        console.error("[syncScroll] エディタの初期化待ちがタイムアウトしました。");
                    }
                }
            } else {
                // EDIT -> VIEW (成功している既存ロジック)
                if (el) {
                    const max = el.scrollHeight - el.clientHeight;
                    console.log(`[syncScroll] ビューワー同期実行: maxScroll=${max}`);
                    if (max > 0) {
                        el.scrollTop = ratio * max;
                    }
                } else {
                    console.error(`[syncScroll] ビューワー要素(#${targetId})が見つかりません。`);
                }
            }
        };

        tryScroll(0);
    });
}