import Link from 'next/link';
import type { ArticleMeta, CategoryId, Locale } from '@/lib/types';
import { canonicalLocaleRecord } from '@/lib/types';
import { articleTypes, categories, ui } from '@/lib/i18n';
import { getReleaseScopedRoadmap } from '@/lib/release-learning-content';
import { isRouteSurfaceEnabledInCurrentBuild, isSeriesEnabledInCurrentBuild } from '@/lib/release-server-scope';
import { supportCopy } from '@/lib/support';
import { DesktopNavigationMore, LocaleSwitch, MobileNavigation, NavigationLink } from './locale-switch';

const navigationCopy: Record<Locale, { skip: string; primary: string; footer: string; start: string; learningMap: string; firstWorkflow: string; portfolio: string; more: string; moreLabel: string; buildAndPortfolio: string; toolsAndResources: string; aboutAidog: string }> = canonicalLocaleRecord({
  'zh-HK': { skip: '直接到主要內容', primary: '主要導覽', footer: '頁尾導覽', start: '選擇起點', learningMap: 'AI Engineer 學習地圖', firstWorkflow: '開始實作', portfolio: '整理作品集', more: '更多', moreLabel: '更多內容', buildAndPortfolio: '實作與作品', toolsAndResources: '工具與資源', aboutAidog: '關於 AI.DOG' },
  'zh-TW': { skip: '直接前往主要內容', primary: '主要導覽', footer: '頁尾導覽', start: '選擇起點', learningMap: 'AI Engineer 學習地圖', firstWorkflow: '開始實作', portfolio: '整理作品集', more: '更多', moreLabel: '更多內容', buildAndPortfolio: '實作與作品', toolsAndResources: '工具與資源', aboutAidog: '關於 AI.DOG' },
  'zh-Hans': { skip: '直接前往主要内容', primary: '主要导航', footer: '页脚导航', start: '选择起点', learningMap: 'AI Engineer 学习地图', firstWorkflow: '开始实践', portfolio: '整理作品集', more: '更多', moreLabel: '更多内容', buildAndPortfolio: '实践与作品', toolsAndResources: '工具与资源', aboutAidog: '关于 AI.DOG' },
  en: { skip: 'Skip to main content', primary: 'Primary navigation', footer: 'Footer navigation', start: 'Choose a starting point', learningMap: 'AI Engineer learning map', firstWorkflow: 'Start building', portfolio: 'Package a portfolio', more: 'More', moreLabel: 'More content', buildAndPortfolio: 'Build and portfolio', toolsAndResources: 'Tools and resources', aboutAidog: 'About AI.DOG' }
});

function DogMark() {
  // This is a fixed, decorative local asset. A native image keeps the shared
  // shell free of the framework image client runtime.
  // eslint-disable-next-line @next/next/no-img-element
  return <img className="brand-mark" src="/ai-dog-mark.webp" alt="" width={32} height={32} decoding="async" aria-hidden="true" />;
}

export function Header({ locale }: { locale: Locale }) {
  const t = ui[locale];
  const navCopy = navigationCopy[locale];
  const support = supportCopy[locale];
  const supportLabel = support.footerLink;
  const roadmapRoute = isRouteSurfaceEnabledInCurrentBuild('series') && isSeriesEnabledInCurrentBuild('ai-engineer-roadmap')
    ? { href: '/' + locale + '/series/ai-engineer-roadmap', surface: 'series' }
    : isRouteSurfaceEnabledInCurrentBuild('home') && getReleaseScopedRoadmap()?.stages.some(stage => stage.number === '00')
      ? { href: '/' + locale + '#roadmap-stage-00', surface: 'home' }
      : null;
  const hasLearnerStart = Boolean(roadmapRoute) || [
    'no-code-starter-lab',
    'coding-starter-lab',
    'labs',
    'resources',
    'portfolio-evidence-planner',
    'interview-lab'
  ].some(isRouteSurfaceEnabledInCurrentBuild);
  const primaryLinks = [
    { href: '/' + locale + (hasLearnerStart ? '#learner-start' : '#start-here'), label: navCopy.start, surface: 'home' },
    ...(roadmapRoute ? [{ ...roadmapRoute, label: navCopy.learningMap }] : []),
    ...(isSeriesEnabledInCurrentBuild('ai-use-routes') ? [{ href: '/' + locale + '/series/ai-use-routes', label: navCopy.firstWorkflow, surface: 'series' }] : []),
    { href: '/' + locale + '/interview-lab', label: t.interviewLab as string, surface: 'interview-lab' },
  ].filter(link => isRouteSurfaceEnabledInCurrentBuild(link.surface));
  const moreGroups = [
    {
      label: navCopy.buildAndPortfolio,
      links: [
        { href: '/' + locale + '/portfolio-evidence-planner', label: navCopy.portfolio, surface: 'portfolio-evidence-planner' },
        { href: '/' + locale + '/labs', label: t.labs as string, surface: 'labs' }
      ]
    },
    {
      label: navCopy.toolsAndResources,
      links: [
        { href: '/' + locale + '/learning-evidence-planner', label: t.planner as string, surface: 'learning-evidence-planner' },
        { href: '/' + locale + '/resources', label: (t.nav as string[])[2], surface: 'resources' }
      ]
    },
    {
      label: navCopy.aboutAidog,
      links: [
        { href: '/' + locale + '/support', label: supportLabel, surface: 'support' },
        { href: '/' + locale + '/about', label: (t.nav as string[])[3], surface: 'about' }
      ]
    }
  ].map(group => ({ ...group, links: group.links.filter(link => isRouteSurfaceEnabledInCurrentBuild(link.surface)) })).filter(group => group.links.length);
  const brand = <><DogMark />AI.DOG</>;
  return <header className="site-header" lang={locale}><a className="skip-link" href="#main-content">{navCopy.skip}</a><div className="shell header-inner">
    {isRouteSurfaceEnabledInCurrentBuild('home') ? <Link className="brand" href={'/' + locale} aria-label={t.brand as string}>{brand}</Link> : <span className="brand" aria-label={t.brand as string}>{brand}</span>}
    <nav className="site-nav" aria-label={navCopy.primary}>
      {primaryLinks.map(link => <NavigationLink key={link.href} href={link.href} label={link.label} />)}
      {moreGroups.length ? <DesktopNavigationMore summary={navCopy.more} navigationLabel={navCopy.moreLabel} groups={moreGroups} /> : null}
    </nav>
    <MobileNavigation summary={t.menu as string} navigationLabel={t.menu as string} moreLabel={navCopy.moreLabel} primaryLinks={primaryLinks} moreGroups={moreGroups} />
    <LocaleSwitch locale={locale} />
  </div></header>;
}

export function Footer({ locale }: { locale: Locale }) {
  const description = locale === 'en' ? 'Practical notes for learning AI and building work you can explain.' : locale === 'zh-Hans' ? '写给想学习 AI、建立能说清楚的作品集的人的实作笔记。' : locale === 'zh-Hant' ? '給想學 AI、建立說得清楚的作品集的人的實作筆記。' : '俾想學 AI、砌一個講得清楚嘅作品集嘅人睇嘅實作筆記。';
  const support = supportCopy[locale];
  const supportLabel = support.footerLink;
  const footerLinks = [
    { href: '/' + locale + '/support', label: supportLabel, surface: 'support' },
    { href: '/' + locale + '/about', label: ui[locale].about as string, surface: 'about' },
    { href: '/' + locale + '/privacy', label: ui[locale].privacy as string, surface: 'privacy' }
  ].filter(link => isRouteSurfaceEnabledInCurrentBuild(link.surface));
  return <footer className="footer" lang={locale}><div className="shell footer-grid"><div><strong className="footer-brand"><DogMark />AI.DOG</strong><p>{description}</p></div>{footerLinks.length ? <nav className="footer-links" aria-label={navigationCopy[locale].footer}>{footerLinks.map(link => <Link key={link.href} href={link.href}>{link.label}</Link>)}</nav> : null}</div></footer>;
}

export function ArticleCard({ article, locale, headingLevel = 'h3' }: { article: ArticleMeta; locale: Locale; headingLevel?: 'h2' | 'h3' }) {
  const copy = article.translations[locale];
  const category = categories[article.categoryId][locale];
  const href = '/' + locale + '/articles/' + article.slug;
  const Heading = headingLevel;
  return <article className="article-card">
    <div className="card-meta"><span>{category.name}</span><span>{articleTypes[locale][article.type]}</span></div>
    <div className="card-copy"><Heading><Link href={href}>{copy.title}</Link></Heading><p>{copy.description}</p><div className="tags">{article.tags.slice(0, 3).map(tag => <span key={tag}>{tag}</span>)}</div></div>
    <Link className="text-link" href={href}>{ui[locale].read as string}<span className="sr-only">: {copy.title}</span> <span aria-hidden>→</span></Link>
  </article>;
}

export function CategoryGrid({ locale, categoryIds }: { locale: Locale; categoryIds?: readonly CategoryId[] }) {
  if (!isRouteSurfaceEnabledInCurrentBuild('categories')) return null;
  const permitted = categoryIds ? new Set(categoryIds) : null;
  const entries = Object.entries(categories).filter(([id]) => !permitted || permitted.has(id as CategoryId));
  if (!entries.length) return null;
  return <div className="category-grid">{entries.map(([id, copy], index) => <Link className="category-card" key={id} href={'/' + locale + '/categories/' + id}><span className="category-number">0{index + 1}</span><div><h3>{copy[locale].name}</h3><p>{copy[locale].description}</p></div><span className="category-arrow" aria-hidden>→</span></Link>)}</div>;
}

export function LanguageSwitch({ locale, slug }: { locale: Locale; slug: string }) {
  void slug;
  return <LocaleSwitch locale={locale} expanded />;
}
