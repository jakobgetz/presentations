(function(){
  const slides = Array.from(document.querySelectorAll('.slide'));
  let idx = 0;
  const counter = document.getElementById('counter');
  function show(i){ idx = (i+slides.length)%slides.length; slides.forEach(s=>s.classList.remove('active')); slides[idx].classList.add('active'); counter.textContent = `${idx+1}/${slides.length} — ${slides[idx].dataset.title || ''}` }
  document.getElementById('prev').addEventListener('click',()=>show(idx-1));
  document.getElementById('next').addEventListener('click',()=>show(idx+1));
  // overlays
  function toggle(id){ const el=document.getElementById(id); el.classList.toggle('hidden'); }
  document.getElementById('show-sources').addEventListener('click',()=>toggle('overlay-sources'));
  document.getElementById('show-notes').addEventListener('click',()=>toggle('overlay-notes'));
  document.querySelectorAll('.overlay .close').forEach(b=>b.addEventListener('click',e=>e.target.closest('.overlay').classList.add('hidden')));
  // keyboard
  document.addEventListener('keydown',e=>{ if(e.key==='ArrowRight') show(idx+1); if(e.key==='ArrowLeft') show(idx-1); if(e.key==='n') toggle('overlay-notes'); if(e.key==='s') toggle('overlay-sources'); });
  show(0);
})();
