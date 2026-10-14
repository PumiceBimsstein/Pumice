(function() {
  // KaTeX の CSS を追加（二重追加防止）
  if (!document.getElementById('katex-css')) {
    const link = document.createElement('link');
    link.id = 'katex-css';
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
    document.head.appendChild(link);
  }

  // KaTeX ライブラリのロード状態をグローバルに一元管理する関数
  const loadKatexShared = () => {
    if (window._katexLoading) {
      return window._katexLoading;
    }

    window._katexLoading = new Promise((resolve, reject) => {
      // すでにグローバルに katex が存在する場合は即座に解決
      if (typeof katex !== 'undefined') {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
      script.async = true;
      script.onload = () => {
        resolve();
      };
      script.onerror = () => {
        window._katexLoading = null; // 失敗時は再試行できるようにリセット
        reject(new Error('Failed to load KaTeX script'));
      };
      document.head.appendChild(script);
    });

    return window._katexLoading;
  };

  // ディスプレイ数式用カスタム要素
  class KaTeXDisplay extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      this.render();
    }

    static get observedAttributes() {
      return ['formula', 'display-mode'];
    }

    attributeChangedCallback() {
      this.render();
    }

    async render() {
      const formula = this.getAttribute('formula') || '';
      const displayMode = this.getAttribute('display-mode') === 'true';

      if (!formula) return;

      try {
        await loadKatexShared();
        
        katex.render(formula, this, {
          displayMode: displayMode,
          throwOnError: false,
          trust: true,
          strict: false
        });
      } catch (e) {
        this.textContent = formula;
        console.error('KaTeX Display rendering error:', e);
      }
    }
  }

  // インライン数式用カスタム要素
  class KaTeXInline extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      this.render();
    }

    static get observedAttributes() {
      return ['formula'];
    }

    attributeChangedCallback() {
      this.render();
    }

    async render() {
      const formula = this.getAttribute('formula') || '';
      if (!formula) return;

      try {
        await loadKatexShared();

        katex.render(formula, this, {
          displayMode: false,
          throwOnError: false
        });
      } catch (e) {
        this.textContent = formula;
        console.error('KaTeX Inline rendering error:', e);
      }
    }
  }

  // カスタム要素の登録
  if (!customElements.get('katex-display')) {
    customElements.define('katex-display', KaTeXDisplay);
  }

  if (!customElements.get('katex-inline')) {
    customElements.define('katex-inline', KaTeXInline);
  }
})();