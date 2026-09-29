import Link from 'next/link';
import { getReleaseScopedRoadmap } from '@/lib/release-learning-content';
import { isRouteSurfaceEnabledInCurrentBuild } from '@/lib/release-server-scope';
import type { Locale } from '@/lib/types';

type RouteKey = 'roadmap' | 'build' | 'noCode' | 'coder' | 'workflow' | 'portfolio' | 'interview';
type LevelKey = 'zero' | 'build' | 'engineer';

type RoadmapStep = { title: string; text: string; optional?: boolean };
type RouteCopy = { phase: string; title: string; text: string; action: string };
type SupportRouteCopy = { title: string; text: string; action: string };
type LevelCopy = {
  id: LevelKey;
  label: string;
  title: string;
  text: string;
  routeIds: readonly RouteKey[];
};

type LandingRoadmapCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  selectorLabel: string;
  levels: readonly LevelCopy[];
  boundary: { title: string; text: string };
  path: { eyebrow: string; title: string; intro: string; label: string; hint: string };
  supportTitle: string;
  supportIntro: string;
  supportLabel: string;
  optional: string;
  steps: readonly RoadmapStep[];
  support: { start: SupportRouteCopy; library: SupportRouteCopy; interview: SupportRouteCopy };
  routes: Record<RouteKey, RouteCopy>;
};

type NavigationLink = RouteCopy & { id: RouteKey; href: string };
type SupportLink = SupportRouteCopy & { id: 'start' | 'library' | 'interview-support'; href: string; optional?: boolean };
type EntryLink = NavigationLink | SupportLink;

const traditionalRoadmapCopy: LandingRoadmapCopy = {
    eyebrow: '由開始用 AI，到可說明的作品',
    title: '按你現在想完成的事，選一個 AI 學習入口',
    intro: '無論你剛開始使用 AI、已用它協助學習或工作，還是想深化工程實作，都可由眼前的目標直接開始。每一條路都由可完成的小練習開始。',
    selectorLabel: '依目前經驗選擇一個 AI 學習起點',
    levels: [
      { id: 'zero', label: 'LEVEL 01 · 剛開始', title: '我剛開始使用 AI', text: '先把 AI 放進一個日常任務：提出清楚問題、檢查輸出，並保留人的判斷。', routeIds: ['roadmap'] },
      { id: 'build', label: 'LEVEL 02 · 已經會用', title: '我想把 AI 用進一個流程', text: '選擇寫程式或不寫程式的練習，完成一段範圍清楚、可停下來覆核的工作。', routeIds: ['noCode', 'coder', 'build'] },
      { id: 'engineer', label: 'LEVEL 03 · 深化實作', title: '我想建立 AI Engineer 能力', text: '先把現有實作測試、交接與整理成證據；遇到技術缺口時，再回到資料、模型與評估地圖。', routeIds: ['workflow', 'portfolio', 'roadmap'] }
    ],
    boundary: { title: '先說清楚學習邊界', text: '本站提供自學材料、練習與檢查框架，不保證掌握技能、轉職、面試或工作結果。' },
    path: {
      eyebrow: '把練習變成實作',
      title: '由會用 AI，到建立 AI Engineer 的實作判斷',
      intro: '這是一組可直接選擇的入口，不是必須順序完成的課程。選定起點後，再用這四個環節累積；重點不是讀完所有材料，而是每次完成一段可以檢查、說明與改進的工作。',
      label: '由使用 AI 到建立作品證據的四個可選目標',
      hint: '已知想做哪種實作，現在就可直接選無程式或 coding 路線；只有概念卡住時才回到學習地圖。已有成果時亦可直接整理作品證據。'
    },
    supportTitle: '已有明確問題？',
    supportIntro: '可按眼前問題選擇入口，或在知道自己要補哪個概念時再使用資源庫。面試練習可與任何一條實作路線並行。',
    supportLabel: '其他 AI 學習入口',
    optional: '延伸練習',
    steps: [
      { title: '完成一個可覆核的 AI workflow', text: '直接選無程式或 coding 路線，完成一段範圍清楚、可以停下來覆核的工作。' },
      { title: '加入測試、覆核與交接', text: '記錄預期結果、失敗情況、人手覆核，以及另一個人如何接手。' },
      { title: '整理成可說明的作品證據', text: '把用途、取捨、測試與限制放在同一份可回看的紀錄。' }
      ,{ title: '遇到概念缺口才補工程地圖', text: '需要時再回到資料、模型、檢索、評估與交付；不是開始實作前必須讀完的清單。', optional: true }
    ],
    support: {
      start: { title: '按目前問題選擇起點', text: '透過常見情境，選一條適合現階段的學習路線。', action: '選擇起點' },
      library: { title: '按主題補強', text: '已有具體缺口，例如模型、評估、資料或安全時，再使用資源庫。', action: '瀏覽資源庫' },
      interview: { title: '練習說明你的判斷', text: '用一條題目練習清楚說明思考過程，可與作品路線並行。', action: '開啟面試練習' }
    },
    routes: {
      roadmap: { phase: '建立基礎', title: '查看 AI Engineer 學習地圖', text: '由模型、資料、檢索、評估到交付，補齊每一項工程判斷。', action: '從第 00 站開始' },
      build: { phase: '完成第一個實作', title: '選擇第一個 AI 實作', text: '從一段範圍清楚、可以覆核的工作開始。', action: '選擇實作路線' },
      noCode: { phase: '不寫程式', title: '用 AI 完成第一個可檢查的流程', text: '以合成案例練習：只產生草稿、由人覆核、不執行外部動作。', action: '開始安全試作' },
      coder: { phase: '會寫程式', title: '以程式建立 AI 工作流程', text: '由規格、差異與測試開始，逐項檢查 AI 的建議。', action: '開啟 coding 練習' },
      workflow: { phase: '檢查流程', title: '用固定案例練習覆核', text: '透過人手覆核與交接紀錄，看清一段流程如何失效。', action: '前往實作案例' },
      portfolio: { phase: '留下證據', title: '整理我的作品證據', text: '把用途、取捨、驗收與限制放進可回看的作品紀錄。', action: '規劃作品證據' },
      interview: { phase: '延伸練習', title: '面試練習', text: '用一條題目練習清楚說明判斷，可與作品路線並行。', action: '開啟面試練習' }
    }
};

const roadmapCopy: Record<Locale, LandingRoadmapCopy> = {
  'zh-Hant': traditionalRoadmapCopy,
  'zh-Hans': {
    eyebrow: '从开始用 AI，到可说明的作品',
    title: '按你现在想完成的事，选择一个 AI 学习入口',
    intro: '无论你刚开始使用 AI、已用它协助学习或工作，还是想深化工程实作，都可以从眼前的目标直接开始。每一条路线都从可完成的小练习开始。',
    selectorLabel: '按目前经验选择一个 AI 学习起点',
    levels: [
      { id: 'zero', label: 'LEVEL 01 · 刚开始', title: '我刚开始使用 AI', text: '先把 AI 放进一个日常任务：提出清楚问题、检查输出，并保留人的判断。', routeIds: ['roadmap'] },
      { id: 'build', label: 'LEVEL 02 · 已经会用', title: '我想把 AI 用进一个流程', text: '选择写代码或不写代码的练习，完成一段范围清楚、可停下来复核的工作。', routeIds: ['noCode', 'coder', 'build'] },
      { id: 'engineer', label: 'LEVEL 03 · 深化实作', title: '我想建立 AI Engineer 能力', text: '先把现有实作测试、交接并整理成证据；遇到技术缺口时，再回到数据、模型与评估地图。', routeIds: ['workflow', 'portfolio', 'roadmap'] }
    ],
    boundary: { title: '先说明学习边界', text: '本站提供自学材料、练习与检查框架，不保证掌握技能、转职、面试或工作结果。' },
    path: {
      eyebrow: '把练习变成实作',
      title: '从会用 AI，到建立 AI Engineer 的实作判断',
      intro: '这是一组可以直接选择的入口，不是必须按顺序完成的课程。选定起点后，再用这四个环节积累；重点不是读完所有材料，而是每次完成一段可以检查、说明与改进的工作。',
      label: '从使用 AI 到建立作品证据的四个可选目标',
      hint: '已经知道想做哪种实作，现在就可以直接选择不写代码或 coding 路线；只有概念卡住时才回到学习地图。已有成果时也可以直接整理作品证据。'
    },
    supportTitle: '已有明确问题？',
    supportIntro: '可按眼前问题选择入口，或在知道自己要补哪个概念时再使用资源库。面试练习可与任何一条实作路线并行。',
    supportLabel: '其他 AI 学习入口',
    optional: '延伸练习',
    steps: [
      { title: '完成一个可复核的 AI workflow', text: '直接选择不写代码或 coding 路线，完成一段范围清楚、可以停下来复核的工作。' },
      { title: '加入测试、复核与交接', text: '记录预期结果、失败情况、人工复核，以及另一个人如何接手。' },
      { title: '整理成可说明的作品证据', text: '把用途、取舍、测试与限制放在同一份可回看的记录。' }
      ,{ title: '遇到概念缺口才补工程地图', text: '需要时再回到数据、模型、检索、评估与交付；不是开始实作前必须读完的清单。', optional: true }
    ],
    support: {
      start: { title: '按目前问题选择起点', text: '通过常见情境，选择一条适合现阶段的学习路线。', action: '选择起点' },
      library: { title: '按主题补强', text: '已有具体缺口，例如模型、评估、数据或安全时，再使用资源库。', action: '浏览资源库' },
      interview: { title: '练习说明你的判断', text: '用一道题练习清楚说明思考过程，可与作品路线并行。', action: '打开面试练习' }
    },
    routes: {
      roadmap: { phase: '建立基础', title: '查看 AI Engineer 学习地图', text: '从模型、数据、检索、评估到交付，补齐每一项工程判断。', action: '从第 00 站开始' },
      build: { phase: '完成第一个实作', title: '选择第一个 AI 实作', text: '从一段范围清楚、可以复核的工作开始。', action: '选择实作路线' },
      noCode: { phase: '不写代码', title: '用 AI 完成第一个可检查的流程', text: '以合成案例练习：只生成草稿、由人复核、不执行外部动作。', action: '开始安全试作' },
      coder: { phase: '会写代码', title: '以代码建立 AI 工作流程', text: '从规格、差异与测试开始，逐项检查 AI 的建议。', action: '打开 coding 练习' },
      workflow: { phase: '检查流程', title: '用固定案例练习复核', text: '通过人工复核与交接记录，看清一段流程如何失效。', action: '前往实作案例' },
      portfolio: { phase: '留下证据', title: '整理我的作品证据', text: '把用途、取舍、验收与限制放进可回看的作品记录。', action: '规划作品证据' },
      interview: { phase: '延伸练习', title: '面试练习', text: '用一道题练习清楚说明判断，可与作品路线并行。', action: '打开面试练习' }
    }
  },
  en: {
    eyebrow: 'From first use to explainable AI work',
    title: 'Choose the AI entry point that fits what you want to complete now',
    intro: 'Whether you are opening an AI tool for the first time, already using it for study or work, or deepening an engineering practice, start directly from the goal in front of you. Every route begins with a small piece of work you can complete.',
    selectorLabel: 'Choose an AI learning starting point by your current experience',
    levels: [
      { id: 'zero', label: 'LEVEL 01 · NEW TO AI', title: 'I am just starting to use AI', text: 'Use AI in one everyday task first: ask a clear question, check the output, and keep human judgment in the loop.', routeIds: ['roadmap'] },
      { id: 'build', label: 'LEVEL 02 · ALREADY USING AI', title: 'I want to put AI into a workflow', text: 'Choose a code or no-code exercise and complete a bounded piece of work that you can pause and review.', routeIds: ['noCode', 'coder', 'build'] },
      { id: 'engineer', label: 'LEVEL 03 · DEEPEN THE PRACTICE', title: 'I want to build AI Engineer capability', text: 'Test, hand over, and package existing work first; return to data, models, and evaluation when a technical gap appears.', routeIds: ['workflow', 'portfolio', 'roadmap'] }
    ],
    boundary: { title: 'Keep the learning boundary clear', text: 'This site provides self-guided material, exercises, and checking frameworks. It does not guarantee skills, a career change, interview success, or employment outcomes.' },
    path: {
      eyebrow: 'Turn practice into implementation',
      title: 'From using AI to building AI Engineer judgment',
      intro: 'This is a set of entry points, not a mandatory sequence. After choosing a starting point, build through these four parts. The goal is not to finish every resource; it is to complete work you can check, explain, and improve each time.',
      label: 'Four goals you can choose from using AI to portfolio evidence',
      hint: 'You do not need to complete these in order. Return to the learning map when a concept blocks you; go straight to portfolio evidence when you already have work to document.'
    },
    supportTitle: 'Already have a specific question?',
    supportIntro: 'Choose an entry point based on the problem in front of you, or use the library when you know the concept you need to strengthen. Interview practice can run alongside any implementation route.',
    supportLabel: 'Other AI learning entry points',
    optional: 'Extra practice',
    steps: [
      { title: 'Complete a reviewable AI workflow', text: 'Go straight to a no-code or coding route and complete one bounded piece of work that you can pause and review.' },
      { title: 'Add tests, review, and handover', text: 'Record expected results, failure cases, human review, and how another person can continue the work.' },
      { title: 'Package explainable portfolio evidence', text: 'Keep the purpose, trade-offs, tests, and limits together in one record you can revisit.' }
      ,{ title: 'Use the engineering map when a concept blocks you', text: 'Return to data, models, retrieval, evaluation, and delivery only when useful; it is not a checklist to finish before you make a first build.', optional: true }
    ],
    support: {
      start: { title: 'Choose a start by your current problem', text: 'Use common situations to find a learning route that fits your current stage.', action: 'Choose a starting point' },
      library: { title: 'Strengthen one topic', text: 'Use the library when you have a specific gap, such as models, evaluation, data, or safety.', action: 'Browse the library' },
      interview: { title: 'Practise explaining your judgment', text: 'Use one question to practise explaining your thinking alongside a portfolio route.', action: 'Open interview practice' }
    },
    routes: {
      roadmap: { phase: 'When a concept blocks you', title: 'View the AI Engineer learning map', text: 'Work through models, data, retrieval, evaluation, and delivery to build each engineering judgment.', action: 'Start at stop 00' },
      build: { phase: 'MAKE A FIRST BUILD', title: 'Choose a first AI build', text: 'Start with one clearly bounded piece of work you can review.', action: 'Choose a build route' },
      noCode: { phase: 'Start here · no code', title: 'Use AI in a first reviewable workflow', text: 'Practise with a synthetic case: draft only, human review, and no external action.', action: 'Start the safe trial' },
      coder: { phase: 'Start here · code', title: 'Build an AI workflow with code', text: 'Start with the specification, diff, and tests; inspect each AI suggestion.', action: 'Open the coding exercise' },
      workflow: { phase: 'CHECK THE FLOW', title: 'Practise review with a fixed case', text: 'Use human review and handover records to see where a workflow can fail.', action: 'Go to build cases' },
      portfolio: { phase: 'KEEP THE EVIDENCE', title: 'Package my portfolio evidence', text: 'Put purpose, trade-offs, checks, and limits into a record you can revisit.', action: 'Plan portfolio evidence' },
      interview: { phase: 'EXTRA PRACTICE', title: 'Interview practice', text: 'Use one question to practise explaining your judgment alongside a portfolio route.', action: 'Open interview practice' }
    }
  }
};

function localHref(locale: Locale, href: string) {
  return `/${locale}${href}`;
}

function isEntryLink(link: EntryLink | undefined): link is EntryLink {
  return Boolean(link);
}

function isNavigationLink(link: NavigationLink | undefined): link is NavigationLink {
  return Boolean(link);
}

function navigationLinks(locale: Locale): NavigationLink[] {
  const copy = roadmapCopy[locale];
  const links: NavigationLink[] = [];
  const seriesEnabled = isRouteSurfaceEnabledInCurrentBuild('series');

  if (seriesEnabled) {
    links.push({ id: 'roadmap', ...copy.routes.roadmap, href: '/series/ai-engineer-roadmap' });
  } else if (isRouteSurfaceEnabledInCurrentBuild('home') && getReleaseScopedRoadmap()?.stages.some(stage => stage.number === '00')) {
    links.push({ id: 'roadmap', ...copy.routes.roadmap, href: '/#roadmap-stage-00' });
  }

  const noCodeEnabled = isRouteSurfaceEnabledInCurrentBuild('no-code-starter-lab');
  const coderEnabled = isRouteSurfaceEnabledInCurrentBuild('coding-starter-lab');

  if (noCodeEnabled) links.push({ id: 'noCode', ...copy.routes.noCode, href: '/no-code-starter-lab#no-code-lab-manual-title' });
  if (coderEnabled) links.push({ id: 'coder', ...copy.routes.coder, href: '/coding-starter-lab' });
  if (!noCodeEnabled && !coderEnabled && seriesEnabled) links.push({ id: 'build', ...copy.routes.build, href: '/series/ai-use-routes' });
  if (isRouteSurfaceEnabledInCurrentBuild('labs')) links.push({ id: 'workflow', ...copy.routes.workflow, href: '/labs' });
  if (isRouteSurfaceEnabledInCurrentBuild('portfolio-evidence-planner')) links.push({ id: 'portfolio', ...copy.routes.portfolio, href: '/portfolio-evidence-planner' });
  if (isRouteSurfaceEnabledInCurrentBuild('interview-lab')) links.push({ id: 'interview', ...copy.routes.interview, href: '/interview-lab' });

  return links;
}

export function LandingRoadmapNavigation({ locale }: { locale: Locale }) {
  const copy = roadmapCopy[locale];
  const linksById = new Map(navigationLinks(locale).map(link => [link.id, link]));
  const startLink: SupportLink | undefined = isRouteSurfaceEnabledInCurrentBuild('home') ? { id: 'start', ...copy.support.start, href: '/#start-here' } : undefined;
  const libraryLink: SupportLink | undefined = isRouteSurfaceEnabledInCurrentBuild('resources') ? { id: 'library', ...copy.support.library, href: '/resources' } : undefined;

  const levelCards = copy.levels.map(level => {
    const directLinks: Array<EntryLink | undefined> = level.id === 'zero'
      ? [startLink ?? linksById.get('roadmap') ?? libraryLink]
      : level.routeIds.map(id => linksById.get(id));
    const fallback: Array<EntryLink | undefined> = level.id === 'engineer'
      ? [libraryLink ?? startLink]
      : [linksById.get('roadmap') ?? libraryLink ?? startLink];

    return { level, links: (directLinks.some(isEntryLink) ? directLinks : fallback).filter(isEntryLink) };
  });

  const mapStages = [
    { step: copy.steps[0], links: [linksById.get('noCode'), linksById.get('coder'), linksById.get('build')].filter(isNavigationLink) },
    { step: copy.steps[1], links: [linksById.get('workflow')].filter(isNavigationLink) },
    { step: copy.steps[2], links: [linksById.get('portfolio')].filter(isNavigationLink) },
    { step: copy.steps[3], links: [linksById.get('roadmap')].filter(isNavigationLink) }
  ];

  const supportLinks: SupportLink[] = [
    startLink,
    libraryLink,
    linksById.has('interview') ? { id: 'interview-support', ...copy.support.interview, href: '/interview-lab', optional: true } : undefined
  ].filter((link): link is SupportLink => Boolean(link));

  return <section id="landing-roadmap" className="landing-roadmap shell section" aria-labelledby="landing-roadmap-title" tabIndex={-1}>
    <header className="landing-roadmap__header">
      <p className="eyebrow">{copy.eyebrow}</p>
      <h2 id="landing-roadmap-title">{copy.title}</h2>
      <p>{copy.intro}</p>
    </header>

    <nav aria-label={copy.selectorLabel}>
      <ol className="landing-roadmap__levels">
        {levelCards.map(({ level, links: levelLinks }, index) => <li key={level.id}>
          <span className="landing-roadmap__level-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
          <p className="landing-roadmap__level-label">{level.label}</p>
          <h3>{level.title}</h3>
          <p>{level.text}</p>
          <ul className="landing-roadmap__level-actions">
            {levelLinks.map(link => <li key={link.id}><Link href={localHref(locale, link.href)}>
              <span><strong>{link.title}</strong><small>{link.text}</small></span>
              <span>{link.action} <span aria-hidden="true">→</span></span>
            </Link></li>)}
          </ul>
        </li>)}
      </ol>
    </nav>

    <aside className="landing-roadmap__boundary" aria-labelledby="landing-roadmap-boundary-title">
      <h3 id="landing-roadmap-boundary-title">{copy.boundary.title}</h3>
      <p>{copy.boundary.text}</p>
    </aside>

    <div className="landing-roadmap__path">
      <header className="landing-roadmap__path-header">
        <p className="eyebrow">{copy.path.eyebrow}</p>
        <h3>{copy.path.title}</h3>
        <p>{copy.path.intro}</p>
      </header>

      <nav aria-label={copy.path.label}>
        <ol className="landing-roadmap__steps">
          {mapStages.map(({ step, links: stageLinks }, index) => <li id={`landing-roadmap-step-${index + 1}`} key={step.title}>
            <span className="landing-roadmap__step-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <div>
              <h4>{step.title}{step.optional ? <small> ({copy.optional})</small> : null}</h4>
              <p>{step.text}</p>
              {stageLinks.length ? <ul className="landing-roadmap__step-links">
                {stageLinks.map(link => <li key={link.id}><Link href={localHref(locale, link.href)}>
                  <span><strong>{link.title}</strong><small>{link.phase}</small></span>
                  <span>{link.action} <span aria-hidden="true">→</span></span>
                </Link></li>)}
              </ul> : null}
            </div>
          </li>)}
        </ol>
      </nav>
      <p className="landing-roadmap__map-hint">{copy.path.hint}</p>
    </div>

    {supportLinks.length ? <nav className="landing-roadmap__support" aria-label={copy.supportLabel}>
      <div className="landing-roadmap__support-header">
        <h3>{copy.supportTitle}</h3>
        <p>{copy.supportIntro}</p>
      </div>
      <ul className="landing-roadmap__support-links">
        {supportLinks.map(link => <li key={link.id}><Link href={localHref(locale, link.href)}>
          <span className="landing-roadmap__support-title"><strong>{link.title}</strong>{link.optional ? <small>{copy.optional}</small> : null}</span>
          <span className="landing-roadmap__support-copy">{link.text}</span>
          <span className="landing-roadmap__support-action">{link.action} <span aria-hidden="true">→</span></span>
        </Link></li>)}
      </ul>
    </nav> : null}
  </section>;
}
