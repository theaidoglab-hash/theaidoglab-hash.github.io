import type { ArticleLearningContract as LearningContract } from '@/lib/article-learning-contract';
import type { Locale } from '@/lib/types';

const copy: Record<Locale, Readonly<{
  title: string;
  prerequisite: string;
  effort: string;
  reading: string;
  readingNote: string;
  guidedPractice: string;
  runnablePractice: string;
  articlePracticeNote: string;
  roadmapPracticeNote: string;
  evidence: string;
  detail: string;
  summary: (range: Readonly<{ minimum: number; maximum: number }>) => string;
  minutes: (range: Readonly<{ minimum: number; maximum: number }>) => string;
}>> = {
  'zh-Hant': {
    title: '學習約定',
    prerequisite: '開始前',
    effort: '預計時間',
    reading: '閱讀與複核',
    readingNote: '按本語言版本的內容長度估算。',
    guidedPractice: '整理與自我檢查',
    runnablePractice: '動手練習',
    articlePracticeNote: '建議完成本文的證據任務。',
    roadmapPracticeNote: '涵蓋整個 roadmap 站點與其練習，不只是閱讀本文。',
    evidence: '完成時留下',
    detail: '時間與練習範圍',
    summary: range => `閱讀與練習合共 ${range.minimum === range.maximum ? `約 ${range.maximum}` : `${range.minimum}–${range.maximum}`} 分鐘`,
    minutes: ({ minimum, maximum }) => minimum === maximum ? `約 ${maximum} 分鐘` : `${minimum}–${maximum} 分鐘`,
  },
  'zh-Hans': {
    title: '学习约定',
    prerequisite: '开始前',
    effort: '预计时间',
    reading: '阅读与复核',
    readingNote: '按本语言版本的内容长度估算。',
    guidedPractice: '整理与自我检查',
    runnablePractice: '动手练习',
    articlePracticeNote: '建议完成本文的证据任务。',
    roadmapPracticeNote: '涵盖整个 roadmap 站点及其练习，不只是阅读本文。',
    evidence: '完成时留下',
    detail: '时间与练习范围',
    summary: range => `阅读与练习共 ${range.minimum === range.maximum ? `约 ${range.maximum}` : `${range.minimum}–${range.maximum}`} 分钟`,
    minutes: ({ minimum, maximum }) => minimum === maximum ? `约 ${maximum} 分钟` : `${minimum}–${maximum} 分钟`,
  },
  en: {
    title: 'Learning contract',
    prerequisite: 'Before you start',
    effort: 'Estimated effort',
    reading: 'Read and review',
    readingNote: 'Estimated from the length of this language edition.',
    guidedPractice: 'Organise and self-check',
    runnablePractice: 'Hands-on practice',
    articlePracticeNote: 'Suggested time to complete this guide’s evidence task.',
    roadmapPracticeNote: 'Covers the full roadmap stage and its practice, not only this article.',
    evidence: 'Finish with',
    detail: 'Time and practice scope',
    summary: range => `${range.minimum === range.maximum ? `About ${range.maximum}` : `${range.minimum}–${range.maximum}`} min total`,
    minutes: ({ minimum, maximum }) => minimum === maximum ? `about ${maximum} min` : `${minimum}–${maximum} min`,
  },
};

export function ArticleLearningContract({
  contract,
  locale,
}: Readonly<{
  contract: LearningContract;
  locale: Locale;
}>) {
  const labels = copy[locale];
  const practiceLabel = contract.practiceMode === 'runnable-practice'
    ? labels.runnablePractice
    : labels.guidedPractice;
  const practiceNote = contract.practiceScope === 'roadmap-stage'
    ? labels.roadmapPracticeNote
    : labels.articlePracticeNote;

  const totalMinutes = {
    minimum: contract.readingMinutes.minimum + contract.practiceMinutes.minimum,
    maximum: contract.readingMinutes.maximum + contract.practiceMinutes.maximum,
  };

  return <section className="article-outline article-learning-contract" aria-labelledby="article-learning-contract-title">
    <h2 id="article-learning-contract-title">{labels.title}</h2>
    <div className="article-learning-contract-summary">{labels.summary(totalMinutes)}</div>
    <dl>
      <div>
        <dt>{labels.prerequisite}</dt>
        <dd>{contract.prerequisite}</dd>
      </div>
      <div>
        <dt>{labels.effort}</dt>
        <dd>{labels.minutes(totalMinutes)}</dd>
      </div>
      <div>
        <dt>{labels.evidence}</dt>
        <dd>{contract.evidence}</dd>
      </div>
    </dl>
    <details className="article-learning-contract-details">
      <summary>{labels.detail}</summary>
      <div className="article-learning-effort">
        <p><strong>{labels.reading}:</strong> {labels.minutes(contract.readingMinutes)} <small>{labels.readingNote}</small></p>
        <p><strong>{practiceLabel}:</strong> {labels.minutes(contract.practiceMinutes)} <small>{practiceNote}</small></p>
      </div>
    </details>
  </section>;
}
