/* SciProbe · mock data layer
   Single source of truth for the demo dataset.
   Naming: H-xxxx = hypothesis, E-xxxx = evidence, R-xxxx = run, S-xxx = sample.
   Values marked predicted are model predictions, NOT experimental facts. */

const PROJECT = {
  id: 'P-2409',
  title: '高离子导率 NASICON 型钠固态电解质',
  domain: '关键材料 / 电化学储能',
  goal: '室温离子电导率 > 1 mS/cm、活化能 < 0.25 eV、对 Na 金属界面稳定、可湿法成型',
  pi: '周砚',
  org: '中科院上海硅酸盐所 · 固态储能组',
  phase: '验证与迭代',
  stageIndex: 3,
  progress: 0.68,
  startedAt: '2026-08-12',
  days: 84,
  kpis: [
    { label: '已验证假设', value: '3 / 7', delta: '+2 本周', trend: 'up' },
    { label: '证据条目', value: '148', delta: '34 条已挂载反证', trend: 'up' },
    { label: '计算任务', value: '62', delta: 'GPU 4,180 core·h', trend: 'up' },
    { label: '候选组分', value: '5', delta: '2 个进入实验', trend: 'up' },
    { label: '预测 σ 室温', value: '2.40', unit: 'mS/cm', delta: 'pred. vs 基线 0.61', trend: 'up' },
    { label: '端到端复现率', value: '100%', delta: '3/3 可回放', trend: 'up' },
  ],
};

const AGENTS = [
  { id: 'sup', code: 'SU', role: 'sup', name: '统筹 · 秦衡', model: 'Intern-S2 · 397B', status: 'run',
    tokens: '18.4K', lastRun: '0s', desc: '任务分解、预算分配、跨智能体裁决，维护长周期记忆与项目台账。',
    skills: ['任务分解 DAG', '资源预算', '冲突裁决', '记忆压缩'] },
  { id: 'search', code: 'SE', role: 'search', name: '文献猎手 · 索远', model: 'Intern-S2 + Crossref/arXiv MCP', status: 'run',
    tokens: '6.1K', lastRun: '12s', desc: '多库检索、去重、引文回溯，输出带 DOI 的可核验证据候选。',
    skills: ['多源检索', '引文回溯', '证据去重'] },
  { id: 'read', code: 'RE', role: 'read', name: '图谱解读者 · 明辨', model: 'InternVL3.5 + S2 多模态', status: 'idle',
    tokens: '2.7K', lastRun: '4m', desc: '解析 PDF 图表、XRD 谱图、SEM 形貌，抽成结构化数值与证据。',
    skills: ['图表数值回读', 'XRD 物相识别', '表格结构化'] },
  { id: 'calc', code: 'CA', role: 'calc', name: '计算执行者 · 均度', model: 'Intern-S1-Pro + DFT/AIMD MCP', status: 'run',
    tokens: '9.3K', lastRun: '2s', desc: '结构弛豫、NEB 迁移势垒、AIMD 扩散系数、凸包稳定性判定。',
    skills: ['DFT 弛豫', 'NEB 能垒', 'AIMD 扩散', '凸包稳定性'] },
  { id: 'exp', code: 'EX', role: 'exp', name: '实验调度 · 试衡', model: 'S2 + A2A 实验装置', status: 'idle',
    tokens: '3.4K', lastRun: '21m', desc: '配方与工艺生成、设备排程、结果回填、失败模式归因。',
    skills: ['配方搜索', '工艺窗口', '设备排程', '失败归因'] },
  { id: 'write', code: 'WR', role: 'write', name: '论文撰写 · 修文', model: 'Intern-S2', status: 'idle',
    tokens: '1.1K', lastRun: '1h', desc: '按期刊范式组织叙事，图表编号与引用自动对齐证据库。',
    skills: ['结构化写作', '引用对齐', '图表标注'] },
  { id: 'critic', code: 'CR', role: 'critic', name: '反证评审 · 驳之', model: 'Intern-S2（对抗模式）', status: 'idle',
    tokens: '2.2K', lastRun: '38m', desc: '为每个结论构造最强反证，不合格假设直接下调先验。',
    skills: ['苏格拉底诘问', '反证构造', '置信度校准'] },
];

const STEPS = [
  { id: 'search', name: '搜', en: 'SEARCH', status: 'done', progress: 1.0, agents: ['search', 'read'],
    detail: '3 个数据库 · 1,284 篇初检 → 62 篇入池' },
  { id: 'read', name: '读', en: 'READ', status: 'done', progress: 1.0, agents: ['read', 'search'],
    detail: '148 条证据抽取 · 31 张图表数值回读' },
  { id: 'calc', name: '算', en: 'COMPUTE', status: 'done', progress: 1.0, agents: ['calc'],
    detail: '62 个任务 · NEB + AIMD + 凸包' },
  { id: 'do', name: '做', en: 'EXPERIMENT', status: 'run', progress: 0.55, agents: ['exp', 'calc'],
    detail: '2 个候选进入合成 · EIS 测试中' },
  { id: 'write', name: '写', en: 'WRITE', status: 'idle', progress: 0.12, agents: ['write', 'critic'],
    detail: '大纲已生成 · 待实验数据锁定' },
];

const HYPOTHESES = [
  { id: 'H-01', statement: 'Zr 位部分 Mg 取代可提升烧结致密度并降低晶界阻抗，使室温电导率翻倍以上。',
    prior: 0.42, score: 0.86, status: 'supported', novelty: 0.18,
    evidence: ['E-001', 'E-002', 'E-004'], counter: ['E-007'],
    note: '文献报道 Mg₀.₂₅ 组分 1.91 mS/cm @25°C，Ea 0.200 eV；本项目重复实验得到 1.74 mS/cm，方向一致。' },
  { id: 'H-02', statement: '引入 Ga 形成 Na–Ga–Si–P–O 晶界玻璃相，可同时改善致密度与晶界润湿。',
    prior: 0.38, score: 0.74, status: 'supported', novelty: 0.24,
    evidence: ['E-003', 'E-002'], counter: [],
    note: '晶界玻璃相降低晶界电阻，但过量 Ga 会牺牲体相纯度，需限制在 0.5–0.8 wt%。' },
  { id: 'H-03', statement: 'K 部分取代 Na 位可拓宽迁移通道，提升室温电导率。',
    prior: 0.31, score: 0.61, status: 'supported', novelty: 0.35,
    evidence: ['E-005'], counter: ['E-008'],
    note: '文献值 7.734×10⁻⁴ S/cm（约为未掺杂的 2 倍）；但大半径 K⁺ 在长循环下可能诱发相分离。' },
  { id: 'H-04', statement: 'Mg(0.25) + Ga(0.5 wt%) + K(0.1) 三元协同，可同时优化体相与晶界，预测 σ_rt ≈ 2.4 mS/cm。',
    prior: 0.52, score: 0.71, status: 'testing', novelty: 0.78,
    evidence: ['E-006', 'E-009'], counter: ['E-007'],
    note: 'predicted：DFT-NEB 给出 Ea 0.18 eV，AIMD 给出 D_Na 3.1×10⁻¹¹ cm²/s @300K；尚无实验闭环。' },
  { id: 'H-05', statement: 'Ca 取代 Zr 可增大晶格自由体积，从而提升钠离子迁移率。',
    prior: 0.28, score: 0.22, status: 'rejected', novelty: 0.12,
    evidence: ['E-010'], counter: ['E-004', 'E-002'],
    note: '反证：Ca²⁺ 半径过大导致第二相偏析与晶格畸变，实测电导率下降 38%。已否证。' },
];

const EVIDENCE = [
  { id: 'E-001', type: 'paper', title: 'Sc³⁺/Ce⁴⁺ 共掺 NASICON 电导率提升', source: 'J. Phys. Chem. C (2021)',
    quote: 'Substituting 16.5 mol% Sc³⁺ for Zr⁴⁺ improves the ionic conductivity from 0.61 to 0.96 mS·cm⁻¹ at room temperature.',
    confidence: 0.92, hash: 'sha256:9f1c…a72e', ts: '2026-09-02 09:14' },
  { id: 'E-002', type: 'paper', title: 'Mg 掺杂高熵 NASICON 喷涂火焰合成', source: 'arXiv:2511.08449',
    quote: 'Mg₀.₂₅NZSP exhibits an optimal ionic conductivity of 1.91 mS/cm at room temperature and an activation energy of 0.200 eV.',
    confidence: 0.95, hash: 'sha256:4b8d…1c93', ts: '2026-09-02 09:31' },
  { id: 'E-003', type: 'paper', title: 'Ga 调制 NZSP 晶界玻璃相', source: 'PMC10935661',
    quote: 'A binder-like glass phase (Na–Ga–Si–P–O) forms surrounding the grains, resulting in an enhanced density electrolyte pellet.',
    confidence: 0.88, hash: 'sha256:77aa…0df4', ts: '2026-09-03 14:02' },
  { id: 'E-004', type: 'calc', title: 'Mg 取代后 ZrO₆ 骨架畸变与 Na2 位占据率', source: 'DFT · materials-dft MCP',
    quote: 'Mg 取代使 Na2 位占据率由 0.61 提升至 0.83，Na–O 平均键长缩短 0.021 Å，迁移通道瓶颈半径 1.04 Å → 1.14 Å。',
    confidence: 0.83, hash: 'sha256:e2c1…8b45', ts: '2026-09-11 21:40' },
  { id: 'E-005', type: 'paper', title: 'K 取代 Na₃₋ₓKₓZr₂Si₂PO₁₂', source: 'KAIST, 2021',
    quote: 'Na₃₋ₓKₓZr₂Si₂PO₁₂ exhibits an ionic conductivity of 7.734 × 10⁻⁴ S/cm at room temperature, more than 2× the undoped sample.',
    confidence: 0.90, hash: 'sha256:3c5f…d1a0', ts: '2026-09-05 10:22' },
  { id: 'E-006', type: 'calc', title: '三元组分 NEB 迁移势垒', source: 'DFT-NEB · materials-dft MCP',
    quote: 'Na2→Na1 跃迁能垒 0.183 eV（Mg+Ga+K 三元），低于 Mg 单掺的 0.204 eV 与未掺杂的 0.264 eV。',
    confidence: 0.81, hash: 'sha256:a90b…77ce', ts: '2026-09-18 03:12' },
  { id: 'E-007', type: 'calc', title: '高 Mg 浓度下的晶界非晶化风险', source: 'AIMD · aimd-diffusion MCP',
    quote: '当 x(Mg) > 0.30 时，晶界区 Na  vacancy 聚集导致局部结构失稳，900 K 退火后出现 4.7% 非晶化体积分数。',
    confidence: 0.72, hash: 'sha256:bb31…4e2a', ts: '2026-09-19 16:05' },
  { id: 'E-008', type: 'exp', title: 'K 掺杂长循环相分离观察', source: 'XRD · 实验台账 S-04',
    quote: 'S-04 在 60°C/200 h 静置后出现 ZrO₂ 单斜相（2θ 28.2°，相对强度 6.3%），与新鲜样品相比升高 4.1 个百分点。',
    confidence: 0.86, hash: 'sha256:1d6e…90ab', ts: '2026-09-26 09:40' },
  { id: 'E-009', type: 'exp', title: 'Mg+Ga 共调制样品 EIS 初测', source: 'EIS · 实验台账 S-03',
    quote: 'S-03 室温总电导率 2.10 mS/cm（25°C），晶界贡献占比由 41% 降至 18%，Ea 0.192 eV。',
    confidence: 0.89, hash: 'sha256:c4a7…2f81', ts: '2026-10-08 17:26' },
  { id: 'E-010', type: 'exp', title: 'Ca 取代对照组失效分析', source: 'SEM/EDS · 实验台账 S-C1',
    quote: 'Ca 掺杂样品出现 3–8 μm 富 Ca 第二相，室温电导率 0.38 mS/cm，较基线下降 38%。',
    confidence: 0.91, hash: 'sha256:5e2d…b3c7', ts: '2026-09-14 11:08' },
];

const PAPERS = [
  { id: 'P-01', title: 'A Strategic Co-doping Approach Using Sc³⁺ and Ce⁴⁺ toward Enhanced Conductivity in NASICON-Type Na₃Zr₂Si₂PO₁₂',
    authors: 'Zhao et al.', journal: 'J. Phys. Chem. C', year: 2021, doi: '10.1021/acs.jpcc.1c06968',
    cites: 214, relevance: 0.94, verdict: '核心依据', tags: ['共掺', '基线值'], demo: false,
    abstract: '通过 Sc³⁺/Ce⁴⁺ 共掺将 NZSP 室温电导率由 0.61 提升至 0.96 mS·cm⁻¹，并给出电荷补偿机制。' },
  { id: 'P-02', title: 'Synergetic Enhancement on Bulk and Grain Boundary Ionic Conduction of Mg Doped High-Entropy NASICON-Type Solid Electrolyte',
    authors: 'Li et al.', journal: 'arXiv:2511.08449', year: 2025, doi: 'arXiv:2511.08449',
    cites: 37, relevance: 0.97, verdict: '核心依据', tags: ['Mg 掺杂', '1.91 mS/cm', 'Ea 0.200 eV'], demo: false,
    abstract: '喷涂火焰合成 Mg₀.₂₅NZSP，室温 1.91 mS/cm、Ea 0.200 eV，归因于体相掺杂与第二相协同。' },
  { id: 'P-03', title: 'The glass phase in the grain boundary of Na₃Zr₂Si₂PO₁₂ created by gallium modulation',
    authors: 'Wang et al.', journal: 'PMC10935661', year: 2024, doi: 'PMC10935661',
    cites: 61, relevance: 0.89, verdict: '机理支撑', tags: ['晶界', '玻璃相', 'Ga'], demo: false,
    abstract: 'Ga 引入形成 Na–Ga–Si–P–O 玻璃相包裹晶粒，提升致密度与总电导率。' },
  { id: 'P-04', title: 'Improving Room Temperature Ionic Conductivity of Na₃₋ₓKₓZr₂Si₂PO₁₂ Solid Electrolytes',
    authors: 'Heo et al.', journal: 'KAIST / J. Power Sources', year: 2021, doi: '10.1016/j.jpowsour.2021.229743',
    cites: 88, relevance: 0.81, verdict: '机理支撑', tags: ['K 取代', '晶格畸变'], demo: false,
    abstract: 'K 取代使室温电导率达 7.734×10⁻⁴ S/cm，约为未掺杂样品的 2 倍以上。' },
  { id: 'P-05', title: 'Machine-learned interatomic potential for Na superionic conductors',
    authors: 'Demo entry', journal: 'npj Comput. Mater.', year: 2024, doi: 'demo',
    cites: 45, relevance: 0.72, verdict: '方法参考', tags: ['MLIP', 'AIMD'], demo: true,
    abstract: '示例条目：机器学习势用于 NASICON 体系的长时间尺度扩散模拟。' },
  { id: 'P-06', title: 'Critical current density and dendrite suppression in Na|NZSP|Na symmetric cells',
    authors: 'Demo entry', journal: 'ACS Energy Lett.', year: 2024, doi: 'demo',
    cites: 102, relevance: 0.76, verdict: '界面依据', tags: ['CCD', '界面'], demo: true,
    abstract: '示例条目：对称电池临界电流密度与晶界缺陷密度的关联分析。' },
  { id: 'P-07', title: 'Low-temperature sintering additives for NASICON electrolytes',
    authors: 'Demo entry', journal: 'J. Eur. Ceram. Soc.', year: 2023, doi: 'demo',
    cites: 33, relevance: 0.64, verdict: '工艺参考', tags: ['烧结助剂', '致密度'], demo: true,
    abstract: '示例条目：低温烧结助剂对 NASICON 致密度与晶界电阻的影响。' },
  { id: 'P-08', title: 'Long-horizon scientific agents: a review of closed-loop discovery systems',
    authors: 'Demo entry', journal: 'Survey', year: 2025, doi: 'demo',
    cites: 12, relevance: 0.41, verdict: '背景', tags: ['AI4S', '闭环'], demo: true,
    abstract: '示例条目：科学智能体的长程任务组织与验证闭环综述。' },
];

const TOOLS = [
  { id: 'T-01', name: 'materials-dft', server: 'MCP · 上海超算节点', protocol: 'MCP v1', latency: 420,
    calls: 31, status: 'ok', desc: '结构弛豫 / 静态自洽 / NEB 迁移势垒',
    io: ['dft_relax(structure, cutoff)', 'dft_neb_barrier(structure, path, images)', 'dft_static(structure)'] },
  { id: 'T-02', name: 'aimd-diffusion', server: 'MCP · GPU 集群', protocol: 'MCP v1', latency: 980,
    calls: 14, status: 'ok', desc: 'AIMD 扩散系数与均方位移统计',
    io: ['aimd_diffusivity(structure, T, steps)', 'msd_analyze(trajectory)'] },
  { id: 'T-03', name: 'phase-hull', server: 'MCP · Materials Project 镜像', protocol: 'MCP v1', latency: 210,
    calls: 9, status: 'ok', desc: '凸包能、相稳定性、分解产物预测',
    io: ['convex_hull_stability(composition)', 'decomposition_products(composition)'] },
  { id: 'T-04', name: 'xrd-sim', server: 'MCP · 本地', protocol: 'MCP v1', latency: 65,
    calls: 18, status: 'ok', desc: '由晶体结构正向模拟 PXRD 图谱与峰位',
    io: ['simulate_xrd(structure, wavelength)', 'phase_match(peaks, db)'] },
  { id: 'T-05', name: 'lit-search', server: 'MCP · Crossref / arXiv', protocol: 'MCP v1', latency: 1240,
    calls: 46, status: 'ok', desc: '文献检索、DOI 解析、引文回溯',
    io: ['search_literature(query, db)', 'resolve_doi(doi)', 'citation_trace(doi, depth)'] },
  { id: 'T-06', name: 'pdf-vision', server: 'MCP · 本地视觉解析', protocol: 'MCP v1', latency: 760,
    calls: 27, status: 'warn', desc: 'PDF 图表数值回读（部分矢量图需人工复核）',
    io: ['parse_paper_multimodal(pdf)', 'extract_plot_values(image, axes)'] },
  { id: 'T-07', name: 'robot-lab', server: 'A2A · 自动化实验线', protocol: 'A2A v1.0', latency: 3200,
    calls: 6, status: 'ok', desc: '配方下发、SPS 烧结、EIS 采数、结果回传',
    io: ['submit_synthesis(recipe)', 'run_eis(sample, freq_range)', 'read_result(job_id)'] },
  { id: 'T-08', name: 'referee', server: 'A2A · 同行评审沙盒', protocol: 'A2A v1.0', latency: 1500,
    calls: 4, status: 'idle', desc: '跨机构调用独立评审智能体做结论复核',
    io: ['request_review(claim, evidence_set)', 'poll_review(review_id)'] },
];

const RUNS = [
  { id: 'R-1042', agent: 'calc', tool: 'dft_neb_barrier', args: 'Na2.9K0.1Zr1.75Mg0.25Si2PO12 / 5 images', status: 'ok', duration: '38m 12s', tokens: '4.1K', ts: '10:42:18' },
  { id: 'R-1041', agent: 'calc', tool: 'aimd_diffusivity', args: 'T=300/600/900K, 20 ps', status: 'run', duration: '12m 04s', tokens: '—', ts: '10:31:02' },
  { id: 'R-1040', agent: 'read', tool: 'extract_plot_values', args: 'arXiv:2511.08449 · Fig.4(a)', status: 'ok', duration: '1m 22s', tokens: '1.8K', ts: '10:18:44' },
  { id: 'R-1039', agent: 'exp', tool: 'run_eis', args: 'S-03 · 1 Hz–1 MHz · 25→120°C', status: 'ok', duration: '26m 31s', tokens: '0.6K', ts: '09:52:07' },
  { id: 'R-1038', agent: 'calc', tool: 'convex_hull_stability', args: 'Na-K-Zr-Mg-Si-P-O', status: 'ok', duration: '4m 09s', tokens: '2.2K', ts: '09:44:20' },
  { id: 'R-1037', agent: 'critic', tool: 'request_review', args: 'H-04 · 7 条证据', status: 'warn', duration: '18m 40s', tokens: '3.0K', ts: '09:12:55' },
  { id: 'R-1036', agent: 'search', tool: 'citation_trace', args: '10.1021/acs.jpcc.1c06968 · depth 2', status: 'ok', duration: '2m 47s', tokens: '1.4K', ts: '08:48:12' },
  { id: 'R-1035', agent: 'read', tool: 'parse_paper_multimodal', args: 'PMC10935661', status: 'fail', duration: '0m 51s', tokens: '0.3K', ts: '08:31:09' },
];

const SAMPLES = [
  { id: 'S-01', name: 'NZSP 基线', recipe: 'Na₃Zr₂Si₂PO₁₂', method: '球磨 + 1150°C SPS', sig: 0.61, ea: 0.264, ccd: 0.15, status: 'done', note: '文献基线复现值' },
  { id: 'S-02', name: 'Mg0.25', recipe: 'Na₃Zr₁.₇₅Mg₀.₂₅Si₂PO₁₂', method: '溶胶-凝胶 + SPS', sig: 1.74, ea: 0.204, ccd: 0.28, status: 'done', note: '文献 1.91，复现偏差 −8.9%' },
  { id: 'S-03', name: 'Mg0.25+Ga0.5%', recipe: 'Na₃Zr₁.₇₅Mg₀.₂₅Si₂PO₁₂ + 0.5 wt% Ga₂O₃', method: '喷雾火焰 + SPS', sig: 2.10, ea: 0.192, ccd: 0.33, status: 'done', note: '晶界贡献降至 18%' },
  { id: 'S-04', name: 'K0.1', recipe: 'Na₂.₉K₀.₁Zr₂Si₂PO₁₂', method: '固相 + 1100°C', sig: 0.77, ea: 0.226, ccd: 0.19, status: 'warn', note: '长循环出现 ZrO₂ 第二相' },
  { id: 'S-05', name: '三元目标（预测）', recipe: 'Na₂.₉K₀.₁Zr₁.₇₅Mg₀.₂₅Si₂PO₁₂ + 0.5 wt% Ga₂O₃', method: '喷雾火焰 + SPS（排产中）', sig: 2.40, ea: 0.180, ccd: 0.62, status: 'plan', note: 'predicted · 待实验闭环' },
  { id: 'S-C1', name: 'Ca 对照', recipe: 'Na₃Zr₁.₈Ca₀.₂Si₂PO₁₂', method: '固相 + SPS', sig: 0.38, ea: 0.312, ccd: 0.08, status: 'fail', note: '富 Ca 第二相，已否证 H-05' },
];

const EXPTS = [
  { id: 'X-01', sample: 'S-03', stage: '配料', metric: '批次偏差', value: 0.4, unit: '%', status: 'ok', ts: '09-28 08:10' },
  { id: 'X-02', sample: 'S-03', stage: '球磨', metric: 'D50', value: 0.42, unit: 'μm', status: 'ok', ts: '09-28 11:32' },
  { id: 'X-03', sample: 'S-03', stage: '煅烧', metric: '保温', value: 900, unit: '°C/4h', status: 'ok', ts: '09-28 16:05' },
  { id: 'X-04', sample: 'S-03', stage: 'SPS', metric: '致密度', value: 96.8, unit: '%', status: 'ok', ts: '09-29 09:47' },
  { id: 'X-05', sample: 'S-03', stage: 'EIS', metric: 'σ_rt', value: 2.10, unit: 'mS/cm', status: 'ok', ts: '10-08 17:26' },
  { id: 'X-06', sample: 'S-03', stage: '对称电池', metric: 'CCD', value: 0.33, unit: 'mA/cm²', status: 'ok', ts: '10-14 22:11' },
  { id: 'X-07', sample: 'S-05', stage: '排产', metric: '预计开工', value: 11, unit: '月 09 日', status: 'run', ts: '10-30 14:20' },
];

const MEMORY = [
  { layer: 'L0 原始证据', count: '1,284', lastWrite: '12s 前', desc: 'PDF chunk / 谱图原始文件 / 计算输出，只追加不修改' },
  { layer: 'L1 结构化事实', count: '312', lastWrite: '3m 前', desc: '带单位与出处的数值事实，冲突时并存并标注' },
  { layer: 'L2 假设与反证', count: '27', lastWrite: '18m 前', desc: '假设、先验、支持/反对证据、评分轨迹' },
  { layer: 'L3 决策台账', count: '11', lastWrite: '42m 前', desc: '不可逆决策 + 理由 + 回滚点，供复现审计' },
];

const EVENTS = [
  { ts: '10:42', actor: '均度 · CA', action: '完成 NEB 计算', target: 'Na₂.₉K₀.₁Zr₁.₇₅Mg₀.₂₅Si₂PO₁₂ → Ea 0.183 eV', level: 'ok' },
  { ts: '10:31', actor: '均度 · CA', action: '提交 AIMD 任务', target: '300/600/900 K · 20 ps', level: 'run' },
  { ts: '10:18', actor: '明辨 · RE', action: '图表数值回读', target: 'arXiv:2511.08449 Fig.4(a) · 置信 0.91', level: 'ok' },
  { ts: '09:52', actor: '试衡 · EX', action: 'EIS 采数完成', target: 'S-03 · σ_rt 2.10 mS/cm', level: 'ok' },
  { ts: '09:44', actor: '均度 · CA', action: '凸包判定', target: '三元组分稳定，无分解产物', level: 'ok' },
  { ts: '09:12', actor: '驳之 · CR', action: '评审退回', target: 'H-04 需补晶界非晶化反证', level: 'warn' },
  { ts: '08:48', actor: '索远 · SE', action: '引文回溯', target: '新增 9 篇候选，2 篇入池', level: 'ok' },
  { ts: '08:31', actor: '明辨 · RE', action: '解析失败', target: 'PMC10935661 矢量图表，转人工复核', level: 'fail' },
  { ts: '08:20', actor: '秦衡 · SU', action: '重排任务图', target: '优先级：实验闭环 > 文献扩充', level: 'ok' },
  { ts: '08:04', actor: '系统', action: '记忆压缩', target: 'L1 → L2 摘要 · 释放 18.2K tokens', level: 'ok' },
];

/* ---------- derived data for charts ---------- */

// Arrhenius: log10(sigma) vs 1000/T. sigma_ref in mS/cm at 298 K, Ea in eV.
function arrhenius(sigRef, ea, tFrom, tTo) {
  const pts = [];
  for (let T = tFrom; T <= tTo; T += 10) {
    const logSig = Math.log10(sigRef) + (ea / (2.303 * 8.617e-5)) * (1 / 298 - 1 / T);
    pts.push([1000 / T, logSig]);
  }
  return pts;
}

const ARRHENIUS = [
  { name: 'S-01 NZSP 基线', color: '#6FA5D6', pts: arrhenius(0.61, 0.264, 313, 453) },
  { name: 'S-02 Mg0.25', color: '#3BD9BE', pts: arrhenius(1.74, 0.204, 313, 453) },
  { name: 'S-03 Mg+Ga', color: '#E2A94F', pts: arrhenius(2.10, 0.192, 313, 453) },
  { name: 'S-05 三元 pred.', color: '#E06A5C', dashed: true, pts: arrhenius(2.40, 0.180, 313, 453) },
];

// NEB energy profile (eV) along normalized reaction coordinate
const NEB = [
  { name: '未掺杂', color: '#6FA5D6', pts: [[0,0],[0.1,0.052],[0.2,0.118],[0.3,0.196],[0.4,0.264],[0.5,0.251],[0.6,0.188],[0.7,0.104],[0.8,0.041],[0.9,0.006],[1,0]] },
  { name: 'Mg 单掺', color: '#3BD9BE', pts: [[0,0],[0.1,0.041],[0.2,0.092],[0.3,0.152],[0.4,0.204],[0.5,0.191],[0.6,0.143],[0.7,0.081],[0.8,0.032],[0.9,0.004],[1,0]] },
  { name: '三元 pred.', color: '#E06A5C', dashed: true, pts: [[0,0],[0.1,0.036],[0.2,0.081],[0.3,0.134],[0.4,0.183],[0.5,0.171],[0.6,0.128],[0.7,0.072],[0.8,0.028],[0.9,0.003],[1,0]] },
];

// Nyquist arcs: semicircle (grain boundary) + low-frequency tail
function nyquist(rBulk, rGB, points) {
  const out = [];
  for (let i = 0; i <= points; i++) {
    const th = Math.PI - (Math.PI * i) / points;
    out.push([rBulk + rGB / 2 + (rGB / 2) * Math.cos(th), (rGB / 2) * Math.sin(th)]);
  }
  for (let i = 1; i <= 8; i++) {
    out.push([rBulk + rGB + 0.12 * Math.sqrt(i), 0.09 * i]);
  }
  return out;
}

const NYQUIST = [
  { name: 'S-03 Mg+Ga', color: '#3BD9BE', pts: nyquist(0.9, 1.4, 36) },
  { name: 'S-02 Mg0.25', color: '#E2A94F', pts: nyquist(1.1, 2.4, 36) },
  { name: 'S-01 基线', color: '#6FA5D6', pts: nyquist(1.3, 4.1, 36) },
];

// Candidate screening scatter: sigma (mS/cm) vs Ea (eV), r = CCD
const SCREEN = [
  { x: 0.61, y: 0.264, r: 0.15, label: 'S-01', color: '#6FA5D6' },
  { x: 0.77, y: 0.226, r: 0.19, label: 'S-04', color: '#E2A94F' },
  { x: 0.38, y: 0.312, r: 0.08, label: 'S-C1', color: '#E06A5C' },
  { x: 1.74, y: 0.204, r: 0.28, label: 'S-02', color: '#3BD9BE' },
  { x: 2.10, y: 0.192, r: 0.33, label: 'S-03', color: '#3BD9BE' },
  { x: 2.40, y: 0.180, r: 0.62, label: 'S-05', color: '#E06A5C' },
];

// PXRD: 2theta (Cu Ka) / relative intensity / hkl. Synthetic, for demo only.
const XRD_PEAKS = [
  [14.62, 12, '113'], [19.42, 100, '110'], [20.55, 22, '104'], [22.98, 8, '202'],
  [24.32, 34, '116'], [25.90, 14, '211'], [27.42, 46, '024'], [28.21, 6, 'm-ZrO2'],
  [29.60, 58, '131'], [31.15, 18, '223'], [32.32, 41, '116'], [33.02, 24, '214'],
  [35.52, 11, '206'], [36.90, 16, '311'], [38.40, 9, '134'], [40.18, 7, '0012'],
  [44.86, 13, '137'], [47.12, 8, '404'], [50.20, 10, '0510'], [54.10, 5, '428'],
  [57.30, 7, '440'], [60.20, 6, '4010'], [63.02, 4, '531'],
];

function xrdCurve(peaks, width) {
  const pts = [];
  for (let x = 10; x <= 66; x += 0.08) {
    let y = 0.9; // baseline
    for (const [pos, inten] of peaks) {
      const d = (x - pos) / (width || 0.16);
      y += inten * Math.exp(-0.5 * d * d);
    }
    y += 0.5 * Math.sin(x * 1.7) * Math.exp(-(x - 10) / 90); // faint noise
    pts.push([x, y]);
  }
  return pts;
}

const XRD_PATTERN = xrdCurve(XRD_PEAKS.map(p => [p[0], p[1]]), 0.16);
const XRD_REFERENCE = xrdCurve(XRD_PEAKS.map(p => [p[0], p[1] * 0.86]), 0.17).map(p => [p[0], p[1] + 0.6]);

// knowledge graph nodes/edges (hand-placed, deterministic)
const KG = {
  nodes: [
    { id: 'n1', label: 'NZSP 基线', x: 0.50, y: 0.50, kind: 'core', r: 26 },
    { id: 'n2', label: 'Mg 取代', x: 0.26, y: 0.28, kind: 'hypo', r: 20 },
    { id: 'n3', label: 'Ga 晶界相', x: 0.74, y: 0.27, kind: 'hypo', r: 20 },
    { id: 'n4', label: 'K 位取代', x: 0.22, y: 0.74, kind: 'hypo', r: 18 },
    { id: 'n5', label: '晶界阻抗', x: 0.72, y: 0.74, kind: 'fact', r: 18 },
    { id: 'n6', label: '致密度', x: 0.40, y: 0.14, kind: 'fact', r: 15 },
    { id: 'n7', label: '迁移势垒', x: 0.60, y: 0.86, kind: 'fact', r: 16 },
    { id: 'n8', label: '三元候选', x: 0.86, y: 0.50, kind: 'result', r: 22 },
    { id: 'n9', label: '相分离', x: 0.10, y: 0.50, kind: 'risk', r: 16 },
  ],
  edges: [
    ['n1', 'n2', 'supports'], ['n1', 'n3', 'supports'], ['n1', 'n4', 'supports'],
    ['n2', 'n5', 'enables'], ['n3', 'n5', 'enables'], ['n2', 'n6', 'enables'],
    ['n5', 'n8', 'feeds'], ['n6', 'n8', 'feeds'], ['n7', 'n8', 'feeds'],
    ['n4', 'n9', 'risks'], ['n9', 'n4', 'contradicts'], ['n1', 'n7', 'constrains'],
  ],
};

// crystal structure parameters for the SVG renderer
const CRYSTAL = {
  cell: { a: 8.72, b: 8.72, c: 12.36 },
  atoms: [
    { el: 'Na', x: 0.18, y: 0.42, z: 0.25, color: '#3BD9BE', size: 0.62 },
    { el: 'Na', x: 0.82, y: 0.58, z: 0.25, color: '#3BD9BE', size: 0.62 },
    { el: 'Na', x: 0.35, y: 0.10, z: 0.75, color: '#3BD9BE', size: 0.62 },
    { el: 'Zr', x: 0.00, y: 0.00, z: 0.00, color: '#6FA5D6', size: 0.9 },
    { el: 'Zr', x: 0.50, y: 0.50, z: 0.00, color: '#6FA5D6', size: 0.9 },
    { el: 'P',  x: 0.25, y: 0.25, z: 0.50, color: '#E2A94F', size: 0.7 },
    { el: 'P',  x: 0.75, y: 0.75, z: 0.50, color: '#E2A94F', size: 0.7 },
    { el: 'Si', x: 0.25, y: 0.75, z: 0.50, color: '#B4A0DC', size: 0.7 },
    { el: 'Si', x: 0.75, y: 0.25, z: 0.50, color: '#B4A0DC', size: 0.7 },
    { el: 'O',  x: 0.12, y: 0.30, z: 0.12, color: '#61756F', size: 0.4 },
    { el: 'O',  x: 0.88, y: 0.70, z: 0.12, color: '#61756F', size: 0.4 },
    { el: 'O',  x: 0.38, y: 0.62, z: 0.38, color: '#61756F', size: 0.4 },
    { el: 'O',  x: 0.62, y: 0.38, z: 0.62, color: '#61756F', size: 0.4 },
  ],
  bonds: [['Zr', 'P'], ['Zr', 'Si'], ['P', 'O'], ['Si', 'O'], ['Na', 'O']],
};

window.MOCK = {
  PROJECT, AGENTS, STEPS, HYPOTHESES, EVIDENCE, PAPERS, TOOLS, RUNS,
  SAMPLES, EXPTS, MEMORY, EVENTS, ARRHENIUS, NEB, NYQUIST, SCREEN,
  XRD_PEAKS, XRD_PATTERN, XRD_REFERENCE, KG, CRYSTAL,
};
