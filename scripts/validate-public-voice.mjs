import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const presentationRoots = [
  path.join(root, 'app', '[lang]'),
  path.join(root, 'components'),
  path.join(root, 'content'),
  path.join(root, 'lib')
];
const extensions = new Set(['.json', '.mdx', '.ts', '.tsx']);
const bannedLearnerLabels = [
  '五歲小朋友版',
  '五岁小朋友版',
  '為何 AI engineer 要懂',
  '为什么 AI engineer 要懂',
  '技術拆解',
  '技术拆解',
  '深度拆解',
  'end-to-end enterprise thinking',
  '完整 enterprise thinking'
];
// These are exact term stacks that previously appeared on high-traffic entry
// surfaces. This is intentionally narrow: technical lessons can still use a
// precise term when they explain a real mechanism, file, or test.
const entrySurfaceFiles = [
  'content/reader-paths.json',
  'app/[lang]/page.tsx',
  'app/[lang]/interview-lab/page.tsx',
  'app/[lang]/series/[series]/page.tsx',
  'components/roadmap-timeline.tsx',
  'lib/ai-use-routes.ts',
  'lib/portfolio-evidence-planner.ts'
];
const bannedEntryTermStacks = [
  '由 permission review 到可驗收的 draft workflow',
  '由 acceptance brief 到可 review 的 engineering evidence',
  '每條路都要留下可檢查的工作證據',
  '由基礎一路行到可展示證據',
  '從基礎一路走到可展示證據',
  '从基础一路走到可展示证据',
  'Move from foundations to evidence you can show',
  '先留低第一份 evidence',
  '決定同 owner、可量度 workflow signal、安全資料邊界、可檢查 evaluation、operating handoff 同清楚 nonclaims',
  '證據就緒訊號',
  '把 prompt experimentation 變成可重現、可評估、權限清楚並保留人工審閱的專業證據。',
  '完整準備地圖：先定位能力，再逐條練',
  '完整準備地圖：先定位能力，再逐題練',
  '完整准备地图：先定位能力，再逐题练',
  'The complete preparation map: locate the capability, then practise one question',
  'Follow an end-to-end AI Engineer route',
  'I want an end-to-end AI Engineer route',
  'Open the complete AI Engineer roadmap',
  '我想有條由頭到尾的 AI Engineer 路線',
  '我想要一條從頭到尾的 AI Engineer 路線',
  '我想要一条从头到尾的 AI Engineer 路线',
  '打開完整 AI Engineer roadmap',
  '開啟完整 AI Engineer roadmap',
  '打开完整 AI Engineer roadmap',
  '打開完整 19 站 roadmap',
  '打开完整 19 站 roadmap',
  'Open the complete 19-stop roadmap',
  '睇一個由頭到尾只用虛構資料嘅示例，再核對自己仲欠咩工作說明。',
  '看一個從頭到尾只用虛構資料的示例，再核對自己還缺什麼工作說明。',
  '看一个从头到尾只用虚构数据的示例，再核对自己还缺什么工作说明。',
  'Read an end-to-end example that uses only fictional data, then check what you still need to explain about your own work.',
  '想睇全程？由合成資料的 reference 開始',
  '想看全程？從合成資料的 reference 開始',
  '想看全程？从合成数据的 reference 开始',
  'Want to inspect the whole workflow? Start with a synthetic reference',
  '用端到端案例核對你有冇講清楚 input、評估、review、rollback 同交付邊界。',
  '用端到端案例核對你有沒有說清楚 input、評估、review、rollback 與交付邊界。',
  '用端到端案例核对你有没有说清 input、评估、review、rollback 和交付边界。',
  'Use an end-to-end case to check whether you have made inputs, evaluation, review, rollback and delivery boundaries explicit.',
  '需要時再打開完整準備地圖',
  '需要时再打开完整准备地图',
  'Open the full preparation map when you need it'
];
const bannedLongFormTermStacks = [
  '有 owner、有答題卡、有 review 位和有誠實證據的工作。',
  '它要交出的，是一條證據鏈：清楚決定、受限 diff、fixed cases、reviewer decision 同 rollback path。',
  '每個 case 有 input、expected boundary、預期 handoff／拒答與判斷準則。',
  '一句 `model.generate()` 可以產生文字，但未講清一個 AI 系統點樣幫到人、點樣停低，或者邊個要為錯誤負責。',
  '凡是已知 boundary，先用 metadata，不要先靠 semantic similarity：',
  'Portfolio artefact 應有 index manifest、chunking rationale、metadata schema、case set、cache invalidation rule、query trace 和一個 failure analysis。',
  '在宣告的限制內，這條 workflow 有沒有產出 valid、source-grounded draft，或一份完整的 handoff？',
  '每個 case 指定 owner、收到的 evidence、可作的 action。',
  'Portfolio evidence 同時是 technical 和 non-technical。State diagram、contract schema、trace field、load fixture 和 latency report 顯示工程紀律；user decision、data boundary、error cost、handoff owner 和 stop condition 則顯示它不只是一個好看的 demo。',
  '這正是 model demo 和可靠 system 的分別。Hiring team 可以由 user decision，一路看到 state handling、test、trace、人手 authority 和 rollback。技術證據是 tool schema、scenario set、trace、grader、retry boundary 和 release gate；非技術證據是 decision owner、data boundary、error cost、approval path 和 claim limit。'
];
const bannedLongFormFrames = [
  '> 核心判斷：',
  '> 核心判断：',
  '> Core judgement:'
];
// Do not turn a lesson into an assessment form by sorting everything into a
// vague technical/non-technical pair. A precise mechanism is fine when the
// sentence explains it; this only catches the report-style label shell.
const reportStyleClassifier = /(?:\btechnical\b|\bnon-technical\b)\s*(?:evidence|proof|judg(?:e)?ment|story|side|choices|thinking|statement|delivery design|交付設計|交付设计)/iu;
// These flagship pages are where a reader decides whether the library sounds
// like a real guide or a pile of portfolio jargon.  Keep the old headings out
// so a future edit has to name the actual question, action, or uncertainty.
const hongKongPortfolioEditorialFiles = [
  'content/articles/portfolio-evidence-rubric/zh-HK.mdx',
  'content/articles/github-portfolio-proof-pack/zh-HK.mdx',
  'content/articles/course-to-portfolio-evidence/zh-HK.mdx',
  'content/articles/learning-evidence/zh-HK.mdx'
];
const retiredHongKongPortfolioFrames = [
  '## 先分清程式部分和工作部分',
  '### 在程式和測試裡看得到甚麼',
  '### 在實際工作裡要交代甚麼',
  '## 做一個 proof pack，不是一堆檔案',
  '## Public 不等於 production',
  '## 用一個 baseline、一項刻意改動和固定測試，替代無止境調參',
  '## 每次實驗留下一條可讀的證據鏈',
  '## 用五分鐘答辯，而不是一段炫技 demo',
  '## 把課程變成八週 evidence plan',
  '## 例子：把一門 RAG 課變成不是人人都可複製的 portfolio',
  '## 課程的真正 benefit'
];
// Entry pages should name the work a reader will actually do. Keep dense
// implementation vocabulary for the lesson body, where a concrete example
// can explain it; do not let it become a substitute for an explanation here.
const hongKongLabEntryPhrases = [
  'enterprise-style LLM workflow',
  'production-thinking',
  'Coder reliability case',
  'Predictive ML 決策案例',
  '公開資料 + LLM evaluation case',
  'public-data context workflow',
  '技術上展示甚麼',
  '商業、交付與風險上展示甚麼',
  'Source package 狀態',
  'reference package 仍是本地、fixture-only 學習材料'
];
// A heading should tell the reader what they can do with the material, not
// sort the page into a report-like "technical / business / delivery / risk"
// stack. These phrases are intentionally scoped to the planner and lab
// landing surfaces; article bodies may still use a precise technical term when
// they define it in context.
const retiredReadingLabels = [
  '瀏覽全部 build pattern',
  '浏览全部 build pattern',
  '暫時沒有項目 ready',
  '暂时没有项目 ready',
  '先暫停，不要 build。最強的欄位仍有未證實條件。先解決列出的缺口，再加入 agent、model、integration 或漂亮 UI。',
  '先暂停，不要 build。最强的栏位仍有未证明条件。先解决列出的缺口，再加入 agent、model、integration 或漂亮 UI。',
  '有虛構決定，但 owner 或改變的 action 模糊',
  '虛構決定、人工 owner 與改變的 action 都清楚',
  '只說 model 或 prompt metric',
  '有 workflow signal，但沒有清楚 baseline 或 guardrail',
  'workflow signal、baseline 與 guardrail 都清楚',
  '只看 happy-path demo',
  '有一些 test case，但 baseline 或預期 routing 模糊',
  'baseline 加預期 pass、failure 與 handoff case 都清楚',
  '看不到 review、trace、rollback 或人工 handoff',
  '有 reviewer 或 handoff，但 operating boundary 模糊',
  'review 或 handoff、trace，以及 rollback 或停止邊界都清楚',
  '有虚构决策，但 owner 或改变的 action 模糊',
  '虚构决策、人工 owner 和改变的 action 都清楚',
  '只说 model 或 prompt metric',
  '有 workflow signal，但没有清楚 baseline 或 guardrail',
  'workflow signal、baseline 与 guardrail 都清楚',
  '只看 happy-path demo',
  '有一些 test case，但 baseline 或预期 routing 模糊',
  'baseline 加预期 pass、failure 和 handoff case 都清楚',
  '看不到 review、trace、rollback 或人工 handoff',
  '有 reviewer 或 handoff，但 operating boundary 模糊',
  'review 或 handoff、trace，以及 rollback 或停止边界都清楚',
  '技術上可以檢查',
  '技术上可以检查',
  'Technical evidence',
  '商業、交付與風險上可以檢查',
  '業務、交付與風險上可以檢查',
  '业务、交付与风险上可以检查',
  'Business, delivery, and risk evidence',
  '技術證據',
  '技术证据',
  '交付、商業與風險證據',
  '交付、业务与风险证据',
  'Delivery, business, and risk evidence',
  '技術上展示甚麼',
  '技術上展示什麼',
  '技术上展示什么',
  'Technical things demonstrated',
  '商業、交付與風險上展示甚麼',
  '業務、交付與風險上展示什麼',
  '业务、交付与风险上展示什么',
  'Business, delivery and risk things demonstrated',
  'Technical evidence it can show',
  'Delivery, business, and risk evidence it can show',
  'enterprise-style LLM workflow',
  'production-thinking',
  'production thinking',
  'Source package 狀態',
  'Source package 状态',
  'Source package status'
];
// The learning-source planner is a decision aid for people at different
// technical levels. Its Chinese controls should name the choice in front of a
// reader, not make them decode English shorthand. These are retired,
// reader-visible strings only; the stable internal field ids remain English.
const retiredChineseLearningPlannerLabels = [
  '你的第一週 starter pack',
  '你的第一周 starter pack',
  'README 草稿或 issue',
  '我做得出 prototype，但無法證明它可靠',
  '我会用 LLM，但说不清资料或权限边界',
  '本週不要做完整 agent、app 或正式環境串接。',
  '不要追 benchmark 分數，也不要宣稱正式環境品質。',
  '可带走的 artefact',
  '看不到 feedback 路径',
  'prerequisite、setup 或第一个任务尚未清楚',
  '复制第一周 brief',
  '第一个 evaluation case'
];
// The optional rehearsal and official-source cards sit directly below the
// learning planner. Keep the old hybrid labels out of these Chinese surfaces
// too, while leaving stable ids and the English locale untouched.
const retiredChineseLearningRehearsalLabels = [
  '不寫 Code：可 review 的 draft workflow',
  '不写 Code：可 review 的 draft workflow',
  '先開下面的不寫 Code starter lab',
  '先打开下面的不写 Code starter lab',
  '全程只在本機做：不需要帳戶、不連 app、不用 live data，也不會做外部 action。',
  '全程只在本机做：不需要账户、不连 app、不用 live data，也不会做外部 action。',
  '看見不吻合，需要改路線或 artefact',
  '看见不吻合，需要改路线或 artefact',
  '投入更多前先 REVISE',
  'OpenAI：檢查 agent workflow',
  'OpenAI：检查 agent workflow',
  '五個 synthetic case 表',
  '五个 synthetic case 表',
  'risk-and-decision map',
  'unsafe-case 記錄',
  'unsafe-case 记录',
  'README 草稿：使用者決策、synthetic input',
  'README 草稿：使用者决策、synthetic input'
];
const learningRehearsalCopyFiles = [
  'lib/learning-evidence-probe.ts',
  'lib/learning-evidence-starting-points.ts'
];
const readerFacingStructureFiles = [
  'lib/portfolio-evidence-planner.ts',
  'lib/build-lab-case-selector.ts',
  'app/[lang]/labs/page.tsx'
];
const retiredArticleCardFrames = [
  'Professional AI Workflow：由模糊需求到可驗收功能',
  '八星期可追問的作品證據 Sprint',
  '由 Offline Evaluation 走到獲授權 Pilot',
  'technical 與非技術 artefact',
  '多模態 demo 要先變成可審核流程，先叫得做產品',
  'AI Harness 同 Definition of Done：framework 前先定義咩叫接受到',
  'Prompt Play 如何變成 Professional Evidence',
  'Turn prompt play into professional evidence',
  'Portfolio 旗艦案例：先將 RAG demo 想法收窄成可審核的 PolicyPilot',
  'A flagship portfolio case: narrow a RAG-demo idea into a reviewable PolicyPilot',
  'ML 決策證據 Lab：由 snapshot 到可交代的 Renewal Triage',
  'ML decision evidence lab: Renewal Triage from snapshot to accountable queue',
  'Portfolio 實作：Approval Queue 把 FAQ 草稿留在人工審批前',
  'Portfolio build: Approval Queue keeps FAQ drafts before human approval',
  'Portfolio 放上 GitHub 前：做一個可被追問的 Proof Pack',
  'Safety、Governance、Privacy 同 Incident Response：唔係 demo 後面補一段聲明',
  'Safety, governance, privacy, and incident response: not a statement added after the demo',
  'Multimodal Architecture、Generation 同 Evaluation：睇到張圖唔代表可以交付文件 workflow',
  'Multimodal architecture, generation, and evaluation: seeing an image is not a deliverable document workflow',
  'Agent／Eval 學習來源：五張官方 receipt',
  'Five official receipts for agent and eval learning',
  'Portfolio 實作：由來源收據做一份可交人判斷的 Context Brief',
  'Portfolio build: turn a source receipt into a human-reviewed context brief'
];
const retiredLivePracticeLabels = [
  '有冇講清業務、交付同風險界線',
  '是否說清業務、交付與風險界線',
  '是否说清业务、交付与风险界线',
  'Whether I named the business, delivery, or risk boundary'
];
// The four-question paths are the first interface many readers use. Keep
// their Chinese names concrete and readable; English wording is allowed in
// the English locale and technical lesson bodies.
const retiredInterviewRouteLabels = [
  'live rehearsal',
  '未有 project：',
  '還沒有 project：',
  '还没有 project：',
  '已有 portfolio：',
  'RAG／agent demo：',
  'ML project：',
  'Software build：',
  'demo、model 或 project',
  '還沒有 project 先選第一條',
  '还没有 project 先选第一条'
];
const retiredNavigationLabels = [
  '深度指南',
  'Deep guides',
  '專業 AI 工作流程',
  'Professional AI Workflows'
];
// First impressions should name a reader action, not promise a vague library
// benefit or compress the whole site into a stack of abstract nouns.
const retiredFirstImpressionFrames = [
  '呢個資源庫幫你',
  '這個資源庫幫你',
  '这个资源库帮你',
  'What this library helps with',
  '由一個可核對嘅案例開始',
  '跟著完整案例做，不是再抄一個 demo',
  '跟着完整案例做，而不是再抄一个 demo',
  'Build one complete case, not another copied demo',
  '用一杯咖啡的預算，支持可重複使用的工程資源',
  '用一杯咖啡的预算，支持可复用的工程资源',
  'Use one coffee-sized budget to sustain reusable engineering resources',
  '如何選擇 AI Engineering 職位路線',
  '如何選擇 AI Engineering 職涯路線',
  '如何选择 AI Engineering 职位路线',
  'How to choose an AI engineering career path',
  '不要再把一個 RAG chatbot 當完整 Portfolio',
  '不要再把一個 RAG chatbot 當成完整作品集',
  '不要再把一个 RAG chatbot 当成完整 Portfolio',
  'A RAG chatbot is not a complete portfolio project',
  'AI Engineer 面試：由職位要求揀第一條要練的問題',
  'AI Engineer 面試：從職務要求選第一條該練的問題',
  'AI Engineer 面试：从职位要求选第一条该练的问题',
  'AI Engineer interviews: choose the first question to practise from the role',
  '非工程師也能建 AI 自動化：最低限度要識得驗收甚麼',
  '非工程師也能建 AI 自動化：最低限度要懂得驗收什麼',
  '非工程师也能建 AI 自动化：最低限度要懂得验收什么',
  'Non-developers can build AI automations: the minimum you must know to evaluate one',
  'Portfolio 值不值得放 GitHub？用證據而不是流暢度評分',
  '唔寫 Code 都可以用 AI：由一段 prompt 變成可驗收工作流程',
  '不寫 Code 也能用 AI：把一段 prompt 變成可驗收工作流程',
  '不写 Code 也能用 AI：把一段 prompt 变成可验收工作流程',
  'Use AI without writing code: turn a prompt into a reviewable workflow'
];
const firstImpressionFiles = [
  'app/[lang]/page.tsx',
  'content/reader-paths.json',
  'content/labs.json',
  'content/articles.json',
  'lib/support.ts'
];
// These entry-page phrases made a reader infer a capability framework rather
// than understand the work, check, or decision in front of them. Keep the
// mechanism names in a lesson when they are explained; do not restore the
// compressed vocabulary bundle to a landing card or planner link.
const plainLanguageEntryFiles = [
  'app/[lang]/page.tsx',
  'app/[lang]/about/page.tsx',
  'components/reader-journey-links.tsx',
  'components/learning-evidence-planner.tsx',
  'components/no-code-personal-case-builder.tsx',
  'components/no-code-personal-case-builder-gate.tsx',
  'content/articles.json',
  'content/labs.json',
  'content/portfolio-example-receipts.json',
  'lib/build-lab-case-selector.ts',
  'lib/interview-lab.ts',
  'lib/no-code-personal-case-builder.ts',
  'lib/no-code-personal-case-builder-gate.ts',
  'lib/no-code-starter-lab.ts'
];
const retiredEntryJargon = [
  'work you want to prove',
  '想證明的工作能力',
  '想证明的工作能力',
  'follow-up-ready engineering judgement',
  'dependable delivery',
  'technical and non-technical judgement',
  'Separate technical proof from business, delivery and risk proof',
  'Record technical proof separately from delivery, risk and production-readiness claims',
  'Turn a course exercise into an eight-week evidence sprint',
  '將課程練習變成八星期作品集證據衝刺',
  '把課程練習變成八週作品集證據衝刺',
  '把课程练习变成八周作品集证据冲刺',
  'Evidence Delta 與 hard-gate release rule。',
  'Evidence Delta 与 hard-gate release rule。',
  'Evidence Delta, and a hard-gate release rule.',
  'source-shaped synthetic fixture',
  'technical pass、workflow proxy 與 job-market outcome 必須分開。',
  'technical pass、workflow proxy 与 job-market outcome 必须分开。',
  'Technical passes, workflow proxies, and job-market outcomes stay separate.',
  'engineering judgement you can follow',
  '從合成資料示例看完整流程',
  '从合成数据示例看完整流程',
  'Inspect a complete workflow through a synthetic reference',
  'README 同證據地圖',
  'README 與證據地圖',
  'README 与证据地图',
  'README and evidence map',
  '可選嘅 plan-first 提示詞',
  '可選的 plan-first 提示詞',
  '可选的 plan-first 提示词',
  'OPTIONAL PLAN-FIRST PROMPT',
  'Plan-first prompt',
  'tool-neutral plan-first prompt',
  '呢個 evidence pack 係乜',
  '這個 evidence pack 是什麼',
  '这个 evidence pack 是什么',
  'What this evidence pack is'
];
// Keep a small set of exact lesson and tool frames out after editorial review.
// They made concrete work sound like a branded capability claim or a lesson
// slogan. The replacement copy names the record, check, or decision instead.
const retiredConcreteWordingFrames = [
  '公開統計資料如何變成可靠的 context brief，而不是 job-market 預測器',
  '公開統計資料怎樣變成可靠的 context brief，而不是 job-market 預測器',
  '公开统计资料如何变成可靠的 context brief，而不是 job-market 预测器',
  'Turn public statistics into a reliable context brief—not a job-market predictor',
  '三層 framework，各自回答不同問題',
  '三层 framework，各自回答不同问题',
  'Three frameworks, each answering a different question',
  '呢個小改動，同時訓練程式判斷同交付責任',
  '這個小改動，同時訓練程式判斷與交付責任',
  '这个小改动，同时训练程序判断和交付责任',
  'This small change trains both code judgment and delivery responsibility',
  '完成後值得留下的證據',
  '完成后值得留下的证据',
  'Evidence worth retaining when you finish',
  '好作品唔係只展示成功 output，而係畀 reviewer 睇到你喺咩情況會停低、點樣重播同點樣修正。',
  '好作品不是只展示成功 output，而是讓 reviewer 看見你在什麼情況會停止、如何重播，以及如何修正。',
  '好作品不是只展示成功 output，而是让 reviewer 看见你在什么情况会停止、如何重播，以及如何修正。',
  'A strong project does not only show a successful output; it lets a reviewer see where you stop, replay, and correct.',
  'Safety 不是在 demo 最後加一段免責聲明。它是一組設計選擇：甚麼資料可入、甚麼 action 可出、誰有權停止、答案錯了後怎樣處理。',
  'Safety 不是 demo 最後加上一段提醒。它是一組設計決定：什麼資料能進來、什麼 action 能出去、誰有權停止、答案錯了之後怎麼辦。',
  'Safety 不是在 demo 最后加一段提醒。它是一组设计决定：什么数据能进入、什么 action 能离开、谁有权停止、答案错误后怎么办。',
  'Safety is not a paragraph added under a demo. It is the set of choices that decides which data may enter, which action may leave, who can stop the system, and what happens when the answer is wrong.',
  '真正的 portfolio evidence 是你的 review：agent 提議甚麼、你接受甚麼、你叫它改甚麼，以及為何。',
  '真正的 portfolio evidence 是你的 review：agent 提議什麼、你接受什麼、你要求它改什麼，以及原因。',
  '真正的 portfolio evidence 是你的 review：agent 提议什么、你接受什么、你要求它改什么，以及原因。',
  'The portfolio evidence is your review: what the agent proposed, what you accepted, what you revised, and why.',
  'Human handoff 不是系統未做好時的道歉，而是 contract 的一部分。',
  'Human handoff 不是系統沒做好時的道歉，而是 contract 的一部分。',
  'Human handoff 不是系统没做好时的道歉，而是 contract 的一部分。',
  'Human handoff is not an apology for an unfinished system. It is part of the system contract.'
];
const concreteWordingFiles = [
  'lib/portfolio-evidence-planner.ts',
  'lib/coding-starter-lab.ts',
  'lib/interview-lab.ts',
  'content/articles/safety-governance-privacy-and-incident-response/en.mdx',
  'content/articles/safety-governance-privacy-and-incident-response/zh-HK.mdx',
  'content/articles/safety-governance-privacy-and-incident-response/zh-TW.mdx',
  'content/articles/safety-governance-privacy-and-incident-response/zh-Hans.mdx',
  'content/articles/coder-ai-pair-workflow/en.mdx',
  'content/articles/coder-ai-pair-workflow/zh-HK.mdx',
  'content/articles/coder-ai-pair-workflow/zh-TW.mdx',
  'content/articles/coder-ai-pair-workflow/zh-Hans.mdx',
  'content/articles/agent-execution-and-serving/en.mdx',
  'content/articles/agent-execution-and-serving/zh-HK.mdx',
  'content/articles/agent-execution-and-serving/zh-TW.mdx',
  'content/articles/agent-execution-and-serving/zh-Hans.mdx'
];
const retiredRoadmapHeading = '用 evaluation、trace 同 release gate 證明行為';
const failures = [];
let checked = 0;

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}

for (const directory of presentationRoots) {
  for (const file of walk(directory)) {
    if (!extensions.has(path.extname(file))) continue;
    checked += 1;
    const source = fs.readFileSync(file, 'utf8');
    for (const label of bannedLearnerLabels) {
      if (source.includes(label)) failures.push(path.relative(root, file) + ': deprecated learner-facing label ' + label);
    }
  }
}

for (const relativePath of entrySurfaceFiles) {
  const file = path.join(root, relativePath);
  const source = fs.readFileSync(file, 'utf8');
  for (const phrase of bannedEntryTermStacks) {
    if (source.includes(phrase)) failures.push(relativePath + ': restored entry-page term stack ' + phrase);
  }
}

// The exact term-stack pass is scoped to zh-HK. The repeated label frame below
// is a mechanical regression check across every locale.
const articleBodiesPath = path.join(root, 'content', 'article-bodies.json');
const articleBodies = Object.values(JSON.parse(fs.readFileSync(articleBodiesPath, 'utf8')));
const hongKongLongFormText = articleBodies
  .map(body => body['zh-HK'] ?? '')
  .join('\n');
const allLongFormText = articleBodies
  .flatMap(body => Object.values(body))
  .join('\n');
for (const phrase of bannedLongFormTermStacks) {
  if (hongKongLongFormText.includes(phrase)) {
    failures.push('content/article-bodies.json (zh-HK): restored long-form term stack ' + phrase);
  }
}
for (const phrase of bannedLongFormFrames) {
  if (allLongFormText.includes(phrase)) {
    failures.push('content/article-bodies.json: restored formulaic long-form frame ' + phrase);
  }
}
if (reportStyleClassifier.test(allLongFormText)) {
  failures.push('content/article-bodies.json: restored report-style technical/non-technical classifier.');
}

for (const relativePath of hongKongPortfolioEditorialFiles) {
  const source = fs.readFileSync(path.join(root, relativePath), 'utf8');
  for (const phrase of retiredHongKongPortfolioFrames) {
    if (source.includes(phrase)) {
      failures.push(relativePath + ': restored formulaic portfolio frame ' + phrase);
    }
  }
}

const roadmapPath = path.join(root, 'content', 'roadmaps', 'ai-engineer-roadmap.json');
if (fs.readFileSync(roadmapPath, 'utf8').includes(retiredRoadmapHeading)) {
  failures.push('content/roadmaps/ai-engineer-roadmap.json: restored roadmap term stack ' + retiredRoadmapHeading);
}

const labsPath = path.join(root, 'content', 'labs.json');
const hongKongLabCopy = JSON.stringify(JSON.parse(fs.readFileSync(labsPath, 'utf8'))[0]?.translations?.['zh-HK'] ?? {});
const labSelectorPath = path.join(root, 'lib', 'build-lab-case-selector.ts');
const labSelectorCopy = fs.readFileSync(labSelectorPath, 'utf8').split("  'zh-TW': {")[0];
const labsPagePath = path.join(root, 'app', '[lang]', 'labs', 'page.tsx');
const labsPageCopy = fs.readFileSync(labsPagePath, 'utf8').split("  'zh-TW': {")[0];
for (const phrase of hongKongLabEntryPhrases) {
  if (hongKongLabCopy.includes(phrase) || labSelectorCopy.includes(phrase) || labsPageCopy.includes(phrase)) {
    failures.push('Hong Kong Build Lab entry copy: restored unexplained term stack ' + phrase);
  }
}

for (const relativePath of readerFacingStructureFiles) {
  const source = fs.readFileSync(path.join(root, relativePath), 'utf8');
  for (const phrase of retiredReadingLabels) {
    if (source.includes(phrase)) {
      failures.push(relativePath + ': restored report-style reading label ' + phrase);
    }
  }
}

const learningPlannerSource = fs.readFileSync(path.join(root, 'lib', 'learning-evidence-planner.ts'), 'utf8');
for (const phrase of retiredChineseLearningPlannerLabels) {
  if (learningPlannerSource.includes(phrase)) {
    failures.push('lib/learning-evidence-planner.ts: restored English shorthand in Chinese planner copy ' + phrase);
  }
}

for (const relativePath of learningRehearsalCopyFiles) {
  const source = fs.readFileSync(path.join(root, relativePath), 'utf8');
  for (const phrase of retiredChineseLearningRehearsalLabels) {
    if (source.includes(phrase)) {
      failures.push(relativePath + ': restored English shorthand in Chinese learning rehearsal copy ' + phrase);
    }
  }
}

const learningStartingPointManifest = JSON.parse(fs.readFileSync(path.join(root, 'content', 'learning-evidence-starting-points.json'), 'utf8'));
const chineseLearningStartingPointText = (learningStartingPointManifest.sources ?? [])
  .flatMap(source => ['zh-HK', 'zh-TW', 'zh-Hans'].map(locale => JSON.stringify(source.copy?.[locale] ?? {})))
  .join('\n');
for (const phrase of retiredChineseLearningRehearsalLabels) {
  if (chineseLearningStartingPointText.includes(phrase)) {
    failures.push('content/learning-evidence-starting-points.json: restored English shorthand in Chinese learning rehearsal copy ' + phrase);
  }
}

const articleCardsSource = fs.readFileSync(path.join(root, 'content', 'articles.json'), 'utf8');
for (const phrase of retiredArticleCardFrames) {
  if (articleCardsSource.includes(phrase)) {
    failures.push('content/articles.json: restored report-style article card frame ' + phrase);
  }
}

const livePracticeSource = fs.readFileSync(path.join(root, 'components', 'interview-live-practice.tsx'), 'utf8');
for (const phrase of retiredLivePracticeLabels) {
  if (livePracticeSource.includes(phrase)) {
    failures.push('components/interview-live-practice.tsx: restored report-style feedback label ' + phrase);
  }
}

const interviewPracticePathSource = JSON.parse(fs.readFileSync(path.join(root, 'content', 'interview-practice-paths.json'), 'utf8'));
for (const locale of ['zh-HK', 'zh-TW', 'zh-Hans']) {
  const localizedRouteCopy = JSON.stringify({
    index: interviewPracticePathSource.index?.[locale],
    paths: interviewPracticePathSource.paths?.map(pathEntry => ({
      copy: pathEntry.copy?.[locale],
      evidenceTasks: pathEntry.evidenceTasks?.map(task => task?.[locale])
    })),
    afterDemoPaths: interviewPracticePathSource.afterDemoPaths?.map(pathEntry => pathEntry.copy?.[locale])
  });
  for (const phrase of retiredInterviewRouteLabels) {
    if (localizedRouteCopy.includes(phrase)) {
      failures.push('content/interview-practice-paths.json/' + locale + ': restored hybrid practice-route label ' + phrase);
    }
  }
}

const interviewLabRouteSource = fs.readFileSync(path.join(root, 'app', '[lang]', 'interview-lab', 'page.tsx'), 'utf8');
for (const phrase of retiredInterviewRouteLabels.slice(-2)) {
  if (interviewLabRouteSource.includes(phrase)) {
    failures.push('app/[lang]/interview-lab/page.tsx: restored hybrid practice-route label ' + phrase);
  }
}

const navigationSource = fs.readFileSync(path.join(root, 'lib', 'i18n.ts'), 'utf8');
for (const phrase of retiredNavigationLabels) {
  if (navigationSource.includes(phrase)) {
    failures.push('lib/i18n.ts: restored generic navigation label ' + phrase);
  }
}

for (const relativePath of firstImpressionFiles) {
  const source = fs.readFileSync(path.join(root, relativePath), 'utf8');
  for (const phrase of retiredFirstImpressionFrames) {
    if (source.includes(phrase)) {
      failures.push(relativePath + ': restored vague or slogan-like first-impression frame ' + phrase);
    }
  }
}

for (const relativePath of plainLanguageEntryFiles) {
  const source = fs.readFileSync(path.join(root, relativePath), 'utf8');
  for (const phrase of retiredEntryJargon) {
    if (source.includes(phrase)) {
      failures.push(relativePath + ': restored unexplained entry-page terminology ' + phrase);
    }
  }
}

for (const relativePath of concreteWordingFiles) {
  const source = fs.readFileSync(path.join(root, relativePath), 'utf8');
  for (const phrase of retiredConcreteWordingFrames) {
    if (source.includes(phrase)) {
      failures.push(relativePath + ': restored report-like wording frame ' + phrase);
    }
  }
}

if (failures.length) {
  throw new Error('Public-voice validation failed:\n' + failures.join('\n'));
}

console.log('Validated ' + checked + ' public presentation files and scoped wording regressions.');
