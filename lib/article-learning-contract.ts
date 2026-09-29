import type { RoadmapArticleContext, RoadmapPracticeMode } from './roadmaps';
import type { ArticleMeta, Locale } from './types';

type MinuteRange = Readonly<{ minimum: number; maximum: number }>;

type LocalizedStandaloneContract = Readonly<{
  prerequisite: Record<Locale, string>;
  evidence: Record<Locale, string>;
  practiceMinutes: MinuteRange;
  practiceMode: RoadmapPracticeMode;
}>;

export type ArticleLearningContract = Readonly<{
  prerequisite: string;
  evidence: string;
  readingMinutes: MinuteRange;
  practiceMinutes: MinuteRange;
  practiceMode: RoadmapPracticeMode;
  practiceScope: 'article' | 'roadmap-stage';
}>;

function localized(traditional: string, simplified: string, english: string): Record<Locale, string> {
  return { 'zh-Hant': traditional, 'zh-Hans': simplified, en: english };
}

function standalone(
  prerequisite: Record<Locale, string>,
  evidence: Record<Locale, string>,
  practiceMinutes: MinuteRange,
  practiceMode: RoadmapPracticeMode = 'guided-self-check',
): LocalizedStandaloneContract {
  return { prerequisite, evidence, practiceMinutes, practiceMode };
}

/**
 * Explicit contracts for articles that are not owned by one roadmap stage.
 * Keeping these keyed by slug makes the exception visible and reviewable;
 * a new standalone article must add its own evidence target rather than
 * silently inheriting a generic article-type promise.
 */
const standaloneContracts: Readonly<Record<string, LocalizedStandaloneContract>> = {
  'choose-an-ai-engineering-path': standalone(
    localized(
      '帶一個目標職位或職位描述；不需要先懂特定模型或框架。',
      '带一个目标职位或职位描述；不需要先懂特定模型或框架。',
      'Bring one target role or job description; no specific model or framework knowledge is required.',
    ),
    localized(
      '一張角色交付地圖：列出交付對象、必備證據，以及下一個要補的作品。',
      '一张角色交付地图：列出交付对象、必备证据，以及下一个要补的作品。',
      'A role-deliverable map naming the recipient, required evidence, and the next portfolio piece to build.',
    ),
    { minimum: 20, maximum: 30 },
  ),
  'evaluate-ai-course-hackathon-event': standalone(
    localized(
      '準備一個活動或課程頁面，以及你想補的職位證據缺口。',
      '准备一个活动或课程页面，以及你想补的职位证据缺口。',
      'Bring one course or event page and the role-evidence gap you want it to close.',
    ),
    localized(
      '一張已填寫的機會評分表，包含預期產出、時間成本與停止條件。',
      '一张已填写的机会评分表，包含预期产出、时间成本和停止条件。',
      'A completed opportunity scorecard with the intended output, time cost, and a stop condition.',
    ),
    { minimum: 20, maximum: 30 },
  ),
  'ai-engineer-interview-learning-map': standalone(
    localized(
      '選一個目標角色，並準備一個你能誠實說明的專案或練習。',
      '选一个目标职位，并准备一个你能诚实说明的项目或练习。',
      'Choose one target role and bring one project or exercise you can describe honestly.',
    ),
    localized(
      '一段 90 秒回答，標出一個仍未補足的因果環節或邊界，並連到一件可核對的作品證據。',
      '一段 90 秒回答，标出一个仍未补足的因果环节或边界，并连到一件可检查的作品证据。',
      'A 90-second answer that names one missing causal link or boundary and points to one inspectable portfolio artefact.',
    ),
    { minimum: 25, maximum: 40 },
  ),
  'renewal-triage-mlops': standalone(
    localized(
      '能閱讀表格與基本指標；只使用文章提供的合成資料，不需要真實客戶資料。',
      '能阅读表格和基本指标；只使用文章提供的合成数据，不需要真实客户数据。',
      'Be comfortable reading a table and basic metrics. Use only the supplied synthetic data; no customer data is needed.',
    ),
    localized(
      '一份可重跑的佇列紀錄：資料時間點、基準規則、容量限制、監察訊號與回退決定。',
      '一份可重跑的队列记录：数据时间点、基准规则、容量限制、监测信号和回退决定。',
      'A rerunnable queue record with the data cutoff, baseline rule, capacity limit, monitoring signal, and rollback decision.',
    ),
    { minimum: 60, maximum: 90 },
    'runnable-practice',
  ),
  'build-a-low-code-ai-automation': standalone(
    localized(
      '帶一件低風險、可以只產生草稿的工作；不需要寫程式。',
      '带一件低风险、可以只生成草稿的工作；不需要写程序。',
      'Bring one low-risk task that can remain draft-only; no programming is required.',
    ),
    localized(
      '一份動作約定、數個固定驗收情境，以及由誰批准或拒絕輸出的紀錄。',
      '一份动作约定、数个固定验收情境，以及由谁批准或拒绝输出的记录。',
      'An action contract, several fixed acceptance cases, and a record of who approves or rejects the output.',
    ),
    { minimum: 30, maximum: 45 },
  ),
  'review-a-coding-agent-build-without-being-a-developer': standalone(
    localized(
      '準備一個範圍有限的本機改動或示範；不需要具備開發者程度，但要能要求測試證據。',
      '准备一个范围有限的本地改动或演示；不需要具备开发者水平，但要能要求测试证据。',
      'Bring one bounded local change or demo. Developer-level skill is not required, but you must be able to ask for test evidence.',
    ),
    localized(
      '一份 review packet：原定計畫、實際 diff、測試結果、權限邊界與人工接受或退回的決定。',
      '一份 review packet：原定计划、实际 diff、测试结果、权限边界和人工接受或退回的决定。',
      'A review packet containing the plan, actual diff, test results, permission boundary, and a human accept-or-return decision.',
    ),
    { minimum: 35, maximum: 50 },
  ),
  'turn-an-ai-course-into-an-eight-week-evidence-sprint': standalone(
    localized(
      '先選定一個學習來源，以及它要補的單一職位證據缺口。',
      '先选定一个学习来源，以及它要补的单一职位证据缺口。',
      'Choose one learning source and the single role-evidence gap it is meant to close.',
    ),
    localized(
      '一份八星期計畫：每週產出、固定檢查、回饋來源與停止或改路條件。',
      '一份八周计划：每周产出、固定检查、反馈来源和停止或改道条件。',
      'An eight-week plan with weekly outputs, fixed checks, a feedback route, and conditions to stop or change direction.',
    ),
    { minimum: 30, maximum: 45 },
  ),
  'ai-engineer-interview-practice-cards': standalone(
    localized(
      '選一條與目標角色相關的題目，並準備計時 90 秒作答。',
      '选一道与目标职位相关的题目，并准备计时 90 秒作答。',
      'Choose one question relevant to your target role and be ready to answer for 90 seconds.',
    ),
    localized(
      '一段經過兩輪修改的回答，清楚交代機制、取捨、失敗邊界與一件可追問的證據。',
      '一段经过两轮修改的回答，清楚交代机制、取舍、失败边界和一件可追问的证据。',
      'A twice-revised answer covering mechanism, trade-off, failure boundary, and one artefact an interviewer can inspect.',
    ),
    { minimum: 30, maximum: 45 },
  ),
  'use-ai-without-writing-code': standalone(
    localized(
      '帶一件低風險、可由人覆核的草稿工作；不需要寫程式或連接帳戶。',
      '带一件低风险、可由人复核的草稿工作；不需要写程序或连接账户。',
      'Bring one low-risk draft task a person can review; no code or connected account is required.',
    ),
    localized(
      '一份結構化輸入、三個固定情境、權限邊界，以及最後由誰作決定的紀錄。',
      '一份结构化输入、三个固定情境、权限边界，以及最后由谁作决定的记录。',
      'A structured input, three fixed cases, a permission boundary, and a record of who makes the final decision.',
    ),
    { minimum: 30, maximum: 45 },
  ),
  'use-ai-as-a-coding-partner-with-proof': standalone(
    localized(
      '能在本機開啟一個小型程式專案、查看 diff，並執行它原有的檢查。',
      '能在本地打开一个小型程序项目、查看 diff，并运行它原有的检查。',
      'Be able to open a small local codebase, inspect a diff, and run its existing checks.',
    ),
    localized(
      '一份可驗收改動紀錄：範圍、測試前後結果、diff review、未解風險與回退方式。',
      '一份可验收改动记录：范围、测试前后结果、diff review、未解风险和回退方式。',
      'An accepted-change record with scope, before-and-after test results, diff review, unresolved risk, and rollback route.',
    ),
    { minimum: 45, maximum: 75 },
    'runnable-practice',
  ),
  'approval-queue-low-code-portfolio': standalone(
    localized(
      '能使用表格或表單整理合成個案；不需要程式或真實個人資料。',
      '能使用表格或表单整理合成案例；不需要程序或真实个人数据。',
      'Be able to organise synthetic cases in a table or form; no code or real personal data is required.',
    ),
    localized(
      '一份可核對的 approval queue：欄位規格、正常與阻擋個案、人工 owner 和最終決定紀錄。',
      '一份可检查的 approval queue：字段规格、正常与阻挡案例、人工 owner 和最终决定记录。',
      'An inspectable approval queue with a field specification, pass and blocked cases, a human owner, and final decision records.',
    ),
    { minimum: 45, maximum: 60 },
  ),
  'choose-an-ai-learning-source-by-role-and-evidence-gap': standalone(
    localized(
      '先寫下一個目標角色、目前能力，以及最需要補的一項作品證據。',
      '先写下一个目标职位、目前能力，以及最需要补的一项作品证据。',
      'Write down one target role, your current capability, and the single portfolio-evidence gap that matters most.',
    ),
    localized(
      '一張來源紀錄與第一星期計畫：前置能力、練習輸出、回饋方法、費用或帳戶界線與不能聲稱的結果。',
      '一张来源记录和第一周计划：先备能力、练习输出、反馈方法、费用或账户边界和不能声称的结果。',
      'A source receipt and Week-1 plan covering prerequisites, practice output, feedback route, account or cost boundary, and nonclaims.',
    ),
    { minimum: 20, maximum: 30 },
  ),
  'turn-an-ai-request-into-an-accepted-change': standalone(
    localized(
      '準備一個小型功能要求，以及可在本機執行的現有檢查或驗收方法。',
      '准备一个小型功能要求，以及可在本地运行的现有检查或验收方法。',
      'Bring one small feature request and an existing local check or acceptance method you can run.',
    ),
    localized(
      '一份變更約定：決策 owner、非目標、正反驗收個案、測試結果、diff 決定與仍未解決的風險。',
      '一份变更约定：决策 owner、非目标、正反验收案例、测试结果、diff 决定和仍未解决的风险。',
      'A change contract with the decision owner, non-goal, positive and negative cases, test results, diff decision, and unresolved risk.',
    ),
    { minimum: 45, maximum: 60 },
    'runnable-practice',
  ),
  'build-a-public-data-kev-review-packet': standalone(
    localized(
      '能閱讀 CSV 或 JSON 欄位，並只使用文章指定的公開快照與合成情境。',
      '能阅读 CSV 或 JSON 字段，并只使用文章指定的公开快照和合成情境。',
      'Be able to read CSV or JSON fields and use only the public snapshot and synthetic cases named in the guide.',
    ),
    localized(
      '一份 public-data review packet：來源紀錄、allowlist、拒絕個案、前後比較、reviewer 決定與回退目標。',
      '一份 public-data review packet：来源记录、allowlist、拒绝案例、前后比较、reviewer 决定和回退目标。',
      'A public-data review packet with a source receipt, allowlist, rejection cases, before-and-after comparison, reviewer decision, and rollback target.',
    ),
    { minimum: 60, maximum: 90 },
    'runnable-practice',
  ),
  'choose-agent-and-evaluation-learning-sources-with-receipts': standalone(
    localized(
      '先選一個 agent 或 evaluation 證據缺口；不需要先購買課程或建立付費帳戶。',
      '先选一个 agent 或 evaluation 证据缺口；不需要先购买课程或建立付费账户。',
      'Choose one agent or evaluation evidence gap first; no course purchase or paid account is required.',
    ),
    localized(
      '一張來源紀錄與 Week-1 artefact 計畫，包含固定測試、人工決定、前置能力與帳戶或費用界線。',
      '一张来源记录和 Week-1 artefact 计划，包含固定测试、人工决定、先备能力和账户或费用边界。',
      'A source receipt and Week-1 artefact plan with fixed tests, a human decision, prerequisites, and account or cost boundaries.',
    ),
    { minimum: 25, maximum: 40 },
  ),
  'build-a-source-bound-context-brief': standalone(
    localized(
      '能閱讀基本表格，並把公開來源、合成數值與推論清楚分開。',
      '能阅读基本表格，并把公开来源、合成数值和推断清楚分开。',
      'Be able to read a basic table and keep public sources, synthetic values, and inference separate.',
    ),
    localized(
      '一份來源受限的背景摘要：來源紀錄、欄位檢查、拒絕情境、人工覆核與不能作預測的聲明。',
      '一份来源受限的背景摘要：来源记录、字段检查、拒绝情境、人工复核和不能作预测的声明。',
      'A source-bounded context brief with a source receipt, field checks, rejection cases, human review, and an explicit no-forecast claim.',
    ),
    { minimum: 60, maximum: 90 },
    'runnable-practice',
  ),
  'build-one-flagship-ai-portfolio-project': standalone(
    localized(
      '帶一個有限的專案構想，以及可合法使用的合成或公開資料路線。',
      '带一个有限的项目构想，以及可合法使用的合成或公开数据路线。',
      'Bring one bounded project idea and a lawful synthetic or public-data route.',
    ),
    localized(
      '一張六格作品地圖：每格都有可開啟的 artefact、檢查方法與不能聲稱的結果，再加一段五分鐘 walkthrough。',
      '一张六格作品地图：每格都有可打开的 artefact、检查方法和不能声称的结果，再加一段五分钟 walkthrough。',
      'A six-row portfolio map with an openable artefact, check, and nonclaim in every row, plus a five-minute walkthrough.',
    ),
    { minimum: 45, maximum: 60 },
  ),
  'choose-transformer-generation-and-adaptation-tradeoffs': standalone(
    localized(
      '先能用自己的話說明 token、attention 與基本生成流程，並帶一個有明確輸入與輸出的任務。',
      '先能用自己的话说明 token、attention 和基本生成流程，并带一个有明确输入和输出的任务。',
      'First be able to explain tokens, attention, and the basic generation path in your own words, and bring one task with defined inputs and outputs.',
    ),
    localized(
      '一份選型紀錄：任務、基準做法、生成或架構取捨、固定檢查，以及何時不應改模型。',
      '一份选型记录：任务、基准做法、生成或架构取舍、固定检查，以及何时不应改模型。',
      'A selection record covering the task, baseline, generation or architecture trade-off, fixed checks, and when not to change the model.',
    ),
    { minimum: 45, maximum: 75 },
  ),
};

function roundReadingRange(rawMinutes: number): MinuteRange {
  const upper = Math.max(5, Math.ceil(rawMinutes / 5) * 5);
  return { minimum: Math.max(5, upper - 5), maximum: upper };
}

/** Estimate deliberate technical reading/review time from the rendered locale body. */
export function estimateArticleReadingMinutes(body: string, locale: Locale): MinuteRange {
  const withoutMarkup = body
    .replace(/```[\s\S]*?```/g, block => block.replace(/```[^\n]*\n?/g, ' '))
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[#>*_|~-]/g, ' ');
  const cjkCharacters = (withoutMarkup.match(/[\u3400-\u9fff]/g) ?? []).length;
  const nonCjkWords = withoutMarkup
    .replace(/[\u3400-\u9fff]/g, ' ')
    .match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu)?.length ?? 0;
  const rawMinutes = locale === 'en'
    ? nonCjkWords / 160
    : (cjkCharacters / 240) + (nonCjkWords / 160);
  return roundReadingRange(rawMinutes);
}

function roadmapPrerequisite(locale: Locale, context: RoadmapArticleContext): string {
  const stage = context.stage;
  if (!stage) throw new Error('A roadmap learning contract needs one owning stage.');

  if (stage.lessonContract.entry === 'sequence' && context.previousStage) {
    const evidence = context.previousStage.evidence[locale];
    return localized(
      `開始前，應能完成或解釋上一站的證據：${evidence}`,
      `开始前，应能完成或解释上一站的证据：${evidence}`,
      `Before starting, be able to produce or explain the previous stage evidence: ${evidence}`,
    )[locale];
  }

  const title = stage.title[locale];
  return localized(
    `不要求先完成上一站；帶一個與「${title}」相關的有限例子。`,
    `不要求先完成上一站；带一个与“${title}”相关的有限例子。`,
    `No earlier roadmap stage is required. Bring one bounded example related to “${title}”.`,
  )[locale];
}

export function hasStandaloneLearningContract(articleSlug: string): boolean {
  return Object.hasOwn(standaloneContracts, articleSlug);
}

export function createArticleLearningContract({
  article,
  body,
  locale,
  roadmapContext,
}: Readonly<{
  article: ArticleMeta;
  body: string;
  locale: Locale;
  roadmapContext?: RoadmapArticleContext;
}>): ArticleLearningContract {
  const explicit = standaloneContracts[article.slug];
  const stage = roadmapContext?.stage;

  if (explicit) {
    return {
      prerequisite: explicit.prerequisite[locale],
      evidence: explicit.evidence[locale],
      readingMinutes: estimateArticleReadingMinutes(body, locale),
      practiceMinutes: explicit.practiceMinutes,
      practiceMode: explicit.practiceMode,
      practiceScope: 'article',
    };
  }

  if (!stage || !roadmapContext) {
    throw new Error(`Article ${article.slug} needs one roadmap stage or an explicit learning contract.`);
  }

  return {
    prerequisite: roadmapPrerequisite(locale, roadmapContext),
    evidence: stage.evidence[locale],
    readingMinutes: estimateArticleReadingMinutes(body, locale),
    practiceMinutes: stage.lessonContract.estimatedMinutes,
    practiceMode: stage.lessonContract.practiceMode,
    practiceScope: 'roadmap-stage',
  };
}
