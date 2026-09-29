import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale, localeStaticParams } from '@/lib/i18n';
import { localizedAlternates, pageSocialMetadata } from '@/lib/site-metadata';

export function generateStaticParams() { return localeStaticParams(); }

const copy = {
  'zh-HK': { eyebrow: 'AI.DOG Lab · 工具觀察', title: 'Skills Hub：搵到可重用嘅 AI 能力', intro: '用 AI 做嘢時，最浪費時間嘅往往唔係寫 prompt，而係每次都由零開始教 Agent 點做。skills.sh 係我用來搜尋 skill，同時觀察 Agent skill 生態趨勢嘅外部入口。', sourceLabel: '開啟 skills.sh', whyTitle: '我會喺呢度睇乜？', why: [['找 skill', '先按工作問題搜尋，例如瀏覽器自動化、測試、設計或部署，再判斷有冇合適嘅專門 workflow。'], ['看趨勢', '留意安裝量、GitHub Stars、熱門主題同相關 skill，了解 Agent 工作流正向邊啲方向發展。'], ['做判斷', '熱門唔等於適合自己。仍然要睇來源、權限、資料邊界、維護狀態，同埋是否真的解決目前問題。']], workflowTitle: '一個簡單用法', workflow: ['先寫低你要完成嘅工作，而唔係先追逐某個工具。', '到 skills.sh 搜尋相關 skill，查看用途、來源及社群訊號。', '只在本地或測試環境試用，確認輸入、輸出及權限後，才考慮放入自己的工作流。'], boundaryTitle: '使用界線', boundary: 'skills.sh 顯示的是公開生態的目錄與訊號，不代表 AI.DOG 已核實每個 skill，也不代表安裝後一定安全、準確或適合生產環境。趨勢會變，使用前要重新查看來源與版本。', source: '外部來源：skills.sh' },
  'zh-Hant': { eyebrow: 'AI.DOG Lab · 工具觀察', title: 'Skills Hub：找到可重複使用的 AI 能力', intro: '使用 AI 時，最浪費時間的往往不是寫 prompt，而是每次都從零開始教 Agent 怎麼做。skills.sh 是我用來搜尋 skill，也觀察 Agent skill 生態趨勢的外部入口。', sourceLabel: '開啟 skills.sh', whyTitle: '我會在這裡看什麼？', why: [['找 skill', '按工作問題搜尋，再判斷是否有合適的專門 workflow。'], ['看趨勢', '留意安裝量、GitHub Stars、熱門主題與相關 skill。'], ['做判斷', '熱門不等於適合自己，仍要檢查來源、權限、資料邊界與維護狀態。']], workflowTitle: '一個簡單用法', workflow: ['先寫下要完成的工作，而不是先追逐某個工具。', '到 skills.sh 搜尋相關 skill，查看用途、來源與社群訊號。', '先在本機或測試環境試用，確認輸入、輸出與權限。'], boundaryTitle: '使用界線', boundary: 'skills.sh 是公開生態的目錄與訊號，不代表 AI.DOG 已核實每個 skill，也不代表安裝後一定安全、準確或適合生產環境。', source: '外部來源：skills.sh' },
  'zh-Hans': { eyebrow: 'AI.DOG Lab · 工具观察', title: 'Skills Hub：找到可重复使用的 AI 能力', intro: '使用 AI 时，最浪费时间的往往不是写 prompt，而是每次都从零开始教 Agent 怎么做。skills.sh 是我用来搜索 skill，也观察 Agent skill 生态趋势的外部入口。', sourceLabel: '打开 skills.sh', whyTitle: '我会在这里看什么？', why: [['找 skill', '按工作问题搜索，再判断是否有合适的专门 workflow。'], ['看趋势', '留意安装量、GitHub Stars、热门主题与相关 skill。'], ['做判断', '热门不等于适合自己，仍要检查来源、权限、数据边界与维护状态。']], workflowTitle: '一个简单用法', workflow: ['先写下要完成的工作，而不是先追逐某个工具。', '到 skills.sh 搜索相关 skill，查看用途、来源与社区信号。', '先在本地或测试环境试用，确认输入、输出与权限。'], boundaryTitle: '使用边界', boundary: 'skills.sh 是公开生态的目录与信号，不代表 AI.DOG 已核实每个 skill，也不代表安装后一定安全、准确或适合生产环境。', source: '外部来源：skills.sh' },
  en: { eyebrow: 'AI.DOG Lab · Tool watch', title: 'Skills Hub: finding reusable AI capability', intro: 'When AI work slows down, the problem is often not the prompt. It is teaching an Agent the same workflow from scratch every time. skills.sh is the external hub I use to find skills and watch where the Agent-skill ecosystem is moving.', sourceLabel: 'Open skills.sh', whyTitle: 'What I look for', why: [['Find skills', 'Search by the work you need to complete, then assess whether a specialised workflow fits.'], ['Watch signals', 'Track installs, GitHub Stars, topics, and related skills as ecosystem signals.'], ['Make a judgement', 'Popularity is not proof of fit. Check source, permissions, data boundaries, and maintenance.']], workflowTitle: 'A simple workflow', workflow: ['Write down the work to complete before choosing a tool.', 'Search skills.sh and inspect purpose, source, and community signals.', 'Try it locally or in a test environment before considering it for real work.'], boundaryTitle: 'Boundary', boundary: 'skills.sh is a public directory and signal source. It does not mean AI.DOG has verified every skill, or that installation makes a workflow safe, accurate, or production-ready.', source: 'External source: skills.sh' },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = copy[lang]; const path = `/${lang}/labs/skills-hub`;
  return { title: t.title, description: t.intro, alternates: localizedAlternates(path), ...pageSocialMetadata({ title: t.title, description: t.intro, path }) };
}

export default async function SkillsHubPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = copy[lang];
  return <div className="shell page skills-hub-page"><header className="page-header"><p className="eyebrow">{t.eyebrow}</p><h1>{t.title}</h1><p>{t.intro}</p><div className="hero-actions"><a className="button primary" href="https://www.skills.sh/" target="_blank" rel="noreferrer">{t.sourceLabel} ↗</a></div></header><section className="skills-hub-grid" aria-labelledby="skills-hub-why-title"><div className="skills-hub-section-heading"><p className="eyebrow">01 · 觀察框架</p><h2 id="skills-hub-why-title">{t.whyTitle}</h2></div><div className="skills-hub-cards">{t.why.map(([title, text]) => <article className="skills-hub-card" key={title}><h3>{title}</h3><p>{text}</p></article>)}</div></section><section className="skills-hub-workflow" aria-labelledby="skills-hub-workflow-title"><p className="eyebrow">02 · 由問題開始</p><h2 id="skills-hub-workflow-title">{t.workflowTitle}</h2><ol>{t.workflow.map(step => <li key={step}>{step}</li>)}</ol></section><aside className="skills-hub-boundary" role="note"><p className="eyebrow">{t.boundaryTitle}</p><p>{t.boundary}</p><a className="text-link" href="https://www.skills.sh/" target="_blank" rel="noreferrer">{t.source} ↗</a></aside></div>;
}
