(function () {
  // ─── Slide navigation ───────────────────────────────────────
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
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); show(idx + 1); }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp')   { e.preventDefault(); show(idx - 1); }
    if (e.key === 'Home') { e.preventDefault(); show(0); }
    if (e.key === 'End')  { e.preventDefault(); show(slides.length - 1); }
  });

  updateUI();

  // ─── Embedding map (slide 2) ─────────────────────────────────
  const canvas = document.getElementById('emap-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const tooltip = document.getElementById('emap-tooltip');

    // Hand-crafted 2D positions (trained embedding projection aesthetic)
    // d ∈ [-1, 1] normalized; groups reflect semantic clusters
    const WORDS = [
      // Animals cluster (left)
      { word: 'cat',      x: -0.82, y: -0.38, group: 'animal' },
      { word: 'dog',      x: -0.75, y: -0.12, group: 'animal' },
      { word: 'horse',    x: -0.80, y:  0.22, group: 'animal' },
      // Verbs cluster (right)
      { word: 'run',      x:  0.82, y: -0.52, group: 'verb'   },
      { word: 'swim',     x:  0.74, y: -0.18, group: 'verb'   },
      { word: 'jump',     x:  0.78, y:  0.22, group: 'verb'   },
      { word: 'fly',      x:  0.68, y:  0.58, group: 'verb'   },
      // Royal / gender pair (top center)
      { word: 'king',     x:  0.02, y: -0.88, group: 'royal'  },
      { word: 'queen',    x:  0.22, y: -0.80, group: 'royal'  },
      // Food (bottom center)
      { word: 'apple',    x: -0.18, y:  0.82, group: 'food'   },
      { word: 'orange',   x:  0.10, y:  0.78, group: 'food'   },
      // Function words (scattered, dim)
      { word: 'the',      x: -0.42, y:  0.58, group: 'func'   },
      { word: 'a',        x:  0.32, y:  0.48, group: 'func'   },
      // king − man + woman ≈ queen demo
      { word: 'man',      x: -0.28, y: -0.62, group: 'royal'  },
      { word: 'woman',    x:  0.48, y: -0.68, group: 'royal'  },
    ];

    // Group colors
    const GROUP_COLOR = {
      animal: '#e07b39',
      verb:   '#6366f1',
      royal:  '#f5c542',
      food:   '#22c55e',
      func:   '#475569',
    };

    let W = 0, H = 0;
    let px = [], py = [];   // pixel positions
    let selected = -1;        // index of selected word (-1 = none)
    let nearestK = 3;         // how many neighbors to show
    let animFrame = null;

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      // Use CSS pixel dimensions for both the attribute and the drawing surface
      const cssW = Math.round(rect.width);
      const cssH = Math.round(rect.height);
      W = canvas.width  = cssW;
      H = canvas.height = cssH;
      canvas.style.width  = cssW + 'px';
      canvas.style.height = cssH + 'px';
      recompute();
    }

    function recompute() {
      // canvas.width/height are already in CSS pixels (no DPR scaling)
      const rw = W;
      const rh = H;
      const pad = 36;
      const ax = (rw - 2 * pad) / 2;
      const ay = (rh - 2 * pad) / 2;
      px = WORDS.map(w => rw / 2 + w.x * ax);
      py = WORDS.map(w => rh / 2 + w.y * ay);
    }

    function dist2(i, j) {
      return (px[i]-px[j])**2 + (py[i]-py[j])**2;
    }

    function getNeighbors(i) {
      const d = WORDS.map((_, j) => ({ j, d: dist2(i, j) }));
      return d.filter(x => x.j !== i).sort((a, b) => a.d - b.d).slice(0, nearestK);
    }

    function draw(now) {
      const rw = W;
      const rh = H;
      ctx.clearRect(0, 0, rw, rh);

      // Background grid
      ctx.strokeStyle = 'rgba(255,220,180,0.035)';
      ctx.lineWidth = 0.5;
      const gridN = 6;
      for (let g = 0; g <= gridN; g++) {
        const gx = (rw / gridN) * g;
        const gy = (rh / gridN) * g;
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, rh); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(rw, gy); ctx.stroke();
      }

      // Axis labels (subtle)
      ctx.fillStyle = 'rgba(90,79,68,0.6)';
      ctx.font = '9px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('semantic axis 1 →', rw - 70, rh - 8);
      ctx.save(); ctx.translate(10, rh / 2); ctx.rotate(-Math.PI/2); ctx.fillText('semantic axis 2 →', 0, 0); ctx.restore();

      // Draw connecting lines for nearest neighbors
      if (selected >= 0) {
        const neighbors = getNeighbors(selected);
        neighbors.forEach(({ j }) => {
          const alpha = 0.18;
          ctx.beginPath();
          ctx.moveTo(px[selected], py[selected]);
          ctx.lineTo(px[j], py[j]);
          ctx.strokeStyle = GROUP_COLOR[WORDS[selected].group];
          ctx.lineWidth = 1.5;
          ctx.globalAlpha = alpha;
          ctx.stroke();
          ctx.globalAlpha = 1;
        });
      }

      // Draw dots
      WORDS.forEach((w, i) => {
        const isSel   = i === selected;
        const isNear  = selected >= 0 && getNeighbors(selected).some(n => n.j === i);
        const rad = isSel ? 9 : isNear ? 6.5 : 5;
        const col = GROUP_COLOR[w.group];

        // Glow for selected
        if (isSel) {
          const grd = ctx.createRadialGradient(px[i], py[i], 0, px[i], py[i], rad * 3);
          grd.addColorStop(0, col + '55');
          grd.addColorStop(1, 'transparent');
          ctx.fillStyle = grd;
          ctx.beginPath();
          ctx.arc(px[i], py[i], rad * 3, 0, Math.PI * 2);
          ctx.fill();
        }

        // Dot
        ctx.beginPath();
        ctx.arc(px[i], py[i], rad, 0, Math.PI * 2);
        ctx.fillStyle = isSel ? '#fff' : col;
        ctx.fill();

        // Label for selected + nearby + royal group always
        if (isSel || isNear || w.group === 'royal') {
          ctx.font = `${isSel ? 'bold ' : ''} 11px JetBrains Mono, monospace`;
          ctx.textAlign = 'left';
          ctx.fillStyle = isSel ? '#fff' : col;
          ctx.fillText(w.word, px[i] + rad + 5, py[i] + 4);
        }
      });

      animFrame = requestAnimationFrame(draw);
    }

    function findWord(mx, my) {
      const thresh = 18;
      let best = -1, bestD = thresh ** 2;
      WORDS.forEach((_, i) => {
        const d = (px[i]-mx)**2 + (py[i]-my)**2;
        if (d < bestD) { bestD = d; best = i; }
      });
      return best;
    }

    function moveTooltip(e, wordIdx) {
      const rect = canvas.parentElement.getBoundingClientRect();
      const ex = e.clientX - rect.left;
      const ey = e.clientY - rect.top;
      tooltip.style.left = (ex + 16) + 'px';
      tooltip.style.top  = (ey - 8)  + 'px';
      tooltip.classList.add('visible');
    }

    function showTooltip(wordIdx) {
      const neighbors = getNeighbors(wordIdx);
      const nn = neighbors.map(({ j }) => `<span style="color:${GROUP_COLOR[WORDS[j].group]}">${WORDS[j].word}</span>`).join(', ');
      tooltip.innerHTML = `<span class="tt-word">${WORDS[wordIdx].word}</span><span class="tt-neighbors">nearest: ${nn}</span>`;
    }

    // Mouse events
    canvas.addEventListener('click', e => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const w = findWord(mx, my);
      if (w >= 0) {
        selected = (selected === w) ? -1 : w;
        if (selected >= 0) {
          showTooltip(selected);
          moveTooltip(e, selected);
          tooltip.classList.add('visible');
        } else {
          tooltip.classList.remove('visible');
        }
      } else {
        selected = -1;
        tooltip.classList.remove('visible');
      }
    });

    canvas.addEventListener('mousemove', e => {
      if (selected >= 0) {
        moveTooltip(e, selected);
        return;
      }
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const w = findWord(mx, my);
      if (w >= 0) {
        showTooltip(w);
        moveTooltip(e, w);
        tooltip.classList.add('visible');
      } else {
        tooltip.classList.remove('visible');
      }
    });

    canvas.addEventListener('mouseleave', () => {
      if (selected < 0) tooltip.classList.remove('visible');
    });

    // ResizeObserver to keep canvas sized correctly
    const ro = new ResizeObserver(() => { resize(); });
    ro.observe(canvas.parentElement);
    resize();
    animFrame = requestAnimationFrame(draw);
  }
})();