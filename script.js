(function () {
  'use strict';
  var header = document.querySelector('.site-header');
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('nav');

  // Menu mobile
  function setMenu(open) { nav.classList.toggle('open', open); btn.setAttribute('aria-expanded', String(open)); }
  btn.addEventListener('click', function () { setMenu(btn.getAttribute('aria-expanded') !== 'true'); });
  nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { setMenu(false); btn.focus(); } });

  // Bayangan header
  function onScroll() { header.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Penanda menu aktif
  var links = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]:not(.nav-cta)'));
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) {
          var on = a.getAttribute('href') === '#' + en.target.id;
          a.classList.toggle('active', on);
          if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(function (a) { var s = document.querySelector(a.getAttribute('href')); if (s) spy.observe(s); });

    // Animasi masuk
    var rv = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); rv.unobserve(en.target); } });
    }, { threshold: .12 });
    document.querySelectorAll('.reveal').forEach(function (el) { rv.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  // Cuplikan bergantian pada hero
  var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.dot'));
  var url = document.getElementById('device-url');
  var cur = 0, timer = null;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function show(i) {
    cur = i;
    slides.forEach(function (s, k) { s.classList.toggle('on', k === i); });
    dots.forEach(function (d, k) { d.classList.toggle('on', k === i); d.setAttribute('aria-selected', String(k === i)); });
    if (url) url.textContent = dots[i].getAttribute('data-url');
  }
  function play() { if (reduce || timer) return; timer = setInterval(function () { show((cur + 1) % slides.length); }, 5200); }
  function stop() { clearInterval(timer); timer = null; }
  dots.forEach(function (d) { d.addEventListener('click', function () { show(+d.getAttribute('data-i')); stop(); }); });
  var dev = document.querySelector('.device');
  if (dev) { dev.addEventListener('mouseenter', stop); dev.addEventListener('mouseleave', play); }
  play();

  var y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
})();
