import startingPointManifest from '@/content/learning-evidence-starting-points.json';
import type { EvidenceGapId } from './learning-evidence-planner';
import type { LearningRouteId } from './learning-evidence-probe';
import { canonicalLocaleRecord, normalizeLocaleContent, type Locale } from './types';

type StartingPointFields = {
  title: string;
  whatToInspect: string;
  firstWeekArtefact: string;
  nonClaim: string;
  caveat: string;
};

export type LearningEvidenceStartingPoint = {
  id: string;
  officialUrl: string;
  lastChecked: string;
  fit: {
    gapIds: EvidenceGapId[];
    routeIds: LearningRouteId[];
  };
  copy: Record<Locale, StartingPointFields>;
};

type StartingPointManifest = {
  schemaVersion: number;
  sources: LearningEvidenceStartingPoint[];
};

export type LearningEvidenceStartingPointCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  empty: string;
  officialUrl: string;
  lastChecked: string;
  whatToInspect: string;
  firstWeekArtefact: string;
  nonClaim: string;
  caveat: string;
  openOfficialSource: string;
};

const manifest = normalizeLocaleContent(startingPointManifest) as unknown as StartingPointManifest;

export const learningEvidenceStartingPoints = manifest.sources;

export const learningEvidenceStartingPointCopy: Record<Locale, LearningEvidenceStartingPointCopy> = canonicalLocaleRecord({
  'zh-TW': {
    eyebrow: '官方起步頁',
    title: '選好缺口與路線後，先核對兩個起點',
    intro: '以下最多兩頁只依你目前的缺口與路線配對，不是排名、課程清單或推薦。看完後，仍要用上方自己選擇的成本、起步要求、內容是否夠新、能否留下成果、回饋機會與停止條件比較。',
    empty: '暫時沒有配對的官方起點；保留上方的比較條件，先做本機小試跑。',
    officialUrl: '官方 URL',
    lastChecked: '最後核對',
    whatToInspect: '要核對什麼',
    firstWeekArtefact: '第一週留下什麼',
    nonClaim: '不能聲稱什麼',
    caveat: '使用時要留意',
    openOfficialSource: '在新分頁開啟官方頁面'
  },
  'zh-Hans': {
    eyebrow: '官方起步页',
    title: '选好缺口与路线后，先核对两个起点',
    intro: '以下最多两页只依你目前的缺口与路线配对，不是排名、课程清单或推荐。看完后，仍要用上方自己选择的成本、起步要求、内容是否够新、能否留下成果、反馈机会与停止条件比较。',
    empty: '暂时没有配对的官方起点；保留上方的比较条件，先做本机小试跑。',
    officialUrl: '官方 URL',
    lastChecked: '最后核对',
    whatToInspect: '要核对什么',
    firstWeekArtefact: '第一周留下什么',
    nonClaim: '不能声称什么',
    caveat: '使用时要留意',
    openOfficialSource: '在新分页打开官方页面'
  },
  en: {
    eyebrow: 'OFFICIAL STARTING POINTS',
    title: 'After choosing the gap and route, inspect two starting points',
    intro: 'These are at most two official pages matched to the gap and route you chose—not rankings, a course list, or recommendations. After reading, still compare the cost, prerequisites, freshness, artefact, feedback, and stop condition you selected above.',
    empty: 'No official starting point matches this route yet. Keep the comparison conditions above and run the local rehearsal first.',
    officialUrl: 'Official URL',
    lastChecked: 'Last checked',
    whatToInspect: 'What to inspect',
    firstWeekArtefact: 'First-week artefact',
    nonClaim: 'What it does not claim',
    caveat: 'Caveat',
    openOfficialSource: 'Open official page in a new tab'
  }
});

export function getLearningEvidenceStartingPoints(gapId: EvidenceGapId, routeId: LearningRouteId) {
  return learningEvidenceStartingPoints
    .filter(source => source.fit.gapIds.includes(gapId) && source.fit.routeIds.includes(routeId))
    .slice(0, 2);
}
