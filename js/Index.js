document.addEventListener("DOMContentLoaded", function () {
  const titleH1 = document.querySelector(".title h1");
  const menu = document.querySelector(".menu");
  const header = document.querySelector("header");

  if (!titleH1 || !menu || !header) return;

  let spacer = null;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        const titleTop = entry.boundingClientRect.top;
        if (entry.isIntersecting) {
          // 고정 해제: title이 충분히 내려왔을 때, 또는 스크롤이 맨 위일 때(.title 원상복귀)
          const atTop = window.scrollY < 20;
          if (titleTop > 50 || atTop) {
            menu.classList.remove("is-fixed");
            if (spacer && spacer.parentNode) {
              spacer.parentNode.removeChild(spacer);
              spacer = null;
            }
          }
        } else {
          // .title h1이 가려졌을 때: 메뉴 상단 고정 + spacer로 자리 유지 (문서 높이 불변 → 깜빡임 방지)
          const menuHeight = menu.offsetHeight;
          if (!spacer) {
            spacer = document.createElement("div");
            spacer.className = "menu-spacer";
            spacer.style.height = menuHeight + "px";
            header.insertBefore(spacer, menu);
          } else {
            spacer.style.height = menuHeight + "px";
          }
          menu.classList.add("is-fixed");
        }
      });
    },
    {
      threshold: 0,
      rootMargin: "-2px 0px 0px 0px",  /* 살짝 넘어갈 때만 전환해서 경계에서 드르륵 방지 */
    }
  );

  observer.observe(titleH1);

  // 스크롤을 맨 위로 올렸을 때도 고정 해제 (observer는 교차 상태가 바뀔 때만 호출되므로)
  function tryUnstickAtTop() {
    if (!menu.classList.contains("is-fixed")) return;
    if (window.scrollY > 30) return;
    menu.classList.remove("is-fixed");
    if (spacer && spacer.parentNode) {
      spacer.parentNode.removeChild(spacer);
      spacer = null;
    }
  }

  window.addEventListener("scroll", tryUnstickAtTop, { passive: true });
});
