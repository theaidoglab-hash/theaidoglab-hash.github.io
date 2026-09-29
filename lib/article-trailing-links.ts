/**
 * Keeps a dense, optional reading list from competing with an article's
 * primary next step. This deliberately accepts only a final, clearly named
 * block with two or more site-internal links. Everything else stays in the
 * article body, including external sources and explanatory conclusions.
 */
export type ArticleTrailingLinks = Readonly<{
  main: string;
  links?: string;
}>;

const relatedLinkLabel = /^(?:延伸閱讀|延伸学习|延伸學習|相關閱讀|相关阅读|相關指南|相关指南|下一步(?:閱讀|阅读)?|Related reading|Further reading|Next step|Keep learning)(?:[\s：:，,。]|$)/iu;

const markdownLink = /\[[^\]\n]+\]\(([^)\s]+)(?:\s+"[^"]*")?\)/gu;

function isRelatedLinkHeading(value: string) {
  const heading = value.match(/^#{2,3}\s+(.+)$/u);
  return Boolean(heading && relatedLinkLabel.test(heading[1].trim()));
}

function isDenseInternalLinkBlock(value: string) {
  const links = [...value.matchAll(markdownLink)];
  return links.length >= 2 && links.every(([, href]) => href.startsWith('/') && !href.startsWith('//'));
}

/**
 * Pull a final, explicitly labelled internal reading list into optional UI.
 * A paragraph is only moved when it begins with a recognised next-step label,
 * or when an immediately preceding heading supplies that label.
 */
export function splitTrailingRelatedLinks(markdown: string): ArticleTrailingLinks {
  const trimmed = markdown.trimEnd();
  if (!trimmed) return { main: markdown };

  const blocks = trimmed.split(/\r?\n\s*\r?\n/u);
  const finalBlock = blocks.at(-1)?.trim();
  if (!finalBlock || !isDenseInternalLinkBlock(finalBlock)) return { main: markdown };

  const previousBlock = blocks.at(-2)?.trim();
  const hasRelatedHeading = previousBlock ? isRelatedLinkHeading(previousBlock) : false;
  if (!hasRelatedHeading && !relatedLinkLabel.test(finalBlock)) return { main: markdown };

  const endIndex = hasRelatedHeading ? blocks.length - 2 : blocks.length - 1;
  const main = blocks.slice(0, endIndex).join('\n\n').trimEnd();
  if (!main) return { main: markdown };

  return { main, links: finalBlock };
}
