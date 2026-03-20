/* ══════════════════════════════════
   LIKE BUTTON
══════════════════════════════════ */
function toggleLike(btn) {
  btn.classList.toggle('liked');
  btn.textContent = btn.classList.contains('liked') ? '♥' : '♡';
  if (btn.classList.contains('liked')) {
    btn.style.transform = 'scale(1.5)'; setTimeout(function(){btn.style.transform='';}, 300);
    var t = document.getElementById('toast'); t.classList.add('show'); setTimeout(function(){t.classList.remove('show');}, 2500);
  }
}

/* ══════════════════════════════════
   PROJECT MODAL
══════════════════════════════════ */
function openP(url) { if (!url || url==='#') document.getElementById('pmodal').style.display='flex'; else window.open(url,'_blank'); }
function closeP() { document.getElementById('pmodal').style.display='none'; }
document.getElementById('pmodal').addEventListener('click', function(e) { if (e.target===this) closeP(); });
document.addEventListener('keydown', function(e) { if (e.key==='Escape') closeP(); });

/* ══════════════════════════════════
   CONTACT FORM
══════════════════════════════════ */
/* EmailJS credentials */
var _EJS = { sid:'service_g724xgv', tid:'template_qowsqq5', pk:'xH4aQdYdc8UZn3YLH', init:false };

function _ejsInit() {
  if (_EJS.init) return;
  try { emailjs.init(_EJS.pk); _EJS.init=true; } catch(e) {}
}

function _mailtoFallback(n, em, s, m) {
  var body = 'Name: '+n+'%0AEmail: '+em+'%0A%0A'+m;
  window.location.href = 'mailto:freefire987156@gmail.com?subject='+encodeURIComponent(s)+'&body='+body;
}

function sendForm() {
  var n=document.getElementById('fn').value.trim(), em=document.getElementById('fe').value.trim();
  var s=document.getElementById('fs').value.trim(), m=document.getElementById('fm').value.trim();
  if (!n||!em||!s||!m) { alert('Please fill in all fields.'); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { alert('Please enter a valid email.'); return; }
  var btn=document.getElementById('sbtn');
  btn.textContent='Sending...'; btn.disabled=true;

  /* Try EmailJS first */
  try {
    _ejsInit();
    emailjs.send(_EJS.sid, _EJS.tid, {
      name: n, email: em, subject: s, message: m
    }).then(function() {
      /* SUCCESS */
      document.getElementById('smsg').style.display='block';
      document.getElementById('smsg').innerHTML='✅ Message sent! I will get back to you soon.';
      ['fn','fe','fs','fm'].forEach(function(id){document.getElementById(id).value='';});
      btn.textContent='Send Message ✦'; btn.disabled=false;
      setTimeout(function(){document.getElementById('smsg').style.display='none';}, 5000);
    }, function(err) {
      /* EmailJS failed — fallback to mailto */
      console.warn('EmailJS failed, using mailto fallback:', err);
      btn.textContent='Send Message ✦'; btn.disabled=false;
      _mailtoFallback(n, em, s, m);
    });
  } catch(e) {
    /* EmailJS not loaded — fallback to mailto */
    console.warn('EmailJS not available, using mailto fallback:', e);
    btn.textContent='Send Message ✦'; btn.disabled=false;
    _mailtoFallback(n, em, s, m);
  }
}

/* ══════════════════════════════════
   3D CARD TILT + COLOUR ORB + SHINE
══════════════════════════════════ */
document.querySelectorAll('.proj-card').forEach(function(card) {
  var orb = card.querySelector('.card-orb');
  var shine = card.querySelector('.card-shine');
  var raf = null, ih = false;
  var cx=0, cy=0, tx=0, ty=0, rx=0, ry=0, trx=0, try_=0;

  card.addEventListener('mousemove', function(e) {
    var r = card.getBoundingClientRect(), x = e.clientX-r.left, y = e.clientY-r.top;
    tx = x; ty = y;
    try_ = ((x - r.width/2)  / (r.width/2))  * 13;
    trx  = -((y - r.height/2) / (r.height/2)) * 10;
    if (shine) shine.style.background = 'radial-gradient(circle at '+x+'px '+y+'px, rgba(255,255,255,0.24), transparent 58%)';
  });

  card.addEventListener('mouseenter', function() {
    ih = true; if (raf) cancelAnimationFrame(raf);
    function loop() {
      if (!ih) return;
      cx += (tx-cx)*0.12; cy += (ty-cy)*0.12;
      rx += (trx-rx)*0.1; ry += (try_-ry)*0.1;
      card.style.transform = 'perspective(900px) rotateX('+rx+'deg) rotateY('+ry+'deg) translateZ(8px)';
      if (orb) { orb.style.left = cx+'px'; orb.style.top = cy+'px'; }
      raf = requestAnimationFrame(loop);
    }
    loop();
  });

  card.addEventListener('mouseleave', function() {
    ih = false; trx = 0; try_ = 0; if (raf) cancelAnimationFrame(raf);
    function unwind() {
      rx += (0-rx)*0.12; ry += (0-ry)*0.12;
      card.style.transform = 'perspective(900px) rotateX('+rx+'deg) rotateY('+ry+'deg) translateZ(0)';
      if (Math.abs(rx)>0.05 || Math.abs(ry)>0.05) { raf = requestAnimationFrame(unwind); }
      else { card.style.transform = ''; if (raf) cancelAnimationFrame(raf); }
    }
    unwind();
  });
});

/* ══════════════════════════════════
   BLOB PARALLAX on mouse
══════════════════════════════════ */
document.addEventListener('mousemove', function(e) {
  var px = (e.clientX/window.innerWidth-.5)*28, py = (e.clientY/window.innerHeight-.5)*28;
  document.querySelectorAll('.blob').forEach(function(b,i) { var f=(i+1)*.3; b.style.transform='translate('+px*f+'px,'+py*f+'px)'; });
});