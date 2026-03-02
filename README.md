# Orbit Slider

A lightweight JavaScript slider that moves elements along any SVG path.

🔗 **Live Demo**  
https://molydebnum.github.io/orbit-slider/

---

## ✨ Features

- Move items along any SVG path
- Drag interaction
- Auto play (`linear` or `step` mode)
- Loop support
- Responsive options
- Lightweight and customizable

---

## 📦 Installation

### Direct Script Include

```html
<!-- GSAP & MotionPathPlugin -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/MotionPathPlugin.min.js"></script>
        
<!-- ORBIT SLIDER -->
  <script src="https://cdn.jsdelivr.net/gh/molydebnum/orbit-slider@main/dist/orbitSlider.min.js"></script>
```

---

## 🚀 Basic Usage

```html
<div class="orbitSlider">
  <svg class="orbitRoad">
    <path class="orbitPath" d="..." />
  </svg>
  
  <div class="orbit">ITEM 1</div>
  <div class="orbit">ITEM 2</div>
  <div class="orbit">ITEM 3</div>
</div>
```

```js
createOrbitSlider(".orbitSlider", {
  visibleCount: 3,
  autoPlay: true,
  autoMode: "linear"
});
document.querySelectorAll(".orbitSlider").forEach((slider) => {
  createorbitSlider(slider, {
    sliderHeight: "500px",    // 全体の高さ
    visibleCount: 4,          // 画面内の表示数
    autoSpeed: 30,            // 流れる速度
    direction: "right"        // 進行方向
  });
});
```

---

## ⚙ Options

### Appearance & Structure

| Option | Type | Default |
|--------|------|---------|
| `sliderHeight` | string | `"400px"` |
| `orbitItemWidth` | string | `"200px"` |
| `visibleCount` | number | `3` |
| `zIndexMode` | `"front" \| "back" \| "center"` | `"front"` |
| `alignOrigin` | `{ x:number, y:number }` | `{ x:0.5, y:0.5 }` |
| `pathTop` | string | `"0px"` |
| `overflowBuffer` | number | `10` |
| `pathWidth` | string \| null | `null` |
| `pathFront` | boolean | `false` |
| `pathDirection` | `"normal" \| "reverse"` | `"normal"` |
| `direction` | `"left" \| "right"` | `"left"` |

---

### Motion & Auto Play

| Option | Type | Default |
|--------|------|---------|
| `autoRotate` | boolean | `true` |
| `autoPlay` | boolean | `true` |
| `autoMode` | `"linear" \| "step"` | `"linear"` |
| `autoSpeed` | number | `50` |
| `stepCount` | number | `1` |
| `stepDuration` | number | `0.6` |
| `stepDelay` | number | `1.2` |
| `loop` | boolean | `true` |

---

### User Interaction

| Option | Type | Default |
|--------|------|---------|
| `pauseOnHover` | boolean | `false` |
| `draggable` | boolean | `true` |
| `dragSpeed` | number | `0.0015` |
| `responsive` | object \| null | `null` |

---

## 📱 Responsive Example

```js
createOrbitSlider(".slider", {
  visibleCount: 3,
  responsive: {
    768: {
      visibleCount: 2
    },
    480: {
      visibleCount: 1
    }
  }
});
```

---

## 🧠 Why Orbit Slider?

Unlike traditional horizontal sliders, Orbit Slider allows full control over motion along custom SVG paths — ideal for:

- Circular sliders
- Wave-shaped layouts
- Hero section animations
- Creative UI components

---

## 📄 License

MIT

---

## 👤 Author

Created by Molydebnum  
https://molydebnum.github.io/orbit-slider/
