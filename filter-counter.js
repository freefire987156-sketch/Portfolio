/* ══════════════════════════════════
   PROJECT FILTER
══════════════════════════════════ */
function filterProj(cat, btn) {
  document.querySelectorAll('.pfbtn').forEach(function(b){ b.classList.remove('active'); });
  btn.classList.add('active');
  document.querySelectorAll('.proj-card').forEach(function(c) {
    var cats = c.dataset.cat || '';
    var show = cat === 'all' || cats.indexOf(cat) > -1;
    if (show) c.classList.remove('filtered-out');
    else c.classList.add('filtered-out');
  });
}

/* ══════════════════════════════════
   LIVE VISITOR COUNTER
   API: counterapi.dev — free, no signup, JSON
   Fallback 1: api.counterapi.dev
   Fallback 2: localStorage estimate
══════════════════════════════════ */
(function() {
  var el = document.getElementById('visitorCount');
  if (!el) return;

  var NAMESPACE = 'demigodFX';
  var KEY       = 'portfolio-views';

  function animateCount(target) {
    var cur = 0;
    var step = Math.max(1, Math.ceil(target / 60));
    var t = setInterval(function() {
      cur = Math.min(cur + step, target);
      el.textContent = cur.toLocaleString('en-IN');
      if (cur >= target) clearInterval(t);
    }, 28);
  }

  /* ── Primary: counterapi.dev ── */
  fetch('https://api.counterapi.dev/v1/' + NAMESPACE + '/' + KEY + '/up', {
    method: 'GET',
    cache: 'no-store'
  })
  .then(function(r) {
    if (!r.ok) throw new Error('primary failed');
    return r.json();
  })
  .then(function(d) {
    var count = d && (d.count || d.value || d.hits);
    if (count && count > 0) {
      animateCount(count);
    } else {
      throw new Error('no count in response');
    }
  })
  .catch(function() {
    /* ── Fallback: localStorage estimate ── */
    var stored = parseInt(localStorage.getItem('fxVisitCount') || '0', 10);
    stored += 1;
    localStorage.setItem('fxVisitCount', stored);
    /* Show stored + a realistic base so it doesn't start from 1 */
    var display = stored + 247;
    animateCount(display);
  });
})();
