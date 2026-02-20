
// ジェネレーター
let generator = document.querySelector(".generator");
let header = document.querySelector(".mainHeader");
const observe = new IntersectionObserver(
  (entries) => {
    entries.forEach((el) => {
        header.classList.toggle("hide",el.isIntersecting);
    });
  },
  {
    threshold: 0.3,
  }
);
observe.observe(generator);

document.addEventListener("DOMContentLoaded", () => {
  const svgInput = document.getElementById("svgInput");
  const previewFrame = document.getElementById("previewFrame");
  const controls = document.querySelectorAll(".gen-controls input, .gen-controls select, .gen-controls textarea");

  // 設定値を取得する関数（あなたの関数の引数形式に合わせる）
  function getOptions() {
    const opts = {
      alignOrigin: { x: 0.5, y: 0.5 } // デフォルト値
    };

    controls.forEach(el => {
      const key = el.dataset.opt;
      if (!key) return;

      if (key === "alignOriginX") opts.alignOrigin.x = parseFloat(el.value);
      else if (key === "alignOriginY") opts.alignOrigin.y = parseFloat(el.value);
      else if (key === "responsive") {
        try { opts[key] = JSON.parse(el.value || "{}"); } catch(e) { opts[key] = null; }
      } else {
        opts[key] = el.type === "checkbox" ? el.checked : 
                    el.type === "number" ? parseFloat(el.value) : el.value;
      }
    });
    // キー名の変換 (datasetの命名と関数の引数名のズレを補正)
    opts.sliderHeight = opts.sliderHeightValue + (opts.sliderHeightUnit || "px");
    opts.orbitItemWidth = opts.orbitItemWidthValue + (opts.orbitItemWidthUnit || "px");
    opts.pathTop = opts.pathTopValue + (opts.pathTopUnit || "px");

    return opts;
  }

  // プレビューの更新
  function updatePreview() {
    const rawSvg = svgInput.value.trim();
    if (!rawSvg) return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(rawSvg, "image/svg+xml");
    const originalPath = doc.querySelector("path");
    const svgElement = doc.querySelector("svg");

    if (!originalPath) {
      previewFrame.innerHTML = "<p style='color:red;'>有効なPathが見つかりません</p>";
      return;
    }

    // 1. パスを複製してクラスを追加（元の属性を保持）
    const pathClone = originalPath.cloneNode(true);
    pathClone.classList.add("orbitPath");

    // 2. SVG全体の構造を作成
    const viewBox = svgElement.getAttribute("viewBox") || "0 0 1000 500";
    
    // プレビュー枠を空にする
    previewFrame.innerHTML = "";

    // 3. 新しいSVGコンテナを作成
    const newSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    newSvg.setAttribute("class", "orbitRoad");
    newSvg.setAttribute("viewBox", viewBox);
    newSvg.setAttribute("fill", "none");
    newSvg.appendChild(pathClone); // デザインを保持したパスを追加

    previewFrame.appendChild(newSvg);

    // 4. アイテム（.orbit）を追加
    for (let i = 0; i < 10; i++) {
      const item = document.createElement("div");
      item.className = "orbit";
      item.style.cssText = "background:orange; height:100px; display:flex; align-items:center; justify-content:center; border-radius:10px;";
      item.textContent = `ITEM ${i+1}`;
      previewFrame.appendChild(item);
    }

    // 5. スライダー実行
    const options = getOptions();
    createorbitSlider(previewFrame, options);

    // コード表示も更新
    updateCodeDisplay(rawSvg, options);
  }

  // 入力変更時にリスタート
  svgInput.addEventListener("input", updatePreview);
  
  // コントロール変更時にリスタート（タイマーで負荷軽減）
  let timer;
  controls.forEach(el => el.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(updatePreview, 300);
  }));
});

function updateCodeDisplay(rawSvg, options) {
    // 1. プラグインの引数と完全に一致させたデフォルト値
    const DEFAULT_OPTIONS = {
      sliderHeight: "400px",
      orbitItemWidth: "200px",
      visibleCount: 3,
      zIndexMode: "front",
      alignOrigin: { x: 0.5, y: 0.5 },
      pathTop: "0px",
      overflowBuffer: 10,
      pathWidth: null,
      pathFront: false,
      pathDirection: "normal",
      direction: "left",
      autoRotate: true,
      autoPlay: true,
      autoMode: "linear",
      autoSpeed: 50,
      stepCount: 1,
      stepDuration: 0.6,
      stepDelay: 1.2,
      loop: true,
      pauseOnHover: false,
      draggable: true,
      dragSpeed: 0.0015,
      responsive: null
    };
  
    // 2. 差分抽出（中間生成キーを除外）
    const filteredOptions = {};
    const tempKeys = [
      "sliderHeightValue", "sliderHeightUnit",
      "orbitItemWidthValue", "orbitItemWidthUnit",
      "pathTopValue", "pathTopUnit",
      "itemCount" // オプションにないキーは除外
    ];
  
    for (const key in options) {
      if (tempKeys.includes(key)) continue;
    
      const val = options[key];
      const def = DEFAULT_OPTIONS[key];
    
      if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
        const hasContent = Object.keys(val).length > 0;
        if (key === "responsive") {
          if (hasContent && JSON.stringify(val) !== JSON.stringify(def)) {
            filteredOptions[key] = val;
          }
        } else {
          if (JSON.stringify(val) !== JSON.stringify(def)) {
            filteredOptions[key] = val;
          }
        }
      } 
      else if (val !== def) {
        filteredOptions[key] = val;
      }
    }
  
    // 3. HTMLコード生成（固定 1〜3 + コメント）
    const htmlCode = `<div class="orbitSlider">
    ${rawSvg.replace('<svg', '<svg class="orbitRoad"').replace('<path', '<path class="orbitPath"')}
  <div class="orbit">ITEM 1</div>
  <div class="orbit">ITEM 2</div>
  <div class="orbit">ITEM 3</div>
</div>`;
    
    // 4. CSSコード生成（空のまま）
    const cssCode = ``;
  
    // 5. JSコード生成（オプションの有無で出力を分岐）
    const hasOptions = Object.keys(filteredOptions).length > 0;
    const jsArgs = hasOptions ? `, ${JSON.stringify(filteredOptions, null, 2)}` : "";
  
    const jsCode = `// GSAPとMotionPathPluginが必要です
  document.querySelectorAll(".orbitSlider").forEach((slider) => {
    createorbitSlider(slider${jsArgs});
  });`;
  
    // 各パネルへ反映
    document.querySelector('.generator [data-panel="html"] code').textContent = htmlCode;
    document.querySelector('.generator [data-panel="css"] code').textContent = cssCode;
    document.querySelector('.generator [data-panel="js"] code').textContent = jsCode;
  }

// グレーアウトを制御する関数
function updateControlVisibility() {
  const autoModeSelect = document.querySelector('[data-opt="autoMode"]');
  const mode = autoModeSelect.value;

  // 1. 各グループの要素を取得
  const linearItems = [
    document.querySelector('[data-opt="autoSpeed"]')
  ];
  const stepItems = [
    document.querySelector('[data-opt="stepCount"]'),
    document.querySelector('[data-opt="stepDuration"]'),
    document.querySelector('[data-opt="stepDelay"]')
  ];

  // 2. 状態に合わせて切り替え関数
  const toggleGroup = (items, isEnabled) => {
    items.forEach(input => {
      if (!input) return;
      input.disabled = !isEnabled;
      
      // 親のlabelごと見た目を変える
      const label = input.closest('label');
      if (label) {
        label.style.opacity = isEnabled ? "1" : "0.4";
        label.style.pointerEvents = isEnabled ? "auto" : "none";
      }
    });
  };

  // 3. モードに応じて実行
  toggleGroup(linearItems, mode === "linear"); // linearの時だけ有効
  toggleGroup(stepItems, mode === "step");     // stepの時だけ有効
}

// イベント登録
document.querySelector('[data-opt="autoMode"]').addEventListener("change", updateControlVisibility);
// 初回実行
updateControlVisibility();



// コピー機能の登録
function setupCopyButtons() {
  const panels = document.querySelectorAll('.generator [data-panel]');

  panels.forEach(panel => {
    // ボタンを作成して追加
    const btn = document.createElement('button');
    btn.textContent = "Copy";
    btn.className = "copy-btn";
    btn.style.cssText = "position:absolute; top:10px; right:10px; z-index:10; padding:5px 10px; cursor:pointer;";
    
    // 親要素を相対位置にする（ボタンの配置基準）
    panel.style.position = "relative";
    panel.appendChild(btn);

    btn.addEventListener('click', () => {
      const code = panel.querySelector('code').textContent;
      navigator.clipboard.writeText(code).then(() => {
        // フィードバック
        const originalText = btn.textContent;
        btn.textContent = "Copied!";
        btn.style.background = "#4CAF50";
        btn.style.color = "white";

        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = "";
          btn.style.color = "";
        }, 2000);
      });
    });
  });
}

// 初期化時に実行
setupCopyButtons();