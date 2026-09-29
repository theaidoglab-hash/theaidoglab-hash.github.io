import Link from 'next/link';
import { FragmentAnchorScroll } from '@/components/fragment-anchor-scroll';
import { RoadmapProgressTracker, RoadmapStageProgressControl } from '@/components/roadmap-progress';
import { getArticle } from '@/lib/content';
import {
  getInterviewTopic,
  interviewTopics,
  type InterviewTopic,
} from '@/lib/interview-lab';
import {
  getInterviewPracticeAfterDemoPathsForTrack,
  interviewPracticeAfterDemoPathAnchor,
} from '@/lib/interview-practice-paths';
import { aiEngineerInterviewPrep, aiEngineerRoadmap, roadmapResourcePath, type AiEngineerInterviewPrep, type AiEngineerRoadmap, type InterviewPrepTrack, type RoadmapLearningGuide, type RoadmapResource, type RoadmapSourceNote, type RoadmapStage, type RoadmapStatus } from '@/lib/roadmaps';
import type { Locale } from '@/lib/types';
import { canonicalLocaleRecord } from '@/lib/types';

const statusCopy: Record<Locale, Record<RoadmapStatus, string>> = canonicalLocaleRecord({
  'zh-HK': { available: '可以開始', partial: '要再補一段', planned: '未有導讀' },
  'zh-TW': { available: '可以開始', partial: '還要補一段', planned: '尚未提供導讀' },
  'zh-Hans': { available: '可以开始', partial: '还要补一段', planned: '尚未提供导读' },
  en: { available: 'Ready to work through', partial: 'Needs another guide', planned: 'Guide not published' }
});

const lessonContractCopy = canonicalLocaleRecord({
  'zh-HK': {
    guidedStatus: '導讀＋自行核對', runnableStatus: '有本機練習', contract: '今站學習合約', effort: '預計時間', minutes: (minimum: number, maximum: number) => `${minimum}–${maximum} 分鐘`, estimateBoundary: '只係規劃估算，唔係速度要求。', prerequisite: '開始前', foundation: '唔需要完成前一站；帶住一個低風險、可以收回嘅問題入場。', diagnostic: '可以當診斷入口；如果做唔出「完成後留低」嗰份紀錄，就返前面相關站點補底。', previous: '先帶齊上一站嘅最小紀錄：', practice: '今站要做', guidedPractice: '先讀首要導讀，寫出今站 artefact，再用一條連結題目或反例自行核對。呢站未有可執行練習包，完成只屬自我檢查。', runnablePractice: '先讀首要導讀，再用連結嘅本機固定測試資料完成練習；記低結果、失敗情況同下一個人手覆核。', completion: '今站完成條件', stopOrReturn: '停低或返回條件'
  },
  'zh-TW': {
    guidedStatus: '導讀＋自行核對', runnableStatus: '有本機練習', contract: '本站學習合約', effort: '預計時間', minutes: (minimum: number, maximum: number) => `${minimum}–${maximum} 分鐘`, estimateBoundary: '僅為規劃估算，不是速度要求。', prerequisite: '開始前', foundation: '不需要完成前一站；帶著一個低風險、可逆的問題開始。', diagnostic: '可把這裡當成診斷入口；若做不出「完成後應有」的紀錄，就回到前面相關站點補足。', previous: '先帶齊上一站的最小紀錄：', practice: '本站任務', guidedPractice: '先讀首要導讀，寫出本站 artefact，再用一題連結問題或反例自行核對。本站尚未提供可執行練習包，完成只代表自我檢查。', runnablePractice: '先讀首要導讀，再用連結的本機固定測試資料完成練習；記下結果、失敗情況與下一個人工覆核。', completion: '本站完成條件', stopOrReturn: '停止或返回條件'
  },
  'zh-Hans': {
    guidedStatus: '导读＋自行核对', runnableStatus: '有本地练习', contract: '本站学习合约', effort: '预计时间', minutes: (minimum: number, maximum: number) => `${minimum}–${maximum} 分钟`, estimateBoundary: '仅为规划估算，不是速度要求。', prerequisite: '开始前', foundation: '不需要完成前一站；带着一个低风险、可逆的问题开始。', diagnostic: '可把这里当成诊断入口；若做不出“完成后应有”的记录，就回到前面相关站点补足。', previous: '先带齐上一站的最小记录：', practice: '本站任务', guidedPractice: '先读首要导读，写出本站 artefact，再用一道链接问题或反例自行核对。本站尚未提供可执行练习包，完成只代表自我检查。', runnablePractice: '先读首要导读，再用链接的本地固定测试数据完成练习；记下结果、失败情况和下一个人工复核。', completion: '本站完成条件', stopOrReturn: '停止或返回条件'
  },
  en: {
    guidedStatus: 'Guide + self-check', runnableStatus: 'Local practice included', contract: 'Lesson contract', effort: 'Estimated effort', minutes: (minimum: number, maximum: number) => `${minimum}–${maximum} minutes`, estimateBoundary: 'A planning estimate, not a speed requirement.', prerequisite: 'Before you start', foundation: 'No previous stage is required. Bring one low-risk, reversible problem.', diagnostic: 'You can use this as a diagnostic entry point. If you cannot produce the “Leave with” record, return to the relevant earlier stage.', previous: 'Bring the minimum record from the previous stage:', practice: 'Your task', guidedPractice: 'Read the primary guide, draft this stage’s artefact, then self-check it with one linked question or counterexample. This stage has no runnable practice pack, so completion is a self-check only.', runnablePractice: 'Read the primary guide, then complete the linked local exercise with fixed fixture data. Record the result, a failure case, and the next human review.', completion: 'Stage completion criteria', stopOrReturn: 'Stop or return when'
  }
});

const stageNumberCopy: Record<Locale, (number: string) => string> = canonicalLocaleRecord({
  'zh-HK': number => `第 ${number} 站：`,
  'zh-TW': number => `第 ${number} 站：`,
  'zh-Hans': number => `第 ${number} 站：`,
  en: number => `Stage ${number}: `
});

const phaseDisclosureCopy: Record<Locale, (count: number) => string> = canonicalLocaleRecord({
  'zh-HK': count => `打開呢一段嘅 ${count} 個學習站`,
  'zh-TW': count => `展開這一段的 ${count} 個學習站`,
  'zh-Hans': count => `展开这一段的 ${count} 个学习站`,
  en: count => `Open this phase’s ${count} learning stages`,
});

const roadmapCopy: Record<Locale, {
  title: string;
  intro: string;
  focus: string;
  evidence: string;
  checkpoint: string;
  gap: string;
  resource: string;
  primaryAction: string;
  optionalResources: string;
  source: string;
}> = canonicalLocaleRecord({
  'zh-HK': {
    title: 'AI Engineer roadmap：由概念到一份講得清嘅紀錄',
    intro: '每站處理一個具體問題，留下一張卡、一次測試或一份決定紀錄；佢哋係學習證據，唔代表已經有正式上線成果。完成一站，再按你講唔講得清下一個決定繼續。',
    focus: '今站會用到', evidence: '完成後留低', checkpoint: '做完呢一段', gap: '未講得清，先返呢度補', resource: '由呢一份開始', primaryAction: '先開呢一項', optionalResources: '要加深先再睇', source: '點樣跟呢條路做'
  },
  'zh-TW': {
    title: 'AI Engineer roadmap：從概念走到可展示證據',
    intro: '由第一站開始。每站會交代為何要學、要看懂什麼，以及完成後應留下甚麼成果，例如 README、測試或決策紀錄。做完再決定是否前進。',
    focus: '這站要掌握', evidence: '完成後應有', checkpoint: '這一段完成時', gap: '前進前先補回', resource: '先從這一份開始', primaryAction: '先開這一項', optionalResources: '想再深入再看', source: '怎麼使用這條路'
  },
  'zh-Hans': {
    title: 'AI Engineer roadmap：从概念走到可展示证据',
    intro: '从第一站开始。每站会交代为什么要学、要看懂什么，以及完成后应留下什么成果，例如 README、测试或决策记录。做完再决定是否前进。',
    focus: '这一站要掌握', evidence: '完成后应有', checkpoint: '这一段完成时', gap: '前进前先补回', resource: '先从这一份开始', primaryAction: '先打开这一项', optionalResources: '想再深入再看', source: '怎样使用这条路'
  },
  en: {
    title: 'AI Engineer roadmap: from concepts to evidence you can show',
    intro: 'Start at the first stop. Each one explains why it matters, what to understand, and what to keep when you finish, such as a README, test, or decision record. Then decide whether to move on.',
    focus: 'Focus here', evidence: 'Leave with', checkpoint: 'When this phase is complete', gap: 'Revisit before moving on', resource: 'Start with this first', primaryAction: 'Open this first', optionalResources: 'Optional deeper reading', source: 'How to use this route'
  }
});

const interviewCopy: Record<Locale, {
  title: string;
  intro: string;
  evidence: string;
  resource: string;
  primaryAction: string;
  optionalResources: string;
  source: string;
}> = canonicalLocaleRecord({
  'zh-HK': {
    title: '揀一項能力，再練一條問題',
    intro: '想補邊項能力，就由相應範圍揀一題開始。每個範圍都有相關導讀；答題時卡住，再返去補原理、取捨或失敗情況。',
    evidence: '你要帶住嘅證據', resource: '先由呢一份開始', primaryAction: '先開呢一項', optionalResources: '想加深先再睇', source: '點樣用呢張地圖'
  },
  'zh-TW': {
    title: '選一項能力，再練一條問題',
    intro: '想補哪項能力，就從相應範圍選一題開始。每個範圍都有相關導讀；回答時卡住，再回去補原理、取捨或失敗情況。',
    evidence: '你要帶著的證據', resource: '先從這一份開始', primaryAction: '先開這一項', optionalResources: '想再深入再看', source: '怎麼使用這張地圖'
  },
  'zh-Hans': {
    title: '选一项能力，再练一道题',
    intro: '想补哪项能力，就从相应范围选一道题开始。每个范围都有相关导读；答题时卡住，再回去补原理、取舍或失败情况。',
    evidence: '你要带着的证据', resource: '先从这一份开始', primaryAction: '先打开这一项', optionalResources: '想再深入再看', source: '怎样使用这张地图'
  },
  en: {
    title: 'Choose a capability, then practise one question',
    intro: 'These 14 areas help you move from a target capability to one question. Each links to the closest AI.DOG guide; choose one area, then start with one standalone question.',
    evidence: 'Evidence to bring', resource: 'Start with this first', primaryAction: 'Open this first', optionalResources: 'Optional deeper reading', source: 'How to use this map'
  }
});

const interviewPrepDisclosureCopy: Record<Locale, { summary: string; hint: string }> = canonicalLocaleRecord({
  'zh-HK': {
    summary: '需要時再打開 14 個準備範圍',
    hint: '能力路線同逐題練習留喺上面；答唔到其中一條時，再返嚟搵要補嘅導讀。'
  },
  'zh-TW': {
    summary: '需要時再打開 14 個準備範圍',
    hint: '能力路線與逐題練習留在上方；答不出其中一條時，再回來找要補的導讀。'
  },
  'zh-Hans': {
    summary: '需要时再打开 14 个准备范围',
    hint: '能力路线与逐题练习留在上方；答不出其中一条时，再回来找要补的导读。'
  },
  en: {
    summary: 'Open the 14 preparation areas when you need them',
    hint: 'The capability routes and question pages stay above; return here when an answer exposes a guide you need to read.'
  }
});

const opensNewTabCopy: Record<Locale, string> = canonicalLocaleRecord({
  'zh-HK': '會喺新分頁開啟',
  'zh-TW': '會在新分頁開啟',
  'zh-Hans': '将在新标签页打开',
  en: 'opens in a new tab'
});

const labResourceTitles: Record<string, Record<Locale, string>> = {
  'build-lab': canonicalLocaleRecord({
    'zh-HK': 'Build Lab：本地練習路徑',
    'zh-TW': 'Build Lab：本機練習路徑',
    'zh-Hans': 'Build Lab：本地练习路径',
    en: 'Build Lab: local practice path'
  }),
  'coding-starter-lab': canonicalLocaleRecord({
    'zh-HK': 'Coder Starter Lab：用一個細改動練習',
    'zh-TW': 'Coder Starter Lab：用一個小改動練習',
    'zh-Hans': 'Coder Starter Lab：用一个小改动练习',
    en: 'Coder Starter Lab: practise with one small change'
  })
};

const interviewPrepResourceTitles: Record<string, Record<Locale, string>> = {
  'ai-engineer-interview-prep': canonicalLocaleRecord({
    'zh-HK': '14 個面試準備範圍',
    'zh-TW': '14 個面試準備範圍',
    'zh-Hans': '14 个面试准备范围',
    en: '14 interview preparation areas'
  })
};

function resourceTitle(resource: RoadmapResource, locale: Locale) {
  if (resource.title?.[locale]) return resource.title[locale];
  if (resource.kind === 'article') return getArticle(resource.target)?.translations[locale].title ?? resource.target;
  if (resource.kind === 'lab') return labResourceTitles[resource.target]?.[locale] ?? resource.target;
  if (resource.kind === 'interview-prep') return interviewPrepResourceTitles[resource.target]?.[locale] ?? resource.target;
  return getInterviewTopic(resource.target)?.title[locale] ?? resource.target;
}

function roadmapStageHref(locale: Locale, stage: RoadmapStage, baseHref: string) {
  return `${baseHref}?phase=${encodeURIComponent(stage.phase)}#roadmap-stage-${stage.number}`;
}

function SourceNote({ note, locale, label }: { note: RoadmapSourceNote; locale: Locale; label: string }) {
  return <aside className="roadmap-source-note">
    <p className="eyebrow">{label}</p>
    <p>{note.text[locale]}</p>
    {note.reference ? <a href={note.reference.url} target="_blank" rel="noreferrer" aria-label={`${note.reference.label[locale]} (${opensNewTabCopy[locale]})`}>{note.reference.label[locale]} <span aria-hidden>↗</span></a> : null}
  </aside>;
}

function ResourceLinks({ resources, locale, label, primaryAction, optionalResources, collapseOptional = false }: { resources: RoadmapResource[]; locale: Locale; label: string; primaryAction: string; optionalResources: string; collapseOptional?: boolean }) {
  if (!resources.length) return null;
  const primary = resources.find(resource => resource.primary);
  if (!primary) return null;
  const optional = resources.filter(resource => resource !== primary);
  const optionalList = <ul>{optional.map(resource => <li key={`${resource.kind}-${resource.target}`}><Link href={roadmapResourcePath(locale, resource)}>{resourceTitle(resource, locale)} <span aria-hidden>→</span></Link></li>)}</ul>;

  return <div className="roadmap-resource-links">
    <span>{label}</span>
    <Link className="roadmap-resource-primary" href={roadmapResourcePath(locale, primary)}>
      <span className="roadmap-resource-primary-action">{primaryAction}</span>
      <span className="roadmap-resource-primary-title">{resourceTitle(primary, locale)}</span>
      <span aria-hidden>→</span>
    </Link>
    {optional.length ? (collapseOptional ? <details className="roadmap-resource-optional roadmap-resource-optional--collapsible">
      <summary>{optionalResources}</summary>
      {optionalList}
    </details> : <div className="roadmap-resource-optional">
      <span>{optionalResources}</span>
      {optionalList}
    </div>) : null}
  </div>;
}

function StageCard({ stage, stages, locale, side, phaseBaseHref }: { stage: RoadmapStage; stages: readonly RoadmapStage[]; locale: Locale; side: 'left' | 'right'; phaseBaseHref: string }) {
  const copy = roadmapCopy[locale];
  const contractCopy = lessonContractCopy[locale];
  const contract = stage.lessonContract;
  const prerequisiteStage = contract.prerequisiteStageId
    ? stages.find(candidate => candidate.id === contract.prerequisiteStageId)
    : undefined;
  const hasPublishedGuide = stage.status === 'available';
  const readinessLabel = hasPublishedGuide
    ? contract.practiceMode === 'runnable-practice' ? contractCopy.runnableStatus : contractCopy.guidedStatus
    : statusCopy[locale][stage.status];
  const readinessClass = hasPublishedGuide && contract.practiceMode === 'guided-self-check' ? 'partial' : stage.status;
  const effort = contractCopy.minutes(contract.estimatedMinutes.minimum, contract.estimatedMinutes.maximum);
  return <li className={`roadmap-stage roadmap-stage--${side}`}>
    <article id={`roadmap-stage-${stage.number}`} className="roadmap-stage-card" tabIndex={-1}>
      <div className="roadmap-stage-marker"><span aria-hidden>{stage.number}</span></div>
      <div className="roadmap-stage-meta"><span className={`roadmap-status roadmap-status--${readinessClass}`}>{readinessLabel}</span><span className="roadmap-status">{effort}</span></div>
      <h3><span className="sr-only">{stageNumberCopy[locale](stage.number)}</span>{stage.title[locale]}</h3>
      <p className="roadmap-stage-summary">{stage.summary[locale]}</p>
      <div className="roadmap-focus"><span>{copy.focus}</span><ul>{stage.focus.map(item => <li key={item}>{item}</li>)}</ul></div>
      <div className="roadmap-evidence"><span>{copy.evidence}</span><p>{stage.evidence[locale]}</p></div>
      {stage.gap ? <div className="roadmap-gap"><span>{copy.gap}</span><p>{stage.gap[locale]}</p></div> : null}
      <details className="roadmap-resource-optional roadmap-resource-optional--collapsible roadmap-lesson-contract">
        <summary><span>{contractCopy.contract}</span><span>{contractCopy.effort}: {effort}</span></summary>
        <div className="roadmap-lesson-contract-content">
          <dl>
            <div>
              <dt>{contractCopy.prerequisite}</dt>
              <dd>{contract.entry === 'foundation'
                ? contractCopy.foundation
                : contract.entry === 'diagnostic'
                  ? contractCopy.diagnostic
                  : <>{contractCopy.previous} {prerequisiteStage ? <Link href={roadmapStageHref(locale, prerequisiteStage, phaseBaseHref)}>{prerequisiteStage.number} · {prerequisiteStage.title[locale]}</Link> : null}</>}</dd>
            </div>
            <div><dt>{contractCopy.effort}</dt><dd>{effort}. {contractCopy.estimateBoundary}</dd></div>
            <div><dt>{contractCopy.practice}</dt><dd>{contract.practiceMode === 'runnable-practice' ? contractCopy.runnablePractice : contractCopy.guidedPractice}</dd></div>
            <div><dt>{contractCopy.completion}</dt><dd><ul>{contract.completion.criteria[locale].map(criterion => <li key={criterion}>{criterion}</li>)}</ul></dd></div>
            <div><dt>{contractCopy.stopOrReturn}</dt><dd>{contract.completion.returnCondition[locale]}</dd></div>
          </dl>
        </div>
      </details>
      <RoadmapStageProgressControl stageId={stage.id} number={stage.number} locale={locale} />
      <ResourceLinks resources={stage.resources} locale={locale} label={copy.resource} primaryAction={copy.primaryAction} optionalResources={copy.optionalResources} collapseOptional />
    </article>
  </li>;
}

function SelfLearningGuide({ guide, locale, stages, phaseBaseHref }: { guide: RoadmapLearningGuide; locale: Locale; stages: readonly RoadmapStage[]; phaseBaseHref: string }) {
  return <section className="roadmap-learning-guide" aria-labelledby="roadmap-learning-guide-title">
    <header>
      <p className="eyebrow">{guide.eyebrow[locale]}</p>
      <h2 id="roadmap-learning-guide-title">{guide.title[locale]}</h2>
      <p>{guide.intro[locale]}</p>
    </header>
    <div className="roadmap-learning-tree-wrap">
      <p className="roadmap-learning-root">{guide.root[locale]}</p>
      <ol className="roadmap-learning-tree">
        {guide.routes.map(route => <li key={route.id}>
          <article>
            <span>{route.range}</span>
            <h3>{route.title[locale]}</h3>
            <p>{route.description[locale]}</p>
            {stages.find(stage => stage.number === route.startStage) ? <Link href={roadmapStageHref(locale, stages.find(stage => stage.number === route.startStage)!, phaseBaseHref)}>{route.action[locale]} <span aria-hidden>→</span></Link> : null}
          </article>
        </li>)}
      </ol>
    </div>
    <section className="roadmap-learning-loop" aria-labelledby="roadmap-learning-loop-title">
      <h3 id="roadmap-learning-loop-title">{guide.loop.title[locale]}</h3>
      <ol>{guide.loop.steps.map((step, index) => <li key={step.title[locale]}>
        <span>{String(index + 1).padStart(2, '0')}</span>
        <div><h4>{step.title[locale]}</h4><p>{step.text[locale]}</p></div>
      </li>)}</ol>
    </section>
    <p className="roadmap-learning-boundary">{guide.boundary[locale]}</p>
  </section>;
}

export function RoadmapTimeline({ locale, roadmap = aiEngineerRoadmap, showIntro = true, selectedPhaseId, phaseBaseHref = `/${locale}/series/ai-engineer-roadmap` }: { locale: Locale; roadmap?: AiEngineerRoadmap | null; showIntro?: boolean; selectedPhaseId?: string; phaseBaseHref?: string }) {
  if (!roadmap) return null;
  const copy = roadmapCopy[locale];
  const selectedPhase = roadmap.phases.find(phase => phase.id === selectedPhaseId) ?? roadmap.phases[0];
  const selectedStages = roadmap.stages.filter(stage => stage.phase === selectedPhase.id);
  const eyebrow: Record<Locale, string> = canonicalLocaleRecord({
    'zh-HK': 'AI 工程學習路線',
    'zh-TW': 'AI 工程學習路線',
    'zh-Hans': 'AI 工程学习路线',
    en: 'AI ENGINEER ROADMAP'
  });
  const PhaseHeading = showIntro ? 'h3' : 'h2';
  return <section className={`roadmap-timeline${showIntro ? '' : ' roadmap-timeline--compact'}`} aria-label={showIntro ? undefined : copy.title} aria-labelledby={showIntro ? 'roadmap-title' : undefined}>
    <FragmentAnchorScroll roadmapStages={roadmap.stages.map(stage => ({ number: stage.number, phase: stage.phase }))} />
    {showIntro ? <header className="roadmap-timeline-header">
      <p className="eyebrow">{eyebrow[locale]}</p>
      <h2 id="roadmap-title">{copy.title}</h2>
      <p>{copy.intro}</p>
    </header> : null}
    <SelfLearningGuide guide={roadmap.selfLearning} locale={locale} stages={roadmap.stages} phaseBaseHref={phaseBaseHref} />
    <RoadmapProgressTracker locale={locale} stages={roadmap.stages.map(stage => ({ id: stage.id, number: stage.number, title: stage.title[locale], href: roadmapStageHref(locale, stage, phaseBaseHref) }))} />
    <nav className="roadmap-phase-nav" aria-label={copy.title}>
      <ol>{roadmap.phases.map(phase => <li key={phase.id}><Link href={`${phaseBaseHref}?phase=${encodeURIComponent(phase.id)}#roadmap-phase-${phase.id}`} aria-current={phase.id === selectedPhase.id ? 'page' : undefined}><span>{phase.range}</span>{phase.title[locale]}</Link></li>)}</ol>
    </nav>
    <ol className="roadmap-phase-list">
      <li className="roadmap-phase" id={`roadmap-phase-${selectedPhase.id}`} key={selectedPhase.id} tabIndex={-1}>
          <header><p className="eyebrow">{selectedPhase.range}</p><PhaseHeading>{selectedPhase.title[locale]}</PhaseHeading><p>{selectedPhase.description[locale]}</p><p className="roadmap-phase-checkpoint"><span>{copy.checkpoint}</span>{selectedPhase.checkpoint[locale]}</p></header>
          <details
            className="roadmap-phase-disclosure"
            open
            suppressHydrationWarning
          >
            <summary>{phaseDisclosureCopy[locale](selectedStages.length)}</summary>
            <ol className="roadmap-stage-list">{selectedStages.map((stage, index) => <StageCard key={stage.id} stage={stage} stages={roadmap.stages} locale={locale} side={index % 2 === 0 ? 'left' : 'right'} phaseBaseHref={phaseBaseHref} />)}</ol>
          </details>
        </li>
    </ol>
    <SourceNote note={roadmap.sourceNote} locale={locale} label={copy.source} />
  </section>;
}

function InterviewTrackCard({ track, locale, topics }: { track: InterviewPrepTrack; locale: Locale; topics: readonly InterviewTopic[] }) {
  const copy = interviewCopy[locale];
  const topicSlugs = new Set(topics.map(topic => topic.slug));
  const afterDemoPaths = getInterviewPracticeAfterDemoPathsForTrack(track.id)
    .filter(path => path.topicSlugs.every(slug => topicSlugs.has(slug)));
  return <li className="interview-prep-track">
    <article id={`interview-prep-track-${track.number}`} tabIndex={-1}>
      <div className="interview-prep-track-meta"><span>{track.number}</span><span className={`roadmap-status roadmap-status--${track.status}`}>{statusCopy[locale][track.status]}</span></div>
      <h3>{track.title[locale]}</h3>
      <p>{track.summary[locale]}</p>
      <div className="interview-prep-evidence"><span>{copy.evidence}</span><p>{track.evidence[locale]}</p></div>
      <ResourceLinks resources={track.resources} locale={locale} label={copy.resource} primaryAction={copy.primaryAction} optionalResources={copy.optionalResources} />
      {afterDemoPaths.map(path => <nav className="interview-prep-after-demo-link" aria-label={path.copy[locale].title} key={path.id}>
        <span>{path.copy[locale].eyebrow}</span>
        <strong>{path.copy[locale].title}</strong>
        <Link href={`/${locale}/interview-lab#${interviewPracticeAfterDemoPathAnchor(path)}`}>{path.copy[locale].action} <span aria-hidden>→</span></Link>
      </nav>)}
    </article>
  </li>;
}

export function InterviewPrepMap({ locale, prep = aiEngineerInterviewPrep, topics = interviewTopics }: { locale: Locale; prep?: AiEngineerInterviewPrep | null; topics?: readonly InterviewTopic[] }) {
  if (!prep) return null;
  const copy = interviewCopy[locale];
  const disclosure = interviewPrepDisclosureCopy[locale];
  const eyebrow: Record<Locale, string> = canonicalLocaleRecord({
    'zh-HK': '面試準備',
    'zh-TW': '面試準備',
    'zh-Hans': '面试准备',
    en: 'INTERVIEW PREP SERIES'
  });
  return <section id="interview-prep-map" className="interview-prep-map" aria-labelledby="interview-prep-title" tabIndex={-1}>
    <header><p className="eyebrow">{eyebrow[locale]}</p><h2 id="interview-prep-title">{copy.title}</h2><p>{copy.intro}</p></header>
    <details className="interview-prep-disclosure">
      <summary>
        <span className="interview-prep-disclosure-title">{disclosure.summary}</span>
        <span className="interview-prep-disclosure-hint">{disclosure.hint}</span>
      </summary>
      <div className="interview-prep-disclosure-content">
        <ol>{prep.tracks.map(track => <InterviewTrackCard key={track.id} track={track} locale={locale} topics={topics} />)}</ol>
        <SourceNote note={prep.sourceNote} locale={locale} label={copy.source} />
      </div>
    </details>
  </section>;
}

export function RoadmapPreview({ locale, roadmap = aiEngineerRoadmap, actionHref = `/${locale}/series/ai-engineer-roadmap#roadmap-stage-00` }: { locale: Locale; roadmap?: AiEngineerRoadmap | null; actionHref?: string }) {
  if (!roadmap) return null;
  const copy: Record<Locale, { eyebrow: string; title: string; description: string; action: (count: number) => string }> = canonicalLocaleRecord({
    'zh-HK': { eyebrow: 'AI 工程學習路線', title: '由概念到一份講得清嘅工作紀錄', description: '用每一站理解模型、接入一件工作、核對結果，再如實講清自己做過乜同未證實乜。', action: () => '由第 00 站開始' },
    'zh-TW': { eyebrow: 'AI 工程學習路線', title: '從基礎一路做到能說清楚的作品', description: '一條順著做的學習路：先理解模型，再做應用，接著學會測試和交付，最後把做過的事說清楚。', action: (count: number) => `查看 ${count} 個學習站` },
    'zh-Hans': { eyebrow: 'AI 工程学习路线', title: '从基础一路做到说得清的作品', description: '一条顺着做的学习路：先理解模型，再做应用，接着学会测试和交付，最后把做过的事说清楚。', action: (count: number) => `查看 ${count} 个学习站` },
    en: { eyebrow: 'AI ENGINEER ROADMAP', title: 'From foundations to work you can explain', description: 'A guided sequence: understand models, build an application, learn to test and deliver it, then explain the work clearly.', action: (count: number) => `Open the ${count}-stop roadmap` }
  });
  const preview = copy[locale];
  return <section className="roadmap-preview" aria-labelledby="roadmap-preview-title">
    <div><p className="eyebrow">{preview.eyebrow}</p><h2 id="roadmap-preview-title">{preview.title}</h2><p>{preview.description}</p></div>
    <ol>{roadmap.phases.map(phase => <li key={phase.id}><span>{phase.range}</span><strong>{phase.title[locale]}</strong></li>)}</ol>
    {actionHref ? <Link className="button primary" href={actionHref}>{preview.action(roadmap.stages.length)} <span aria-hidden>→</span></Link> : null}
  </section>;
}
