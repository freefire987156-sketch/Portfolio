/* ══════════════════════════════════
   HERO TIME GREETING + VISITOR LOCATION
══════════════════════════════════ */
(function() {
  /* Greeting based on visitor local time */
  var h = new Date().getHours(), t, e, b;
  if      (h >= 5  && h < 12) { t='Good Morning';   e='☀️';  b='Good Morning!'  }
  else if (h >= 12 && h < 17) { t='Good Afternoon'; e='🌤️'; b='Good Afternoon!' }
  else if (h >= 17 && h < 21) { t='Good Evening';   e='🌇'; b='Good Evening!'   }
  else                         { t='Good Night';     e='🌙'; b='Good Night!'     }
  document.getElementById('gText').textContent = t;
  document.getElementById('gEmoji').textContent = e;
  document.getElementById('gHead').textContent = b;

  /* Detect visitor country & flag via free API */
  var locEl = document.getElementById('gLocation');
  if (!locEl) return;
  fetch('https://ipapi.co/json/')
    .then(function(r){ return r.json(); })
    .then(function(d){
      if (d && d.city && d.country_name) {
        /* Convert country code to flag emoji */
        var code = d.country_code || '';
        var flag = code.toUpperCase().split('').map(function(c){
          return String.fromCodePoint(c.charCodeAt(0) + 127397);
        }).join('');
        locEl.textContent = d.city + ', ' + d.country_name + ' ' + flag;
      } else {
        locEl.textContent = 'Somewhere on Earth 🌍';
      }
    })
    .catch(function(){
      locEl.textContent = 'Somewhere on Earth 🌍';
    });
})();

/* ══════════════════════════════════
   CSS FLOATING PARTICLES
══════════════════════════════════ */
(function() {
  var c = document.getElementById('particles');
  var cols = ['#6c63ff','#ff6584','#43c98e','#f6a623','#38bdf8'];
  for (var i = 0; i < 28; i++) {
    var p = document.createElement('div'); p.className = 'particle';
    var s = Math.random() * 6 + 3;
    p.style.cssText = 'width:'+s+'px;height:'+s+'px;left:'+Math.random()*100+'%;bottom:'+Math.random()*15+'%;background:'+cols[~~(Math.random()*cols.length)]+';animation-duration:'+(Math.random()*12+8)+'s;animation-delay:'+(Math.random()*10)+'s;';
    c.appendChild(p);
  }
})();

/* ══════════════════════════════════
   HERO CANVAS — particle network + mouse attraction
══════════════════════════════════ */
(function() {
  var cv = document.getElementById('heroCanvas'); if (!cv) return;
  var ctx = cv.getContext('2d'), W, H, pts = [];
  function rsz() { W = cv.width = window.innerWidth; H = cv.height = window.innerHeight; }
  rsz(); window.addEventListener('resize', rsz);
  var cols = ['#6c63ff','#ff6584','#43c98e','#f6a623','#38bdf8'];
  function Pt() { this.r(); }
  Pt.prototype = {
    r: function() { this.x=Math.random()*W; this.y=Math.random()*H; this.vx=(Math.random()-.5)*.6; this.vy=(Math.random()-.5)*.6; this.rad=Math.random()*2+.7; this.col=cols[~~(Math.random()*cols.length)]; this.a=Math.random()*.5+.1; this.lf=0; this.mx=170+Math.random()*230; },
    tick: function() { this.x+=this.vx; this.y+=this.vy; this.lf++; if(this.lf>this.mx||this.x<0||this.x>W||this.y<0||this.y>H) this.r(); },
    draw: function() { ctx.save(); ctx.globalAlpha=this.a*(1-this.lf/this.mx); ctx.beginPath(); ctx.arc(this.x,this.y,this.rad,0,Math.PI*2); ctx.fillStyle=this.col; ctx.fill(); ctx.restore(); }
  };
  for (var i = 0; i < 80; i++) pts.push(new Pt());
  var mx = W/2, my = H/2;
  document.addEventListener('mousemove', function(e) { mx = e.clientX; my = e.clientY; });
  document.addEventListener('touchmove', function(e){ mx=e.touches[0].clientX; my=e.touches[0].clientY; },{passive:true});
  function loop() {
    ctx.clearRect(0,0,W,H);
    pts.forEach(function(p, i) {
      for (var j=i+1; j<pts.length; j++) {
        var q=pts[j], d=Math.hypot(p.x-q.x,p.y-q.y);
        if (d<120) { ctx.save(); ctx.globalAlpha=.04*(1-d/120); ctx.strokeStyle=p.col; ctx.lineWidth=.6; ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y); ctx.stroke(); ctx.restore(); }
      }
      var dm = Math.hypot(p.x-mx, p.y-my);
      if (dm < 200) { var f=0.012*(1-dm/200); p.vx+=(mx-p.x)*f; p.vy+=(my-p.y)*f; }
      p.vx *= 0.97; p.vy *= 0.97;
      p.tick(); p.draw();
    });
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ══════════════════════════════════
   COUNTERS
══════════════════════════════════ */
function animC(el, target, suffix, dur) {
  if (!el) return;
  var st = performance.now();
  var from = 0;
  (function f(n) {
    var p = Math.min((n-st)/dur, 1);
    var e = p < 1 ? 1-Math.pow(1-p, 4) : 1;
    el.textContent = Math.floor(e * target) + (suffix||'');
    if (p < 1) requestAnimationFrame(f);
  })(performance.now());
}
/* Counter triggered on scroll into view */
var cObs = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) {
      animC(document.getElementById('c1'), 10, '+', 1800);
      animC(document.getElementById('c2'), 19, '', 2000);
      cObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
var statEl = document.querySelector('.stats-float');
if (statEl) cObs.observe(statEl);

/* ══════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════ */
var ro = new IntersectionObserver(function(entries) {
  entries.forEach(function(e, i) {
    if (e.isIntersecting) {
      e.target.classList.remove('hide-up');
      setTimeout(function() { e.target.classList.add('visible'); }, i * 60);
    } else {
      /* Hide upward when scrolled past */
      if (e.boundingClientRect.top < 0) {
        e.target.classList.remove('visible');
        e.target.classList.add('hide-up');
      } else {
        /* Reset to come from below again */
        e.target.classList.remove('visible', 'hide-up');
      }
    }
  });
}, { threshold: 0.06 });
document.querySelectorAll('.reveal').forEach(function(el) { el.classList.add('anim'); ro.observe(el); });

/* ══════════════════════════════════
   SKILL BARS
══════════════════════════════════ */
var so = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) { e.target.querySelectorAll('.sk-fill').forEach(function(b,i) { setTimeout(function(){b.style.width=b.dataset.w+'%';},i*90); }); so.unobserve(e.target); }
  });
}, { threshold: 0.15 });
document.querySelectorAll('#skills').forEach(function(el) { so.observe(el); });

/* ══════════════════════════════════
   ACTIVE NAV on scroll
══════════════════════════════════ */
var secs = ['about','projects','skills','contact'];
function upNav() {
  var sy = window.scrollY, cur = 'about';
  secs.forEach(function(id) { var el = document.getElementById(id); if (el && sy >= el.offsetTop - 190) cur = id; });
  document.querySelectorAll('.bottom-nav .nav-link').forEach(function(l,i) { l.classList.toggle('active', secs[i]===cur); });
}
window.addEventListener('scroll', upNav, { passive: true }); window.addEventListener('load', upNav);
function goTo(id, btn) {
  var el = document.getElementById(id);
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 78, behavior: 'smooth' });
  if (btn) { document.querySelectorAll('.bottom-nav .nav-link').forEach(function(l){l.classList.remove('active');}); btn.classList.add('active'); }
}