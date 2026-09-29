import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { ArticleCard } from '@/components/site';
import { CategoryJourneyHandoff } from '@/components/reader-journey-links';
import { getCategoryArticles } from '@/lib/content';
import { interviewLabCopy } from '@/lib/interview-lab';
import { categories, isLocale } from '@/lib/i18n';
import { isRouteSurfaceEnabledInCurrentBuild } from '@/lib/release-server-scope';
import { localizedAlternates, pageSocialMetadata } from '@/lib/site-metadata';
import { CATEGORY_IDS, type CategoryId } from '@/lib/types';

export function generateStaticParams() {
  return CATEGORY_IDS.map(category => ({ category }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; category: string }> }): Promise<Metadata> {
  const { lang, category } = await params;
  if (!isLocale(lang) || !CATEGORY_IDS.includes(category as CategoryId)) return {};
  const copy = categories[category as CategoryId][lang];
  const path = `/${lang}/categories/${category}`;
  return {
    title: copy.name,
    description: copy.description,
    alternates: localizedAlternates(path),
    ...pageSocialMetadata({ title: copy.name, description: copy.description, path })
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ lang: string; category: string }> }) {
  const { lang, category } = await params;
  if (!isLocale(lang) || !isRouteSurfaceEnabledInCurrentBuild('categories')) notFound();
  if (category === 'roles-pathways') redirect(`/${lang}/categories/ai-engineering-career`);
  if (!CATEGORY_IDS.includes(category as CategoryId)) notFound();
  const id = category as CategoryId;
  const copy = categories[id][lang];
  const articles = getCategoryArticles(id);
  const labCopy = id === 'ai-engineering-interviews' ? interviewLabCopy[lang] : undefined;
  const codexInstallCopy = {
    'zh-HK': {
      eyebrow: '課程工具',
      title: '所有課程都會以 Codex 作為主要示範工具',
      text: '建議先安裝 Codex，之後跟着課程用受限資料夾、逐次批准和人工覆核完成練習。若你的帳戶、方案或地區暫時不可用，仍可先完成共同核心。',
      action: '安裝 Codex →',
    },
    'zh-TW': {
      eyebrow: '課程工具',
      title: '所有課程都會以 Codex 作為主要示範工具',
      text: '建議先安裝 Codex，之後跟著課程用受限資料夾、逐次批准與人工覆核完成練習。若你的帳戶、方案或地區暫時不可用，仍可先完成共同核心。',
      action: '安裝 Codex →',
    },
    'zh-Hans': {
      eyebrow: '课程工具',
      title: '所有课程都会以 Codex 作为主要示范工具',
      text: '建议先安装 Codex，然后跟着课程用受限文件夹、逐次批准与人工复核完成练习。如果你的账户、方案或地区暂时不可用，仍可先完成共同核心。',
      action: '安装 Codex →',
    },
    en: {
      eyebrow: 'COURSE TOOL',
      title: 'Codex is the main demonstration tool across our courses',
      text: 'Install Codex first, then use the course exercises with a constrained folder, approval-on-request, and human review. If your account, plan, or region does not support it, you can still complete the shared core.',
      action: 'Install Codex →',
    },
  }[lang === 'zh-Hant' ? 'zh-TW' : lang];

  return <div className="shell page">
    <header className="page-header"><p className="eyebrow">CATEGORY</p><h1>{copy.name}</h1><p>{copy.description}</p></header>
    <section className="category-codex-install" aria-labelledby="category-codex-install-title">
      <div><p className="eyebrow">{codexInstallCopy.eyebrow}</p><h2 id="category-codex-install-title">{codexInstallCopy.title}</h2><p>{codexInstallCopy.text}</p></div>
      <a className="button secondary" href="https://learn.chatgpt.com/docs/quickstart" target="_blank" rel="noreferrer">{codexInstallCopy.action}</a>
    </section>
    {labCopy && isRouteSurfaceEnabledInCurrentBuild('interview-lab') && <section className="category-interview-lab" aria-labelledby="category-interview-lab-title">
      <div><p className="eyebrow">{labCopy.eyebrow}</p><h2 id="category-interview-lab-title">{labCopy.title}</h2><p>{labCopy.intro}</p></div>
      <Link className="button primary" href={`/${lang}/interview-lab`}>{labCopy.navigatorAction}</Link>
    </section>}
    <CategoryJourneyHandoff locale={lang} category={id} />
    <div className="article-grid">{articles.map(article => <ArticleCard key={article.id} article={article} locale={lang} headingLevel="h2" />)}</div>
  </div>;
}
