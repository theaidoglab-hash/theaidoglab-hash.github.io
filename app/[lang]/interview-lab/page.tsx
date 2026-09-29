import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ClearLegacyInterviewFragment } from '@/components/clear-legacy-interview-fragment';
import { FragmentAnchorScroll } from '@/components/fragment-anchor-scroll';
import { InterviewAfterDemoPaths } from '@/components/interview-after-demo-paths';
import { InterviewLivePracticeGate } from '@/components/interview-live-practice-gate';
import { InterviewPracticePaths } from '@/components/interview-practice-paths';
import { InterviewPrepMap } from '@/components/roadmap-timeline';
import { getArticle } from '@/lib/content';
import { interviewLabCopy, interviewPracticePath } from '@/lib/interview-lab';
import { toLiveInterviewPracticeTopics } from '@/lib/interview-live-practice-topics';
import { isLocale } from '@/lib/i18n';
import {
  getReleaseScopedInterviewCapabilityGroups,
  getReleaseScopedInterviewPrep,
  getReleaseScopedInterviewTopics,
} from '@/lib/release-learning-content';
import { isRouteSurfaceEnabledInCurrentBuild } from '@/lib/release-server-scope';
import { localizedAlternates, pageSocialMetadata } from '@/lib/site-metadata';
import { LOCALES, type Locale } from '@/lib/types';
import { canonicalLocaleRecord } from '@/lib/types';

const staticHosting = process.env.GITHUB_PAGES === 'true';

const routeFirstCopy: Record<Locale, { label: string; routes: string; routesDetail: string; map: string; mapDetail: string; secondaryBrowse: string; secondaryBrowseDetail: string; capabilitySection: string; browseQuestions: (count: number) => string; practiceEyebrow: string }> = canonicalLocaleRecord({
  'zh-HK': {
    label: '由邊度開始',
    routes: '揀一條四題練習路線，五條選一條',
    routesDetail: '未有作品就揀第一條。其餘由眼前問題入手；答完題，再補返原理、取捨同容易出錯嘅位。',
    map: '想換題時，再睇 14 個準備範圍',
    mapDetail: '14 個準備範圍收喺後面，需要時先打開。',
    secondaryBrowse: '需要換題時，再瀏覽其他分類',
    secondaryBrowseDetail: '進階路線、能力分組和 14 個準備範圍收在這裡；第一次不用全看。',
    capabilitySection: '按要補嘅能力揀題',
    browseQuestions: count => `打開呢組 ${count} 條題目`,
    practiceEyebrow: '逐條試答，逐條補足'
  },
  'zh-TW': {
    label: '怎麼開始',
    routes: '五條四題練習，先選一條',
    routesDetail: '還沒有作品就先選第一條；其餘從眼前情境開始，回答後再補上原理、取捨與容易出錯的位置。',
    map: '需要時再打開 14 個準備範圍',
    mapDetail: '14 個主題收在後面，隨時可以看。',
    secondaryBrowse: '需要換題時，再瀏覽其他分類',
    secondaryBrowseDetail: '進階路線、能力分組和 14 個準備範圍收在這裡；第一次不用全看。',
    capabilitySection: '想換題時，可依能力選',
    browseQuestions: count => `展開這組 ${count} 道題目`,
    practiceEyebrow: '逐題試答，逐題補足'
  },
  'zh-Hans': {
    label: '怎么开始',
    routes: '五条四题练习，先选一条',
    routesDetail: '还没有作品就先选第一条；其余从眼前情境开始，回答后再补上原理、取舍与容易出错的位置。',
    map: '需要时再打开 14 个准备范围',
    mapDetail: '14 个主题收在后面，随时可以看。',
    secondaryBrowse: '需要换题时，再浏览其他分类',
    secondaryBrowseDetail: '进阶路线、能力分组和 14 个准备范围收在这里；第一次不用全看。',
    capabilitySection: '想换题时，可按能力选',
    browseQuestions: count => `展开这组 ${count} 道题目`,
    practiceEyebrow: '逐题试答，逐题补足'
  },
  en: {
    label: 'How to begin',
    routes: 'Choose one of five four-question starter paths',
    routesDetail: 'Choose the first route if you have no project yet; otherwise start with a scenario, then explain the principle, trade-off, and failure case.',
    map: 'Open the 14 preparation areas when you need them',
    mapDetail: 'The 14 topics stay out of the way until then.',
    secondaryBrowse: 'Browse other ways to choose a question when needed',
    secondaryBrowseDetail: 'Advanced paths, capability groups, and the 14-area preparation map stay here. You do not need them on your first visit.',
    capabilitySection: 'Choose another question by capability',
    browseQuestions: count => `Browse this group’s ${count} questions`,
    practiceEyebrow: 'Practise it, then explain it'
  }
});

export function generateStaticParams() {
  return LOCALES.map(lang => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const copy = interviewLabCopy[lang];
  const path = `/${lang}/interview-lab`;
  return { title: copy.title, description: copy.intro, alternates: localizedAlternates(path), ...pageSocialMetadata({ title: copy.title, description: copy.intro, path }) };
}

export default async function InterviewLabPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang) || !isRouteSurfaceEnabledInCurrentBuild('interview-lab')) notFound();
  const copy = interviewLabCopy[lang];
  const navigation = routeFirstCopy[lang];
  const map = getArticle('ai-engineer-interview-learning-map');
  const topics = getReleaseScopedInterviewTopics();
  const capabilityGroups = getReleaseScopedInterviewCapabilityGroups();
  const prep = getReleaseScopedInterviewPrep();
  const firstTopic = topics[0];
  if (!firstTopic) notFound();

  return <div className="shell page interview-lab">
    <ClearLegacyInterviewFragment locale={lang} />
    <FragmentAnchorScroll />
    <header className="page-header interview-lab-header">
      <p className="eyebrow">{copy.eyebrow}</p>
      <h1>{copy.title}</h1>
      <p>{copy.intro}</p>
      <p className="interview-lab-count"><strong>{topics.length}</strong> {copy.count} <span aria-hidden>·</span> <strong>{capabilityGroups.length}</strong> {copy.groupLabel}</p>
    </header>

    <nav className="interview-lab-route-nav" aria-label={navigation.label}>
      <a href="#interview-practice-paths"><span>01</span><strong>{navigation.routes}</strong><small>{navigation.routesDetail}</small></a>
      <a href="#interview-secondary-browse"><span>02</span><strong>{navigation.secondaryBrowse}</strong><small>{navigation.secondaryBrowseDetail}</small></a>
    </nav>

    <InterviewPracticePaths locale={lang} topics={topics} />

    <details id="interview-secondary-browse" className="portfolio-reference-disclosure interview-secondary-browse">
      <summary><strong>{navigation.secondaryBrowse}</strong><span>{navigation.secondaryBrowseDetail}</span></summary>
      <div className="portfolio-reference-disclosure__content">
        <InterviewAfterDemoPaths locale={lang} topics={topics} />

        <section id="interview-capability-routes" aria-labelledby="interview-capability-routes-title" tabIndex={-1}>
          <h2 id="interview-capability-routes-title">{navigation.capabilitySection}</h2>
          <div className="interview-group-grid">
            {capabilityGroups.map((group, groupIndex) => {
              const groupTopics = topics.filter(topic => group.topicNumbers.includes(topic.number));
              const groupCopy = group.copy[lang];
              const first = groupTopics[0];
              return <article className="interview-group-card" key={group.id}>
                <div className="interview-group-card-header">
                  <span className="interview-group-number">0{groupIndex + 1}</span>
                  <span className="interview-group-count">{groupTopics.length} {copy.count}</span>
                </div>
                <h3>{groupCopy.title}</h3>
                <div className="interview-tests"><span>{copy.testsLabel}</span><p>{groupCopy.tests}</p></div>
                <p className="interview-group-description">{groupCopy.description}</p>
                {first && <Link className="text-link interview-group-action" href={interviewPracticePath(lang, first)}>{groupCopy.action} <span aria-hidden>→</span></Link>}
                <details className="interview-topic-disclosure">
                  <summary>{navigation.browseQuestions(groupTopics.length)}</summary>
                  <ol className="interview-topic-list">
                    {groupTopics.map(topic => <li key={topic.anchor}>
                      <Link href={interviewPracticePath(lang, topic)}>
                        <span>{topic.number}</span><strong>{topic.title[lang]}</strong><small>{copy.practiceLabel} →</small>
                      </Link>
                    </li>)}
                  </ol>
                </details>
              </article>;
            })}
          </div>
        </section>

        <section aria-label={navigation.map}>
          <p>{navigation.mapDetail}</p>
          <InterviewPrepMap locale={lang} prep={prep} topics={topics} />
        </section>
      </div>
    </details>

    <InterviewLivePracticeGate locale={lang} topics={staticHosting ? toLiveInterviewPracticeTopics(lang, topics) : undefined} />

    <section className="interview-practice-method" aria-labelledby="interview-practice-method-title">
      <div><p className="eyebrow">{navigation.practiceEyebrow}</p><h2 id="interview-practice-method-title">{copy.useTitle}</h2></div>
      <ol>{copy.useSteps.map((step, index) => <li key={step}><span>0{index + 1}</span><p>{step}</p></li>)}</ol>
    </section>

    <aside className="interview-boundary">
      <div><p className="eyebrow">{copy.boundaryTitle}</p><p>{copy.boundary}</p></div>
      <div className="interview-boundary-actions">{map ? <Link className="button secondary" href={`/${lang}/articles/${map.slug}`}>{copy.mapAction}</Link> : null}<Link className="button primary" href={interviewPracticePath(lang, firstTopic)}>{copy.deckAction}</Link></div>
    </aside>
  </div>;
}
