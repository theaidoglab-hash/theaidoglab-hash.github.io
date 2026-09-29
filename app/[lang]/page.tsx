import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LearnerStartDiagnostic, type LearnerStartRoutes } from '@/components/learner-start-diagnostic';
import { RoadmapPreview } from '@/components/roadmap-timeline';
import { TechnicalConceptPath } from '@/components/technical-concept-path';
import { isLocale, localeStaticParams, ui } from '@/lib/i18n';
import { learnerStartDiagnosticCopy } from '@/lib/learner-start-diagnostic-copy';
import { getReleaseScopedInterviewTopics, getReleaseScopedRoadmap } from '@/lib/release-learning-content';
import type { Locale } from '@/lib/types';
import { localizedAlternates, pageSocialMetadata } from '@/lib/site-metadata';
import { getBuyMeACoffeeSupportUrl } from '@/lib/support';
import { isRouteSurfaceEnabledInCurrentBuild, isScopedReleaseBuild, isSeriesEnabledInCurrentBuild } from '@/lib/release-server-scope';

type LandingHeroCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  primaryAction: string;
  secondaryAction: string;
  technicalAction: string;
  boundary: string;
};

type LandingSectionCopy = {
  routesEyebrow: string;
  routesTitle: string;
  routesIntro: string;
  routes: readonly { id: 'interview' | 'portfolio' | 'workflow' | 'roadmap'; title: string; text: string; action: string; surface: string; href: string }[];
  aboutEyebrow: string;
  aboutTitle: string;
  aboutText: string;
  supportEyebrow: string;
  supportTitle: string;
  supportText: string;
  supportAction: string;
  supportPendingAction: string;
};

const traditionalHeroCopy: LandingHeroCopy = {
    eyebrow: '學 AI，建立自己的下一步',
    title: '由零開始的 AI 學習',
    intro: '無論你有沒有開發背景，都可以在這裡由零開始學 AI：非開發者學會把 AI 用在日常工作；開發者透過實作與作品，逐步走向 AI Engineer。',
    primaryAction: '找我的 AI 起點',
    secondaryAction: '查看四條主要路線',
    technicalAction: '解釋 LLM／部署概念',
    boundary: '提供自學材料、練習與檢查框架；不保證掌握技能、轉職、面試或工作結果。',
};

const landingSectionCopy: Record<Locale, LandingSectionCopy> = {
  'zh-Hant': {
    routesEyebrow: '從這裡開始',
    routesTitle: '你想先做什麼？',
    routesIntro: '選最接近你現況的一條；不必一次做完，也可以隨時換路。',
    routes: [
      { id: 'interview', title: '練 AI Engineer 面試', text: '由一條題目開始，練習把你的想法說清楚。', action: '開始練習', surface: 'interview-lab', href: '/interview-lab' },
      { id: 'portfolio', title: '整理作品集', text: '把 demo 整理成你可以展示和解釋的作品。', action: '整理我的作品', surface: 'portfolio-evidence-planner', href: '/portfolio-evidence-planner' },
      { id: 'workflow', title: '用 AI 做日常工作', text: '由一件小工作開始，學習使用和檢查 AI。', action: '選一條路', surface: 'series', href: '/series/ai-use-routes' },
      { id: 'roadmap', title: '走向 AI Engineer', text: '按學習地圖，一步步建立實作能力。', action: '查看學習地圖', surface: 'series', href: '/series/ai-engineer-roadmap' }
    ],
    aboutEyebrow: '關於 AI.DOG',
    aboutTitle: '一個給所有人開始學 AI 的地方',
    aboutText: 'AI.DOG 把 AI 學習拆成可以開始的小步驟：不寫 Code 的人先用好 AI；開發者再逐步建立 AI Engineer 的實作能力。',
    supportEyebrow: '支持 AI.DOG',
    supportTitle: '覺得有用？請 AI.DOG 喝杯咖啡',
    supportText: '你的自選支持會用於整理、校對和維護免費指南與練習。',
    supportAction: '在 Buy Me a Coffee 支持 AI.DOG',
    supportPendingAction: '了解如何支持 AI.DOG'
  },
  'zh-Hans': {
    routesEyebrow: '从这里开始',
    routesTitle: '你想先做什么？',
    routesIntro: '选最接近你目前情况的一条；不必一次做完，也可以随时换路线。',
    routes: [
      { id: 'interview', title: '练 AI Engineer 面试', text: '从一道题开始，练习把你的想法说清楚。', action: '开始练习', surface: 'interview-lab', href: '/interview-lab' },
      { id: 'portfolio', title: '整理作品集', text: '把 demo 整理成你可以展示和解释的作品。', action: '整理我的作品', surface: 'portfolio-evidence-planner', href: '/portfolio-evidence-planner' },
      { id: 'workflow', title: '用 AI 做日常工作', text: '从一件小工作开始，学习使用和检查 AI。', action: '选一条路线', surface: 'series', href: '/series/ai-use-routes' },
      { id: 'roadmap', title: '走向 AI Engineer', text: '按学习地图，一步步建立实作能力。', action: '查看学习地图', surface: 'series', href: '/series/ai-engineer-roadmap' }
    ],
    aboutEyebrow: '关于 AI.DOG',
    aboutTitle: '一个让所有人开始学习 AI 的地方',
    aboutText: 'AI.DOG 把 AI 学习拆成可以开始的小步骤：不写代码的人先用好 AI；开发者再逐步建立 AI Engineer 的实作能力。',
    supportEyebrow: '支持 AI.DOG',
    supportTitle: '觉得有用？请 AI.DOG 喝杯咖啡',
    supportText: '你的自选支持会用于整理、校对和维护免费指南与练习。',
    supportAction: '在 Buy Me a Coffee 支持 AI.DOG',
    supportPendingAction: '了解如何支持 AI.DOG'
  },
  en: {
    routesEyebrow: 'START HERE',
    routesTitle: 'What would you like to do first?',
    routesIntro: 'Choose the route closest to where you are. You do not need to finish everything, and you can switch routes at any time.',
    routes: [
      { id: 'interview', title: 'Practise AI Engineer interviews', text: 'Start with one question and practise explaining your thinking clearly.', action: 'Start practising', surface: 'interview-lab', href: '/interview-lab' },
      { id: 'portfolio', title: 'Shape your portfolio', text: 'Turn a demo into work you can show and explain.', action: 'Shape my portfolio', surface: 'portfolio-evidence-planner', href: '/portfolio-evidence-planner' },
      { id: 'workflow', title: 'Use AI in everyday work', text: 'Start with one small task and learn to use and check AI.', action: 'Choose a route', surface: 'series', href: '/series/ai-use-routes' },
      { id: 'roadmap', title: 'Build toward becoming an AI engineer', text: 'Use the learning map to build hands-on skills step by step.', action: 'View the learning map', surface: 'series', href: '/series/ai-engineer-roadmap' }
    ],
    aboutEyebrow: 'ABOUT AI.DOG',
    aboutTitle: 'A place for anyone to start learning AI',
    aboutText: 'AI.DOG turns AI learning into small steps you can begin: people who do not code can first use AI well, while developers can build hands-on AI Engineer skills over time.',
    supportEyebrow: 'SUPPORT AI.DOG',
    supportTitle: 'Found this useful? Buy AI.DOG a coffee',
    supportText: 'Optional support helps maintain the free guides and exercises.',
    supportAction: 'Support AI.DOG on Buy Me a Coffee',
    supportPendingAction: 'Learn how to support AI.DOG'
  }
};

const landingHeroCopy: Record<Locale, LandingHeroCopy> = {
  'zh-Hant': traditionalHeroCopy,
  'zh-Hans': {
    eyebrow: '学习 AI，建立自己的下一步',
    title: '从零开始的 AI 学习',
    intro: '无论你有没有开发背景，都可以在这里从零开始学 AI：非开发者学会把 AI 用在日常工作；开发者通过实作与作品，逐步走向 AI Engineer。',
    primaryAction: '找我的 AI 起点',
    secondaryAction: '查看四条主要路线',
    technicalAction: '理解 LLM／部署概念',
    boundary: '提供自学材料、练习与检查框架；不保证掌握技能、转职、面试或工作结果。',
  },
  en: {
    eyebrow: 'Learn AI and build your next step',
    title: 'Learn AI from zero',
    intro: 'Whether or not you have a development background, you can start learning AI here: non-developers learn to apply AI in everyday work, while developers build toward becoming AI engineers through hands-on practice and portfolio work.',
    primaryAction: 'Find my AI starting point',
    secondaryAction: 'Browse the four main routes',
    technicalAction: 'Explore LLM systems',
    boundary: 'This site provides self-guided material, exercises, and checking frameworks. It does not guarantee skills, a career change, interview success, or employment outcomes.',
  }
};

export function generateStaticParams() { return localeStaticParams(); }
export async function generateMetadata({params}:{params:Promise<{lang:string}>}):Promise<Metadata>{const {lang}=await params;if(!isLocale(lang))return{};const title=ui[lang].brand as string;const description=ui[lang].intro as string;const path=`/${lang}`;return{title,description,alternates:localizedAlternates(path),...pageSocialMetadata({title,description,path})};}
export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang) || !isRouteSurfaceEnabledInCurrentBuild('home')) notFound();

  const noCodeEnabled = isRouteSurfaceEnabledInCurrentBuild('no-code-starter-lab');
  const codingEnabled = isRouteSurfaceEnabledInCurrentBuild('coding-starter-lab');
  const roadmapEnabled = isSeriesEnabledInCurrentBuild('ai-engineer-roadmap');
  const workflowSeriesEnabled = isSeriesEnabledInCurrentBuild('ai-use-routes');
  const labsEnabled = isRouteSurfaceEnabledInCurrentBuild('labs');
  const portfolioEnabled = isRouteSurfaceEnabledInCurrentBuild('portfolio-evidence-planner');
  const interviewEnabled = isRouteSurfaceEnabledInCurrentBuild('interview-lab');
  const resourcesEnabled = isRouteSurfaceEnabledInCurrentBuild('resources');
  const technicalConceptsEnabled = isRouteSurfaceEnabledInCurrentBuild('article-downloads');
  const supportEnabled = isRouteSurfaceEnabledInCurrentBuild('support');
  const scopedRelease = isScopedReleaseBuild();
  const roadmap = scopedRelease ? getReleaseScopedRoadmap() : null;
  const firstInterviewTopic = interviewEnabled ? getReleaseScopedInterviewTopics()[0] : undefined;
  const roadmapHref = roadmapEnabled ? `/${lang}/series/ai-engineer-roadmap` : '';
  const hero = landingHeroCopy[lang];
  const section = landingSectionCopy[lang];
  const supportUrl = supportEnabled ? getBuyMeACoffeeSupportUrl() : undefined;
  const learnerStartRoutes: LearnerStartRoutes = {
    ...(roadmapEnabled ? { early: `/${lang}/series/ai-engineer-roadmap?route=early#learning-route-panel-early` } : {}),
    ...(noCodeEnabled ? { noCode: {
      href: `/${lang}/no-code-starter-lab#no-code-lab-setup-title`,
      quickHref: `/${lang}/no-code-starter-lab#no-code-lab-manual-title`
    } } : {}),
    ...(codingEnabled ? { coding: {
      href: `/${lang}/coding-starter-lab`,
      quickHref: `/${lang}/coding-starter-lab#coding-starter-lab-quick-title`
    } } : {}),
    ...(labsEnabled ? { labs: `/${lang}/labs?case=coding-starter#lab-case-selector-title` } : {}),
    ...(roadmapHref ? { roadmap: roadmapHref } : {}),
    ...(resourcesEnabled ? { resources: `/${lang}/resources` } : {}),
    ...(technicalConceptsEnabled ? { technical: {
      href: `/${lang}#technical-concepts`,
      quickHref: `/${lang}/articles/inference-memory-scheduling-and-serving-engines#inference-request-path-lab-title`
    } } : {}),
    ...(portfolioEnabled ? { portfolio: {
      href: `/${lang}/portfolio-evidence-planner`,
      quickHref: `/${lang}/portfolio-evidence-planner#portfolio-quick-start`
    } } : {}),
    ...(interviewEnabled ? { interview: {
      href: `/${lang}/interview-lab`,
      quickHref: firstInterviewTopic ? `/${lang}/interview-lab/${firstInterviewTopic.slug}` : `/${lang}/interview-lab`
    } } : {})
  };
  const hasLearnerStart = Object.keys(learnerStartRoutes).length > 0;
  const heroActions = [
    hasLearnerStart ? { href: '#learner-start', label: hero.primaryAction, primary: true } : null,
    { href: '#start-here', label: hero.secondaryAction, primary: false },
    technicalConceptsEnabled ? { href: '#technical-concepts', label: hero.technicalAction, primary: false } : null,
  ].filter((action): action is { href: string; label: string; primary: boolean } => action !== null);

  return <>
    <section className="hero hero--simple shell">
      <div className="hero-copy">
        <p className="eyebrow">{hero.eyebrow}</p>
        <h1>{hero.title}</h1>
        <p className="hero-intro">{hero.intro}</p>
        {heroActions.length ? <div className="hero-actions">{heroActions.map(action => <Link className={`button ${action.primary ? 'primary' : 'secondary'}`} href={action.href} key={action.href}>{action.label}</Link>)}</div> : null}
        <p className="hero-boundary">{hero.boundary}</p>
      </div>
    </section>
    {hasLearnerStart ? <LearnerStartDiagnostic locale={lang} copy={learnerStartDiagnosticCopy[lang]} routes={learnerStartRoutes} /> : null}
    <section id="start-here" className="landing-routes shell section" aria-labelledby="landing-routes-title">
      <header className="landing-routes-header">
        <p className="eyebrow">{section.routesEyebrow}</p>
        <h2 id="landing-routes-title">{section.routesTitle}</h2>
        <p>{section.routesIntro}</p>
      </header>
      <div className="intent-grid">
        {section.routes.filter(route => route.id === 'roadmap'
          ? Boolean(roadmapHref)
          : route.id === 'workflow'
            ? workflowSeriesEnabled
            : isRouteSurfaceEnabledInCurrentBuild(route.surface)).map(route => <article className="intent-card" key={route.id}>
          <h3>{route.title}</h3>
          <p>{route.text}</p>
          <Link className="text-link" href={route.id === 'roadmap' && roadmapHref ? roadmapHref : `/${lang}${route.href}`}>{route.action} <span aria-hidden>→</span></Link>
        </article>)}
      </div>
    </section>
    {technicalConceptsEnabled ? <TechnicalConceptPath locale={lang} /> : null}
    <section className="landing-about-support shell section" aria-label={section.aboutEyebrow}>
      <div className="landing-about">
        <p className="eyebrow">{section.aboutEyebrow}</p>
        <h2>{section.aboutTitle}</h2>
        <p>{section.aboutText}</p>
      </div>
      <aside className="landing-support" aria-labelledby="landing-support-title">
        <p className="eyebrow">{section.supportEyebrow}</p>
        <h2 id="landing-support-title">{section.supportTitle}</h2>
        <p>{section.supportText}</p>
        {supportUrl ? <a className="button primary" href={supportUrl} target="_blank" rel="noreferrer" aria-label={`${section.supportAction}. ${lang === 'en' ? 'Opens in a new tab' : '會在新分頁開啟'}`}>{section.supportAction} <span aria-hidden>↗</span></a> : <Link className="button secondary" href={`/${lang}/support`}>{section.supportPendingAction} <span aria-hidden>→</span></Link>}
      </aside>
    </section>
    {roadmap ? <section id="roadmap-stage-00" className="shell section" aria-label={section.routesTitle} tabIndex={-1}><RoadmapPreview locale={lang} roadmap={roadmap} actionHref={roadmapHref} /></section> : null}
  </>;
}
