(function () {
  const slides = Array.from(document.querySelectorAll('.slide'));
  if (!slides.length) return;

  let idx = 0;
  const counter = document.getElementById('counter');
  const progress = document.getElementById('progress');

  function updateUI() {
    slides.forEach((s) => s.classList.remove('active'));
    slides[idx].classList.add('active');

    const title = slides[idx].dataset.title || '';
    counter.textContent = `${idx + 1} / ${slides.length}  ·  ${title}`;
    progress.style.width = `${((idx + 1) / slides.length) * 100}%`;
  }

  function show(i) {
    idx = (i + slides.length) % slides.length;
    updateUI();
  }

  document.getElementById('prev').addEventListener('click', () => show(idx - 1));
  document.getElementById('next').addEventListener('click', () => show(idx + 1));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      show(idx + 1);
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      show(idx - 1);
    }
    if (e.key === 'Home') {
      e.preventDefault();
      show(0);
    }
    if (e.key === 'End') {
      e.preventDefault();
      show(slides.length - 1);
    }
  });

  updateUI();
})();