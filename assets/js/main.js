// =========================================================
// SPACE MC — shared interactions (starfield, nav, copy IP)
// =========================================================

(function starfield(){
  const canvas = document.createElement('canvas');
  canvas.id = 'starfield';
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let stars = [];
  let w, h;

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    const count = Math.min(160, Math.floor((w * h) / 9000));
    stars = Array.from({length: count}, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.3 + 0.3,
      base: Math.random() * 0.5 + 0.3,
      speed: Math.random() * 0.015 + 0.004,
      phase: Math.random() * Math.PI * 2,
      drift: Math.random() * 0.04 + 0.01
    }));
  }

  function draw(t){
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#cfe9ff';
    for (const s of stars){
      const twinkle = reduceMotion ? s.base : s.base + Math.sin(t * s.speed + s.phase) * 0.35;
      ctx.globalAlpha = Math.max(0, Math.min(1, twinkle));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
      if (!reduceMotion){
        s.y += s.drift;
        if (s.y > h) { s.y = -2; s.x = Math.random() * w; }
      }
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(draw);
})();

// ---------- mobile nav toggle ----------
(function nav(){
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
  });
  links.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });
})();

// ---------- copy IP ----------
function copyIP(btn, value){
  navigator.clipboard.writeText(value).then(() => {
    const original = btn.textContent;
    btn.textContent = 'Disalin ✓';
    btn.disabled = true;
    setTimeout(() => { btn.textContent = original; btn.disabled = false; }, 1800);
  }).catch(() => {
    const original = btn.textContent;
    btn.textContent = 'Gagal, salin manual';
    setTimeout(() => { btn.textContent = original; }, 1800);
  });
}
