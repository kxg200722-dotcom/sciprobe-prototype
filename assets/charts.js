/* SciProbe · lightweight SVG chart renderer (no external deps, offline-safe) */

const NS = 'http://www.w3.org/2000/svg';
let uid = 0;

const C = {
  line: '#223034', line2: '#2E4045', text: '#61756F', text2: '#93A6A1', text1: '#DDE7E3',
  accent: '#3BD9BE', bg: '#0E1315',
};

function niceDomain(vals, padRatio) {
  let min = Math.min(...vals), max = Math.max(...vals);
  if (min === max) { min -= 1; max += 1; }
  const pad = (max - min) * (padRatio === undefined ? 0.08 : padRatio);
  return [min - pad, max + pad];
}

function scaleFns(dom, range) {
  const [d0, d1] = dom;
  return v => range[0] + (range[1] - range[0]) * ((v - d0) / (d1 - d0 || 1));
}

function ticks(dom, count) {
  const [a, b] = dom;
  const step = (b - a) / (count - 1);
  return Array.from({ length: count }, (_, i) => a + step * i);
}

function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

const Charts = {
  line(target, o) {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return;
    const W = 720, H = o.h || 230, P = { l: 52, r: 18, t: 16, b: 34 };
    const id = 'mk' + (++uid);
    const allPts = o.series.flatMap(s => s.pts);
    const xd = o.xDomain || niceDomain(allPts.map(p => p[0]));
    const yd = o.yDomain || niceDomain(allPts.map(p => p[1]));
    const sx = scaleFns(xd, [P.l, W - P.r]);
    const sy = scaleFns(yd, [H - P.b, P.t]);
    const xt = ticks(xd, o.xTicks || 6);
    const yt = ticks(yd, o.yTicks || 5);

    let g = '';
    // grid
    yt.forEach(v => {
      g += `<line x1="${P.l}" y1="${sy(v)}" x2="${W - P.r}" y2="${sy(v)}" stroke="${C.line}" stroke-width="1"/>`;
      g += `<text x="${P.l - 8}" y="${sy(v) + 3}" text-anchor="end" font-size="9" font-family="monospace" fill="${C.text}">${o.fmtY ? o.fmtY(v) : v.toFixed(2)}</text>`;
    });
    xt.forEach(v => {
      g += `<line x1="${sx(v)}" y1="${P.t}" x2="${sx(v)}" y2="${H - P.b}" stroke="${C.line}" stroke-width="1" stroke-dasharray="0"/>`;
      g += `<text x="${sx(v)}" y="${H - P.b + 15}" text-anchor="middle" font-size="9" font-family="monospace" fill="${C.text}">${o.fmtX ? o.fmtX(v) : v.toFixed(1)}</text>`;
    });

    // bands (vertical highlight ranges)
    (o.bands || []).forEach(b => {
      const x0 = sx(b.from), x1 = sx(b.to);
      g += `<rect x="${x0}" y="${P.t}" width="${Math.max(1, x1 - x0)}" height="${H - P.b - P.t}" fill="${b.color || 'rgba(59,217,190,.07)'}" stroke="none"/>`;
      if (b.label) g += `<text x="${x0 + 4}" y="${P.t + 12}" font-size="8.5" font-family="monospace" fill="${C.text}">${esc(b.label)}</text>`;
    });

    // series
    o.series.forEach(s => {
      const d = s.pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${sx(p[0]).toFixed(2)},${sy(p[1]).toFixed(2)}`).join(' ');
      g += `<path d="${d}" fill="none" stroke="${s.color || C.accent}" stroke-width="${s.width || 1.6}"
        ${s.dashed ? 'stroke-dasharray="5 4"' : ''} stroke-linejoin="round" opacity="${s.opacity || 1}"/>`;
      if (s.dots) s.pts.forEach(p => {
        g += `<circle cx="${sx(p[0])}" cy="${sy(p[1])}" r="2.4" fill="${s.color || C.accent}"/>`;
      });
    });

    // markers (single points with label)
    (o.markers || []).forEach(m => {
      g += `<circle cx="${sx(m.x)}" cy="${sy(m.y)}" r="${m.r || 4}" fill="${m.color || C.accent}" opacity=".9"/>`;
      if (m.label) g += `<text x="${sx(m.x) + 7}" y="${sy(m.y) - 5}" font-size="9" font-family="monospace" fill="${C.text2}">${esc(m.label)}</text>`;
    });

    // axes
    g += `<line x1="${P.l}" y1="${H - P.b}" x2="${W - P.r}" y2="${H - P.b}" stroke="${C.line2}"/>`;
    g += `<line x1="${P.l}" y1="${P.t}" x2="${P.l}" y2="${H - P.b}" stroke="${C.line2}"/>`;
    if (o.xLabel) g += `<text x="${W - P.r}" y="${H - 4}" text-anchor="end" font-size="9.5" font-family="monospace" fill="${C.text}">${esc(o.xLabel)}</text>`;
    if (o.yLabel) g += `<text x="${P.l - 8}" y="${P.t - 4}" text-anchor="end" font-size="9.5" font-family="monospace" fill="${C.text}">${esc(o.yLabel)}</text>`;

    el.innerHTML = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet">${g}</svg>`;
    if (o.legend !== false) el.insertAdjacentHTML('beforeend', Charts.legend(o.series));
  },

  legend(series) {
    return `<div class="chart-legend">${series.map(s =>
      `<span><i style="background:${s.color};${s.dashed ? 'opacity:.6' : ''}"></i>${esc(s.name)}</span>`).join('')}</div>`;
  },

  scatter(target, o) {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return;
    const W = 720, H = o.h || 260, P = { l: 52, r: 20, t: 18, b: 34 };
    const xd = o.xDomain || niceDomain(o.points.map(p => p.x));
    const yd = o.yDomain || niceDomain(o.points.map(p => p.y));
    const sx = scaleFns(xd, [P.l, W - P.r]);
    const sy = scaleFns(yd, [H - P.b, P.t]);
    const maxR = Math.max(...o.points.map(p => p.r));
    let g = '';
    ticks(yd, 5).forEach(v => {
      g += `<line x1="${P.l}" y1="${sy(v)}" x2="${W - P.r}" y2="${sy(v)}" stroke="${C.line}"/>`;
      g += `<text x="${P.l - 8}" y="${sy(v) + 3}" text-anchor="end" font-size="9" font-family="monospace" fill="${C.text}">${o.fmtY ? o.fmtY(v) : v.toFixed(2)}</text>`;
    });
    ticks(xd, 6).forEach(v => {
      g += `<line x1="${sx(v)}" y1="${P.t}" x2="${sx(v)}" y2="${H - P.b}" stroke="${C.line}"/>`;
      g += `<text x="${sx(v)}" y="${H - P.b + 15}" text-anchor="middle" font-size="9" font-family="monospace" fill="${C.text}">${o.fmtX ? o.fmtX(v) : v.toFixed(1)}</text>`;
    });
    // target zone
    if (o.zone) {
      const x0 = sx(o.zone.x0), x1 = sx(o.zone.x1), y0 = sy(o.zone.y1), y1 = sy(o.zone.y0);
      g += `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" fill="rgba(59,217,190,.06)" stroke="rgba(59,217,190,.28)" stroke-dasharray="4 4"/>`;
      g += `<text x="${x0 + 6}" y="${y0 + 13}" font-size="9" font-family="monospace" fill="${C.text2}">${esc(o.zone.label || '')}</text>`;
    }
    o.points.forEach(p => {
      const r = 5 + 11 * (p.r / maxR);
      g += `<circle cx="${sx(p.x)}" cy="${sy(p.y)}" r="${r}" fill="${p.color}" opacity=".16"/>`;
      g += `<circle cx="${sx(p.x)}" cy="${sy(p.y)}" r="${r}" fill="none" stroke="${p.color}" stroke-width="1"/>`;
      g += `<circle cx="${sx(p.x)}" cy="${sy(p.y)}" r="2" fill="${p.color}"/>`;
      if (p.label) g += `<text x="${sx(p.x)}" y="${sy(p.y) - r - 5}" text-anchor="middle" font-size="9" font-family="monospace" fill="${C.text2}">${esc(p.label)}</text>`;
    });
    g += `<line x1="${P.l}" y1="${H - P.b}" x2="${W - P.r}" y2="${H - P.b}" stroke="${C.line2}"/>`;
    g += `<line x1="${P.l}" y1="${P.t}" x2="${P.l}" y2="${H - P.b}" stroke="${C.line2}"/>`;
    if (o.xLabel) g += `<text x="${W - P.r}" y="${H - 4}" text-anchor="end" font-size="9.5" font-family="monospace" fill="${C.text}">${esc(o.xLabel)}</text>`;
    if (o.yLabel) g += `<text x="${P.l - 8}" y="${P.t - 4}" text-anchor="end" font-size="9.5" font-family="monospace" fill="${C.text}">${esc(o.yLabel)}</text>`;
    el.innerHTML = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet">${g}</svg>`;
  },

  xrd(target, o) {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return;
    const W = 720, H = o.h || 300, P = { l: 46, r: 18, t: 34, b: 40 };
    const xd = [10, 66], yd = [0, 118];
    const sx = scaleFns(xd, [P.l, W - P.r]);
    const sy = scaleFns(yd, [H - P.b, P.t]);
    let g = '';
    ticks([10, 66], 9).forEach(v => {
      g += `<line x1="${sx(v)}" y1="${P.t}" x2="${sx(v)}" y2="${H - P.b}" stroke="${C.line}"/>`;
      g += `<text x="${sx(v)}" y="${H - P.b + 16}" text-anchor="middle" font-size="9" font-family="monospace" fill="${C.text}">${v}</text>`;
    });
    [0, 20, 40, 60, 80, 100].forEach(v => {
      g += `<line x1="${P.l}" y1="${sy(v)}" x2="${W - P.r}" y2="${sy(v)}" stroke="${C.line}"/>`;
      g += `<text x="${P.l - 8}" y="${sy(v) + 3}" text-anchor="end" font-size="9" font-family="monospace" fill="${C.text}">${v}</text>`;
    });
    // reference pattern
    const refD = o.reference.map((p, i) => `${i === 0 ? 'M' : 'L'}${sx(p[0]).toFixed(2)},${sy(p[1]).toFixed(2)}`).join(' ');
    g += `<path d="${refD}" fill="none" stroke="${C.text}" stroke-width="1" opacity=".5"/>`;
    // main pattern
    const d = o.pattern.map((p, i) => `${i === 0 ? 'M' : 'L'}${sx(p[0]).toFixed(2)},${sy(p[1]).toFixed(2)}`).join(' ');
    g += `<path d="${d}" fill="none" stroke="${C.accent}" stroke-width="1.25"/>`;

    if (o.labels) {
      const labelled = [[19.42, '110'], [24.32, '116'], [27.42, '024'], [29.60, '131'], [32.32, '116'], [28.21, 'ZrO₂']];
      labelled.forEach(([p, hkl]) => {
        const peak = o.pattern.reduce((a, b) => Math.abs(b[0] - p) < Math.abs(a[0] - p) ? b : a);
        const x = sx(p), y = sy(peak[1]);
        g += `<line x1="${x}" y1="${y - 4}" x2="${x}" y2="${y - 16}" stroke="${C.line2}" stroke-width="1"/>`;
        g += `<text x="${x}" y="${y - 20}" text-anchor="middle" font-size="8.5" font-family="monospace" fill="${hkl === 'ZrO₂' ? '#E06A5C' : C.text2}">${hkl}</text>`;
      });
      // sticks
      (o.sticks || []).forEach(s => {
        g += `<line x1="${sx(s[0])}" y1="${H - P.b}" x2="${sx(s[0])}" y2="${H - P.b - s[1] * 0.22}" stroke="#3E555B" stroke-width="1.6"/>`;
      });
    }
    g += `<line x1="${P.l}" y1="${H - P.b}" x2="${W - P.r}" y2="${H - P.b}" stroke="${C.line2}"/>`;
    g += `<text x="${W - P.r}" y="${H - 6}" text-anchor="end" font-size="9.5" font-family="monospace" fill="${C.text}">2θ (Cu Kα, °)</text>`;
    g += `<text x="${P.l - 6}" y="${P.t - 8}" text-anchor="end" font-size="9.5" font-family="monospace" fill="${C.text}">I / a.u.</text>`;
    el.innerHTML = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet">${g}</svg>`;
  },

  spark(target, pts, color) {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return;
    const W = 120, H = 28;
    const xs = pts.map((p, i) => i), ys = pts.map(p => p[1]);
    const xd = [0, pts.length - 1], yd = niceDomain(ys, 0.2);
    const sx = scaleFns(xd, [2, W - 2]), sy = scaleFns(yd, [H - 3, 3]);
    const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${sx(i)},${sy(p[1])}`).join(' ');
    el.innerHTML = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
      <path d="${d}" fill="none" stroke="${color || C.accent}" stroke-width="1.4"/></svg>`;
  },
};

window.Charts = Charts;
