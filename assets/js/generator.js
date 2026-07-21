
// ジェネレーター
let generator = document.querySelector(".generator");
let header = document.querySelector(".mainHeader");
const observe = new IntersectionObserver(
  (entries) => {
    entries.forEach((el) => {
      header.classList.toggle("hide", el.isIntersecting);
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

  // 設定値を取得
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
        try { opts[key] = JSON.parse(el.value || "{}"); } catch (e) { opts[key] = null; }
      } else {
        opts[key] = el.type === "checkbox" ? el.checked :
          el.type === "number" ? parseFloat(el.value) : el.value;
      }
    });
    // キー名の変換 
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

  if (!originalPath || !svgElement) {
    previewFrame.innerHTML = "<p style='color:red;'>有効なPathが見つかりません</p>";
    return;
  }

  // 1. SVG全体をクローン（背景や装飾もそのまま保持）
  const newSvg = svgElement.cloneNode(true);
  newSvg.classList.add("orbitRoad");

  // 2. 元ドキュメント内でのoriginalPathの位置を特定し、
  //    クローン側の同じ位置のpathにorbitPathクラスを付与
  const allOriginalPaths = Array.from(doc.querySelectorAll("path"));
  const pathIndex = allOriginalPaths.indexOf(originalPath);
  const clonedPaths = newSvg.querySelectorAll("path");
  const targetPath = clonedPaths[pathIndex] || clonedPaths[0];
  if (targetPath) targetPath.classList.add("orbitPath");

  // プレビュー枠を空に
  previewFrame.innerHTML = "";
  previewFrame.appendChild(newSvg);

  // 3. アイテム（.orbit）を追加
  for (let i = 0; i < 10; i++) {
    const item = document.createElement("div");
    item.className = "orbit";
    item.style.cssText = "background:orange; aspect-ratio:1; display:flex; align-items:center; justify-content:center; border-radius:10px;";
    item.textContent = `ITEM ${i + 1}`;
    previewFrame.appendChild(item);
  }

  // 4. スライダー実行
  const options = getOptions();
  createorbitSlider(previewFrame, options);

  // コード表示更新
  updateCodeDisplay(rawSvg, options);
}


  // タブ切り替え
  document.querySelectorAll('.svg-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.svg-tab-btn').forEach(b => b.classList.remove('is-active'));
      document.querySelectorAll('.svg-tab-panel').forEach(p => p.classList.add('is-hidden'));
      btn.classList.add('is-active');
      document.querySelector(`[data-svg-panel="${btn.dataset.svgTab}"]`).classList.remove('is-hidden');
    });
  });

  // サンプルSVGデータ
  const sampleSVGs = {
    wave: `<svg viewBox="0 0 1440 400" xmlns="http://www.w3.org/2000/svg"><path d="M0 250 Q360 10 720 250 Q1080 490 1440 250" stroke="black" fill="none"/></svg>`,
    arch: `<svg viewBox="0 0 1440 300" xmlns="http://www.w3.org/2000/svg"><path d="M0 280 Q720 20 1440 280" stroke="black" fill="none"/></svg>`,
    "s-curve": `<svg viewBox="0 0 1440 300" xmlns="http://www.w3.org/2000/svg"><path d="M0 50 C360 50 360 250 720 250 C1080 250 1080 50 1440 50" stroke="black" fill="none"/></svg>`,
    "zig-zag": `<svg viewBox="0 0 1440 300" xmlns="http://www.w3.org/2000/svg"><path d="M0 250 L230 60 Q240 50 250 60 L470 250 Q480 260 490 250 L710 50 Q720 40 730 50 L950 250 Q960 260 970 250 L1190 50 Q1200 40 1210 50 L1440 250" stroke="black" fill="none"/></svg>`,
  };

  // サンプル選択
  document.querySelectorAll('.sample-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.sample-btn').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      svgInput.value = sampleSVGs[btn.dataset.sample];
      svgInput.dispatchEvent(new Event('input'));
    });
  });

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
  // 1. デフォルト値
  const DEFAULT_OPTIONS = {
    sliderHeight: "400px",
    orbitItemWidth: "150px",
    visibleCount: 3,
    zIndexMode: "front",
    alignOrigin: { x: 0.5, y: 0.5 },
    pathTop: "0px",
    overflowBuffer: 15,
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

  // 3. HTMLコード生成
  const htmlCode = `<div class="orbitSlider">
    ${rawSvg.replace('<svg', '<svg class="orbitRoad"').replace('<path', '<path class="orbitPath"')}
  <div class="orbit">ITEM 1</div>
  <div class="orbit">ITEM 2</div>
  <div class="orbit">ITEM 3</div>
   <!-- 必要な分だけアイテムを追加（class="orbit"がついていればタグの種類はなんでもOK） -->
</div>`;

  // 4. CSSコード生成
  const cssCode = ``;

  // 5. JSコード生成
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

// グレーアウト制御
function updateControlVisibility() {
  const autoModeSelect = document.querySelector('[data-opt="autoMode"]');
  const mode = autoModeSelect.value;

  // 1. 各グループ要素取得
  const linearItems = [
    document.querySelector('[data-opt="autoSpeed"]')
  ];
  const stepItems = [
    document.querySelector('[data-opt="stepCount"]'),
    document.querySelector('[data-opt="stepDuration"]'),
    document.querySelector('[data-opt="stepDelay"]')
  ];

  // 2. 状態に合わせて切り替え
  const toggleGroup = (items, isEnabled) => {
    items.forEach(input => {
      if (!input) return;
      input.disabled = !isEnabled;

      // labelごと見た目を変える
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



// コピー機能
function setupCopyButtons() {
  const panels = document.querySelectorAll('.generator [data-panel]');

  panels.forEach(panel => {
    // ボタン作成追加
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
