/* ══════════════════════════════════
   DARK MODE — data-theme on <html>
══════════════════════════════════ */
var root = document.documentElement;
var isDark = localStorage.getItem('fth') === 'dark';
function applyTheme() {
  root.setAttribute('data-theme', isDark?'dark':'light');
  var icon=document.getElementById('tbIcon');
  if(icon) icon.textContent=isDark?'🌙':'☀️';
  else document.getElementById('themeBtn').textContent=isDark?'🌙':'☀️';
}
applyTheme();
function toggleTheme() {
  var icon=document.getElementById('tbIcon');
  if(icon){icon.style.transform='rotate(360deg) scale(1.4)';setTimeout(function(){icon.style.transform='';},500);}
  isDark=!isDark; localStorage.setItem('fth',isDark?'dark':'light'); applyTheme();
}

/* ══════════════════════════════════
   LANGUAGE — Google Translate
══════════════════════════════════ */
function googleTranslateElementInit() {
  new google.translate.TranslateElement({ pageLanguage: 'en', autoDisplay: false }, 'gt_el');
}
function toggleDD(e) { e.stopPropagation(); document.getElementById('ldd').classList.toggle('open'); }
document.addEventListener('click', function() { document.getElementById('ldd').classList.remove('open'); });
function setL(code, label, el) {
  document.getElementById('llabel').textContent = label;
  document.getElementById('ldd').classList.remove('open');
  document.querySelectorAll('.lopt').forEach(function(o) { o.classList.remove('sel'); });
  el.classList.add('sel');
  /* wait for Google Translate to inject the combo, then trigger */
  var tries = 0;
  var fn = function() {
    var sel = document.querySelector('.goog-te-combo');
    if (sel) { sel.value = code; sel.dispatchEvent(new Event('change')); return; }
    if (++tries < 20) setTimeout(fn, 300);
  };
  fn();
}

/* ══════════════════════════════════
   LIVE CLOCK
══════════════════════════════════ */
(function() {
  var cl = document.getElementById('clk');
  function tick() {
    var d = new Date();
    cl.textContent = '🕐 ' + String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0') + ':' + String(d.getSeconds()).padStart(2,'0');
  }
  tick(); setInterval(tick, 1000);
})();

/* ══════════════════════════════════
   LOGO GREETING CYCLER
══════════════════════════════════ */
(function() {
  var words = ['Hello','Hola','Bonjour','Ciao','Namaste','Marhaba','Konnichiwa','Annyeong','Ni Hao','Olá','Hallo','Привет','Salam','Salut'];
  var i = 0, el = document.getElementById('logoGreet');
  setInterval(function() {
    i = (i + 1) % words.length;
    el.style.animation = 'none'; el.offsetHeight;
    el.textContent = words[i];
    el.style.animation = 'greetSwap 0.4s cubic-bezier(.34,1.56,.64,1)';
  }, 2000);
})();