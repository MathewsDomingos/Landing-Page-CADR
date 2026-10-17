(function () {
  "use strict";

  /* ---------- Repassa UTMs e parâmetros de rastreio para o checkout ----------
     Ex.: quem chega por ?utm_source=instagram&utm_campaign=bio leva esses
     parâmetros até a Kiwify, e a venda aparece atribuída no painel. */
  var params = new URLSearchParams(window.location.search);
  if ([...params.keys()].length) {
    document.querySelectorAll("a[data-checkout]").forEach(function (a) {
      var url = new URL(a.href);
      params.forEach(function (value, key) {
        if (!url.searchParams.has(key)) url.searchParams.set(key, value);
      });
      a.href = url.toString();
    });
  }

  /* ---------- Revelação ao rolar ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { revealObserver.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Barra fixa de compra (celular) ----------
     Aparece depois que o botão do topo sai da tela e some quando
     a oferta ou o CTA final estão visíveis, para não duplicar botões. */
  var bar = document.querySelector(".stickybar");
  var watched = [".hero__actions", "#oferta", ".final", ".footer"]
    .map(function (s) { return document.querySelector(s); })
    .filter(Boolean);

  if (bar && "IntersectionObserver" in window) {
    var visible = new Set();
    var passedHero = false;
    var heroActions = document.querySelector(".hero__actions");

    var barObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
        if (entry.target === heroActions && !entry.isIntersecting) {
          passedHero = entry.boundingClientRect.top < 0;
        }
      });
      var show = passedHero && visible.size === 0;
      bar.classList.toggle("is-shown", show);
      bar.setAttribute("aria-hidden", show ? "false" : "true");
      bar.querySelector("a").tabIndex = show ? 0 : -1;
    });
    watched.forEach(function (el) { barObserver.observe(el); });
  }

  /* ---------- Ano no rodapé ---------- */
  var year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
})();
