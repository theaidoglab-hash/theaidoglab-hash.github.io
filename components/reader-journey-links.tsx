import Link from 'next/link';
import { isRouteSurfaceEnabledInCurrentBuild } from '@/lib/release-server-scope';
import type { CategoryId, Locale } from '@/lib/types';
import { canonicalLocaleRecord } from '@/lib/types';

type JourneyLink = {
  title: string;
  text: string;
  action: string;
  href: string;
};

type JourneyNavigationCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  navigationLabel: string;
  links: JourneyLink[];
};

type CategoryHandoff = JourneyLink & {
  eyebrow: string;
};

const resourceNavigationCopy: Record<Locale, JourneyNavigationCopy> = canonicalLocaleRecord({
  'zh-HK': {
    eyebrow: '由眼前要處理嘅事開始',
    title: '按眼前要處理嘅問題揀第一篇',
    intro: '揀一個眼前要處理嘅問題，再睇對應指南；唔使由第一篇開始。',
    navigationLabel: '按目標瀏覽資源',
    links: [
      { title: '釐清一個 LLM 系統問題', text: '由 response 點解變慢、記憶體由何而來，或 context 同輸出點樣改變行為開始；唔好先猜 GPU 配置。', action: '查看系統概念指南', href: '/resources?category=ai-engineering-foundations#resource-results' },
      { title: '準備 AI Engineer 面試', text: '每次練一條問題，再講得出你會點揀、點解、邊度會出錯，同埋會點樣核對。', action: '開始面試練習', href: '/interview-lab' },
      { title: '跟 AI Engineer roadmap 逐步練習', text: '由模型基礎、應用，到一個小功能點樣寫、點樣測，練習喺面試講清自己做過乜。', action: '查看 19 站 roadmap', href: '/series/ai-engineer-roadmap' },
      { title: '用 AI 做嘢：唔寫 Code 定有寫 Code', text: '由今日做到、又安全嘅一步開始：只出草稿，或者逐項檢查 AI 建議嘅程式改動。', action: '揀用 AI 做嘢嘅路線', href: '/series/ai-use-routes' },
      { title: '將 project 變成作品證據', text: '將 project 寫成一個業務決定：邊個拍板、現時點做、點驗收，同埋出錯時交畀邊個。', action: '規劃 project evidence', href: '/portfolio-evidence-planner' },
      { title: '比較課程或學習來源', text: '先寫低自己未證明到嘅能力，再睇來源有冇練習、回饋、驗收方法，同埋幾時唔應該再投放時間。', action: '比較學習來源', href: '/learning-evidence-planner' }
    ]
  },
  'zh-TW': {
    eyebrow: '選一條路開始',
    title: '從眼前要處理的問題選第一篇',
    intro: '先選一個具體目標，再看對應指南；不需要從第一篇文章讀起。',
    navigationLabel: '依目標瀏覽資源',
    links: [
      { title: '釐清一個 LLM 系統問題', text: '從回應為何變慢、記憶體從何而來，或 context 與輸出如何改變行為開始；不要先猜 GPU 配置。', action: '查看系統概念指南', href: '/resources?category=ai-engineering-foundations#resource-results' },
      { title: '準備 AI Engineer 面試', text: '每次練一條練習題，再講得出你會怎麼選、為什麼、哪裡可能出錯，以及怎麼核對。', action: '開始面試練習', href: '/interview-lab' },
      { title: '沿 AI Engineer roadmap 逐步練習', text: '從模型基礎、應用，到一個小功能怎麼寫、怎麼測，練習如何在面試把經驗講清楚。', action: '查看 19 站 roadmap', href: '/series/ai-engineer-roadmap' },
      { title: '用 AI 做工作：不寫 Code 或有寫 Code', text: '從今天能安全完成的一步開始：只出草稿，或逐項檢查 AI 建議的程式改動。', action: '選擇 AI 工作路線', href: '/series/ai-use-routes' },
      { title: '把 project 變成作品證據', text: '先說清要處理哪個業務決策、誰拍板、目前怎麼做、怎麼驗收與交接，再開 repo。', action: '規劃 project evidence', href: '/portfolio-evidence-planner' },
      { title: '比較課程或學習來源', text: '先寫下自己還沒證明的能力，再看來源有沒有練習、回饋、驗收方法，以及什麼時候不值得繼續投入。', action: '比較學習來源', href: '/learning-evidence-planner' }
    ]
  },
  'zh-Hans': {
    eyebrow: '选一条路线开始',
    title: '从眼前要处理的问题选第一篇',
    intro: '先选择一个具体目标，再看对应指南；不需要从第一篇文章读起。',
    navigationLabel: '按目标浏览资源',
    links: [
      { title: '厘清一个 LLM 系统问题', text: '从回应为什么变慢、内存从何而来，或 context 与输出如何改变行为开始；不要先猜 GPU 配置。', action: '查看系统概念指南', href: '/resources?category=ai-engineering-foundations#resource-results' },
      { title: '准备 AI Engineer 面试', text: '每次练一道练习题，再讲得出你会怎么选、为什么、哪里可能出错，以及怎么核对。', action: '开始面试练习', href: '/interview-lab' },
      { title: '沿 AI Engineer roadmap 逐步练习', text: '从模型基础、应用，到一个小功能怎样写、怎样测，练习怎样在面试中把经验讲清楚。', action: '查看 19 站 roadmap', href: '/series/ai-engineer-roadmap' },
      { title: '用 AI 做工作：不写 Code 或写 Code', text: '从今天能安全完成的一步开始：只出草稿，或逐项检查 AI 建议的代码改动。', action: '选择 AI 工作路线', href: '/series/ai-use-routes' },
      { title: '把 project 变成作品证据', text: '先说清要处理哪个业务决策、谁拍板、目前怎么做、怎样验收和交接，再开 repo。', action: '规划 project evidence', href: '/portfolio-evidence-planner' },
      { title: '比较课程或学习来源', text: '先写下自己还没证明的能力，再看来源有没有练习、反馈、验收方法，以及什么时候不值得继续投入。', action: '比较学习来源', href: '/learning-evidence-planner' }
    ]
  },
  en: {
    eyebrow: 'CHOOSE A PATH',
    title: 'Start with the problem in front of you',
    intro: 'Choose one concrete goal, then read the relevant guides. You do not need to start at the first article.',
    navigationLabel: 'Browse resources by goal',
    links: [
      { title: 'Clarify one LLM systems question', text: 'Start with why a response is slow, where memory goes, or how context and output change behaviour instead of guessing at a GPU configuration.', action: 'View systems guides', href: '/resources?category=ai-engineering-foundations#resource-results' },
      { title: 'Prepare for an AI Engineer interview', text: 'Practise one question, then explain what you would choose, why, what could fail, and how you would check it.', action: 'Start interview practice', href: '/interview-lab' },
      { title: 'Work through the AI Engineer roadmap', text: 'Learn model foundations and applications, then build a small application and the checks around it. Practise explaining that work in an interview.', action: 'View the 19-stop roadmap', href: '/series/ai-engineer-roadmap' },
      { title: 'Use AI for work, with or without code', text: 'Start with one safe step today: keep it draft-only, or inspect an AI-suggested code change line by line.', action: 'Choose an AI work route', href: '/series/ai-use-routes' },
      { title: 'Turn a project into portfolio evidence', text: 'Name the business decision, who signs off, the current approach, how you will check it, and how it is handed over before opening a repository.', action: 'Plan project evidence', href: '/portfolio-evidence-planner' },
      { title: 'Compare a course or learning source', text: 'Name the capability you cannot yet show, then see whether a source gives you practice, feedback, a way to check the work, and a point to stop investing time.', action: 'Compare learning sources', href: '/learning-evidence-planner' }
    ]
  }
});

const categoryHandoffs: Record<Locale, Partial<Record<CategoryId, CategoryHandoff>>> = canonicalLocaleRecord({
  'zh-HK': {
    'ai-engineering-foundations': { eyebrow: '下一步', title: '基礎未穩，就由路線起點補起', text: '沿住路線補模型、資料點樣影響結果，同埋點樣驗收；未需要急住轉另一個工具。', action: '由 roadmap 第 00 站開始', href: '/series/ai-engineer-roadmap?phase=foundations#roadmap-stage-00' },
    'ai-engineering-career': { eyebrow: '下一步', title: '先決定想證明乜，再揀下一個來源', text: '比較一至三個不記名來源會唔會幫你補到想展示嘅能力；名氣同價錢只係其中一部分。', action: '比較學習來源', href: '/learning-evidence-planner' },
    'portfolio-evidence': { eyebrow: '下一步', title: '未開 repo 前，先講清 project 做緊乜', text: '由虛構業務決定開始：邊個拍板、現時點做、點樣驗收、資料界線喺邊，同埋交接俾邊個。', action: '規劃 project evidence', href: '/portfolio-evidence-planner' },
    'professional-workflows': { eyebrow: '下一步', title: '跟一組合成資料逐項睇', text: '逐項核對輸入、檢查、人工覆核、撤回方法同交付界線有冇寫清楚。', action: '睇實作案例', href: '/labs' },
    'low-code-ai-builders': { eyebrow: '下一步', title: '由一個可以覆核嘅草稿流程開始', text: '先揀一項低風險、做錯可收回嘅工作。AI 只起草、分類或比較；最後由負責嘅人決定。', action: '打開唔寫 Code 路線', href: '/series/ai-use-routes#track-non-coder' },
    'ai-for-coders': { eyebrow: '下一步', title: '將 AI 提議變成可以覆核嘅改動', text: '先寫清楚要改乜、不應改乜同驗收條件；再睇計劃、差異、測試同誰批准。', action: '打開有寫 Code 路線', href: '/series/ai-use-routes#track-coder' },
    'resources-opportunities': { eyebrow: '下一步', title: '比較課程前，先睇最後帶得走乜', text: '用同一項想證明嘅能力，比較有冇作品、回饋、驗收方法、起步條件，同埋幾時應該停止。', action: '比較學習來源', href: '/learning-evidence-planner' }
  },
  'zh-TW': {
    'ai-engineering-foundations': { eyebrow: '下一步', title: '基礎還不穩，就從路線起點補起', text: '沿著路線補模型、資料如何影響結果，以及怎麼驗收；還不需要急著換另一個工具。', action: '從 roadmap 第 00 站開始', href: '/series/ai-engineer-roadmap?phase=foundations#roadmap-stage-00' },
    'ai-engineering-career': { eyebrow: '下一步', title: '先決定要證明什麼，再選下一個來源', text: '比較一到三個不記名來源會不會幫你補到想展示的能力；名氣與價格只是其中一部分。', action: '比較學習來源', href: '/learning-evidence-planner' },
    'portfolio-evidence': { eyebrow: '下一步', title: '開 repo 前，先拆清 project 的工作', text: '從虛構業務決策開始：誰拍板、目前怎麼做、怎麼驗收、資料邊界在哪，以及交接給誰。', action: '規劃 project evidence', href: '/portfolio-evidence-planner' },
    'professional-workflows': { eyebrow: '下一步', title: '跟著一組合成資料，看清一段本機處理', text: '逐項核對輸入、檢查、人工覆核、撤回方法與交付邊界有沒有寫清楚。', action: '查看建置實驗室', href: '/labs' },
    'low-code-ai-builders': { eyebrow: '下一步', title: '從可以覆核的草稿流程開始', text: '先選一項低風險、做錯能收回的工作。AI 只起草、分類或比較；最後動作由負責的人決定。', action: '開啟不寫 Code 路線', href: '/series/ai-use-routes#track-non-coder' },
    'ai-for-coders': { eyebrow: '下一步', title: '把 AI 的建議變成可覆核的改動', text: '先寫清楚要改什麼、不應改什麼與驗收條件；再看計畫、差異、測試與誰批准。', action: '開啟 coder 路線', href: '/series/ai-use-routes#track-coder' },
    'resources-opportunities': { eyebrow: '下一步', title: '比較課程前，先看最後帶得走什麼', text: '用同一項想證明的能力，比較有沒有作品、回饋、驗收方法、起步條件，以及什麼時候應該停止。', action: '比較學習來源', href: '/learning-evidence-planner' }
  },
  'zh-Hans': {
    'ai-engineering-foundations': { eyebrow: '下一步', title: '基础还不稳，就从路线起点补起', text: '沿着路线补模型、数据怎样影响结果，以及怎样验收；还不需要急着换另一个工具。', action: '从 roadmap 第 00 站开始', href: '/series/ai-engineer-roadmap?phase=foundations#roadmap-stage-00' },
    'ai-engineering-career': { eyebrow: '下一步', title: '先决定要证明什么，再选下一个来源', text: '比较一到三个不记名来源会不会帮你补到想展示的能力；名气与价格只是其中一部分。', action: '比较学习来源', href: '/learning-evidence-planner' },
    'portfolio-evidence': { eyebrow: '下一步', title: '开 repo 前，先拆清 project 的工作', text: '从虚构业务决策开始：谁拍板、目前怎么做、怎样验收、数据边界在哪，以及交接给谁。', action: '规划 project evidence', href: '/portfolio-evidence-planner' },
    'professional-workflows': { eyebrow: '下一步', title: '跟着一组合成数据，看清一段本地处理', text: '逐项核对输入、检查、人工复核、撤回方法和交付边界有没有写清楚。', action: '查看构建实验室', href: '/labs' },
    'low-code-ai-builders': { eyebrow: '下一步', title: '从可以复核的草稿流程开始', text: '先选一项低风险、做错能收回的工作。AI 只起草、分类或比较；最后动作由负责的人决定。', action: '打开不写 Code 路线', href: '/series/ai-use-routes#track-non-coder' },
    'ai-for-coders': { eyebrow: '下一步', title: '把 AI 的建议变成可复核的改动', text: '先写清楚要改什么、不应改什么和验收条件；再看计划、差异、测试与谁批准。', action: '打开 coder 路线', href: '/series/ai-use-routes#track-coder' },
    'resources-opportunities': { eyebrow: '下一步', title: '比较课程前，先看最后带得走什么', text: '用同一项想证明的能力，比较有没有作品、反馈、验收方法、起步条件，以及什么时候应该停止。', action: '比较学习来源', href: '/learning-evidence-planner' }
  },
  en: {
    'ai-engineering-foundations': { eyebrow: 'NEXT STEP', title: 'If the foundations are shaky, repair them at the start of the route', text: 'Use the route to reconnect models and data to their effects, and learn how to check the result. There is no need to switch tools yet.', action: 'Start at roadmap stop 00', href: '/series/ai-engineer-roadmap?phase=foundations#roadmap-stage-00' },
    'ai-engineering-career': { eyebrow: 'NEXT STEP', title: 'Decide what you need to show before choosing another source', text: 'Compare whether one to three unnamed sources help you build the capability you need to show. Reputation and price are only part of the decision.', action: 'Compare learning sources', href: '/learning-evidence-planner' },
    'portfolio-evidence': { eyebrow: 'NEXT STEP', title: 'Before opening a repository, unpack the project work', text: 'Start with a fictional business decision: who signs off, how it works now, how you will check it, the data boundary, and who takes the work over.', action: 'Plan project evidence', href: '/portfolio-evidence-planner' },
    'professional-workflows': { eyebrow: 'NEXT STEP', title: 'Trace one local flow with synthetic data', text: 'Check whether the inputs, checks, human review, rollback path, and delivery boundary are all clear.', action: 'View the build lab', href: '/labs' },
    'low-code-ai-builders': { eyebrow: 'NEXT STEP', title: 'Start with one draft workflow a person can review', text: 'Choose one low-risk task that can be undone. Keep AI to drafting, classification, or comparison; a responsible person makes the final action.', action: 'Open the no-code route', href: '/series/ai-use-routes#track-non-coder' },
    'ai-for-coders': { eyebrow: 'NEXT STEP', title: 'Turn an AI suggestion into a reviewable code change', text: 'State what should change, what must not change, and the acceptance condition. Then inspect the plan, diff, tests, and who approves it.', action: 'Open the coder route', href: '/series/ai-use-routes#track-coder' },
    'resources-opportunities': { eyebrow: 'NEXT STEP', title: 'Compare what you can take away before you invest time', text: 'Use the same capability you want to show to compare the work produced, feedback, checking method, entry conditions, and when to stop.', action: 'Compare learning sources', href: '/learning-evidence-planner' }
  }
});

function localHref(locale: Locale, href: string) {
  return `/${locale}${href}`;
}

function isJourneyHrefEnabled(href: string) {
  if (href.startsWith('/resources')) return isRouteSurfaceEnabledInCurrentBuild('resources');
  if (href.startsWith('/interview-lab')) return isRouteSurfaceEnabledInCurrentBuild('interview-lab');
  if (href.startsWith('/series/')) return isRouteSurfaceEnabledInCurrentBuild('series');
  if (href.startsWith('/portfolio-evidence-planner')) return isRouteSurfaceEnabledInCurrentBuild('portfolio-evidence-planner');
  if (href.startsWith('/learning-evidence-planner')) return isRouteSurfaceEnabledInCurrentBuild('learning-evidence-planner');
  if (href.startsWith('/labs')) return isRouteSurfaceEnabledInCurrentBuild('labs');
  if (href.startsWith('/articles/')) return isRouteSurfaceEnabledInCurrentBuild('article-downloads');
  return isRouteSurfaceEnabledInCurrentBuild('__local-only-journey-link__');
}

export function ReaderJourneyNavigation({ locale }: { locale: Locale }) {
  const copy = resourceNavigationCopy[locale];
  const links = copy.links.filter(link => isJourneyHrefEnabled(link.href));
  if (!links.length) return null;

  return <section className="reader-journey-navigation" aria-labelledby="reader-journey-title">
    <div className="reader-journey-heading">
      <p className="eyebrow">{copy.eyebrow}</p>
      <h2 id="reader-journey-title">{copy.title}</h2>
      <p>{copy.intro}</p>
    </div>
    <nav className="reader-journey-grid" aria-label={copy.navigationLabel}>
      {links.map((link, index) => <Link className="reader-journey-link" href={localHref(locale, link.href)} key={link.href}>
        <span className="reader-journey-number">{String(index + 1).padStart(2, '0')}</span>
        <span className="reader-journey-copy"><strong>{link.title}</strong><span>{link.text}</span></span>
        <span className="reader-journey-action">{link.action} <span aria-hidden="true">→</span></span>
      </Link>)}
    </nav>
  </section>;
}

export function CategoryJourneyHandoff({ locale, category }: { locale: Locale; category: CategoryId }) {
  const handoff = categoryHandoffs[locale][category];
  if (!handoff || !isJourneyHrefEnabled(handoff.href)) return null;

  return <aside className="category-journey-handoff" aria-labelledby={`category-handoff-${category}`}>
    <div>
      <p className="eyebrow">{handoff.eyebrow}</p>
      <h2 id={`category-handoff-${category}`}>{handoff.title}</h2>
      <p>{handoff.text}</p>
    </div>
    <Link className="button secondary" href={localHref(locale, handoff.href)}>{handoff.action} <span aria-hidden="true">→</span></Link>
  </aside>;
}
