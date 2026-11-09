/* SciProbe · 自动演示驱动
 * 仅在 URL 带 ?demo=1 时激活：按 step 参数执行本页脚本，到点自动跳到下一页。
 * 入口：index.html?demo=1&step=0
 */
(function () {
  var q = new URLSearchParams(location.search);
  if (q.get('demo') !== '1') return;

  var STEPS = [
    { page: 'index.html', no: '01', title: '总览工作台', desc: '一个课题的实时状态：6 个指标、5 段闭环、7 个智能体', dur: 14000,
      actions: [
        { at: 3000, run: function () { tap('#scope-switch [data-scope="risk"]'); } },
        { at: 7500, run: function () { tap('#scope-switch [data-scope="all"]'); } },
        { at: 10500, run: function () { tap('#refresh-events'); } }
      ] },
    { page: 'workspace.html', no: '02', title: '智能体协作', desc: '验证 H-04 → 工具调用 → 反证 → 裁决，全程可回放', dur: 24000,
      actions: [
        { at: 1500, run: function () { tap('[data-preset="verify"]'); } }
      ] },
    { page: 'literature.html', no: '03', title: '文献与知识图谱', desc: '点击图谱节点联动过滤文献，滚轮缩放查看证据关系', dur: 15000,
      actions: [
        { at: 3000, run: function () { tap('.kg-node[data-nid="n2"]'); } },
        { at: 9000, run: function () { tap('#kg-in'); } }
      ] },
    { page: 'analysis.html', no: '04', title: '科学数据解析', desc: '峰位标注、晶体结构旋转、等效电路拟合', dur: 16000,
      actions: [
        { at: 3000, run: function () { tap('#label-switch [data-labels="0"]'); } },
        { at: 6500, run: function () { tap('#label-switch [data-labels="1"]'); } },
        { at: 10500, run: function () { tap('#fit'); } }
      ] },
    { page: 'compute.html', no: '05', title: '计算与工具链', desc: '切换组分曲线，提交 NEB 任务并观察队列推进', dur: 18000,
      actions: [
        { at: 3000, run: function () { tap('.ser-chip[data-ser="Mg 单掺"]'); } },
        { at: 6000, run: function () { tap('.ser-chip[data-ser="Mg 单掺"]'); } },
        { at: 10000, run: function () { tap('#submit'); } }
      ] },
    { page: 'experiment.html', no: '06', title: '实验与验证', desc: '选中候选样本，回填结果触发假设重排', dur: 18000,
      actions: [
        { at: 3000, run: function () { tap('tr[data-sid="S-05"]'); } },
        { at: 7000, run: function () {
            set('#f-sample', 'S-05'); set('#f-sigma', '2.40'); set('#f-ea', '0.180');
            tap('#f-submit');
          } }
      ] },
    { page: 'deliver.html', no: '07', title: '成果与生态', desc: '论文成稿、复现凭证回放、MCP / A2A / Skills 注册', dur: 16000,
      actions: [
        { at: 3000, run: function () { tap('#replay'); } },
        { at: 9000, run: function () { tap('#eco-tabs [data-tab="skill"]'); } }
      ] },
    { page: 'index.html', no: '08', title: '演示结束', desc: '', dur: 0, end: true, actions: [] }
  ];

  var idx = Math.max(0, Math.min(STEPS.length - 1, parseInt(q.get('step') || '0', 10) || 0));
  var step = STEPS[idx];

  /* ---------- 样式 ---------- */
  var css = ''
    + '.demo-bar{position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:200;'
    + 'width:min(660px,88vw);background:#0E1315;border:1px solid #2E4045;border-radius:8px;'
    + 'box-shadow:0 10px 30px rgba(0,0,0,.45);padding:12px 16px 0;pointer-events:auto}'
    + '.demo-row{display:flex;align-items:center;gap:10px}'
    + '.demo-no{font-family:var(--mono);font-size:10px;color:#7C908A;letter-spacing:.06em}'
    + '.demo-title{font-size:13px;font-weight:600;color:#DDE7E3}'
    + '.demo-time{margin-left:auto;font-family:var(--mono);font-size:10px;color:#7C908A}'
    + '.demo-btn{height:22px;padding:0 8px;border:1px solid #2E4045;border-radius:3px;'
    + 'background:transparent;color:#9EB1AC;font-size:10.5px;cursor:pointer}'
    + '.demo-btn:hover{border-color:#3E555B;color:#DDE7E3}'
    + '.demo-desc{margin-top:6px;font-size:11px;color:#9EB1AC}'
    + '.demo-progress{margin:10px -16px 0;height:2px;background:#223034}'
    + '.demo-progress i{display:block;height:100%;width:0;background:#3BD9BE}'
    + '.demo-ring{position:fixed;z-index:190;border:1.5px solid #3BD9BE;border-radius:4px;'
    + 'box-shadow:0 0 0 4px rgba(59,217,190,.16);pointer-events:none;transition:opacity .5s;opacity:1}'
    + '.demo-end{position:fixed;inset:0;z-index:210;display:flex;flex-direction:column;'
    + 'align-items:center;justify-content:center;gap:14px;background:rgba(8,11,12,.86)}'
    + '.demo-end h3{font-size:22px;color:#DDE7E3;font-weight:600}'
    + '.demo-end p{font-size:12px;color:#9EB1AC}'
    + '.demo-end .demo-btn{height:30px;padding:0 14px;font-size:12px}'
    + '.demo-end .primary{background:#3BD9BE;border-color:#3BD9BE;color:#04110E;font-weight:600}'
    + '@media print{.demo-bar,.demo-end,.demo-ring{display:none}}';
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  /* ---------- 控件 ---------- */
  function tap(sel) {
    var el = document.querySelector(sel);
    if (!el) return;
    ring(el);
    // SVG 元素（如知识图谱节点 <g>）没有 click() 方法，需要派发事件
    if (typeof el.click === 'function') {
      el.click();
    } else {
      el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    }
  }

  function set(sel, val) {
    var el = document.querySelector(sel);
    if (!el) return;
    el.value = val;
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function ring(el) {
    var r = el.getBoundingClientRect();
    var d = document.createElement('div');
    d.className = 'demo-ring';
    d.style.left = (r.left - 4) + 'px';
    d.style.top = (r.top - 4) + 'px';
    d.style.width = (r.width + 8) + 'px';
    d.style.height = (r.height + 8) + 'px';
    document.body.appendChild(d);
    setTimeout(function () { d.style.opacity = '0'; }, 700);
    setTimeout(function () { d.remove(); }, 1400);
  }

  /* ---------- 结束页 ---------- */
  if (step.end) {
    var end = document.createElement('div');
    end.className = 'demo-end';
    end.innerHTML = '<h3>自动演示结束</h3>'
      + '<p>7 个页面 · 约 2 分 06 秒 · 12 处关键交互 · 全部为真实点击</p>'
      + '<div class="demo-row"><button class="demo-btn primary" id="demo-again">重新播放</button>'
      + '<button class="demo-btn" id="demo-close">退出演示</button></div>';
    document.body.appendChild(end);
    document.getElementById('demo-again').onclick = function () { location.href = 'index.html?demo=1&step=0'; };
    document.getElementById('demo-close').onclick = function () { location.href = 'index.html'; };
    return;
  }

  /* ---------- 进度条 ---------- */
  var bar = document.createElement('div');
  bar.className = 'demo-bar';
  bar.innerHTML = '<div class="demo-row">'
    + '<span class="demo-no">' + step.no + ' / 08</span>'
    + '<span class="demo-title">' + step.title + '</span>'
    + '<span class="demo-time" id="demo-time">0:00</span>'
    + '<button class="demo-btn" id="demo-pause">暂停</button>'
    + '<button class="demo-btn" id="demo-exit">退出</button>'
    + '</div><div class="demo-desc">' + step.desc + '</div>'
    + '<div class="demo-progress"><i id="demo-fill"></i></div>';
  document.body.appendChild(bar);

  var fill = document.getElementById('demo-fill');
  var timeEl = document.getElementById('demo-time');
  var pauseBtn = document.getElementById('demo-pause');

  var elapsed = 0, last = performance.now(), paused = false, done = false;
  var fired = {};

  pauseBtn.onclick = function () {
    paused = !paused;
    pauseBtn.textContent = paused ? '继续' : '暂停';
    last = performance.now();
  };
  document.getElementById('demo-exit').onclick = function () { location.href = 'index.html'; };
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') location.href = 'index.html'; });

  function tick() {
    var now = performance.now();
    if (!paused) elapsed += now - last;
    last = now;

    var ratio = step.dur ? Math.min(1, elapsed / step.dur) : 0;
    fill.style.width = (ratio * 100) + '%';
    var sec = Math.floor(elapsed / 1000);
    timeEl.textContent = Math.floor(sec / 60) + ':' + ('0' + (sec % 60)).slice(-2);

    step.actions.forEach(function (a, i) {
      if (!fired[i] && elapsed >= a.at) {
        fired[i] = true;
        try { a.run(); } catch (e) { console.warn('[demo] action failed:', e); }
      }
    });

    if (!done && step.dur && elapsed >= step.dur) {
      done = true;
      location.href = STEPS[idx + 1].page + '?demo=1&step=' + (idx + 1);
      return;
    }
    if (!done) setTimeout(tick, 100);
  }

  setTimeout(tick, 100);
})();
