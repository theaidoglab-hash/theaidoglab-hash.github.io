import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArticleCard } from '@/components/site';
import { EarlyAiLearningRoute } from '@/components/early-ai-learning-route';
import { FragmentAnchorScroll } from '@/components/fragment-anchor-scroll';
import { LearningRouteSwitcher, type LearningRouteSwitcherCopy } from '@/components/learning-route-switcher';
import { RoadmapTimeline } from '@/components/roadmap-timeline';
import { StaticPageRedirect } from '@/components/static-page-redirect';
import { SupportNudge } from '@/components/support-nudge';
import { getArticles } from '@/lib/content';
import { aiUseRouteCopy, aiUseTracks } from '@/lib/ai-use-routes';
import { interviewLabCopy, interviewPracticePath, interviewTopics } from '@/lib/interview-lab';
import { getReleaseScopedRoadmap } from '@/lib/release-learning-content';
import {
  getReleaseScopedSeries,
  isRouteSurfaceEnabledInCurrentBuild,
  isSeriesEnabledInCurrentBuild,
} from '@/lib/release-server-scope';
import { localizedAlternates, pageSocialMetadata } from '@/lib/site-metadata';
import { canonicalLocaleRecord, LOCALES, type Locale } from '@/lib/types';

// Static hosting renders the canonical series view. Optional phase and route
// selection remains request-time behavior in the Cloudflare runtime.
export const dynamic = 'force-static';

type LearningRoutePageCopy = LearningRouteSwitcherCopy & {
  engineer: LearningRouteSwitcherCopy['engineer'] & {
    eyebrow: string;
    title: string;
    intro: string;
    interviewAction: string;
  };
};

const learningRoutePageCopy: Record<Locale, LearningRoutePageCopy> = canonicalLocaleRecord({
  'zh-HK': {
    eyebrow: '學習路線',
    title: '由零開始學 AI，或走向 AI Engineer',
    intro: '先揀你而家需要嘅路線：不寫 Code 可以先學點樣安全、有效地用 AI 做工作；有開發底子，可以由基礎、實作一路走到面試練習。',
    legend: '揀選學習路線',
    selectedLabel: '✓ 正在查看這條路線',
    chooseLabel: '選擇這條路線 →',
    early: { label: 'AI 起步', detail: '不寫 Code：先學用 AI 完成一件可覆核嘅工作' },
    engineer: { label: 'AI Engineer', detail: '有開發底子：由模型、資料、評估走到交付', eyebrow: 'AI Engineer', title: 'AI Engineer 學習路線', intro: '按 19 個學習站，由模型基礎、應用、檢查到可展示嘅工作紀錄。每完成一段，再用面試練習檢查自己可唔可以講清楚背後嘅取捨。', interviewAction: '開始面試練習' }
  },
  'zh-TW': {
    eyebrow: '學習路線',
    title: '由零開始學 AI，或走向 AI Engineer',
    intro: '先選擇你現在需要的路線：不寫 Code 可以先學如何安全、有效地用 AI 做工作；有開發底子，可以從基礎、實作一路走到面試練習。',
    legend: '選擇學習路線',
    selectedLabel: '✓ 正在查看這條路線',
    chooseLabel: '選擇這條路線 →',
    early: { label: 'AI 起步', detail: '不寫 Code：先學用 AI 完成一件可覆核的工作' },
    engineer: { label: 'AI Engineer', detail: '有開發底子：從模型、資料、評估走到交付', eyebrow: 'AI Engineer', title: 'AI Engineer 學習路線', intro: '按 19 個學習站，從模型基礎、應用、檢查到可展示的工作紀錄。每完成一段，再用面試練習檢查自己能否說清楚背後的取捨。', interviewAction: '開始面試練習' }
  },
  'zh-Hans': {
    eyebrow: '学习路线',
    title: '从零开始学 AI，或走向 AI Engineer',
    intro: '先选择你现在需要的路线：不写 Code 可以先学如何安全、有效地用 AI 做工作；有开发基础，可以从基础、实作一路走到面试练习。',
    legend: '选择学习路线',
    selectedLabel: '✓ 正在查看这条路线',
    chooseLabel: '选择这条路线 →',
    early: { label: 'AI 起步', detail: '不写 Code：先学用 AI 完成一件可复核的工作' },
    engineer: { label: 'AI Engineer', detail: '有开发基础：从模型、数据、评估走到交付', eyebrow: 'AI Engineer', title: 'AI Engineer 学习路线', intro: '按 19 个学习站，从模型基础、应用、检查到可展示的工作记录。每完成一段，再用面试练习检查自己能否说清楚背后的取舍。', interviewAction: '开始面试练习' }
  },
  en: {
    eyebrow: 'Learning routes',
    title: 'Start learning AI, or grow into an AI Engineer',
    intro: 'Choose the route you need now: learn to use AI safely and effectively without writing code, or build from technical foundations through practical work and interview practice.',
    legend: 'Choose a learning route',
    selectedLabel: '✓ Currently viewing this route',
    chooseLabel: 'Choose this route →',
    early: { label: 'Start with AI', detail: 'No code: use AI for one reviewable piece of work' },
    engineer: { label: 'AI Engineer', detail: 'Technical foundation: models, data, evaluation, and delivery', eyebrow: 'AI Engineer', title: 'AI Engineer learning route', intro: 'Work through 19 learning stops, from model foundations and applications to checks and evidence you can show. Use interview practice after each phase to see whether you can explain the trade-offs.', interviewAction: 'Start interview practice' }
  }
});

const legacyInterviewRedirectCopy = canonicalLocaleRecord({
  'zh-HK': { title: '頁面已搬到面試練習', detail: '此舊連結會帶你到 AI Engineer Interview Lab。', action: '前往面試練習' },
  'zh-TW': { title: '頁面已移至面試練習', detail: '此舊連結會帶你到 AI Engineer Interview Lab。', action: '前往面試練習' },
  'zh-Hans': { title: '页面已移至面试练习', detail: '此旧链接会带你到 AI Engineer Interview Lab。', action: '前往面试练习' },
  en: { title: 'This page has moved', detail: 'This older link now leads to the AI Engineer Interview Lab.', action: 'Open interview practice' },
});

const series = {
  'prompt-play': {
    tag: 'prompt play',
    copy: canonicalLocaleRecord({
      'zh-HK': { eyebrow: '系列', title: 'Prompt Play', intro: '試 prompt 時，唔只睇一次答得靚。將同一批題目、容許資料、預期結果同人手覆核寫低，先至知道改動有冇真係改善。' },
      'zh-TW': { eyebrow: '系列', title: 'Prompt Play', intro: '試 prompt 時，不要只看一次答得漂亮。把同一批題目、允許資料、預期結果與人工覆核寫下來，才知道改動有沒有真的改善。' },
      'zh-Hans': { eyebrow: '系列', title: 'Prompt Play', intro: '试 prompt 时，不要只看一次答得漂亮。把同一批题目、允许数据、预期结果与人工复核写下来，才知道改动有没有真的改善。' },
      en: { eyebrow: 'Series', title: 'Prompt Play', intro: 'Do not judge a prompt from one polished answer. Keep the same questions, allowed data, expected results, and human review so you can see whether a change actually helps.' }
    })
  },
  'ai-engineer-roadmap': {
    tag: 'ai engineer roadmap',
    copy: canonicalLocaleRecord({
      'zh-HK': { eyebrow: '學習路線', title: 'AI 學習路線', intro: '無論你而家想用 AI 幫手做工作，定係想走向 AI Engineer，先由適合自己嘅起點開始。' },
      'zh-TW': { eyebrow: '學習路線', title: 'AI 學習路線', intro: '無論你現在想用 AI 幫忙做工作，或想走向 AI Engineer，先從適合自己的起點開始。' },
      'zh-Hans': { eyebrow: '学习路线', title: 'AI 学习路线', intro: '无论你现在想用 AI 帮忙做工作，或想走向 AI Engineer，先从适合自己的起点开始。' },
      en: { eyebrow: 'Learning routes', title: 'AI learning routes', intro: 'Whether you want to use AI for work or grow into an AI Engineer, start from the route that fits you now.' }
    })
  },
  'ai-engineer-interviews': {
    tag: 'interview lab',
    copy: canonicalLocaleRecord({
      'zh-HK': { eyebrow: '面試學習地圖', title: 'AI Engineer Interview Lab', intro: '按可轉移能力準備公開題型：由一個具體決定講到機制、取捨、失敗邊界和可展示證據。', mapTitle: '59 條獨立練習問題，分成 10 條能力路線', mapIntro: '每星期揀一條問題。先自己答，再睇你漏掉的因果、風險或可被追問的作品證據。', practice: '練這條問題' },
      'zh-TW': { eyebrow: '面試學習地圖', title: 'AI Engineer Interview Lab', intro: '依可遷移能力準備公開題型：從一個具體決策談到機制、取捨、失敗邊界與可展示證據。', mapTitle: '59 條獨立練習問題，分成 10 條能力路線', mapIntro: '每週選一條問題。先自己回答，再看你漏掉的因果、風險或能被追問的作品證據。', practice: '練這條問題' },
      'zh-Hans': { eyebrow: '面试学习地图', title: 'AI Engineer Interview Lab', intro: '按可迁移能力准备公开题型：从一个具体决策讲到机制、取舍、失败边界和可展示证据。', mapTitle: '59 条独立练习问题，分成 10 条能力路线', mapIntro: '每周选一条问题。先自己回答，再看你漏掉的因果、风险或能被追问的作品证据。', practice: '练这条问题' },
      en: { eyebrow: 'Interview learning map', title: 'AI Engineer Interview Lab', intro: 'Prepare public question patterns by transferable capability: start with a concrete decision, then explain mechanism, trade-offs, failure boundaries and evidence.', mapTitle: 'Fifty-nine standalone practice questions across ten capability routes', mapIntro: 'Choose one question each week. Answer it first, then inspect the causal link, risk, or portfolio evidence you left out.', practice: 'Practise this question' }
    })
  },
  'ai-use-routes': {
    tag: 'ai use routes',
    copy: canonicalLocaleRecord({
      'zh-HK': {
        eyebrow: '用 AI 做實際工作',
        title: '用 AI，不必先變成 AI Engineer',
        intro: '想用 AI 幫手做事，毋須先替自己貼上技術角色標籤。不寫 Code 可以由只出草稿的流程開始；會寫 Code 的人可以逐項檢查 AI 提議的改動。最後決定仍然由人手作出。',
        routesTitle: '今日想先做好哪一件事？',
        routesIntro: '按工作內容揀路。由一件小、低風險、做錯仍可收回的事開始。',
        sharedTitle: '開始前寫下四件事',
        shared: ['邊個會根據這份結果作甚麼決定？', '正常、缺資料和必須停下的情況，預期結果分別係乜？', '這一步要開哪些權限？', '發送、更新、批核同部署由哪位負責的人做？'],
        routes: [
          { tag: '不寫 Code', title: '我不寫 Code，想穩陣地用 AI', description: '把日常整理工作收窄為只出草稿的流程：輸入是甚麼、輸出要有甚麼格式、由誰核對。AI 不會自行採取下一步行動。', steps: ['揀一個小而低風險的決定。', '寫低資料欄位、預期結果和幾個例外。', 'AI 只負責起草、分類或比較；實際行動留畀人。'], action: '想先了解原理，閱讀不寫 Code 路線', slug: 'use-ai-without-writing-code', labAction: '開始 15 分鐘手動檢查（毋須登入）', labHref: '/no-code-starter-lab#no-code-lab-manual-title' },
          { tag: '會寫 Code', title: '我會寫 Code，想同 AI 一齊做', description: '你寫清楚要改乜、怎樣才算完成；AI 只可以提出計劃、差異和測試，人手決定採不採用。', steps: ['寫低功能、非目標和完成條件。', '喺合成或隔離環境跑測試，逐項睇差異。', '留低通過、要修正或停止的決定，同埋退回上一版的方法。'], action: '想先了解原理，閱讀 coding partner 路線', slug: 'use-ai-as-a-coding-partner-with-proof', labAction: '開始 15 分鐘案例判斷（暫不用寫 Code）', labHref: '/coding-starter-lab#coding-starter-lab-quick-title' }
        ]
      },
      'zh-TW': {
        eyebrow: '用 AI 做實際工作',
        title: '用 AI，不必先變成 AI Engineer',
        intro: '想用 AI 幫忙做事，不必先證明自己屬於哪種技術角色。不寫 Code 可以從只出草稿的流程開始；有寫 Code 可以逐項看 AI 建議的改動。最後決定仍然在人手。',
        routesTitle: '今天想先做好哪一件事？',
        routesIntro: '依工作內容選路。從一件小、低風險、做錯仍能收回的事開始。',
        sharedTitle: '開始前寫下四件事',
        shared: ['誰要根據這份結果決定什麼？', '正常、缺資料與不該做的情況，預期結果分別是什麼？', '這一步要開哪些權限？', '發送、更新、核准與部署由哪位負責的人做？'],
        routes: [
          { tag: '不寫 Code', title: '我不寫 Code，但想穩健地使用 AI', description: '把日常整理工作收窄成只出草稿的流程：輸入是什麼、結果要長什麼樣、誰會核對。AI 不會自己做下一步。', steps: ['挑一個小而低風險的決定。', '寫下資料欄位、預期結果與幾個例外。', 'AI 只負責起草、分類或比較；實際行動留給人。'], action: '想先了解原理，閱讀不寫 Code 路線', slug: 'use-ai-without-writing-code', labAction: '開始 15 分鐘手動檢查（不需登入）', labHref: '/no-code-starter-lab#no-code-lab-manual-title' },
          { tag: '有寫 Code', title: '我有寫 Code，想用 AI 一起做', description: '你寫清楚要改什麼和怎樣才算完成；AI 只提方案、差異與測試，人工再決定用不用。', steps: ['寫下功能、非目標與完成條件。', '在合成或隔離環境執行測試，逐項看差異。', '留下通過、要修正或停止的決定，以及退回上一版的方法。'], action: '想先了解原理，閱讀 coding partner 路線', slug: 'use-ai-as-a-coding-partner-with-proof', labAction: '開始 15 分鐘案例判斷（暫不寫 Code）', labHref: '/coding-starter-lab#coding-starter-lab-quick-title' }
        ]
      },
      'zh-Hans': {
        eyebrow: '用 AI 做实际工作',
        title: '用 AI，不必先成为 AI Engineer',
        intro: '想用 AI 帮忙做事，不必先证明自己属于哪种技术角色。不写 Code 可以从只出草稿的流程开始；写 Code 可以逐项看 AI 建议的改动。最后决定仍然在人手。',
        routesTitle: '今天想先做好哪一件事？',
        routesIntro: '按工作内容选路。从一件小、低风险、做错仍能收回的事开始。',
        sharedTitle: '开始前写下四件事',
        shared: ['谁要根据这份结果决定什么？', '正常、缺资料与不该做的情况，预期结果分别是什么？', '这一步要开哪些权限？', '发送、更新、批准与部署由哪位负责的人做？'],
        routes: [
          { tag: '不写 Code', title: '我不写 Code，但想稳妥地使用 AI', description: '把日常整理工作收窄成只出草稿的流程：输入是什么、结果要长什么样、谁会核对。AI 不会自己做下一步。', steps: ['挑一个小而低风险的决定。', '写下数据字段、预期结果与几个例外。', 'AI 只负责起草、分类或比较；实际行动留给人。'], action: '想先了解原理，阅读不写 Code 路线', slug: 'use-ai-without-writing-code', labAction: '开始 15 分钟手动检查（无需登录）', labHref: '/no-code-starter-lab#no-code-lab-manual-title' },
          { tag: '写 Code', title: '我写 Code，想用 AI 一起做', description: '你写清楚要改什么和怎样才算完成；AI 只提方案、差异和测试，人工再决定用不用。', steps: ['写下功能、非目标与完成条件。', '在合成或隔离环境运行测试，逐项看差异。', '留下通过、要修正或停止的决定，以及退回上一版的方法。'], action: '想先了解原理，阅读 coding partner 路线', slug: 'use-ai-as-a-coding-partner-with-proof', labAction: '开始 15 分钟案例判断（暂不写 Code）', labHref: '/coding-starter-lab#coding-starter-lab-quick-title' }
        ]
      },
      en: {
        eyebrow: 'Use AI for real work',
        title: 'Use AI without becoming an AI engineer first',
        intro: 'You can use AI for work without first proving a technical identity. A no-code route starts with a draft-only task; a coding route lets you inspect an AI-suggested change. A person still makes the final call.',
        routesTitle: 'What do you want to make safer today?',
        routesIntro: 'Choose by the work in front of you. Start with something small, low-risk, and recoverable if it goes wrong.',
        sharedTitle: 'Write down four things first',
        shared: ['Who will make which decision from this result?', 'What should happen in a normal case, a missing-data case, and a request that must stop?', 'Which permissions does this step actually need?', 'Who is responsible for sending, updating, approving, or deploying?'],
        routes: [
          { tag: 'No-code route', title: 'I do not write code, but I want to use AI safely', description: 'Make a routine task draft-only: say what comes in, what should come out, and who checks it. AI does not take the next action on its own.', steps: ['Pick one small, low-risk decision.', 'Write the data fields, expected result, and a few exceptions.', 'Keep AI to drafting, classification, or comparison; leave real action to a person.'], action: 'Read the no-code route for context', slug: 'use-ai-without-writing-code', labAction: 'Start the 15-minute manual check (no sign-in)', labHref: '/no-code-starter-lab#no-code-lab-manual-title' },
          { tag: 'Coder route', title: 'I write code and want AI alongside me', description: 'You define the change and what counts as done. The agent proposes a plan, diff, and tests; a person decides whether to use them.', steps: ['Write the feature, non-goal, and done condition.', 'Run tests in a synthetic or isolated environment and inspect each change.', 'Record pass, revise, or stop, plus how to return to the earlier version.'], action: 'Read the coding-partner route for context', slug: 'use-ai-as-a-coding-partner-with-proof', labAction: 'Start the 15-minute case judgment (no code yet)', labHref: '/coding-starter-lab#coding-starter-lab-quick-title' }
        ]
      }
    })
  }
} as const;

type SeriesId = keyof typeof series;

export function generateStaticParams() {
  const selectedSeriesIds = new Set(getReleaseScopedSeries().map(seriesItem => seriesItem.id));
  return LOCALES.flatMap(lang => Object.keys(series)
    .filter(seriesId => selectedSeriesIds.has(seriesId))
    .map(seriesId => ({ lang, series: seriesId })));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; series: string }> }): Promise<Metadata> {
  const { lang: rawLang, series: seriesId } = await params;
  if (!LOCALES.includes(rawLang as Locale) || !(seriesId in series) || !isSeriesEnabledInCurrentBuild(seriesId)) return {};
  const lang = rawLang as Locale;
  const copy = series[seriesId as SeriesId].copy[lang];
  const path = `/${lang}/series/${seriesId}`;
  return {
    title: copy.title,
    description: copy.intro,
    alternates: localizedAlternates(path),
    ...pageSocialMetadata({ title: copy.title, description: copy.intro, path })
  };
}

export default async function SeriesPage({ params, searchParams }: { params: Promise<{ lang: string; series: string }>; searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const { lang: rawLang, series: seriesId } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const phaseParam = Array.isArray(resolvedSearchParams.phase) ? resolvedSearchParams.phase[0] : resolvedSearchParams.phase;
  const routeParam = Array.isArray(resolvedSearchParams.route) ? resolvedSearchParams.route[0] : resolvedSearchParams.route;
  if (
    !LOCALES.includes(rawLang as Locale)
    || !(seriesId in series)
    || !isRouteSurfaceEnabledInCurrentBuild('series')
    || !isSeriesEnabledInCurrentBuild(seriesId)
  ) notFound();
  const lang = rawLang as Locale;
  if (seriesId === 'ai-engineer-interviews') {
    const href = `/${lang}/interview-lab`;
    if (process.env.GITHUB_PAGES === 'true') {
      return <StaticPageRedirect href={href} {...legacyInterviewRedirectCopy[lang]} />;
    }
    redirect(href);
  }
  const definition = series[seriesId as SeriesId];
  const copy = definition.copy[lang];
  const isRoadmap = seriesId === 'ai-engineer-roadmap';
  const roadmap = isRoadmap ? getReleaseScopedRoadmap() : null;
  if (isRoadmap && !roadmap) notFound();
  const allArticles = getArticles();
  const matches = allArticles.filter(article => article.tags.some(tag => tag.toLowerCase() === definition.tag));
  const mapCopy = 'mapTitle' in copy ? copy : undefined;
  const routeCopy = 'routes' in copy ? copy : undefined;
  const routeLearningCopy = seriesId === 'ai-use-routes' ? aiUseRouteCopy[lang] : undefined;
  const labCopy = seriesId === 'ai-engineer-interviews' ? interviewLabCopy[lang] : undefined;
  const roadmapLearningCopy = learningRoutePageCopy[lang];
  const initialLearningRoute = routeParam === 'early' ? 'early' : 'engineer';
  const articlesById = new Map(allArticles.map(article => [article.id, article]));
  return <div className="page shell">
    {isRoadmap ? <><header className="page-header"><p className="eyebrow">{copy.eyebrow}</p><h1>{copy.title}</h1><p>{copy.intro}</p></header><LearningRouteSwitcher
      copy={roadmapLearningCopy}
      initialRoute={initialLearningRoute}
      earlyRoute={<EarlyAiLearningRoute locale={lang} />}
      engineerRoute={<section className="learning-route-engineer" aria-labelledby="learning-route-engineer-title">
        <header className="learning-route-engineer__header roadmap-timeline-header">
          <p className="eyebrow">{roadmapLearningCopy.engineer.eyebrow}</p>
          <h2 id="learning-route-engineer-title">{roadmapLearningCopy.engineer.title}</h2>
          <p>{roadmapLearningCopy.engineer.intro}</p>
          {isRouteSurfaceEnabledInCurrentBuild('interview-lab') ? <div className="hero-actions learning-route-engineer__actions"><Link className="button secondary" href={`/${lang}/interview-lab`}>{roadmapLearningCopy.engineer.interviewAction} <span aria-hidden>→</span></Link></div> : null}
        </header>
        <RoadmapTimeline locale={lang} roadmap={roadmap} showIntro={false} selectedPhaseId={phaseParam} phaseBaseHref={`/${lang}/series/ai-engineer-roadmap`} />
      </section>}
    /></> : <>
      <header className="page-header"><p className="eyebrow">{copy.eyebrow}</p><h1>{copy.title}</h1><p>{copy.intro}</p>{labCopy && <p className="series-lab-action"><Link className="button secondary" href={`/${lang}/interview-lab`}>{labCopy.navigatorAction}</Link></p>}</header>
      {routeLearningCopy && <FragmentAnchorScroll />}
      {mapCopy && <section className="topic-map" aria-labelledby="topic-map-title"><div><p className="eyebrow">STUDY SEQUENCE</p><h2 id="topic-map-title">{mapCopy.mapTitle}</h2><p>{mapCopy.mapIntro}</p></div><ol>{interviewTopics.map(topic => <li key={topic.anchor}><Link href={interviewPracticePath(lang, topic)}><span>{topic.number}</span><strong>{topic.title[lang]}</strong><small>{mapCopy.practice} →</small></Link></li>)}</ol></section>}
      {routeCopy && routeLearningCopy && <section className="route-map" aria-labelledby="route-map-title"><div className="route-map-intro"><p className="eyebrow">{routeLearningCopy.tracksEyebrow}</p><h2 id="route-map-title">{routeCopy.routesTitle}</h2><p>{routeCopy.routesIntro}</p><h3>{routeCopy.sharedTitle}</h3><ul>{routeCopy.shared.map(item => <li key={item}>{item}</li>)}</ul></div><div className="route-cards">{routeCopy.routes.map((route, index) => <article className="route-card" key={route.slug}><span>0{index + 1} · {route.tag}</span><h3>{route.title}</h3><p>{route.description}</p><ol>{route.steps.map(step => <li key={step}>{step}</li>)}</ol><div className="route-card-actions"><Link className="button primary" href={`/${lang}${route.labHref}`}>{route.labAction} <span aria-hidden>→</span></Link><Link className="text-link" href={`/${lang}/articles/${route.slug}`}>{route.action} <span aria-hidden>→</span></Link></div></article>)}</div></section>}
      {routeLearningCopy && <section className="route-curriculum" aria-labelledby="route-curriculum-title">
        <header className="route-curriculum-header"><p className="eyebrow">{routeLearningCopy.eyebrow}</p><h2 id="route-curriculum-title">{routeLearningCopy.title}</h2><p>{routeLearningCopy.intro}</p></header>
        <div className="route-curriculum-grid">{aiUseTracks.map(track => <section id={`track-${track.id}`} className={`route-track route-track-${track.id}`} key={track.id} aria-labelledby={`track-${track.id}-title`} tabIndex={-1}>
          <div className="route-track-header"><p className="eyebrow">{track.eyebrow[lang]}</p><h3 id={`track-${track.id}-title`}>{track.title[lang]}</h3><p>{track.intro[lang]}</p></div>
          {track.starterLab && <aside className="route-track-lab"><h4>{track.starterLab.title[lang]}</h4><p>{track.starterLab.description[lang]}</p><Link className="text-link" href={`/${lang}${track.starterLab.href}`}>{track.starterLab.action[lang]} <span aria-hidden>→</span></Link></aside>}
          <ol>{track.steps.map((step, index) => {
            const article = articlesById.get(step.articleId);
            if (!article) return null;
            return <li key={step.articleId}><span>{String(index + 1).padStart(2, '0')}</span><div><p>{routeLearningCopy.step} {index + 1}</p><Link href={`/${lang}/articles/${article.slug}`}>{article.translations[lang].title} <span aria-hidden>→</span></Link><small>{step.purpose[lang]}</small></div></li>;
          })}</ol>
          <Link className="text-link" href={track.categoryHref[lang]}>{track.categoryLabel[lang]} <span aria-hidden>→</span></Link>
        </section>)}</div>
        <aside className="route-crossover"><p className="eyebrow">{routeLearningCopy.crossOverTitle}</p><p>{routeLearningCopy.crossOver}</p></aside>
      </section>}
      <section className="article-grid series-articles" aria-label={copy.title}>{matches.map(article => <ArticleCard key={article.id} article={article} locale={lang} />)}</section>
    </>}
    <SupportNudge locale={lang} />
  </div>;
}
