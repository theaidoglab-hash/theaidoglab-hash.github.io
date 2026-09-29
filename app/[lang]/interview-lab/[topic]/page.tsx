import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FragmentAnchorScroll } from '@/components/fragment-anchor-scroll';
import { InterviewLivePracticeGate } from '@/components/interview-live-practice-gate';
import { SupportNudge } from '@/components/support-nudge';
import { getArticle, readArticle, renderMarkdown } from '@/lib/content';
import { extractInterviewerQuestion, presentStandaloneInterviewQuestion, readStandaloneInterviewQuestion } from '@/lib/interview-question-content';
import { getInterviewQuestionMetadata, type InterviewQuestionPractice } from '@/lib/interview-question-metadata';
import { extractInterviewTopicMarkdown, interviewLabCopy, interviewPracticePath, type InterviewTopic } from '@/lib/interview-lab';
import { toLiveInterviewPracticeTopics } from '@/lib/interview-live-practice-topics';
import type { InterviewQuestionCompanyAttribution } from '@/lib/interview-question-metadata';
import { getInterviewPracticeContinuation, interviewPracticeContinuationCopy } from '@/lib/interview-practice-continuations';
import { getInterviewPracticePathsForTopic, nextInterviewPracticeTopic } from '@/lib/interview-practice-paths';
import { isLocale } from '@/lib/i18n';
import {
  getReleaseScopedInterviewPrep,
  getReleaseScopedInterviewTopic,
  getReleaseScopedInterviewTopics,
  getReleaseScopedRoadmap,
} from '@/lib/release-learning-content';
import { isRouteSurfaceEnabledInCurrentBuild } from '@/lib/release-server-scope';
import type { AiEngineerInterviewPrep, AiEngineerRoadmap } from '@/lib/roadmaps';
import { localizedAlternates, pageSocialMetadata } from '@/lib/site-metadata';
import { LOCALES, type Locale } from '@/lib/types';
import { canonicalLocaleRecord } from '@/lib/types';

const staticHosting = process.env.GITHUB_PAGES === 'true';

const questionCopy: Record<Locale, {
  eyebrow: string;
  intro: string;
  back: string;
  return: string;
  practice: string;
  pathEyebrow: string;
  pathNavigation: string;
  pathNext: string;
  attemptEyebrow: string;
  attemptTitle: string;
  attemptHelp: string;
  revealTitle: string;
  revealHint: string;
}> = canonicalLocaleRecord({
  'zh-HK': {
    eyebrow: '一條練習問題',
    intro: '先用自己嘅經驗答一次。答完再睇筆記：佢會拆解系統點運作、用喺工作時要權衡乜，同埋邊啲情況應該停手。',
    back: '返回 Interview Lab',
    return: '選另一條起步路線',
    practice: '直接去即時對話練習',
    pathEyebrow: '練習路線',
    pathNavigation: '相關練習路線',
    pathNext: '路線下一題',
    attemptEyebrow: '先試答',
    attemptTitle: '先用自己的話答這條題',
    attemptHelp: '先講一次，再開答案地圖。不用完整，也不用背稿。',
    revealTitle: '試答後，展開答案地圖和詳細筆記',
    revealHint: '內含六項核對提示、原理、取捨、失敗情況和可檢查證據。'
  },
  'zh-TW': {
    eyebrow: '一條練習問題',
    intro: '先用自己的經驗回答一次。答完再看筆記：它會拆解系統怎麼運作、用在工作時該權衡什麼，以及哪些情況應該停下來。',
    back: '返回 Interview Lab',
    return: '選另一條起步路線',
    practice: '直接到 live chat 練習',
    pathEyebrow: '練習路線',
    pathNavigation: '相關練習路線',
    pathNext: '路線下一題',
    attemptEyebrow: '先試答',
    attemptTitle: '先用自己的話回答這題',
    attemptHelp: '先說一次，再打開答案地圖。不必完整，也不必背稿。',
    revealTitle: '試答後，展開答案地圖與詳細筆記',
    revealHint: '包含六項核對提示、原理、取捨、失敗情況與可檢查證據。'
  },
  'zh-Hans': {
    eyebrow: '一条练习问题',
    intro: '先用自己的经验回答一次。答完再看笔记：它会拆解系统如何运作、用在工作时要权衡什么，以及哪些情况应该停下来。',
    back: '返回 Interview Lab',
    return: '选另一条起步路线',
    practice: '直接到 live chat 练习',
    pathEyebrow: '练习路线',
    pathNavigation: '相关练习路线',
    pathNext: '路线下一题',
    attemptEyebrow: '先试答',
    attemptTitle: '先用自己的话回答这题',
    attemptHelp: '先说一次，再打开答案地图。不必完整，也不必背稿。',
    revealTitle: '试答后，展开答案地图和详细笔记',
    revealHint: '包含六项核对提示、原理、取舍、失败情况和可检查证据。'
  },
  en: {
    eyebrow: 'ONE PRACTICE QUESTION',
    intro: 'Answer once from your own experience. Then read the notes: they unpack how the system works, the trade-offs at work, and when it should stop.',
    back: 'Back to Interview Lab',
    return: 'Choose another starter path',
    practice: 'Go to live-chat rehearsal',
    pathEyebrow: 'PRACTICE ROUTE',
    pathNavigation: 'Related practice routes',
    pathNext: 'Next in this route',
    attemptEyebrow: 'TRY FIRST',
    attemptTitle: 'Answer this question in your own words first',
    attemptHelp: 'Give one attempt before opening the answer map. It does not need to be polished, and you do not need a memorised script.',
    revealTitle: 'After your attempt, reveal the answer map and detailed notes',
    revealHint: 'Includes six checking prompts, the mechanism, trade-offs, failure cases, and evidence someone can inspect.'
  }
});

const tableCopy: Record<Locale, string> = canonicalLocaleRecord({
  'zh-HK': '可橫向捲動的資料表',
  'zh-TW': '可橫向捲動的資料表',
  'zh-Hans': '可横向滚动的数据表',
  en: 'Scrollable data table'
});

const codeCopy: Record<Locale, string> = canonicalLocaleRecord({
  'zh-HK': '可橫向捲動的程式碼區塊',
  'zh-TW': '可橫向捲動的程式碼區塊',
  'zh-Hans': '可横向滚动的代码区块',
  en: 'Scrollable code block'
});

type QuestionAnswerMapCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  labels: Record<keyof InterviewQuestionPractice, string>;
};

const questionAnswerMapCopy: Record<Locale, QuestionAnswerMapCopy> = canonicalLocaleRecord({
  'zh-HK': {
    eyebrow: '答完後核對',
    title: '呢條題要講到邊幾樣？',
    intro: '唔使背句子。答完後，用呢六格核對有冇講到情境、容易誤判嘅假設、原理、取捨、要防嘅失敗情況，同埋可以畀人核對嘅證據。',
    labels: {
      scenario: '今次情境',
      trap: '容易誤判嘅假設',
      mechanism: '要講清嘅原理',
      tradeoff: '要講清嘅取捨',
      failure: '要防嘅失敗情況',
      evidence: '可以畀人核對嘅證據'
    }
  },
  'zh-TW': {
    eyebrow: '回答後核對',
    title: '這題要講到哪些事？',
    intro: '不必背句子。回答後，用這六格核對是否說到情境、容易誤判的假設、原理、取捨、要防的失敗情況，以及別人能檢查的證據。',
    labels: {
      scenario: '這次情境',
      trap: '容易誤判的假設',
      mechanism: '要說清的原理',
      tradeoff: '要說清的取捨',
      failure: '要防的失敗情況',
      evidence: '別人能檢查的證據'
    }
  },
  'zh-Hans': {
    eyebrow: '回答后核对',
    title: '这题要讲到哪些事？',
    intro: '不必背句子。回答后，用这六格核对是否说到情境、容易误判的假设、原理、取舍、要防的失败情况，以及别人能检查的证据。',
    labels: {
      scenario: '这次情境',
      trap: '容易误判的假设',
      mechanism: '要讲清的原理',
      tradeoff: '要讲清的取舍',
      failure: '要防的失败情况',
      evidence: '别人能检查的证据'
    }
  },
  en: {
    eyebrow: 'CHECK YOUR ANSWER',
    title: 'What should this answer cover?',
    intro: 'Do not memorise a script. After answering, use these six prompts to check that you named the scenario, tempting wrong answer, mechanism, trade-off, failure, and evidence another person can inspect.',
    labels: {
      scenario: 'The situation',
      trap: 'The tempting wrong answer',
      mechanism: 'The mechanism to explain',
      tradeoff: 'The trade-off to name',
      failure: 'One way it can fail',
      evidence: 'Evidence someone can inspect'
    }
  }
});

const companyAttributionCopy: Record<InterviewQuestionCompanyAttribution, Record<Locale, {
  eyebrow: string;
  title: string;
  company: string;
  limit: string;
}>> = {
  'not-asserted': canonicalLocaleRecord({
    'zh-HK': {
      eyebrow: '公司歸屬與來源限制',
      title: '這條練習題不作公司歸屬',
      company: '公司歸屬：本頁不聲稱這條題目由任何公司提出。',
      limit: '這是 AI.DOG 的教學練習。題面、case、文件、量度和 artefact 均為 synthetic 教材；它不是任何公司現時或過去面試流程的證據，亦不預示你會遇到這條題。'
    },
    'zh-TW': {
      eyebrow: '公司歸屬與來源限制',
      title: '這條練習題不作公司歸屬',
      company: '公司歸屬：本頁不主張這條題目由任何公司提出。',
      limit: '這是 AI.DOG 的教學練習。題面、case、文件、量測與 artefact 都是 synthetic 教材；不構成任何公司現行或過去面試流程的證據，也不預示你會遇到這條題。'
    },
    'zh-Hans': {
      eyebrow: '公司归属与来源限制',
      title: '这条练习题不作公司归属',
      company: '公司归属：本页不主张这条题目由任何公司提出。',
      limit: '这是 AI.DOG 的教学练习。题面、case、文件、量测与 artefact 都是 synthetic 教材；不构成任何公司当前或过去面试流程的证据，也不预示你会遇到这条题。'
    },
    en: {
      eyebrow: 'COMPANY ATTRIBUTION AND SOURCE LIMIT',
      title: 'No company attribution is made for this practice question',
      company: 'Company attribution: this page does not claim that any company asked this question.',
      limit: 'This is an AI.DOG teaching exercise. Its prompt, cases, documents, measurements and artefacts are synthetic; it is not evidence of a company’s current or past interview process, and does not predict what you will be asked.'
    }
  })
};

const routeCopy: Record<Locale, {
  eyebrow: string;
  title: string;
  roadmap: string;
  preparation: string;
  roadmapAction: string;
  preparationAction: string;
}> = canonicalLocaleRecord({
  'zh-HK': {
    eyebrow: '學習路線',
    title: '呢條題放喺你條路邊度',
    roadmap: 'Roadmap 站點',
    preparation: '面試準備範圍',
    roadmapAction: '打開這一站',
    preparationAction: '查看準備地圖'
  },
  'zh-TW': {
    eyebrow: '學習路線',
    title: '這題在你的路線裡',
    roadmap: 'Roadmap 站點',
    preparation: '面試準備範圍',
    roadmapAction: '打開這一站',
    preparationAction: '查看準備地圖'
  },
  'zh-Hans': {
    eyebrow: '学习路线',
    title: '这题在你的路线里',
    roadmap: 'Roadmap 站点',
    preparation: '面试准备范围',
    roadmapAction: '打开这一站',
    preparationAction: '查看准备地图'
  },
  en: {
    eyebrow: 'LEARNING ROUTE',
    title: 'Where this question fits in your route',
    roadmap: 'Roadmap stop',
    preparation: 'Interview preparation route',
    roadmapAction: 'Open this stop',
    preparationAction: 'View the preparation map'
  }
});

function QuestionRouteCallout({ locale, topic, roadmap, prep, roadmapHref }: { locale: Locale; topic: InterviewTopic; roadmap: AiEngineerRoadmap | null; prep: AiEngineerInterviewPrep | null; roadmapHref?: string }) {
  const copy = routeCopy[locale];
  const stages = roadmapHref ? topic.roadmapStages.flatMap(stageId => {
    const stage = roadmap?.stages.find(candidate => candidate.id === stageId);
    return stage ? [stage] : [];
  }) : [];
  const tracks = topic.prepTracks.flatMap(trackId => {
    const track = prep?.tracks.find(candidate => candidate.id === trackId);
    return track ? [track] : [];
  });

  if (!stages.length && !tracks.length) return null;

  return <aside className="interview-route-callout" aria-labelledby="interview-route-title">
    <div className="interview-route-callout-heading">
      <p className="eyebrow">{copy.eyebrow}</p>
      <h2 id="interview-route-title">{copy.title}</h2>
    </div>
    <div className="interview-route-callout-links">
      {stages.length ? <section>
        <span>{copy.roadmap}</span>
        <ul>{stages.map(stage => <li key={stage.id}><Link href={`${roadmapHref}?phase=${encodeURIComponent(stage.phase)}#roadmap-stage-${stage.number}`}>{stage.number}. {stage.title[locale]} <small>{copy.roadmapAction} →</small></Link></li>)}</ul>
      </section> : null}
      {tracks.length ? <section>
        <span>{copy.preparation}</span>
        <ul>{tracks.map(track => <li key={track.id}><Link href={`/${locale}/interview-lab#interview-prep-track-${track.number}`}>{track.number}. {track.title[locale]} <small>{copy.preparationAction} →</small></Link></li>)}</ul>
      </section> : null}
    </div>
  </aside>;
}

function QuestionAttributionCallout({ locale, topic }: { locale: Locale; topic: InterviewTopic }) {
  const copy = companyAttributionCopy[topic.companyAttribution][locale];

  return <aside className="roadmap-source-note interview-question-attribution" aria-labelledby="interview-question-attribution-title">
    <p className="eyebrow">{copy.eyebrow}</p>
    <h2 id="interview-question-attribution-title">{copy.title}</h2>
    <p>{copy.company}</p>
    <p>{copy.limit}</p>
  </aside>;
}

function QuestionAnswerMap({ locale, topic }: { locale: Locale; topic: InterviewTopic }) {
  const practice = getInterviewQuestionMetadata(topic.slug)?.practice[locale];
  if (!practice) return null;
  const copy = questionAnswerMapCopy[locale];
  const fields: Array<keyof InterviewQuestionPractice> = ['scenario', 'trap', 'mechanism', 'tradeoff', 'failure', 'evidence'];

  return <aside className="interview-answer-map" aria-labelledby="interview-answer-map-title">
    <header>
      <p className="eyebrow">{copy.eyebrow}</p>
      <h2 id="interview-answer-map-title">{copy.title}</h2>
      <p>{copy.intro}</p>
    </header>
    <dl>
      {fields.map(field => <div key={field}>
        <dt>{copy.labels[field]}</dt>
        <dd>{practice[field]}</dd>
      </div>)}
    </dl>
  </aside>;
}

function QuestionPracticePathCallout({ locale, topic, topics }: { locale: Locale; topic: InterviewTopic; topics: readonly InterviewTopic[] }) {
  const topicsBySlug = new Map(topics.map(candidate => [candidate.slug, candidate]));
  const memberships = getInterviewPracticePathsForTopic(topic.slug)
    .filter(path => path.topicSlugs.every(slug => topicsBySlug.has(slug)));
  if (memberships.length === 0) return null;

  return <nav className="interview-question-path-navigation" aria-label={questionCopy[locale].pathNavigation}>
    {memberships.map(path => {
      const nextSlug = nextInterviewPracticeTopic(path, topic.slug);
      const next = nextSlug ? topicsBySlug.get(nextSlug) : undefined;
      const pathHref = `/${locale}/interview-lab#interview-practice-path-${path.id}`;
      return <section key={path.id}>
        <p className="eyebrow">{questionCopy[locale].pathEyebrow}</p>
        <h2>{path.copy[locale].title}</h2>
        <Link className="text-link" href={pathHref}>↩ {path.copy[locale].title}</Link>
        {next
          ? <Link className="text-link" href={interviewPracticePath(locale, next)}>{questionCopy[locale].pathNext}: {next.title[locale]} <span aria-hidden>→</span></Link>
          : <a className="text-link" href="#live-interview-practice">{questionCopy[locale].practice} <span aria-hidden>→</span></a>}
      </section>;
    })}
  </nav>;
}

function QuestionCapabilityContinuationCallout({ locale, topic, topics, prep }: { locale: Locale; topic: InterviewTopic; topics: readonly InterviewTopic[]; prep: AiEngineerInterviewPrep | null }) {
  const topicsBySlug = new Map(topics.map(candidate => [candidate.slug, candidate]));
  if (getInterviewPracticePathsForTopic(topic.slug).some(path => path.topicSlugs.every(slug => topicsBySlug.has(slug)))) return null;
  const continuation = getInterviewPracticeContinuation(topic.slug);
  if (!continuation) return null;

  const track = prep?.tracks.find(candidate => candidate.id === continuation.capability.id);
  const next = continuation.nextTopicSlug ? topicsBySlug.get(continuation.nextTopicSlug) : undefined;
  if (!track || (continuation.nextTopicSlug && !next)) return null;

  const copy = interviewPracticeContinuationCopy[locale];
  const focus = continuation.capability.focus[locale];
  const description = next
    ? `${copy.nextLead} ${focus}`
    : `${copy.rehearsalLead} ${focus}`;

  return <aside className="interview-question-capability-navigation" aria-labelledby="interview-question-capability-title">
    <p className="eyebrow">{copy.eyebrow}</p>
    <h2 id="interview-question-capability-title">{track.title[locale]}</h2>
    <p>{description}</p>
    {next
      ? <Link className="text-link" href={interviewPracticePath(locale, next)}>{copy.nextAction}: {next.title[locale]} <span aria-hidden>→</span></Link>
      : <a className="text-link" href="#live-interview-practice">{copy.rehearsalAction} <span aria-hidden>→</span></a>}
  </aside>;
}

export function generateStaticParams() {
  return LOCALES.flatMap(lang => getReleaseScopedInterviewTopics().map(topic => ({ lang, topic: topic.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; topic: string }> }): Promise<Metadata> {
  const { lang, topic: rawTopic } = await params;
  const topic = getReleaseScopedInterviewTopic(rawTopic);
  if (!isLocale(lang) || !topic) return {};
  const path = interviewPracticePath(lang, topic);
  const description = `${topic.title[lang]}：${questionCopy[lang].intro}`;
  return {
    title: `${topic.title[lang]} | Interview Lab`,
    description,
    alternates: localizedAlternates(path),
    ...pageSocialMetadata({ title: `${topic.title[lang]} | Interview Lab`, description, path, type: 'article' })
  };
}

export default async function InterviewQuestionPage({ params }: { params: Promise<{ lang: string; topic: string }> }) {
  const { lang, topic: rawTopic } = await params;
  if (!isLocale(lang) || !isRouteSurfaceEnabledInCurrentBuild('interview-lab')) notFound();
  const topics = getReleaseScopedInterviewTopics();
  const topic = topics.find(candidate => candidate.slug === rawTopic);
  const roadmap = getReleaseScopedRoadmap();
  const prep = getReleaseScopedInterviewPrep();
  if (!topic) notFound();
  let markdown = readStandaloneInterviewQuestion(topic.slug, lang);
  if (!markdown) {
    const deck = getArticle('ai-engineer-interview-practice-cards');
    if (!deck) notFound();
    markdown = extractInterviewTopicMarkdown(readArticle(deck, lang), topic);
  }
  const interviewerQuestion = extractInterviewerQuestion(markdown, lang);
  if (!interviewerQuestion) {
    throw new Error(`Could not extract the interviewer question for ${topic.slug}/${lang}`);
  }
  const readerMarkdown = presentStandaloneInterviewQuestion(markdown, lang);
  const copy = questionCopy[lang];

  return <div className="article-shell interview-question-shell">
    <FragmentAnchorScroll />
    <header className="article-header interview-question-header">
      <Link className="category-label" href={`/${lang}/interview-lab`}>{copy.back}</Link>
      <p className="eyebrow">{copy.eyebrow} · {topic.number}</p>
      <h1>{topic.title[lang]}</h1>
      <p className="article-dek">{copy.intro}</p>
      <div className="article-meta"><span>{interviewLabCopy[lang].eyebrow}</span><span>{topic.number} / {topics.length}</span></div>
    </header>

    <section className="interview-answer-map interview-question-attempt" aria-labelledby="interview-question-attempt-title">
      <p className="eyebrow">{copy.attemptEyebrow}</p>
      <h2 id="interview-question-attempt-title">{copy.attemptTitle}</h2>
      <blockquote><p>{interviewerQuestion}</p></blockquote>
      <p>{copy.attemptHelp}</p>
      <a className="button primary interview-question-practice-cta" href="#live-interview-practice">{copy.practice}</a>
    </section>

    <InterviewLivePracticeGate
      locale={lang}
      initialTopicSlug={topic.slug}
      initialInterviewerQuestion={interviewerQuestion}
      topics={staticHosting ? toLiveInterviewPracticeTopics(lang, topics) : undefined}
    />

    <details className="portfolio-reference-disclosure interview-answer-disclosure">
      <summary><strong>{copy.revealTitle}</strong><span>{copy.revealHint}</span></summary>
      <div className="portfolio-reference-disclosure__content">
        <QuestionAnswerMap locale={lang} topic={topic} />
        <article className="prose">{renderMarkdown(readerMarkdown, tableCopy[lang], codeCopy[lang])}</article>
      </div>
    </details>

    <QuestionAttributionCallout locale={lang} topic={topic} />
    <QuestionRouteCallout locale={lang} topic={topic} roadmap={roadmap} prep={prep} roadmapHref={isRouteSurfaceEnabledInCurrentBuild('series') ? `/${lang}/series/ai-engineer-roadmap` : undefined} />
    <QuestionPracticePathCallout locale={lang} topic={topic} topics={topics} />
    <QuestionCapabilityContinuationCallout locale={lang} topic={topic} topics={topics} prep={prep} />
    <SupportNudge locale={lang} />
    <nav className="interview-question-navigation" aria-label={copy.eyebrow}>
      <Link className="button secondary" href={`/${lang}/interview-lab#interview-practice-paths`}>{copy.return}</Link>
    </nav>
  </div>;
}
