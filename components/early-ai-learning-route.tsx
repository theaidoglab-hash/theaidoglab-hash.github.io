import Link from 'next/link';
import { isRouteSurfaceEnabledInCurrentBuild } from '@/lib/release-server-scope';
import type { Locale } from '@/lib/types';
import { canonicalLocaleRecord } from '@/lib/types';

type EarlyRouteStep = {
  title: string;
  text: string;
  action: string;
  href: string;
  routeSurface: string;
};

type EarlyAiLearningRouteCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  steps: EarlyRouteStep[];
  boundary: string;
};

const earlyAiLearningRouteCopy: Record<Locale, EarlyAiLearningRouteCopy> = canonicalLocaleRecord({
  'zh-HK': {
    eyebrow: 'AI 起步',
    title: '由零開始嘅 AI 學習路線',
    intro: '唔使立即揀一件工作或 project，亦唔使先學寫 Code。先隨意睇下 AI 可以幫到乜、邊啲位仍要由人決定；準備好先由一件小而低風險嘅工作開始。',
    steps: [
      { title: '先睇下 AI 可以點樣幫手', text: '由草稿、分類或比較等情境開始認識；此刻毋須揀一件任務，亦毋須開帳戶。', action: '看看 AI 工作路線', href: '/series/ai-use-routes#track-non-coder', routeSurface: 'series' },
      { title: '想動手時，再試第一個離線練習', text: '準備好後，先用虛構資料做一次手動檢查，睇清流程、例外情況同要交返畀人處理嘅位。', action: '開始不寫 Code 練習', href: '/no-code-starter-lab#no-code-lab-manual-title', routeSurface: 'no-code-starter-lab' },
      { title: '準備好時，再整理下一步', text: '當你開始有興趣嘅方向，先講清楚自己仲未能展示邊項能力，再比較下一個學習來源。', action: '整理學習下一步', href: '/learning-evidence-planner', routeSurface: 'learning-evidence-planner' }
    ],
    boundary: '呢條路線讓你先探索安全使用 AI 嘅基本概念，唔等於 AI Engineer 技術訓練；想寫 Code、建構或部署 AI 系統時，可以切換到 AI Engineer 路線。'
  },
  'zh-TW': {
    eyebrow: 'AI 起步',
    title: '由零開始的 AI 學習路線',
    intro: '不必立刻選一件工作或 project，也不必先學寫 Code。先隨意看看 AI 可以幫上什麼、哪些地方仍由人決定；準備好時才從一件小而低風險的工作開始。',
    steps: [
      { title: '先看看 AI 可以怎樣幫忙', text: '從草稿、分類或比較等情境開始認識；現在不必選一件任務，也不必建立帳戶。', action: '看看 AI 工作路線', href: '/series/ai-use-routes#track-non-coder', routeSurface: 'series' },
      { title: '想動手時，再試第一個離線練習', text: '準備好後，再用虛構資料做一次手動檢查，看清流程、例外情況與必須交回人處理的位置。', action: '開始不寫 Code 練習', href: '/no-code-starter-lab#no-code-lab-manual-title', routeSurface: 'no-code-starter-lab' },
      { title: '準備好時，再整理下一步', text: '當你開始對某個方向感興趣，再說清楚自己還不能展示哪項能力，並比較下一個學習來源。', action: '整理學習下一步', href: '/learning-evidence-planner', routeSurface: 'learning-evidence-planner' }
    ],
    boundary: '這條路線讓你先探索安全使用 AI 的基本概念，不等於 AI Engineer 技術訓練；想寫 Code、建構或部署 AI 系統時，可以切換到 AI Engineer 路線。'
  },
  'zh-Hans': {
    eyebrow: 'AI 起步',
    title: '从零开始的 AI 学习路线',
    intro: '不必立刻选择一件工作或 project，也不必先学写 Code。先随意看看 AI 可以帮上什么、哪些地方仍由人决定；准备好时才从一件小而低风险的工作开始。',
    steps: [
      { title: '先看看 AI 可以怎样帮忙', text: '从草稿、分类或比较等情境开始认识；现在不必选择一件任务，也不必建立账户。', action: '看看 AI 工作路线', href: '/series/ai-use-routes#track-non-coder', routeSurface: 'series' },
      { title: '想动手时，再试第一个离线练习', text: '准备好后，再用虚构数据做一次手动检查，看清流程、例外情况与必须交回人处理的位置。', action: '开始不写 Code 练习', href: '/no-code-starter-lab#no-code-lab-manual-title', routeSurface: 'no-code-starter-lab' },
      { title: '准备好时，再整理下一步', text: '当你开始对某个方向感兴趣，再说清楚自己还不能展示哪项能力，并比较下一个学习来源。', action: '整理学习下一步', href: '/learning-evidence-planner', routeSurface: 'learning-evidence-planner' }
    ],
    boundary: '这条路线让你先探索安全使用 AI 的基本概念，不等于 AI Engineer 技术训练；想写 Code、构建或部署 AI 系统时，可以切换到 AI Engineer 路线。'
  },
  en: {
    eyebrow: 'AI foundations',
    title: 'A zero-to-one AI learning route',
    intro: 'You do not need to choose a task or project yet, and you do not need to learn to code first. Look around at what AI can help with and where people still decide; when you are ready, start with one small, low-risk task.',
    steps: [
      { title: 'See how AI can help', text: 'Start by looking at drafting, classification, or comparison scenarios. You do not need to pick a task or create an account yet.', action: 'Browse AI work routes', href: '/series/ai-use-routes#track-non-coder', routeSurface: 'series' },
      { title: 'Try a first offline exercise when you are ready', text: 'When it feels useful, use fictional data for one manual check so you can see the flow, exceptions, and points that go back to a person.', action: 'Start the no-code exercise', href: '/no-code-starter-lab#no-code-lab-manual-title', routeSurface: 'no-code-starter-lab' },
      { title: 'Choose a next step when it becomes useful', text: 'Once a direction interests you, name the capability you still cannot show and compare the next learning source.', action: 'Plan the next learning step', href: '/learning-evidence-planner', routeSurface: 'learning-evidence-planner' }
    ],
    boundary: 'This route lets you explore the basics of using AI safely. It is not AI Engineer training; switch to the AI Engineer route when you want to write code, build, or deploy AI systems.'
  }
});

export function EarlyAiLearningRoute({ locale }: { locale: Locale }) {
  const copy = earlyAiLearningRouteCopy[locale];

  return <section className="early-ai-route" aria-labelledby="early-ai-route-title">
    <header className="roadmap-timeline-header">
      <p className="eyebrow">{copy.eyebrow}</p>
      <h2 id="early-ai-route-title">{copy.title}</h2>
      <p>{copy.intro}</p>
    </header>
    <ol className="early-ai-route__steps">
      {copy.steps.map((step, index) => <li key={step.href}>
        <span className="early-ai-route__number">{String(index + 1).padStart(2, '0')}</span>
        <h3>{step.title}</h3>
        <p>{step.text}</p>
        {isRouteSurfaceEnabledInCurrentBuild(step.routeSurface) ? <Link className="text-link" href={`/${locale}${step.href}`}>{step.action} <span aria-hidden>→</span></Link> : null}
      </li>)}
    </ol>
    <p className="early-ai-route__boundary">{copy.boundary}</p>
  </section>;
}
