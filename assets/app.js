/* SciProbe · shared shell + utilities
   The nav/sidebar/topbar markup lives here ONCE. Every page renders it identically
   and only fills its own <main>. Never re-author navigation per page. */

const NAV = [
  { group: '科研闭环', items: [
    { id: 'index',      label: '总览工作台', icon: 'grid',    href: 'index.html',      meta: '01' },
    { id: 'workspace',  label: '智能体协作', icon: 'chat',    href: 'workspace.html',  meta: '02' },
    { id: 'literature', label: '文献与图谱', icon: 'library', href: 'literature.html', meta: '03' },
    { id: 'analysis',   label: '科学数据解析', icon: 'wave',  href: 'analysis.html',   meta: '04' },
  ]},
  { group: '验证与产出', items: [
    { id: 'compute',    label: '计算与工具链', icon: 'cpu',   href: 'compute.html',    meta: '05' },
    { id: 'experiment', label: '实验与验证', icon: 'flask',   href: 'experiment.html', meta: '06' },
    { id: 'deliver',    label: '成果与生态', icon: 'file',    href: 'deliver.html',    meta: '07' },
  ]},
];

const ICONS = {
  grid:   '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',
  chat:   '<path d="M21 14a3 3 0 0 1-3 3H8l-5 4V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3z"/><path d="M8 9h8M8 12.5h5"/>',
  library:'<path d="M4 5v15M9 5v15" /><path d="M14 5.5l5 14.2"/><path d="M3 3h6M8 3h6"/>',
  wave:   '<path d="M2 13h4l2.5-7 4 14L16 9l2 4h4"/>',
  cpu:    '<rect x="5" y="5" width="14" height="14" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/>',
  flask:  '<path d="M9 3h6M10 3v6.5L4.6 18a2 2 0 0 0 1.7 3h11.4a2 2 0 0 0 1.7-3L14 9.5V3"/><path d="M7 15h10"/>',
  file:   '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
  bell:   '<path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10.5 21h3"/>',
  play:   '<path d="M6 4l14 8-14 8z"/>',
  plus:   '<path d="M12 5v14M5 12h14"/>',
  x:      '<path d="M6 6l12 12M18 6L6 18"/>',
  check:  '<path d="M4 12.5l5 5L20 6.5"/>',
  copy:   '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>',
  down:   '<path d="M12 3v12M7 11l5 5 5-5M4 21h16"/>',
  up:     '<path d="M12 21V9M7 13l5-5 5 5M4 3h16"/>',
  refresh:'<path d="M20 12a8 8 0 1 1-2.3-5.6"/><path d="M20 4v5h-5"/>',
  brain:  '<path d="M9 3a3 3 0 0 0-3 3 3 3 0 0 0-1 5.8A3 3 0 0 0 6 17a3 3 0 0 0 3 3 2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"/><path d="M15 3a3 3 0 0 1 3 3 3 3 0 0 1 1 5.8A3 3 0 0 1 18 17a3 3 0 0 1-3 3 2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/>',
  net:    '<circle cx="12" cy="12" r="2.5"/><circle cx="5" cy="5" r="2.2"/><circle cx="19" cy="5" r="2.2"/><circle cx="5" cy="19" r="2.2"/><circle cx="19" cy="19" r="2.2"/><path d="M6.8 6.8L10 10M17.2 6.8L14 10M6.8 17.2L10 14M17.2 17.2L14 14"/>',
  lock:   '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  arrow:  '<path d="M5 12h14M13 6l6 6-6 6"/>',
  ext:    '<path d="M14 4h6v6"/><path d="M20 4L11 13"/><path d="M18 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5"/>',
  filter: '<path d="M3 5h18l-7 8v6l-4 2v-8z"/>',
  clock:  '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
  spark:  '<path d="M12 3v4M12 17v4M3 12h4M17 12h4"/><path d="M6.5 6.5l2.5 2.5M15 15l2.5 2.5M17.5 6.5L15 9M9 15l-2.5 2.5"/>',
};

function icon(name, size) {
  const p = ICONS[name] || ICONS.grid;
  const s = size || 15;
  return `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor"
    stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
}

function buildShell() {
  const page = document.body.dataset.page || 'index';
  const nav = NAV.map(g => `
    <div class="nav-group">
      <div class="nav-group-label">${g.group}</div>
      ${g.items.map(it => `
        <a class="nav-item ${it.id === page ? 'active' : ''}" href="${it.href}">
          ${icon(it.icon)}<span>${it.label}</span><span class="nav-meta">${it.meta}</span>
        </a>`).join('')}
    </div>`).join('');

  const navEl = `
  <aside class="sidebar">
    <div class="brand">
      <div class="brand-mark">SP</div>
      <div class="brand-text"><b>书生·探微</b><span>SciProbe</span></div>
    </div>
    <nav class="nav">${nav}</nav>
    <div class="nav-foot">
      <div class="runtime">
        <span class="dot"></span><b>Intern-S2</b> 在线
        <span class="spacer"></span><span>ctx 256K</span>
      </div>
    </div>
  </aside>`;

  const topEl = `
  <header class="topbar">
    <div class="crumb">
      <span>MAT-SCI</span><span class="sep">/</span>
      <b>NASICON 钠固态电解质 · P-2409</b><span class="sep">/</span>
      <span>${pageLabel(page)}</span>
    </div>
    <div class="push"></div>
    <div class="searchbox">
      ${icon('search', 13)}
      <input id="global-search" placeholder="搜索文献 / 证据 / 样本 / 工具" autocomplete="off"/>
    </div>
    <div class="top-status"><span class="dot dot-run"></span>2 任务运行中</div>
    <div class="avatar">ZH</div>
  </header>`;

  document.body.insertAdjacentHTML('afterbegin', navEl + topEl);
}

function pageLabel(page) {
  for (const g of NAV) for (const it of g.items) if (it.id === page) return it.label;
  return '总览工作台';
}

/* ---------- utilities ---------- */
let toastTimer = null;
function toast(msg, kind) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.className = 'toast-wrap';
    document.body.appendChild(wrap);
  }
  const el = document.createElement('div');
  el.className = 'toast' + (kind === 'warn' ? ' warn' : '');
  el.innerHTML = `<span class="dot"></span><span>${msg}</span>`;
  wrap.appendChild(el);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.remove(), 2600);
}

function openModal(title, html, hint) {
  let mask = document.querySelector('.modal-mask');
  if (!mask) {
    mask = document.createElement('div');
    mask.className = 'modal-mask';
    mask.innerHTML = `
      <div class="modal">
        <div class="panel-head">
          <h3 id="modal-title"></h3><span class="hint" id="modal-hint"></span>
          <div class="right"><button class="btn btn-ghost btn-sm" id="modal-x">${icon('x', 13)}</button></div>
        </div>
        <div class="modal-body" id="modal-body"></div>
      </div>`;
    document.body.appendChild(mask);
    mask.addEventListener('click', e => { if (e.target === mask) mask.classList.remove('open'); });
    mask.querySelector('#modal-x').addEventListener('click', () => mask.classList.remove('open'));
  }
  mask.querySelector('#modal-title').textContent = title;
  mask.querySelector('#modal-hint').textContent = hint || '';
  mask.querySelector('#modal-body').innerHTML = html;
  mask.classList.add('open');
}

function closeModal() {
  const m = document.querySelector('.modal-mask');
  if (m) m.classList.remove('open');
}

function fmt(n, d) {
  if (n === null || n === undefined) return '—';
  return typeof n === 'number' ? n.toFixed(d === undefined ? 2 : d) : n;
}

function copyText(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => toast('已复制到剪贴板')).catch(() => toast('复制失败', 'warn'));
  } else {
    toast('当前环境不支持复制', 'warn');
  }
}

function typeInto(el, text, speed, done) {
  let i = 0;
  el.textContent = '';
  const step = () => {
    if (i >= text.length) { if (done) done(); return; }
    el.textContent += text[i++];
    setTimeout(step, speed || 14);
  };
  step();
}

/* delegated handlers for common data-attributes */
function bindDelegates() {
  document.addEventListener('click', e => {
    const tc = e.target.closest('.tool-call .tc-head');
    if (tc) tc.parentElement.classList.toggle('open');

    const copy = e.target.closest('[data-copy]');
    if (copy) copyText(copy.dataset.copy);

    const modal = e.target.closest('[data-modal]');
    if (modal) {
      const m = App.modals && App.modals[modal.dataset.modal];
      if (m) openModal(m.title, m.body, m.hint);
    }

    const toastable = e.target.closest('[data-toast]');
    if (toastable) toast(toastable.dataset.toast);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  buildShell();
  bindDelegates();
});

window.App = { icon, toast, openModal, closeModal, fmt, copyText, typeInto, NAV };
