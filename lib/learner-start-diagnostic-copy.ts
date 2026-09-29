import type { Locale } from '@/lib/types';

export type Goal = 'explore' | 'workflow' | 'portfolio' | 'concepts' | 'interview';
export type CodingLevel = 'none' | 'basic' | 'comfortable';
export type TimeBudget = 'quick' | 'session' | 'week';

export type StartRouteId = 'early' | 'noCode' | 'coding' | 'labs' | 'roadmap' | 'resources' | 'technical' | 'portfolio' | 'interview';

export type LearnerStartRouteTarget = string | {
  href: string;
  quickHref?: string;
};

export type LearnerStartRoutes = Partial<Record<StartRouteId, LearnerStartRouteTarget>>;

export type Recommendation = {
  title: string;
  why: string;
  next: string;
  action?: string;
};

export type DiagnosticCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  goalLegend: string;
  goals: Record<Goal, string>;
  codingLegend: string;
  codingLevels: Record<CodingLevel, string>;
  timeLegend: string;
  timeBudgets: Record<TimeBudget, string>;
  resultEyebrow: string;
  resultTitle: string;
  resultEmpty: string;
  startAction: string;
  exploreAction: string;
  whyLabel: string;
  nextLabel: string;
  localBoundary: string;
  recommendations: Record<StartRouteId, Recommendation>;
  quickRecommendations?: Partial<Record<StartRouteId, Recommendation>>;
};

// This is deliberately server-owned: the interactive client receives only the active locale's copy.
export const learnerStartDiagnosticCopy: Record<Locale, DiagnosticCopy> = {
  'zh-Hant': {
    eyebrow: '由你現在的狀態開始',
    title: '先找到適合你的 AI 起點',
    intro: '不用先讀完整個網站。若你只想先輕鬆認識 AI，選第一項就可以直接瀏覽；其他方向再補充程式基礎和可用時間，這裡會推薦一個起點。',
    goalLegend: '1. 你現在想由哪裡開始？',
    goals: { explore: '先輕鬆認識 AI，不急著做項目', workflow: '第一次把 AI 用進可覆核的工作', portfolio: '開始建立一個 AI 作品', concepts: '補一個 AI／工程概念缺口', interview: '練習 AI Engineer 面試' },
    codingLegend: '2. 你目前的程式基礎？',
    codingLevels: { none: '不寫程式／暫時不想寫', basic: '看得懂小段程式與測試', comfortable: '可以自行修改、執行與除錯' },
    timeLegend: '3. 這次有多少時間？',
    timeBudgets: { quick: '約 15 分鐘', session: '約 1 小時', week: '一星期逐步完成' },
    resultEyebrow: '你的第一步',
    resultTitle: '選定方向後，這裡會顯示一個起點',
    resultEmpty: '先選一個方向；若不是只想先認識 AI，再補充程式基礎和可用時間。這不是能力測驗，只用來減少你要比較的路線。',
    startAction: '開始這一步',
    exploreAction: '看看 AI 起步路線',
    whyLabel: '為什麼從這裡開始',
    nextLabel: '完成後再做什麼',
    localBoundary: '選擇只存在這個頁面，不會上傳或建立帳戶。推薦是導航提示，不是能力評分。',
    recommendations: {
      early: { title: '先輕鬆看看 AI，不用立刻做練習', why: '你不必現在選一個工作、作品或技術目標。先看看 AI 可以怎樣用，以及哪些方向值得日後深入。', next: '當你想動手時，再回來選一條工作、作品或概念路線。' },
      noCode: { title: '先完成無程式本機練習', why: '先用固定虛構案例練習輸入、檢查、停止與交接，不需要帳戶或真實資料。', next: '完成後，把決定、案例和覆核紀錄整理到作品規劃器。' },
      coding: { title: '先完成 Coder Starter Lab（45–60 分鐘）', why: '你可以由一個小函式、固定案例和差異檢查開始，不需要先搭建完整 AI 系統。', next: '完成後，選一個 Build Lab，加入自己的案例與失敗測試。' },
      labs: { title: '選一個 Build Lab 作為同一個作品的起點', why: '你已有執行與除錯基礎，可以直接選一個有固定案例、測試和邊界的實作。', next: '不要只重跑 starter；改寫問題、加入自己的案例與一項實質修改。' },
      roadmap: { title: '從 AI Engineer 學習地圖的第 00 站開始', why: '先建立共同語言與概念邊界，再按缺口前進；不用預先讀完 19 站。', next: '每站完成指定產物與自我檢查，再前往下一站。' },
      resources: { title: '先用資源庫找一個具體概念', why: '這次時間較短，或你想先釐清單一概念；搜尋一個明確問題會比由頭讀完整路線更容易完成。', next: '把找到的概念帶回一個實作或作品任務。' },
      technical: { title: '先由一條 LLM 系統問題開始', why: '你有時間拆開一個具體 bottleneck；先分清慢、記憶體和輸出行為，才知道下一步要量甚麼。', next: '完成後，沿第 03、04、05 和 12 站，把概念連到一條可解釋的 request path。' },
      portfolio: { title: '先用 15 分鐘寫一張作品起步卡', why: '這一步只定義要解決的問題、由誰作最後決定，以及不能做的事；不是完成整份作品規劃。', next: '完成起步卡後，再選一個練習案例，逐步加入測試、覆核和可展示證據。' },
      interview: { title: '先完成一條四題面試路線', why: '四題足以練習定義、機制、取捨與證據，比隨機翻完整題庫容易開始。', next: '把回答中暴露的缺口帶回學習地圖或作品。' }
    },
    quickRecommendations: {
      technical: { title: '用 15 分鐘拆開一條短請求', why: '只做預設的「短請求（request）· 已預熱快取（warm cache）」情境：指出先要量哪一段，並記下要留下的欄位；不用讀完文章或懂晒部署。', next: '下次有較長時間，再比較長請求、流量突然增加（burst）或冷快取（cold cache），然後把概念帶回實作。' },
      resources: { title: '用 15 分鐘選定一條概念指南，不用完成它', why: '資源庫中最短的完整指南仍需約 35–40 分鐘；這次只選定一條問題、讀開頭和記下何時回來完成。', next: '有完整時段時，再按指南標示的時間完成練習，並帶回實作或作品。' },
      coding: { title: '用 15 分鐘做 Coder Starter 的兩個案例判斷', why: '暫時不用下載、寫程式或開 AI 助手。先寫下 TC-01 和 TC-06 應走的 route，再核對為何 BLOCKED 要先於 NEEDS_REVISION。', next: '有 45–60 分鐘時，再完成全部六個案例、改動說明和覆核記錄。', action: '開始 15 分鐘案例判斷' },
      interview: { title: '用 15 分鐘練一條面試題', why: '只回答一條題：先用 90 秒講出自己的答案，再核對一個原理、取捨或停止條件；不用完成四題路線。', next: '有較長時間時，再沿一條四題路線補齊其他問題，並把缺口帶回學習或作品。' }
    }
  },
  'zh-Hans': {
    eyebrow: '从你现在的状态开始',
    title: '先找到适合你的 AI 起点',
    intro: '不用先读完整个网站。如果你只想轻松认识 AI，选择第一项就可以直接浏览；其他方向再补充编程基础和可用时间，这里会推荐一个起点。',
    goalLegend: '1. 你现在想从哪里开始？',
    goals: { explore: '先轻松认识 AI，不急着做项目', workflow: '第一次把 AI 用进可复核的工作', portfolio: '开始建立一个 AI 作品', concepts: '补一个 AI／工程概念缺口', interview: '练习 AI Engineer 面试' },
    codingLegend: '2. 你目前的编程基础？',
    codingLevels: { none: '不写代码／暂时不想写', basic: '看得懂小段代码与测试', comfortable: '可以自行修改、运行与调试' },
    timeLegend: '3. 这次有多少时间？',
    timeBudgets: { quick: '约 15 分钟', session: '约 1 小时', week: '一周逐步完成' },
    resultEyebrow: '你的第一步',
    resultTitle: '选定方向后，这里会显示一个起点',
    resultEmpty: '先选一个方向；如果不是只想先认识 AI，再补充编程基础和可用时间。这不是能力测试，只用来减少你要比较的路线。',
    startAction: '开始这一步',
    exploreAction: '看看 AI 起步路线',
    whyLabel: '为什么从这里开始',
    nextLabel: '完成后再做什么',
    localBoundary: '选择只存在这个页面，不会上载或建立账户。推荐是导航提示，不是能力评分。',
    recommendations: {
      early: { title: '先轻松看看 AI，不必立刻做练习', why: '你不必现在选择一个工作、作品或技术目标。先看看 AI 可以怎样用，以及哪些方向值得日后深入。', next: '当你想动手时，再回来选一条工作、作品或概念路线。' },
      noCode: { title: '先完成无代码本地练习', why: '先用固定虚构案例练习输入、检查、停止与交接，不需要账户或真实数据。', next: '完成后，把决策、案例和复核记录整理到作品规划器。' },
      coding: { title: '先完成 Coder Starter Lab（45–60 分钟）', why: '你可以从一个小函数、固定案例和差异检查开始，不需要先搭建完整 AI 系统。', next: '完成后，选一个 Build Lab，加入自己的案例与失败测试。' },
      labs: { title: '选择一个 Build Lab 作为同一个作品的起点', why: '你已有运行与调试基础，可以直接选择一个有固定案例、测试和边界的实作。', next: '不要只重跑 starter；改写问题、加入自己的案例与一项实质修改。' },
      roadmap: { title: '从 AI Engineer 学习地图第 00 站开始', why: '先建立共同语言与概念边界，再按缺口前进；不用预先读完 19 站。', next: '每站完成指定产物与自我检查，再前往下一站。' },
      resources: { title: '先用资源库找一个具体概念', why: '这次时间较短，或你想先厘清单一概念；搜索一个明确问题比从头读完整路线更容易完成。', next: '把找到的概念带回一个实作或作品任务。' },
      technical: { title: '先从一个 LLM 系统问题开始', why: '你有时间拆开一个具体 bottleneck；先分清慢、内存和输出行为，才知道下一步要量什么。', next: '完成后，沿第 03、04、05 和 12 站，把概念连到一条可解释的 request path。' },
      portfolio: { title: '先用 15 分钟写一张作品起步卡', why: '这一步只定义要解决的问题、由谁作最后决定，以及不能做的事；不是完成整份作品规划。', next: '完成起步卡后，再选一个练习案例，逐步加入测试、复核和可展示证据。' },
      interview: { title: '先完成一条四题面试路线', why: '四题足以练习定义、机制、取舍与证据，比随机翻完整题库容易开始。', next: '把回答中暴露的缺口带回学习地图或作品。' }
    },
    quickRecommendations: {
      technical: { title: '用 15 分钟拆开一条短请求', why: '只做默认的“短请求（request）· 已预热缓存（warm cache）”情境：指出应先量哪一段，并记下要保留的字段；不用读完文章或懂完部署。', next: '下次有较长时间，再比较长请求、流量突然增加（burst）或冷缓存（cold cache），然后把概念带回实作。' },
      resources: { title: '用 15 分钟选定一条概念指南，不用完成它', why: '资源库中最短的完整指南仍需约 35–40 分钟；这次只选定一个问题、读开头并记下何时回来完成。', next: '有完整时段时，再按指南标示的时间完成练习，并带回实作或作品。' },
      coding: { title: '用 15 分钟做 Coder Starter 的两个案例判断', why: '暂时不用下载、写程序或打开 AI 助手。先写下 TC-01 和 TC-06 应走的 route，再核对为何 BLOCKED 要早于 NEEDS_REVISION。', next: '有 45–60 分钟时，再完成全部六个案例、改动说明和复核记录。', action: '开始 15 分钟案例判断' },
      interview: { title: '用 15 分钟练一道面试题', why: '只回答一道题：先用 90 秒说出自己的答案，再核对一个原理、取舍或停止条件；不用完成四题路线。', next: '有较长时间时，再沿一条四题路线补齐其他问题，并把缺口带回学习或作品。' }
    }
  },
  en: {
    eyebrow: 'START WHERE YOU ARE',
    title: 'Find the AI starting point that fits you',
    intro: 'You do not need to read the whole site first. If you just want to explore AI, choose the first option and browse straight away. For the other directions, add your coding baseline and available time to get one recommended start.',
    goalLegend: '1. Where would you like to start?',
    goals: { explore: 'I just want to explore AI — no project yet', workflow: 'Use AI in a first reviewable workflow', portfolio: 'Start building an AI portfolio project', concepts: 'Fill one AI or engineering concept gap', interview: 'Practise an AI Engineer interview' },
    codingLegend: '2. What is your current coding baseline?',
    codingLevels: { none: 'I do not code, or do not want to yet', basic: 'I can read a small function and test', comfortable: 'I can modify, run, and debug code' },
    timeLegend: '3. How much time do you have this time?',
    timeBudgets: { quick: 'About 15 minutes', session: 'About one hour', week: 'Work through it over a week' },
    resultEyebrow: 'YOUR FIRST STEP',
    resultTitle: 'Choose a direction to reveal a starting point',
    resultEmpty: 'Choose a direction first. Unless you only want to explore AI, then add your coding baseline and available time. This is not an ability test; it only reduces the routes you need to compare.',
    startAction: 'Start this step',
    exploreAction: 'Browse the AI starter route',
    whyLabel: 'Why start here',
    nextLabel: 'What comes after it',
    localBoundary: 'Choices stay on this page. Nothing is uploaded and no account is created. The recommendation is navigation help, not an ability score.',
    recommendations: {
      early: { title: 'Browse AI first — no exercise required', why: 'You do not need to pick a work, portfolio, or technical goal yet. Look around at how AI can be used and which directions may be worth exploring later.', next: 'When you want to try something, return to choose a work, portfolio, or concept route.' },
      noCode: { title: 'Complete the local no-code exercise first', why: 'Use fixed fictional cases to practise inputs, checks, stops, and handoffs without an account or real data.', next: 'Then package the decision, cases, and review record in the portfolio planner.' },
      coding: { title: 'Complete the 45–60-minute Coder Starter Lab first', why: 'Begin with a small function, fixed cases, and diff review instead of setting up a full AI system.', next: 'Then choose one Build Lab and add your own cases and failure test.' },
      labs: { title: 'Choose one Build Lab as the start of one project', why: 'You can already run and debug code, so begin with a bounded build that has fixtures, tests, and explicit limits.', next: 'Do not only replay the starter. Change the problem, add your own cases, and implement one material change.' },
      roadmap: { title: 'Start at stop 00 of the AI Engineer learning map', why: 'Build shared language and concept boundaries, then move by gaps. You do not need to read all 19 stops first.', next: 'Complete the stage artefact and self-check before moving forward.' },
      resources: { title: 'Use the library to find one specific concept', why: 'This visit is short, or you want to resolve one concept first. A named question is easier to finish than starting a complete route.', next: 'Bring the concept back into a build or portfolio task.' },
      technical: { title: 'Start with one LLM systems question', why: 'You have time to unpack one concrete bottleneck. Separating slowness, memory, and output behaviour makes the next measurement clear.', next: 'Then use stops 03, 04, 05, and 12 to connect the ideas into one explainable request path.' },
      portfolio: { title: 'Spend 15 minutes on a portfolio start card', why: 'This step only names the problem, the person who makes the final decision, and what the project must not do. It does not complete the full portfolio plan.', next: 'After the start card, choose one practice case and gradually add tests, review, and evidence you can show.' },
      interview: { title: 'Complete one four-question interview path', why: 'Four questions are enough to practise definition, mechanism, trade-offs, and evidence without browsing the whole catalogue.', next: 'Take the gaps exposed by your answers back to the learning map or a project.' }
    },
    quickRecommendations: {
      technical: { title: 'Use 15 minutes to unpack one short request', why: 'Use only the default “Short request · warm cache” scenario, where a reusable cache is already available: name the slice to inspect first and the fields to retain. You do not need to finish the guide or make a deployment choice.', next: 'When you have longer, compare a long request, a traffic burst, or a cold cache and bring the concept back to a build.' },
      resources: { title: 'Use 15 minutes to choose one concept guide, not finish it', why: 'The shortest complete library guides still take about 35–40 minutes. This visit only chooses one question, reads the opening, and records when to return.', next: 'When you have a full session, complete the guide at its stated pace and bring it back to a build or portfolio task.' },
      coding: { title: 'Use 15 minutes to judge two Coder Starter cases', why: 'Do not download, write code, or open an AI assistant yet. Predict the routes for TC-01 and TC-06, then check why BLOCKED takes priority over NEEDS_REVISION.', next: 'When you have 45–60 minutes, complete all six cases, the change brief, and the reviewer record.', action: 'Start the 15-minute case judgment' },
      interview: { title: 'Use 15 minutes on one interview question', why: 'Answer one question for 90 seconds, then check one missing principle, trade-off, or stop condition. You do not need to complete a four-question path.', next: 'When you have longer, continue through a four-question path and carry the gaps back to learning or a project.' }
    }
  }
};
