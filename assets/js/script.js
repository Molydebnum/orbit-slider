// ヘッダー
const mainLogo = document.querySelector(".mainLogo");
window.addEventListener("scroll", () => {
  mainLogo.classList.toggle("isSmall", window.scrollY > 0);
});

// スクロール
const scrollTrigger = document.querySelectorAll(".scrollTrigger");
scrollTrigger.forEach((el) => {
  window.addEventListener("scroll", () => {
    let scrollTriggerPosition = el.getBoundingClientRect().top;
    if (scrollTriggerPosition < window.innerHeight) {
      el.classList.add("isShow");
    }
  });
});

// スライダー
// ヒーロー
document.querySelectorAll(".heroSlider").forEach((slider) => {
  createorbitSlider(slider, {
    sliderHeight: "55vw",
    orbitItemWidth: "13vw",
    visibleCount: 7,
    alignOrigin: {
      x: 0.5,
      y: 0.04
    },
    autoRotate: false,
    autoSpeed: 40,
    overflowBuffer: 20,
    pathDirection: "reverse",
    responsive: {
      700: {
        orbitItemWidth: "23vw",
        sliderHeight: "65vw",
        visibleCount: 5,
      },
    },
  });
});
document.querySelectorAll(".heroSliderNumber").forEach((el, i) => {
  el.textContent = (i + 1).toString().padStart(2, "0");
});

// デモスライダー1
document.querySelectorAll(".demoSlider1").forEach((slider) => {
  createorbitSlider(slider, {
    visibleCount: 15,
    orbitItemWidth: "20%",
    sliderHeight: "460px",
    pathTop: "50px",
    dragSpeed: 0.0005,
    autoSpeed: 120,
    pauseOnHover: false,
    direction: "left",
    pathDirection: "normal",
    alignOrigin: {
      x: 0.5,
      y: 0.03,
    },
    autoPlay: true,
    autoMode: "linear",
    autoRotate: false,
    pathFront: true,
    zIndexMode: "front",
    overflowBuffer: 20,
    responsive: {
      700: {
        sliderHeight: "65vw",
      },
    },
  });
});

// デモスライダー2
document.querySelectorAll(".demoSlider2").forEach((slider) => {
  createorbitSlider(slider, {
    visibleCount: 2.5,
    orbitItemWidth: "250px",
    autoMode: "step",
    stepDuration: 1,
    stepDelay: 0.5,
    draggable: false,
    sliderHeight: "500px",
    pathTop: "50px",
    overflowBuffer: 25,
    responsive: {
      700: {
        sliderHeight: "65vw",
        orbitItemWidth: "35%",
      },
    },
  });
});

// デモタブ
document.querySelectorAll(".demoCode,.generatorCode").forEach((tabs) => {
  const btns = tabs.querySelectorAll(".tabBtn");
  const panels = tabs.querySelectorAll(".tabPanel");

  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.tab;

      btns.forEach((b) => b.classList.remove("is-active"));
      panels.forEach((p) => p.classList.remove("is-active"));

      btn.classList.add("is-active");
      tabs.querySelector(`[data-panel="${target}"]`).classList.add("is-active");
    });
  });
});
