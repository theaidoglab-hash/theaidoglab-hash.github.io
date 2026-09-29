export const MAX_RESOURCE_SEARCH_QUERY_LENGTH = 160;
export const MAX_RESOURCE_SEARCH_CLAUSES = 12;
export const MAX_RESOURCE_SEARCH_TERM_LENGTH = 64;

const resourceSearchSynonyms = [
  ['vector database', 'vector databases', 'vector db', 'vector store', 'vector stores', '向量資料庫', '向量 資料庫', '向量数据库', '向量 数据库', '向量庫', '向量库'],
  ['deploy', 'deployed', 'deploying', 'deployment', '部署'],
  ['math', 'maths', 'mathematics', '數學', '数学'],
  ['cv', 'resume', 'résumé', '履歷', '履历', '簡歷', '简历'],
] as const;

export type ResourceSearchClause = readonly string[];

export function normalizeResourceSearchText(value: string) {
  return value
    .normalize('NFKC')
    .toLocaleLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenizeNormalizedQuery(query: string) {
  return query
    .replace(/[^\p{L}\p{N}+#.\-]+/gu, ' ')
    .split(/\s+/u)
    .map(token => token.replace(/^[.\-]+|[.\-]+$/g, '').slice(0, MAX_RESOURCE_SEARCH_TERM_LENGTH))
    .filter(Boolean);
}

const normalizedSynonymGroups = resourceSearchSynonyms.map(group => (
  [...new Set(group.map(normalizeResourceSearchText))]
));

const synonymPhrases = normalizedSynonymGroups.flatMap(group => (
  group.map(term => ({ group, tokens: tokenizeNormalizedQuery(term) }))
    .filter(entry => entry.tokens.length > 1)
));

function sameTokensAt(tokens: string[], offset: number, candidate: string[]) {
  return candidate.every((token, index) => tokens[offset + index] === token);
}

/**
 * Turn a learner query into AND clauses. Terms inside one clause are synonyms
 * (OR), while every clause must match. Multi-word synonyms are consumed as one
 * concept, so `vector database deployment` produces two clauses, not three.
 */
export function buildResourceSearchClauses(query: string): ResourceSearchClause[] {
  const normalizedQuery = normalizeResourceSearchText(query.slice(0, MAX_RESOURCE_SEARCH_QUERY_LENGTH));
  if (!normalizedQuery) return [];

  const tokens = tokenizeNormalizedQuery(normalizedQuery);
  const clauses: ResourceSearchClause[] = [];

  for (let index = 0; index < tokens.length && clauses.length < MAX_RESOURCE_SEARCH_CLAUSES;) {
    const phrase = synonymPhrases
      .filter(entry => entry.tokens.length <= tokens.length - index && sameTokensAt(tokens, index, entry.tokens))
      .sort((left, right) => right.tokens.length - left.tokens.length)[0];

    if (phrase) {
      clauses.push(phrase.group);
      index += phrase.tokens.length;
      continue;
    }

    const token = tokens[index];
    clauses.push(normalizedSynonymGroups.find(group => group.includes(token)) ?? [token]);
    index += 1;
  }

  return clauses;
}

export function containsResourceSearchTerm(searchText: string, term: string) {
  const normalizedTerm = normalizeResourceSearchText(term);
  if (!normalizedTerm) return true;
  if (/^[a-z0-9]+$/.test(normalizedTerm)) {
    const escaped = normalizedTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(^|[^a-z0-9])${escaped}(?=$|[^a-z0-9])`, 'u').test(searchText);
  }
  return searchText.includes(normalizedTerm);
}

export function matchesResourceSearchClauses(searchText: string, clauses: ResourceSearchClause[]) {
  const normalizedText = normalizeResourceSearchText(searchText);
  return clauses.every(alternatives => (
    alternatives.some(term => containsResourceSearchTerm(normalizedText, term))
  ));
}

export function matchesResourceSearchQuery(searchText: string, query: string) {
  return matchesResourceSearchClauses(searchText, buildResourceSearchClauses(query));
}
