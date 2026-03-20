/* ═══════════════════════════════════════════════
   MOBILE-ONLY JAVASCRIPT
   Sab features sirf mobile pe chalta hai (touch check)
═══════════════════════════════════════════════ */
(function() {
  var isMobile = window.matchMedia('(max-width:768px)').matches;
  if (!isMobile) return; // Desktop/Mac pe kuch nahi chalta

  /* ── F1: SWIPE NAVIGATION ── */
  var sectionIds = ['about','projects','skills','contact'];
  var swipeSt = null;
  var swipeThreshold = 60;

  function getActiveSectionIdx() {
    var sy = window.scrollY, cur = 0;
    sectionIds.forEach(function(id,i) {
      var el = document.getElementById(id);
      if (el && sy >= el.offsetTop - 200) cur = i;
    });
    return cur;
  }

  document.addEventListener('touchstart', function(e) {
    swipeSt = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, { passive: true });

  document.addEventListener('touchend', function(e) {
    if (!swipeSt) return;
    var dx = e.changedTouches[0].clientX - swipeSt.x;
    var dy = e.changedTouches[0].clientY - swipeSt.y;
    swipeSt = null;
    // Only horizontal swipe (dx dominant)
    if (Math.abs(dx) < swipeThreshold || Math.abs(dy) > Math.abs(dx) * 0.8) return;
    var cur = getActiveSectionIdx();
    var next = dx < 0 ? Math.min(cur + 1, sectionIds.length - 1) : Math.max(cur - 1, 0);
    if (next !== cur) {
      var el = document.getElementById(sectionIds[next]);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, { passive: true });

  /* ── Swipe hint — show briefly then hide ── */
  var hint = document.getElementById('swipeHint');
  if (hint) {
    setTimeout(function() { hint.classList.add('hidden'); }, 3500);
  }

  /* ── F2: PULL TO REFRESH ── */
  var ptrEl = document.getElementById('ptr-indicator');
  var ptrText = ptrEl ? ptrEl.querySelector('.ptr-text') : null;
  var ptrStartY = 0;
  var ptrActive = false;
  var ptrThreshold = 80;
  var ptrRefreshing = false;

  document.addEventListener('touchstart', function(e) {
    if (window.scrollY === 0) {
      ptrStartY = e.touches[0].clientY;
      ptrActive = true;
    }
  }, { passive: true });

  document.addEventListener('touchmove', function(e) {
    if (!ptrActive || ptrRefreshing) return;
    var dy = e.touches[0].clientY - ptrStartY;
    if (dy > 20 && window.scrollY === 0) {
      if (ptrEl) {
        ptrEl.classList.add('pulling');
        if (ptrText) ptrText.textContent = dy > ptrThreshold ? 'RELEASE TO REFRESH' : 'PULL TO REFRESH';
      }
    }
  }, { passive: true });

  document.addEventListener('touchend', function(e) {
    if (!ptrActive || ptrRefreshing) return;
    var dy = e.changedTouches[0].clientY - ptrStartY;
    ptrActive = false;
    if (dy > ptrThreshold && window.scrollY === 0) {
      ptrRefreshing = true;
      if (ptrEl) { ptrEl.classList.add('refreshing'); if (ptrText) ptrText.textContent = 'REFRESHING...'; }
      setTimeout(function() {
        window.location.reload();
      }, 1200);
    } else {
      if (ptrEl) ptrEl.classList.remove('pulling');
    }
  }, { passive: true });

  /* ── F3: HAPTIC + RIPPLE ── */
  function haptic() {
    if (navigator.vibrate) navigator.vibrate(8);
  }

  function addRipple(el, e) {
    el.classList.add('ripple-container');
    var rect = el.getBoundingClientRect();
    var x = (e.changedTouches ? e.changedTouches[0].clientX : e.clientX) - rect.left;
    var y = (e.changedTouches ? e.changedTouches[0].clientY : e.clientY) - rect.top;
    var size = Math.max(rect.width, rect.height);
    var rip = document.createElement('span');
    rip.className = 'ripple-wave';
    rip.style.cssText = 'width:'+size+'px;height:'+size+'px;left:'+(x-size/2)+'px;top:'+(y-size/2)+'px';
    el.appendChild(rip);
    setTimeout(function() { rip.remove(); }, 600);
  }

  // Attach haptic+ripple to all buttons
  var btns = document.querySelectorAll('button, .proj-btn, .btn, .nav-link, .pfbtn, .submit-btn');
  btns.forEach(function(btn) {
    btn.addEventListener('touchend', function(e) {
      haptic();
      addRipple(btn, e);
    }, { passive: true });
  });

  /* ── F4: BOTTOM SHEET ── */
  // openBSheet & closeBSheet are global below

  /* ── F5: LONG PRESS MENU on proj-cards ── */
  var lpm = document.getElementById('longPressMenu');
  var lpmTimer = null;
  var lpmCard = null;

  function openLPM(card, x, y) {
    lpmCard = card;
    if (!lpm) return;
    // Position menu near touch point but keep in viewport
    var mx = Math.min(x, window.innerWidth - 200);
    var my = Math.min(y, window.innerHeight - 180);
    lpm.style.left = mx + 'px';
    lpm.style.top = my + 'px';
    lpm.classList.add('open');
    haptic();
    // Wire view action
    var viewBtn = document.getElementById('lpm-view');
    if (viewBtn) {
      viewBtn.onclick = function() {
        var projBtn = card.querySelector('.proj-btn');
        if (projBtn) projBtn.click();
        closeLPM();
      };
    }
    // Wire like action
    var likeBtn = document.getElementById('lpm-like');
    if (likeBtn) {
      likeBtn.onclick = function() {
        var lb = card.querySelector('.proj-like');
        if (lb) lb.click();
        closeLPM();
      };
    }
  }

  document.querySelectorAll('.proj-card').forEach(function(card) {
    card.addEventListener('touchstart', function(e) {
      var touch = e.touches[0];
      lpmTimer = setTimeout(function() {
        openLPM(card, touch.clientX, touch.clientY);
      }, 600);
    }, { passive: true });

    card.addEventListener('touchend', function() {
      clearTimeout(lpmTimer);
    }, { passive: true });

    card.addEventListener('touchmove', function() {
      clearTimeout(lpmTimer);
    }, { passive: true });
  });

  // Close LPM on outside tap
  document.addEventListener('touchend', function(e) {
    if (lpm && lpm.classList.contains('open') && !lpm.contains(e.target)) {
      closeLPM();
    }
  });

})(); // end isMobile guard

/* ── Bottom Sheet global functions (called from HTML onclick) ── */
function openBSheet() {
  var bs = document.getElementById('bottomSheet');
  var ov = document.getElementById('bsOverlay');
  if (bs) bs.classList.add('open');
  if (ov) ov.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeBSheet() {
  var bs = document.getElementById('bottomSheet');
  var ov = document.getElementById('bsOverlay');
  if (bs) bs.classList.remove('open');
  if (ov) ov.classList.remove('open');
  document.body.style.overflow = '';
}

function closeLPM() {
  var lpm = document.getElementById('longPressMenu');
  if (lpm) lpm.classList.remove('open');
}