/* SciProbe · SVG pseudo-3D crystal viewer (orthographic projection, no WebGL) */

const Crystal = {
  mount(target, data, opts) {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return;
    const o = Object.assign({ height: 320, autoRotate: true, speed: 0.006 }, opts || {});
    el.style.height = o.height + 'px';

    const cell = data.cell;
    const cx = cell.a / 2, cy = cell.b / 2, cz = cell.c / 2;
    const atoms = data.atoms.map(a => ({
      ...a,
      X: a.x * cell.a - cx,
      Y: a.y * cell.b - cy,
      Z: a.z * cell.c - cz,
    }));

    // bonds by distance
    const bonds = [];
    for (let i = 0; i < atoms.length; i++) {
      for (let j = i + 1; j < atoms.length; j++) {
        const dx = atoms[i].X - atoms[j].X, dy = atoms[i].Y - atoms[j].Y, dz = atoms[i].Z - atoms[j].Z;
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (d > 0.9 && d < 2.35) bonds.push([i, j]);
      }
    }

    const corners = [];
    for (let x = 0; x <= 1; x++) for (let y = 0; y <= 1; y++) for (let z = 0; z <= 1; z++)
      corners.push([x * cell.a - cx, y * cell.b - cy, z * cell.c - cz]);
    const cellEdges = [];
    for (let i = 0; i < corners.length; i++) for (let j = i + 1; j < corners.length; j++) {
      const a = corners[i], b = corners[j];
      const diff = Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
      if (Math.abs(diff - Math.min(cell.a, cell.b, cell.c)) < 0.4) cellEdges.push([i, j]);
    }

    let angle = 0.6, tilt = 0.28, dragging = false, lastX = 0, lastY = 0, raf = null, running = true;

    const project = (p) => {
      const ca = Math.cos(angle), sa = Math.sin(angle);
      const x1 = p[0] * ca - p[2] * sa;
      const z1 = p[0] * sa + p[2] * ca;
      const ct = Math.cos(tilt), st = Math.sin(tilt);
      const y1 = p[1] * ct - z1 * st;
      const z2 = p[1] * st + z1 * ct;
      return [x1, y1, z2];
    };

    const draw = () => {
      const W = el.clientWidth || 520, H = o.height;
      const s = Math.min(W, H) / (Math.max(cell.a, cell.b, cell.c) * 1.9);
      const ox = W / 2, oy = H / 2 + 6;

      const projected = atoms.map((a, i) => {
        const pr = project([a.X, a.Y, a.Z]);
        return { ...a, i, sx: ox + pr[0] * s, sy: oy - pr[1] * s * 0.94 + pr[2] * s * 0.18, depth: pr[2] };
      });
      const projAtoms = [...projected].sort((p, q) => p.depth - q.depth);

      const projCorners = corners.map(c => {
        const pr = project(c);
        return [ox + pr[0] * s, oy - pr[1] * s * 0.94 + pr[2] * s * 0.18, pr[2]];
      });

      let g = '';
      // cell wireframe
      cellEdges.forEach(([i, j]) => {
        g += `<line x1="${projCorners[i][0].toFixed(1)}" y1="${projCorners[i][1].toFixed(1)}"
          x2="${projCorners[j][0].toFixed(1)}" y2="${projCorners[j][1].toFixed(1)}"
          stroke="#2E4045" stroke-width="1" stroke-dasharray="3 3" opacity=".8"/>`;
      });

      // bonds (behind atoms)
      bonds.forEach(([i, j]) => {
        const A = projected[i], B = projected[j];
        g += `<line x1="${A.sx.toFixed(1)}" y1="${A.sy.toFixed(1)}" x2="${B.sx.toFixed(1)}" y2="${B.sy.toFixed(1)}"
          stroke="#3E555B" stroke-width="1.2" opacity=".45"/>`;
      });

      // atoms
      projAtoms.forEach(a => {
        const r = 4 + 7 * a.size * (0.86 + 0.14 * ((a.depth + 6) / 12));
        const hi = o.highlight && o.highlight === a.el;
        g += `<circle cx="${a.sx.toFixed(1)}" cy="${a.sy.toFixed(1)}" r="${r.toFixed(1)}"
          fill="${a.color}" fill-opacity="${hi ? 0.95 : 0.72}" stroke="${a.color}" stroke-width="${hi ? 2 : 1}"/>`;
        g += `<text x="${a.sx.toFixed(1)}" y="${(a.sy + 3).toFixed(1)}" text-anchor="middle"
          font-size="7.5" font-family="monospace" fill="#04110E" opacity="${hi ? 1 : .82}">${a.el}</text>`;
      });

      el.innerHTML = `<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:100%">
        <defs><radialGradient id="cglow" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stop-color="#3BD9BE" stop-opacity=".07"/>
          <stop offset="100%" stop-color="#3BD9BE" stop-opacity="0"/></radialGradient></defs>
        <rect width="${W}" height="${H}" fill="url(#cglow)"/>${g}</svg>`;
    };

    const loop = () => {
      if (!running) return;
      if (!dragging && o.autoRotate) { angle += o.speed; draw(); }
      raf = requestAnimationFrame(loop);
    };

    el.style.position = 'relative';
    el.style.overflow = 'hidden';
    el.style.cursor = 'grab';

    el.addEventListener('pointerdown', e => {
      dragging = true; lastX = e.clientX; lastY = e.clientY;
      el.style.cursor = 'grabbing';
      el.setPointerCapture(e.pointerId);
    });
    el.addEventListener('pointermove', e => {
      if (!dragging) return;
      angle += (e.clientX - lastX) * 0.008;
      tilt = Math.max(-0.9, Math.min(0.9, tilt + (e.clientY - lastY) * 0.006));
      lastX = e.clientX; lastY = e.clientY;
      draw();
    });
    el.addEventListener('pointerup', () => { dragging = false; el.style.cursor = 'grab'; });

    draw();
    loop();

    return {
      stop() { running = false; if (raf) cancelAnimationFrame(raf); },
      highlight(element) { o.highlight = element; draw(); },
      resize() { draw(); },
    };
  },
};

window.Crystal = Crystal;
