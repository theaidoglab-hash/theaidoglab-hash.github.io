import Link from 'next/link';
import { isRouteSurfaceEnabledInCurrentBuild, isSeriesEnabledInCurrentBuild } from '@/lib/release-server-scope';
import type { Locale } from '@/lib/types';

type TechnicalConceptLink = Readonly<{
  title: string;
  text: string;
  action: string;
  href: string;
  kind: 'article' | 'series';
}>;

type TechnicalConceptPathCopy = Readonly<{
  eyebrow: string;
  title: string;
  intro: string;
  audience: string;
  bridge: string;
  glossaryAction: string;
  navigationLabel: string;
  links: readonly TechnicalConceptLink[];
}>;

const technicalConceptPathCopy: Record<Locale, TechnicalConceptPathCopy> = {
  'zh-Hant': {
    eyebrow: '技術向 LLM 系統概念',
    title: '由一條系統問題開始，而不是先選 GPU',
    intro: '想理解模型系統為何慢、何時用盡記憶體，或長輸入會改變甚麼？先由眼前的問題開始。每份指南都有可核對的學習邊界；不提供硬件選購、容量承諾或效能測試。',
    audience: '適合已有基本 AI 概念、想理解模型系統如何運作的技術學習者。剛開始學 AI 的讀者可先看詞彙表，再回來選問題。',
    bridge: '先用人話：TTFT 是送出問題到看見第一個字的等候時間；context 是模型這次可參考的內容；KV cache 是暫存已看內容、避免每次重算的做法。',
    glossaryAction: '先看 AI 工程共通語言的基礎詞彙',
    navigationLabel: 'LLM 系統問題起點',
    links: [
      { title: '第一個輸出為甚麼未到？', text: '分開 queue、prefill、first output、decode 和 validation，先知道「慢」發生在哪一段。', action: '拆開 request path', href: '/articles/inference-memory-scheduling-and-serving-engines#inference-request-path-lab-title', kind: 'article' },
      { title: '記憶體壓力從哪裡來？', text: '分開 weights、KV cache、context 和 concurrency；不要先假定只要加硬件。', action: '查看記憶體與容量取捨', href: '/articles/modern-attention-moe-and-serving-tradeoffs', kind: 'article' },
      { title: '長 context 與長輸出改變了甚麼？', text: '用固定任務分清 generation、sampling、context budget 和驗收；不要把每個問題都叫成 model 問題。', action: '查看生成取捨', href: '/articles/choose-transformer-generation-and-adaptation-tradeoffs', kind: 'article' },
      { title: '想把這些概念連成全圖？', text: '由 token／attention、generation／context、cache／throughput，再到 latency budget，逐站建立可解釋的心智模型。', action: '由第 03 站開始', href: '/series/ai-engineer-roadmap?phase=foundations#roadmap-stage-03', kind: 'series' }
    ]
  },
  'zh-Hans': {
    eyebrow: '面向技术学习者的 LLM 系统概念',
    title: '从一个系统问题开始，而不是先选 GPU',
    intro: '想理解模型系统为什么慢、何时耗尽内存，或长输入会改变什么？先从眼前的问题开始。每份指南都有可核对的学习边界；不提供硬件选购、容量承诺或性能测试。',
    audience: '适合已有基本 AI 概念、想理解模型系统如何运作的技术学习者。刚开始学 AI 的读者可先看词汇表，再回来选择问题。',
    bridge: '先用人话：TTFT 是提交问题到看见第一个字的等待时间；context 是模型这次可参考的内容；KV cache 是暂存已看内容、避免每次重算的做法。',
    glossaryAction: '先看 AI 工程共通语言的基础词汇',
    navigationLabel: 'LLM 系统问题起点',
    links: [
      { title: '第一个输出为什么还没到？', text: '分开 queue、prefill、first output、decode 和 validation，先知道“慢”发生在哪一段。', action: '拆开 request path', href: '/articles/inference-memory-scheduling-and-serving-engines#inference-request-path-lab-title', kind: 'article' },
      { title: '内存压力从哪里来？', text: '分开 weights、KV cache、context 和 concurrency；不要先假定只要加硬件。', action: '查看内存与容量取舍', href: '/articles/modern-attention-moe-and-serving-tradeoffs', kind: 'article' },
      { title: '长 context 与长输出改变了什么？', text: '用固定任务分清 generation、sampling、context budget 和验收；不要把每个问题都叫成 model 问题。', action: '查看生成取舍', href: '/articles/choose-transformer-generation-and-adaptation-tradeoffs', kind: 'article' },
      { title: '想把这些概念连成全图？', text: '由 token／attention、generation／context、cache／throughput，再到 latency budget，逐站建立可解释的心智模型。', action: '从第 03 站开始', href: '/series/ai-engineer-roadmap?phase=foundations#roadmap-stage-03', kind: 'series' }
    ]
  },
  en: {
    eyebrow: 'TECHNICAL LLM SYSTEMS',
    title: 'Start with one systems question, not a GPU choice',
    intro: 'Want to understand why a model system is slow, runs short of memory, or changes with a long input? Start with the question in front of you. Every guide has a checkable learning boundary; none is hardware-buying advice, a capacity promise, or a benchmark.',
    audience: 'For technical learners with basic AI concepts who want to understand how a model system behaves. If you are new to AI, read the glossary first, then return to choose a question.',
    bridge: 'In plain language: TTFT is the wait from sending a request to seeing its first word; context is the material the model can use this time; and a KV cache temporarily keeps already-read material so it does not need to be recalculated every time.',
    glossaryAction: 'Read the AI engineering shared-language guide for core terms',
    navigationLabel: 'LLM systems starting questions',
    links: [
      { title: 'Why has the first output not arrived?', text: 'Separate queueing, prefill, first output, decode, and validation before deciding where “slow” actually happens.', action: 'Unpack the request path', href: '/articles/inference-memory-scheduling-and-serving-engines#inference-request-path-lab-title', kind: 'article' },
      { title: 'Where does memory pressure come from?', text: 'Separate weights, KV cache, context, and concurrency instead of assuming that more hardware is the first answer.', action: 'Inspect memory and capacity trades', href: '/articles/modern-attention-moe-and-serving-tradeoffs', kind: 'article' },
      { title: 'What changes with long context and long output?', text: 'Use a fixed task to separate generation, sampling, context budget, and acceptance checks instead of calling every issue a model problem.', action: 'Inspect generation trades', href: '/articles/choose-transformer-generation-and-adaptation-tradeoffs', kind: 'article' },
      { title: 'Want to connect the whole picture?', text: 'Work from tokens and attention through generation, cache and throughput to latency budgets, one explainable stop at a time.', action: 'Start at stop 03', href: '/series/ai-engineer-roadmap?phase=foundations#roadmap-stage-03', kind: 'series' }
    ]
  }
};

function isTechnicalConceptLinkEnabled(link: TechnicalConceptLink) {
  return link.kind === 'series'
    ? isSeriesEnabledInCurrentBuild('ai-engineer-roadmap')
    : isRouteSurfaceEnabledInCurrentBuild('article-downloads');
}

export function TechnicalConceptPath({ locale }: Readonly<{ locale: Locale }>) {
  const copy = technicalConceptPathCopy[locale];
  const links = copy.links.filter(isTechnicalConceptLinkEnabled);
  if (!links.length) return null;

  return <section id="technical-concepts" className="reader-journey-navigation shell" aria-labelledby="technical-concepts-title" tabIndex={-1}>
    <div className="reader-journey-heading">
      <p className="eyebrow">{copy.eyebrow}</p>
      <h2 id="technical-concepts-title">{copy.title}</h2>
      <p>{copy.intro}</p>
      <p className="technical-concept-audience">{copy.audience}</p>
      <p className="technical-concept-bridge">{copy.bridge} <Link href={`/${locale}/articles/ai-engineering-shared-language`}>{copy.glossaryAction} <span aria-hidden="true">→</span></Link></p>
    </div>
    <nav className="reader-journey-grid" aria-label={copy.navigationLabel}>
      {links.map((link, index) => <Link className="reader-journey-link" href={`/${locale}${link.href}`} key={link.href}>
        <span className="reader-journey-number">{String(index + 1).padStart(2, '0')}</span>
        <span className="reader-journey-copy"><strong>{link.title}</strong><span>{link.text}</span></span>
        <span className="reader-journey-action">{link.action} <span aria-hidden="true">→</span></span>
      </Link>)}
    </nav>
  </section>;
}
