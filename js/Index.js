document.addEventListener("DOMContentLoaded", function () {
  const titleH1 = document.querySelector(".title h1");
  const menu = document.querySelector(".menu");
  const header = document.querySelector("header");
  const FIX_THRESHOLD = 6;
  const UNFIX_AT_TOP = 24;

  if (!titleH1 || !menu || !header) return;

  let spacer = null;
  let isFixed = false;

  function ensureSpacer() {
    const menuHeight = menu.offsetHeight;
    if (!spacer) {
      spacer = document.createElement("div");
      spacer.className = "menu-spacer";
      header.insertBefore(spacer, menu);
    }
    spacer.style.height = menuHeight + "px";
  }

  function removeSpacer() {
    if (spacer && spacer.parentNode) {
      spacer.parentNode.removeChild(spacer);
      spacer = null;
    }
  }

  function setFixed(nextFixed) {
    if (nextFixed === isFixed) return;
    isFixed = nextFixed;
    if (nextFixed) {
      ensureSpacer();
      menu.classList.add("is-fixed");
      return;
    }
    menu.classList.remove("is-fixed");
    removeSpacer();
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        // 교차선 근처에서 출렁이는 현상을 줄이기 위해 히스테리시스 적용
        if (entry.isIntersecting) {
          const shouldUnfix = entry.intersectionRatio > FIX_THRESHOLD / 100 || window.scrollY <= UNFIX_AT_TOP;
          if (shouldUnfix) setFixed(false);
          return;
        }
        setFixed(true);
      });
    },
    {
      threshold: [0, FIX_THRESHOLD / 100],
      rootMargin: "0px 0px 0px 0px",
    }
  );

  observer.observe(titleH1);

  // 스크롤을 맨 위로 올렸을 때도 고정 해제 (observer는 교차 상태가 바뀔 때만 호출되므로)
  function tryUnstickAtTop() {
    if (!isFixed) return;
    if (window.scrollY > UNFIX_AT_TOP) return;
    setFixed(false);
  }

  window.addEventListener("scroll", tryUnstickAtTop, { passive: true });
  window.addEventListener("resize", function () {
    if (!isFixed || !spacer) return;
    spacer.style.height = menu.offsetHeight + "px";
  });
});
