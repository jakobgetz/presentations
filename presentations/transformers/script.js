(function(){
  const slides = Array.from(document.querySelectorAll('.slide'));
  if(!slides.length) return;
  let idx = 0;
  const counter = document.getElementById('counter');
  function show(i){ idx = (i+slides.length)%slides.length; slides.forEach(s=>s.classList.remove('active')); slides[idx].classList.add('active'); counter.textContent = `${idx+1}/${slides.length} — ${slides[idx].dataset.title || ''}` }
  document.getElementById('prev').addEventListener('click',()=>show(idx-1));
  document.getElementById('next').addEventListener('click',()=>show(idx+1));
  function toggle(id){ const el=document.getElementById(id); if(!el) return; el.classList.toggle('hidden'); }
  const sBtn=document.getElementById('show-sources'); if(sBtn) sBtn.addEventListener('click',()=>toggle('overlay-sources'));
  const nBtn=document.getElementById('show-notes'); if(nBtn) nBtn.addEventListener('click',()=>toggle('overlay-notes'));
  document.querySelectorAll('.overlay .close').forEach(b=>b.addEventListener('click',e=>e.target.closest('.overlay').classList.add('hidden')));
  document.addEventListener('keydown',e=>{ if(e.key==='ArrowRight') show(idx+1); if(e.key==='ArrowLeft') show(idx-1); if(e.key==='n') toggle('overlay-notes'); if(e.key==='s') toggle('overlay-sources'); });
  show(0);
})();
