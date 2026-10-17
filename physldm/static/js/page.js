// PhysLDM project page: tabbed video players + lazy loading.
// Videos carry data-src and get their src only when they (or their tab) become visible;
// looping clips play while visible and pause when scrolled away or when another tab is chosen.
(function () {
  function ensureSrc(v) {
    if (!v.getAttribute('src') && v.dataset.src) { v.src = v.dataset.src; v.load(); }
  }
  function tryPlay(v) {
    if (v.dataset.autoplay === '0') return;
    var p = v.play();
    if (p && p.catch) p.catch(function () {});
  }
  function inView(el) {
    var r = el.getBoundingClientRect();
    var h = window.innerHeight || document.documentElement.clientHeight;
    return r.bottom > 0 && r.top < h;
  }
  function activePanel(v) {
    var panel = v.closest('.tab-panel');
    return !panel || panel.classList.contains('is-active');
  }

  var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var v = e.target;
      if (!activePanel(v)) return;
      if (e.isIntersecting) { ensureSrc(v); tryPlay(v); } else { v.pause(); }
    });
  }, { threshold: 0.25 }) : null;

  document.querySelectorAll('video.lazy').forEach(function (v) {
    if (io) io.observe(v); else { ensureSrc(v); }
  });

  document.querySelectorAll('.video-tabs').forEach(function (group) {
    var tabs = group.querySelectorAll('.tabs li');
    var panels = group.querySelectorAll('.tab-panel');
    tabs.forEach(function (li, i) {
      li.addEventListener('click', function (ev) {
        ev.preventDefault();
        tabs.forEach(function (t) { t.classList.remove('is-active'); });
        panels.forEach(function (p) {
          p.classList.remove('is-active');
          p.querySelectorAll('video').forEach(function (v) { v.pause(); });
        });
        li.classList.add('is-active');
        panels[i].classList.add('is-active');
        var v = panels[i].querySelector('video');
        if (v) { ensureSrc(v); if (inView(v)) { v.currentTime = 0; tryPlay(v); } }
      });
    });
  });
})();
