export type ArticleOutlineHeading = {
  level: 2 | 3;
  text: string;
  id: string;
};

export type ParsedArticleMarkdownHeading = {
  level: 2 | 3;
  sourceText: string;
  text: string;
  explicitId?: string;
};

function plainHeadingText(value: string) {
  return value
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

export function parseArticleMarkdownHeading(line: string): ParsedArticleMarkdownHeading | null {
  const match = line.match(/^(##|###) (.*)$/);
  if (!match) return null;

  const level = match[1].length as 2 | 3;
  const source = match[2];
  const explicit = source.match(/^(.*?)\s*\{#([a-z0-9-]+)\}\s*$/);
  const sourceText = explicit ? explicit[1].trimEnd() : source;

  return {
    level,
    sourceText,
    text: plainHeadingText(sourceText),
    explicitId: explicit?.[2],
  };
}

function makeAnchorBase(value: string, fallbackIndex: number) {
  const slug = value
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
  return slug || `section-${fallbackIndex}`;
}

function uniqueAnchorId(base: string, used: Set<string>) {
  if (!used.has(base)) {
    used.add(base);
    return base;
  }

  let suffix = 2;
  while (used.has(`${base}-${suffix}`)) suffix += 1;
  const id = `${base}-${suffix}`;
  used.add(id);
  return id;
}

/**
 * Returns the headings readers can use to move around a long article.
 * Code fences are deliberately ignored so examples never become navigation.
 */
export function extractArticleOutline(markdown: string): ArticleOutlineHeading[] {
  const headings: ArticleOutlineHeading[] = [];
  const usedIds = new Set<string>();
  let inCodeFence = false;

  for (const rawLine of markdown.split(/\r?\n/)) {
    const line = rawLine.trimEnd();
    if (line.startsWith('```')) {
      inCodeFence = !inCodeFence;
      continue;
    }
    if (inCodeFence) continue;

    const heading = parseArticleMarkdownHeading(line);
    if (!heading) continue;

    const base = heading.explicitId ?? makeAnchorBase(heading.text || heading.sourceText, headings.length + 1);
    headings.push({
      level: heading.level,
      text: heading.text || heading.sourceText || `Section ${headings.length + 1}`,
      id: uniqueAnchorId(base, usedIds),
    });
  }

  return headings;
}
