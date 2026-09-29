import { getArticles } from '@/lib/content';
import { isRouteSurfaceEnabledInCurrentBuild } from '@/lib/release-server-scope';

export const dynamic = 'force-static';

function cdata(value: string) {
  return `<![CDATA[${value.replaceAll(']]>', ']]]]><![CDATA[>')}]]>`;
}

export function GET() {
  if (!isRouteSurfaceEnabledInCurrentBuild('rss')) {
    return new Response('Not found', { status: 404 });
  }
  const origin = (process.env.SITE_ORIGIN || 'https://preview.invalid').replace(/\/$/, '');
  const feedUrl = `${origin}/rss.xml`;
  const articles = getArticles();
  const lastBuildDate = articles.length
    ? new Date(Math.max(...articles.map(article => Date.parse(article.updatedAt)))).toUTCString()
    : new Date('2026-09-22').toUTCString();
  const items = articles.map(article => {
    const url = `${origin}/en/articles/${article.slug}`;
    return `<item><title>${cdata(article.translations.en.title)}</title><link>${url}</link><guid isPermaLink="false">${article.id}</guid><pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate><description>${cdata(article.translations.en.description)}</description></item>`;
  }).join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>AI.DOG Learning &amp; Portfolio Library</title><link>${origin}/en</link><description>Evidence-led notes for learning AI and building inspectable portfolio work.</description><language>en</language><atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/><lastBuildDate>${lastBuildDate}</lastBuildDate>${items}</channel></rss>`;
  return new Response(xml, { headers: { 'content-type': 'application/rss+xml; charset=utf-8' } });
}
