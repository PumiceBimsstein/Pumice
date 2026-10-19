// 主要約40言語（Rust, Ruby, Perlなどを含む）が最初から登録されているデフォルトのhljsをインポート
// 1. highlight.js の標準テーマCSSをインポート
import 'highlight.js/styles/base16/solarized-dark.css';
// 2. 自作のスタイル（style_highlight.css）をインポート
import './style_highlight.css';
import hljs from 'highlight.js/lib/common';

// 標準セットに含まれていない言語だけを個別インポート
import elm from 'highlight.js/lib/languages/elm';
import haskell from 'highlight.js/lib/languages/haskell';
import ocaml from 'highlight.js/lib/languages/ocaml';
import fsharp from 'highlight.js/lib/languages/fsharp';

// 足りない言語だけを追加登録
hljs.registerLanguage('elm', elm);
hljs.registerLanguage('haskell', haskell);
hljs.registerLanguage('ocaml', ocaml);
hljs.registerLanguage('fsharp', fsharp);

// ページ全体のコード強調用 Range を集約・一括更新する関数
function updateGlobalCodeSearchHighlight() {
    if (!CSS || !CSS.highlights) return;

    // ページ内のすべての highlight-code および highlight-code-span を取得
    const allCodeComponents = document.querySelectorAll('highlight-code, highlight-code-span');
    const allRanges = [];

    allCodeComponents.forEach(component => {
        const searchText = component.getAttribute('search-text') || '';
        const query = searchText.trim().toLowerCase();
        if (!query) return;

        const codeElement = component.querySelector('code');
        if (!codeElement) return;

        const walker = document.createTreeWalker(codeElement, NodeFilter.SHOW_TEXT);
        let currentNode;

        while ((currentNode = walker.nextNode())) {
            const text = currentNode.textContent.toLowerCase();
            let startOffset = 0;

            while ((startOffset = text.indexOf(query, startOffset)) !== -1) {
                const range = new Range();
                range.setStart(currentNode, startOffset);
                range.setEnd(currentNode, startOffset + query.length);
                allRanges.push(range);

                startOffset += query.length;
            }
        }
    });

    if (allRanges.length > 0) {
        const highlight = new Highlight(...allRanges);
        CSS.highlights.set('code-search-highlight', highlight);
    } else {
        CSS.highlights.delete('code-search-highlight');
    }
}

// 描画更新が連続した際のチラつき・重複処理を防ぐデバウンス用 ID
let searchHighlightDebounceId = null;

function requestGlobalCodeSearchHighlight() {
    if (searchHighlightDebounceId) {
        cancelAnimationFrame(searchHighlightDebounceId);
    }
    searchHighlightDebounceId = requestAnimationFrame(() => {
        updateGlobalCodeSearchHighlight();
    });
}

// Web Componentの定義（コードブロック用）
class HighlightCode extends HTMLElement {
    constructor() {
        super();
        this._content = "";
        this._lang = "";
        this._theme = "";
        this._searchText = "";
    }

    static get observedAttributes() {
        return ['code', 'lang', 'theme', 'update-key', 'search-text'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;

        if (name === 'code') this._content = newValue;
        if (name === 'lang') this._lang = newValue;
        if (name === 'theme') this._theme = newValue;
        if (name === 'search-text') this._searchText = newValue;

        if (name === 'search-text') {
            requestGlobalCodeSearchHighlight();
        } else {
            this.render();
        }
    }

    connectedCallback() {
        this.render();
    }

    render() {
        if (!this._content) return;

        this.innerHTML = `
            <div style="position: relative;">
                <button class="copy-button" style="
                    position: absolute;
                    top: 0.3rem;
                    right: 0.3rem;
                    padding: 0.05rem 0.4rem;
                    font-size: 0.75rem;
                    cursor: pointer;
                    border-radius: 0.25rem;
                    border: 1px solid currentColor;
                    background: transparent;
                    opacity: 0.6;
                ">Copy</button>
                <code style="
                    white-space: pre; 
                    display: block; 
                    font-family: inherit; 
                    color: inherit;
                    padding: 1.5rem;
                    background: transparent;
                "></code>
            </div>
        `;

        const codeElement = this.querySelector('code');
        const copyButton = this.querySelector('.copy-button');
        if (!codeElement) return;
        
        codeElement.textContent = this._content;

        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(this._content).then(() => {
                copyButton.textContent = 'Copied!';
                setTimeout(() => {
                    copyButton.textContent = 'Copy';
                }, 2000);
            });
        });

        if (this._theme) {
            codeElement.classList.add(`theme-${this._theme}`);
        }

        const isHighlightEnabled = (this._theme === "Light" || this._theme === "Dark");

        if (isHighlightEnabled && this._lang && typeof hljs !== 'undefined') {
            codeElement.classList.add(`language-${this._lang}`);
            hljs.highlightElement(codeElement);
        } else {
            codeElement.className = "";
            if (this._theme) {
                codeElement.classList.add(`theme-${this._theme}`);
            }
        }

        requestGlobalCodeSearchHighlight();
    }
}

customElements.define('highlight-code', HighlightCode);

// Web Componentの定義（インラインコード codeSpan 用）
class HighlightCodeSpan extends HTMLElement {
    constructor() {
        super();
        this._content = "";
        this._searchText = "";
    }

    static get observedAttributes() {
        return ['content', 'search-text'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;

        if (name === 'content') this._content = newValue;
        if (name === 'search-text') this._searchText = newValue;

        if (name === 'search-text') {
            requestGlobalCodeSearchHighlight();
        } else {
            this.render();
        }
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `<code></code>`;
        const codeElement = this.querySelector('code');
        if (!codeElement) return;

        codeElement.textContent = this._content || '';

        requestGlobalCodeSearchHighlight();
    }
}

customElements.define('highlight-code-span', HighlightCodeSpan);