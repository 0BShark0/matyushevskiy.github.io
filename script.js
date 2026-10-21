(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');

  // ---- Тема ----
  var themeBtn = document.getElementById('themeToggle');
  function currentTheme() {
    var t = root.getAttribute('data-theme');
    if (t) return t;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  themeBtn.addEventListener('click', function () {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  // ---- Мобильное меню ----
  var burger = document.getElementById('burger');
  var links = document.getElementById('navLinks');
  burger.addEventListener('click', function () {
    var open = links.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
  });
  links.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      links.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });

  // ---- Тень навбара при скролле ----
  var nav = document.querySelector('.nav');
  function onScroll() { nav.classList.toggle('is-scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- Появление блоков и активный пункт меню ----
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

    var navMap = {};
    links.querySelectorAll('a').forEach(function (a) { navMap[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var a = navMap[en.target.id];
        if (a && en.isIntersecting) {
          links.querySelectorAll('a').forEach(function (x) { x.classList.remove('is-active'); });
          a.classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach(function (s) { spy.observe(s); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-visible'); });
  }

  // ---- Фильтр проектов ----
  var chips = document.querySelectorAll('.chip');
  var projects = document.querySelectorAll('#projectGrid .project');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var f = chip.getAttribute('data-filter');
      chips.forEach(function (c) {
        c.classList.toggle('is-active', c === chip);
        c.setAttribute('aria-pressed', String(c === chip));
      });
      projects.forEach(function (p) {
        var cats = (p.getAttribute('data-cat') || '').split(/\s+/);
        var show = f === 'all' || cats.indexOf(f) !== -1;
        p.classList.toggle('is-hidden', !show);
        if (show) p.classList.add('is-visible');
      });
    });
  });

  // ---- Копирование email ----
  var toast = document.getElementById('toast');
  var timer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('is-visible');
    clearTimeout(timer);
    timer = setTimeout(function () { toast.classList.remove('is-visible'); }, 2000);
  }
  var copyBtn = document.getElementById('copyEmail');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var email = copyBtn.getAttribute('data-email');
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(
          function () { showToast('Email скопирован'); },
          function () { showToast(email); }
        );
      } else {
        showToast(email);
      }
    });
  }

  // ---- Год в футере ----
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
