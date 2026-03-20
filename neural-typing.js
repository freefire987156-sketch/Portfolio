/* ══════════════════════════════════
   NEURAL WEB INTRO
══════════════════════════════════ */
(function() {
  // Only show once per session
  if (sessionStorage.getItem('nw_seen')) {
    document.getElementById('neural-intro').style.display = 'none';
    return;
  }
  sessionStorage.setItem('nw_seen', '1');

  var intro = document.getElementById('neural-intro');
  var cv = document.getElementById('neural-cv');
  var W = window.innerWidth, H = window.innerHeight;
  cv.width = W; cv.height = H;
  var ctx = cv.getContext('2d');
  var AC = ['#6c63ff','#ff6584','#43c98e','#f6a623','#38bdf8'];
  var BG = '#e0e5ec';

  // build nodes
  var nodes = [];
  var count = Math.min(35, Math.floor(W * H / 18000));
  for (var i = 0; i < count; i++) {
    nodes.push({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * 0.9, vy: (Math.random() - .5) * 0.9,
      r: 2.5 + Math.random() * 3,
      col: AC[~~(Math.random() * AC.length)],
      pulse: Math.random() * Math.PI * 2
    });
  }

  var f = 0, totalFrames = 180, raf;

  function tick() {
    ctx.clearRect(0, 0, W, H);

    // background fades out after frame 90
    var bgA = f < 90 ? 1 : Math.max(0, 1 - (f - 90) / 60);
    ctx.fillStyle = 'rgba(224,229,236,' + bgA + ')';
    ctx.fillRect(0, 0, W, H);

    // master alpha: fade in → hold → fade out
    var masterA;
    if (f < 25)       masterA = f / 25;
    else if (f < 110) masterA = 1;
    else              masterA = Math.max(0, 1 - (f - 110) / 55);

    // move nodes
    nodes.forEach(function(nd) {
      nd.x += nd.vx; nd.y += nd.vy; nd.pulse += 0.05;
      if (nd.x < 0 || nd.x > W) nd.vx *= -1;
      if (nd.y < 0 || nd.y > H) nd.vy *= -1;
    });

    // connections
    var maxDist = Math.min(W, H) * 0.32;
    nodes.forEach(function(a, i) {
      for (var j = i + 1; j < nodes.length; j++) {
        var b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < maxDist) {
          var la = masterA * 0.3 * (1 - d / maxDist);
          var pulse = 0.5 + 0.5 * Math.sin(a.pulse + b.pulse);
          if (la * pulse < 0.01) continue;
          ctx.save();
          ctx.globalAlpha = la * pulse;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = a.col; ctx.lineWidth = 0.9; ctx.stroke();
          ctx.restore();
        }
      }
    });

    // nodes + glow
    nodes.forEach(function(nd) {
      var pa = masterA * (0.6 + 0.4 * Math.sin(nd.pulse));
      if (pa < 0.01) return;
      // glow ring
      ctx.save(); ctx.globalAlpha = pa * 0.2;
      ctx.beginPath(); ctx.arc(nd.x, nd.y, nd.r * 5, 0, Math.PI * 2);
      ctx.strokeStyle = nd.col; ctx.lineWidth = 1; ctx.stroke(); ctx.restore();
      // core dot
      ctx.save(); ctx.globalAlpha = pa;
      ctx.beginPath(); ctx.arc(nd.x, nd.y, nd.r, 0, Math.PI * 2);
      ctx.fillStyle = nd.col; ctx.fill(); ctx.restore();
    });

    f++;
    if (f < totalFrames) {
      raf = requestAnimationFrame(tick);
    } else {
      skipIntro();
    }
  }

  tick();

  window.skipIntro = function() {
    if (raf) cancelAnimationFrame(raf);
    intro.classList.add('hide');
    setTimeout(function() { intro.style.display = 'none'; }, 700);
  };

  // resize
  window.addEventListener('resize', function() {
    W = cv.width = window.innerWidth;
    H = cv.height = window.innerHeight;
  });
})();

/* ══════════════════════════════════
   TYPING EFFECT
══════════════════════════════════ */
(function() {
  var words = ['Designer 🎨','Video Editor 🎬','3D Artist 🧊','Developer 💻','Web Scraper 🕷️','Creator ✨'];
  var wi=0, ci=0, del=false;
  var el = document.getElementById('gHead');
  if (!el) return;
  function type() {
    var w = words[wi];
    if (!del) {
      el.textContent = w.slice(0, ++ci);
      if (ci === w.length) { del=true; setTimeout(type, 1800); return; }
      setTimeout(type, 85);
    } else {
      el.textContent = w.slice(0, --ci);
      if (ci === 0) { del=false; wi=(wi+1)%words.length; setTimeout(type, 350); return; }
      setTimeout(type, 40);
    }
  }
  /* Start after greeting loads */
  setTimeout(type, 1000);
})();

/* ══════════════════════════════════
   PROJECT FILTER
══════════════════════════════════ */
function filterProj(cat, btn) {
  document.querySelectorAll('.filter-btn').forEach(function(b){ b.classList.remove('active'); });
  btn.classList.add('active');
  var cards = document.querySelectorAll('.proj-card');
  var visible = 0;
  cards.forEach(function(c) {
    var cats = c.dataset.cat || '';
    var show = cat === 'all' || cats.indexOf(cat) > -1;
    if (show) { c.classList.remove('filtered'); visible++; }
    else c.classList.add('filtered');
  });
  var fc = document.getElementById('filterCount');
  if (fc) fc.textContent = visible + ' project' + (visible !== 1 ? 's' : '');
}

/* ══════════════════════════════════
   SOUND EFFECTS — always ON
══════════════════════════════════ */
(function() {
  var AudioCtx = window.AudioContext || window.webkitAudioContext;
  var actx = null;
  function getCtx() { if (!actx) actx = new AudioCtx(); return actx; }
  function playTick(freq, dur, vol) {
    try {
      var ctx = getCtx();
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.setValueAtTime(freq, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(freq*1.5, ctx.currentTime + dur*0.4);
      g.gain.setValueAtTime(vol||0.08, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      o.start(); o.stop(ctx.currentTime + dur);
    } catch(e) {}
  }
  /* Attach sounds to interactive elements after DOM ready */
  function attachSounds() {
    /* Primary buttons */
    document.querySelectorAll('.btn-primary, .submit-btn, .proj-btn').forEach(function(el) {
      el.addEventListener('click', function(){ playTick(700, 0.1, 0.1); });
    });
    /* Secondary buttons */
    document.querySelectorAll('.btn-secondary, .filter-btn, .pfbtn, .nav-link, .theme-btn, .lang-btn, .back-btn').forEach(function(el) {
      el.addEventListener('click', function(){ playTick(450, 0.08, 0.07); });
    });
    /* Like button */
    document.querySelectorAll('.proj-like').forEach(function(el) {
      el.addEventListener('click', function(){ playTick(900, 0.12, 0.09); });
    });
  }
  /* Init on first user interaction (browser policy) */
  document.addEventListener('click', function init() {
    getCtx();
    attachSounds();
    document.removeEventListener('click', init);
  }, { once: true });
})();