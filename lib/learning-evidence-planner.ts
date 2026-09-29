import type { Locale } from './types';
import { canonicalLocaleRecord } from './types';

export const EVIDENCE_GAP_IDS = ['delivery', 'evaluation', 'data-boundary', 'business-decision', 'review'] as const;
export type EvidenceGapId = typeof EVIDENCE_GAP_IDS[number];

export const SOURCE_FIELD_IDS = ['artefact', 'feedback', 'assessment', 'cost', 'timeFit', 'freshness', 'gapFit', 'entryFit', 'stop'] as const;
export type SourceFieldId = typeof SOURCE_FIELD_IDS[number];
export const SOURCE_DETAIL_IDS = ['sourceTitle', 'officialUrl', 'checkedDate', 'lessonAssignment'] as const;
export type SourceDetailId = typeof SOURCE_DETAIL_IDS[number];

type Option = { value: string; label: string };

export type LearningEvidencePlannerCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  privacy: string;
  modeHeading: string;
  modeHelp: string;
  rehearseFirstLabel: string;
  rehearseFirstText: string;
  compareNamedSourceLabel: string;
  compareNamedSourceText: string;
  sourceStatusHeading: string;
  sourceNotSelected: string;
  sourceNotSelectedText: string;
  gapHeading: string;
  gapLabel: string;
  gapHelp: string;
  sourceHeading: string;
  sourceCountLabel: string;
  sourceCountHelp: string;
  sourceCountOptions: Record<1 | 2 | 3, string>;
  sourceSlot: string;
  unnamedHelp: string;
  sourceDetailsHeading: string;
  sourceDetailsHelp: string;
  sourceDetails: Record<SourceDetailId, { label: string; help: string; placeholder: string }>;
  fields: Record<SourceFieldId, { label: string; help: string }>;
  options: Record<SourceFieldId, Option[]>;
  scoreLabel: string;
  scoreHelp: string;
  decisionHeading: string;
  suggestedSource: string;
  suggestedDecision: string;
  suggestedStop: string;
  noSource: string;
  readyDecision: string;
  pauseDecision: string;
  weekHeading: string;
  sourceReceipt: string;
  receiptGap: string;
  receiptSource: string;
  receiptSignal: string;
  receiptInputs: string;
  receiptSourceDetails: string;
  notRecorded: string;
  artefact: string;
  nonGoal: string;
  dataBoundary: string;
  firstEvaluation: string;
  floorHeading: string;
  floorText: string;
  copyBrief: string;
  copySuccess: string;
  copyError: string;
  copyNote: string;
  sourceLabel: (index: number) => string;
  gaps: Record<EvidenceGapId, {
    label: string;
    description: string;
    starter: {
      artefact: string;
      nonGoal: string;
      dataBoundary: string;
      firstEvaluation: string;
    };
  }>;
};

const sourceName = (prefix: string) => (index: number) => `${prefix} ${String(index + 1).padStart(2, '0')}`;

export const learningEvidencePlannerCopy: Record<Locale, LearningEvidencePlannerCopy> = canonicalLocaleRecord({
  en: {
    eyebrow: 'LEARNING EVIDENCE PLANNER',
    title: 'Choose a learning source by the evidence it can leave behind',
    intro: 'Start with a small local rehearsal if you have not chosen a source. If you already have one, compare up to three against an evidence gap. Neither route rates or recommends a provider.',
    privacy: 'Local only: the source title, URL, date, and lesson you enter stay in this page\'s memory. This planner does not store, send, or analyse them, and it asks for no profile, employer detail, or account. Refreshing clears the comparison; the details leave this page only if you choose to copy the brief.',
    modeHeading: '01 · Choose how to begin',
    modeHelp: 'You do not need a course, account, or provider name to start. Keep the comparison closed until you have a named page worth checking.',
    rehearseFirstLabel: 'I have not chosen a source yet',
    rehearseFirstText: 'Pick a no-code or coder rehearsal below. Its local record says NOT_SELECTED_YET until you later decide to compare a named source.',
    compareNamedSourceLabel: 'I already have a named source to check',
    compareNamedSourceText: 'Record only its official page, date, and a specific lesson or assignment. The comparison checks evidence conditions; it does not rank or recommend a provider.',
    sourceStatusHeading: 'Current source status',
    sourceNotSelected: 'NOT_SELECTED_YET',
    sourceNotSelectedText: 'No source has been selected, scored, or recommended. The two official starting pages below are only for inspection. Complete the small local rehearsal first; open the comparison only when a named source addresses a visible gap.',
    gapHeading: '02 · Name the evidence gap',
    gapLabel: 'Which missing proof matters most right now?',
    gapHelp: 'Choose one gap. You can return and change it later.',
    sourceHeading: '03 · Compare what each source makes possible',
    sourceCountLabel: 'How many source slots do you want to assess?',
    sourceCountHelp: 'Use Source 01–03 only. Compare the learning conditions, not brand reputation.',
    sourceCountOptions: { 1: 'One source', 2: 'Two sources', 3: 'Three sources' },
    sourceSlot: 'Source slot',
    unnamedHelp: 'Keep only the details you need to verify your own choice. They stay in this browser until you choose to copy the brief.',
    sourceDetailsHeading: 'Record the page you checked',
    sourceDetailsHelp: 'All four details are needed before this source can pass the evidence floor. They are local to this page and are copied only when you choose to copy the brief.',
    sourceDetails: {
      sourceTitle: { label: 'Source title', help: 'Use the course, guide, or provider title shown on the page you checked.', placeholder: 'For example: Machine Learning Crash Course' },
      officialUrl: { label: 'Official page URL', help: 'Use the HTTPS page you actually checked, not a search-results link.', placeholder: 'https://example.com/learning-path' },
      checkedDate: { label: 'Date checked', help: 'Record when you last reviewed this page. Check again if its details change.', placeholder: '' },
      lessonAssignment: { label: 'Exact lesson or assignment', help: 'Name the module, chapter, or task that directly addresses this gap.', placeholder: 'For example: Module 2 — Classification' }
    },
    fields: {
      artefact: { label: 'Artefact', help: 'What can you make and keep as evidence?' },
      feedback: { label: 'Feedback', help: 'Who or what can help you improve it?' },
      assessment: { label: 'Assessment', help: 'What observable check tells you whether it works?' },
      cost: { label: 'Cost', help: 'Is the commitment known and manageable for a Week-1 experiment?' },
      timeFit: { label: 'This-week time fit', help: 'Can you name a protected time block this week and a first artefact that fits it without displacing a higher-priority work or portfolio task?' },
      freshness: { label: 'Freshness', help: 'Is the material current enough for the evidence you need?' },
      gapFit: { label: 'Evidence-gap fit', help: 'Does a named lesson or assignment directly address the gap you selected above?' },
      entryFit: { label: 'Entry fit', help: 'Are the prerequisites, setup, and first Week-1 task clear enough to start safely?' },
      stop: { label: 'Stop condition', help: 'When will you stop rather than add more time or money?' }
    },
    options: {
      artefact: [
        { value: 'unknown', label: 'Not checked yet' },
        { value: 'none', label: 'No inspectable artefact' },
        { value: 'preview', label: 'I can view an example, but cannot keep my own version' },
        { value: 'keep', label: 'I can make and keep a versioned artefact' }
      ],
      feedback: [
        { value: 'unknown', label: 'Not checked yet' },
        { value: 'none', label: 'No feedback route is visible' },
        { value: 'peer', label: 'A peer or reviewer can respond to my work' },
        { value: 'structured', label: 'A rubric, review, or revision loop is explicit' }
      ],
      assessment: [
        { value: 'unknown', label: 'Not checked yet' },
        { value: 'none', label: 'No observable check is visible' },
        { value: 'completion', label: 'A small task or completion check exists' },
        { value: 'observable', label: 'A test, rubric, or inspectable assignment exists' }
      ],
      cost: [
        { value: 'unknown', label: 'Not checked yet' },
        { value: 'high', label: 'Unclear or high for this experiment' },
        { value: 'medium', label: 'Known, but needs a trade-off' },
        { value: 'low', label: 'Known and manageable' }
      ],
      timeFit: [
        { value: 'unknown', label: 'Not checked yet' },
        { value: 'unbounded', label: 'I cannot name a protected time block or a time boundary for the first artefact' },
        { value: 'not-now', label: 'This would displace a higher-priority work or portfolio task' },
        { value: 'bounded', label: 'I have a protected time block this week and the first artefact fits it' }
      ],
      freshness: [
        { value: 'unknown', label: 'Not checked yet' },
        { value: 'dated', label: 'Dated or unclear' },
        { value: 'current', label: 'Current enough for the intended artefact' },
        { value: 'maintained', label: 'Versioned or maintained with an update signal' }
      ],
      gapFit: [
        { value: 'unknown', label: 'Not checked yet' },
        { value: 'indirect', label: 'Related, but I cannot name the lesson or assignment for this gap' },
        { value: 'direct', label: 'A named lesson or assignment directly addresses this gap' }
      ],
      entryFit: [
        { value: 'unknown', label: 'Not checked yet' },
        { value: 'blocked', label: 'Prerequisites, setup, or the first task are unclear' },
        { value: 'ready', label: 'Prerequisites, setup, and a safe Week-1 task are clear' }
      ],
      stop: [
        { value: 'not-set', label: 'Set a stop condition before committing' },
        { value: 'artefact', label: 'Stop after Week 1 if I cannot create and keep the artefact' },
        { value: 'feedback', label: 'Stop if no person or rubric can give useful feedback' },
        { value: 'assessment', label: 'Stop if I cannot identify an observable check' },
        { value: 'certainty', label: 'Stop if cost or freshness cannot be confirmed before commitment' }
      ]
    },
    scoreLabel: 'Comparison signal',
    scoreHelp: 'A transparent local signal out of 12; it is not a rating of a provider or a promise of an outcome. This-week time fit is a required decision check, not a way to inflate the score.',
    decisionHeading: '04 · Suggested reversible next move',
    suggestedSource: 'Suggested source',
    suggestedDecision: 'Suggested decision',
    suggestedStop: 'Suggested stop',
    noSource: 'None yet',
    readyDecision: 'Run one bounded Week-1 check with this source slot. It currently clears the evidence floor, including a named page, checked date, lesson, and a protected time block for the first artefact; revisit it if the stop condition is reached.',
    pauseDecision: 'Pause the source decision. No current slot yet shows a recorded source title, official page, checked date, exact lesson or assignment, keepable artefact, feedback route, observable assessment, current-enough material, direct fit to this gap, clear entry point, protected time for the first artefact, and stop condition together.',
    weekHeading: 'Your Week-1 starter pack',
    sourceReceipt: 'Source receipt',
    receiptGap: 'Evidence gap',
    receiptSource: 'Compared slot',
    receiptSignal: 'Current signal',
    receiptInputs: 'Checked conditions',
    receiptSourceDetails: 'Source details checked',
    notRecorded: 'Not recorded',
    artefact: 'Artefact',
    nonGoal: 'Non-goal',
    dataBoundary: 'Data boundary',
    firstEvaluation: 'First evaluation case',
    floorHeading: 'The decision rule',
    floorText: 'A source only clears the floor when you record its title, official HTTPS page, checked date, and exact lesson or assignment; can make and keep an artefact; obtain feedback; point to an observable assessment; see material that is current enough; confirm an entry point; protect time for a first artefact this week; and set a stop condition. Cost changes confidence; it does not turn a weak or mismatched source into evidence.',
    copyBrief: 'Copy Week-1 brief',
    copySuccess: 'Copied. Paste it into a private note, README draft, or issue; it stays on this device until you choose to paste it.',
    copyError: 'Copying is not available in this browser. You can still select the plan below.',
    copyNote: 'The copied brief contains only your local choices and the source details you entered. This planner does not save or send them.',
    sourceLabel: sourceName('Source'),
    gaps: {
      delivery: {
        label: 'I can explain AI work, but cannot show a bounded delivery artefact',
        description: 'Turn a vague learning claim into one inspectable handoff.',
        starter: {
          artefact: 'Create a one-page problem, acceptance, and handoff record for a fictional or public-safe scenario.',
          nonGoal: 'Do not build a full agent, app, or production integration this week.',
          dataBoundary: 'Use a small synthetic or public-safe fixture only; do not paste employer, client, or personal data.',
          firstEvaluation: 'Ask one reviewer whether the acceptance rule makes the handoff testable; record one ambiguity they find.'
        }
      },
      evaluation: {
        label: 'I can make a prototype, but cannot show whether it is reliable',
        description: 'Move from a happy-path demo to a small, visible evaluation.',
        starter: {
          artefact: 'Create a five-case evaluation sheet with expected result, actual result, and review note.',
          nonGoal: 'Do not optimise a benchmark score or claim production quality.',
          dataBoundary: 'Use fictional or public-safe cases; label any generated examples as synthetic.',
          firstEvaluation: 'Write one expected pass and one expected failure before you run or inspect anything.'
        }
      },
      'data-boundary': {
        label: 'I can use an LLM, but cannot explain data or permission boundaries',
        description: 'Make the allowed input, prohibited input, and human owner explicit.',
        starter: {
          artefact: 'Create a one-page data boundary card: allowed fields, prohibited fields, retention assumption, and human owner.',
          nonGoal: 'Do not connect a live tool, inbox, file store, or customer data source.',
          dataBoundary: 'Use only a synthetic fixture and state that no external action is allowed.',
          firstEvaluation: 'Test one prohibited-input case and confirm that it is routed to a human rather than processed.'
        }
      },
      'business-decision': {
        label: 'I know technical concepts, but cannot connect them to a business decision',
        description: 'Show what decision changes, what baseline exists, and who owns the call.',
        starter: {
          artefact: 'Create a decision brief with one user, one decision, one baseline, one business measure, and one guardrail.',
          nonGoal: 'Do not forecast savings, adoption, or ROI without real evidence.',
          dataBoundary: 'Use a fictional decision and synthetic numbers labelled as examples, not observed results.',
          firstEvaluation: 'Ask whether the proposed output changes a named decision; if not, reduce the scope.'
        }
      },
      review: {
        label: 'I can write code or prompts, but cannot show professional review or rollback thinking',
        description: 'Make a change safe to inspect before it is made irreversible.',
        starter: {
          artefact: 'Create a change note with acceptance checks, a reviewer, rollback trigger, and rollback owner.',
          nonGoal: 'Do not deploy, automate an external action, or claim an approval was obtained.',
          dataBoundary: 'Use a local mock or synthetic fixture; no keys, credentials, or real system access.',
          firstEvaluation: 'Write one safe case and one rollback-triggering case, then check that both have a human owner.'
        }
      }
    }
  },
  'zh-TW': {
    eyebrow: '學習證據規劃器',
    title: '用最後留下的證據，選擇學習來源',
    intro: '還沒選來源，可以先做下方一個本機小練習；已有想核對的來源，才比較最多三個。兩條路都不替平台排位或推薦。',
    privacy: '僅在本機運作：你填入的來源名稱、URL、核對日期與課節只會暫時留在這一頁的記憶中。規劃器不會儲存、傳送或用來分析，也不會要求個人資料、雇主資料或帳戶。重新整理就會清空；只有你主動複製計畫時，這些資料才會離開頁面。',
    modeHeading: '01 · 還沒選來源，要怎樣開始？',
    modeHelp: '不必先報課程名稱、開帳戶或選平台。真的有一頁想核對時，才打開比較。',
    rehearseFirstLabel: '我還沒選學習來源',
    rehearseFirstText: '先選 no-code 或 coder 路線，做下方的本機練習。尚未決定要比較哪個來源前，紀錄會寫成 NOT_SELECTED_YET。',
    compareNamedSourceLabel: '我已有一個想核對的來源',
    compareNamedSourceText: '只記下官方頁、核對日期和一個具體課節或作業。比較只看證據條件，不替供應者評分、排位或推薦。',
    sourceStatusHeading: '目前的來源狀態',
    sourceNotSelected: 'NOT_SELECTED_YET（尚未選來源）',
    sourceNotSelectedText: '目前未選、未評分、未推薦任何來源。下方兩張官方起步頁只供你核對；先完成本機小練習，當真的有來源直接補到缺口，才打開比較。',
    gapHeading: '02 · 先定義缺少哪一種證據',
    gapLabel: '現在最需要補哪一種能力證據？',
    gapHelp: '一次選一個缺口。之後隨時可以回來修改。',
    sourceHeading: '03 · 比較每個來源實際讓你做到什麼',
    sourceCountLabel: '想比較幾個來源？',
    sourceCountHelp: '只使用來源 01–03。重點是比較學習條件，不是比較名氣。',
    sourceCountOptions: { 1: '一個來源', 2: '兩個來源', 3: '三個來源' },
    sourceSlot: '來源欄位',
    unnamedHelp: '只記下核對自己選擇所需的資料。尚未複製計畫前，它們只會留在你目前開啟的瀏覽器。',
    sourceDetailsHeading: '記下你核對過哪一頁',
    sourceDetailsHelp: '四項都要填，來源才會通過起步要求。資料只留在這一頁；只有你主動複製計畫時才會帶走。',
    sourceDetails: {
      sourceTitle: { label: '來源名稱', help: '照你核對那一頁的課程、指南或供應者名稱填寫。', placeholder: '例如：Machine Learning Crash Course' },
      officialUrl: { label: '官方頁面 URL', help: '貼上你實際核對過的 HTTPS 頁面，不要貼搜尋結果。', placeholder: 'https://example.com/learning-path' },
      checkedDate: { label: '你核對的日期', help: '記下最後閱讀這一頁的日期；內容有變動就要再核對。', placeholder: '' },
      lessonAssignment: { label: '直接相關的課節／作業', help: '寫明哪個單元、章節或作業直接補到這次缺口。', placeholder: '例如：第 2 單元 · 分類' }
    },
    fields: {
      artefact: { label: '可以帶走的成果', help: '最後可以做出並保留什麼成果？' },
      feedback: { label: '回饋機會', help: '誰或哪種安排可以幫你改善？' },
      assessment: { label: '檢查方式', help: '有什麼看得見的檢查可以判斷是否做到？' },
      cost: { label: '成本', help: '對第一週小實驗而言，承諾是否已知且可負擔？' },
      timeFit: { label: '本週時間是否配合', help: '你能否寫下本週預留的時段，以及一份能在該時段完成或覆核的起步成果，而不會擠掉更優先的工作或作品集任務？' },
      freshness: { label: '內容是否夠新', help: '材料對這次要做的成果來說是否夠新？' },
      gapFit: { label: '是否補到這個缺口', help: '是否有一個說得出的課節或作業，直接補到上面選的缺口？' },
      entryFit: { label: '能否順利起步', help: '開始前要懂什麼、要準備什麼，以及第一週任務是否清楚並能安全開始？' },
      stop: { label: '停止條件', help: '什麼時候應該停，而不是再投入時間或金錢？' }
    },
    options: {
      artefact: [
        { value: 'unknown', label: '尚未核對' },
        { value: 'none', label: '沒有可以核對的成果' },
        { value: 'preview', label: '只能看範例，不能保留自己的版本' },
        { value: 'keep', label: '可以做出並保留有版本的成果' }
      ],
      feedback: [
        { value: 'unknown', label: '尚未核對' },
        { value: 'none', label: '看不到取得回饋的方法' },
        { value: 'peer', label: '同儕或覆核者可以回應我的作品' },
        { value: 'structured', label: '有清楚的評分準則、覆核或修改循環' }
      ],
      assessment: [
        { value: 'unknown', label: '尚未核對' },
        { value: 'none', label: '看不到可觀察檢查' },
        { value: 'completion', label: '有一個小任務或完成檢查' },
        { value: 'observable', label: '有測試、評分準則或可檢查的作業' }
      ],
      cost: [
        { value: 'unknown', label: '尚未核對' },
        { value: 'high', label: '對這次小實驗來說不清楚或太高' },
        { value: 'medium', label: '已知，但需要取捨' },
        { value: 'low', label: '已知且可負擔' }
      ],
      timeFit: [
        { value: 'unknown', label: '尚未核對' },
        { value: 'unbounded', label: '說不出本週可預留的時段，或第一份成果需要多久仍不清楚' },
        { value: 'not-now', label: '會擠掉一項更優先的工作或作品集任務' },
        { value: 'bounded', label: '我已預留本週時段，第一份成果可在這個範圍內完成或覆核' }
      ],
      freshness: [
        { value: 'unknown', label: '尚未核對' },
        { value: 'dated', label: '過時或不清楚' },
        { value: 'current', label: '對這次要做的成果來說夠新' },
        { value: 'maintained', label: '有版本或持續更新訊號' }
      ],
      gapFit: [
        { value: 'unknown', label: '尚未核對' },
        { value: 'indirect', label: '有關聯，但說不出哪個課節或作業補到這個缺口' },
        { value: 'direct', label: '有一個說得出的課節或作業直接補到這個缺口' }
      ],
      entryFit: [
        { value: 'unknown', label: '尚未核對' },
        { value: 'blocked', label: '開始前要懂什麼、要準備什麼或第一個任務仍不清楚' },
        { value: 'ready', label: '開始前要懂什麼、要準備什麼和安全的第一週任務都清楚' }
      ],
      stop: [
        { value: 'not-set', label: '承諾前先設定停止條件' },
        { value: 'artefact', label: '第一週結束仍無法做出並保留成果就停止' },
        { value: 'feedback', label: '沒有人或評分準則可以給有用回饋就停止' },
        { value: 'assessment', label: '找不到可觀察檢查就停止' },
        { value: 'certainty', label: '承諾前無法確認成本或新鮮度就停止' }
      ]
    },
    scoreLabel: '這個來源寫清楚了多少',
    scoreHelp: '這是透明的本機檢查，滿分 12 分；不是供應者評分，也不保證任何結果。本週時間是否配合是必須核對的決定條件，不是用來加分。',
    decisionHeading: '04 · 建議下一步（可逆）',
    suggestedSource: '建議來源',
    suggestedDecision: '建議決定',
    suggestedStop: '建議停止點',
    noSource: '暫時還沒有',
    readyDecision: '以這個來源欄位進行一個有範圍的第一週檢查。它目前通過證據底線，包括已記下核對頁面、日期、課節，以及本週已預留的成果時間；一觸發停止條件就重新檢視。',
    pauseDecision: '先停在這裡。現在還沒有同時核對到來源名稱、官方頁面、核對日期、直接相關課節或作業、可保留的成果、取得回饋的方法、可觀察的檢查、夠新的材料、安全起步條件、本週預留時間和停止條件。',
    weekHeading: '你的第一週起步計畫',
    sourceReceipt: '來源收據',
    receiptGap: '能力缺口',
    receiptSource: '比較欄位',
    receiptSignal: '目前訊號',
    receiptInputs: '已核對條件',
    receiptSourceDetails: '已核對的來源資料',
    notRecorded: '尚未記下',
    artefact: '可以帶走的成果',
    nonGoal: '非目標',
    dataBoundary: '資料邊界',
    firstEvaluation: '第一個檢查情境',
    floorHeading: '決定規則',
    floorText: '只有當你記下來源名稱、官方 HTTPS 頁面、核對日期與直接相關課節或作業；能做出並保留成果；取得回饋；指出可觀察的檢查；材料夠新；確認起步條件；預留本週完成或覆核第一份成果的時間；並設定停止條件，這個來源才通過底線。成本會影響信心，但不會把薄弱或不配對的來源變成證據。',
    copyBrief: '複製第一週說明',
    copySuccess: '已複製。你可自行貼到私人筆記、專案說明草稿或工作紀錄；在你自己貼出前，它不會離開這台裝置。',
    copyError: '這個瀏覽器無法直接複製；你仍可在下方自行選取計畫內容。',
    copyNote: '複製內容只包括你在本頁所作的選擇，以及填入的來源資料。規劃器不會儲存或傳送它們。',
    sourceLabel: sourceName('來源'),
    gaps: {
      delivery: {
        label: '我會解釋 AI 工作，但還拿不出有範圍的交付紀錄',
        description: '把模糊的學習聲稱變成一份可以交給人核對的紀錄。',
        starter: {
          artefact: '為一個虛構或公開安全情境，做一頁問題、驗收方式和交接紀錄。',
          nonGoal: '本週不要做完整的自動化助手、應用程式或正式環境串接。',
          dataBoundary: '只使用小型合成或公開安全的練習資料；不要貼雇主、客戶或個人資料。',
          firstEvaluation: '請一位覆核者檢查驗收方式能否核對交接內容，並記下他指出的一個模糊處。'
        }
      },
      evaluation: {
        label: '我做得出原型，但無法證明它可靠',
        description: '從只看順利的示範，走向一個小而看得見的檢查。',
        starter: {
          artefact: '做一張五個情境的檢查表：預期結果、實際結果和覆核備註。',
          nonGoal: '不要追基準測試分數，也不要宣稱正式環境品質。',
          dataBoundary: '只使用虛構或公開安全的情境；任何生成範例都要標示為練習資料。',
          firstEvaluation: '在執行或檢查前，先寫一個預期通過和一個預期失敗。'
        }
      },
      'data-boundary': {
        label: '我會用大型語言模型（LLM），但說不清資料或權限邊界',
        description: '把允許輸入、禁止輸入和最後拍板的人寫清楚。',
        starter: {
          artefact: '做一頁資料使用界線：允許欄位、禁止欄位、保留假設和最後拍板的人。',
          nonGoal: '不要連接真實工具、收件匣、檔案庫或客戶資料來源。',
          dataBoundary: '只使用練習資料，並寫明不允許執行外部動作。',
          firstEvaluation: '測試一個禁止輸入的情境，確認它交給人，而不是被處理。'
        }
      },
      'business-decision': {
        label: '我懂技術概念，但連不到一個商業決定',
        description: '說明哪個決定會變、目前的對照做法是什麼，以及誰有最終決定權。',
        starter: {
          artefact: '做一份決定摘要：一個使用者、一個決定、一個對照做法、一個商業指標和一條安全界線。',
          nonGoal: '沒有真實證據前，不要預測節省、採用率或 ROI。',
          dataBoundary: '使用虛構決定與標示為範例的合成數字，不要把它當觀察結果。',
          firstEvaluation: '詢問輸出是否會改變一個已命名決定；若不會，就縮小範圍。'
        }
      },
      review: {
        label: '我會寫程式或提示詞，但還說不清別人怎麼覆核或何時退回上一版',
        description: '在改動變成不可逆之前，先讓它可以安全被檢查。',
        starter: {
          artefact: '做一份改動紀錄：驗收方式、覆核者、何時退回上一版及由誰處理。',
          nonGoal: '不要部署、不要自動執行外部動作，也不要宣稱已獲批准。',
          dataBoundary: '只使用本機模擬或練習資料；不使用金鑰、登入資料或真實系統存取。',
          firstEvaluation: '寫一個安全情境與一個會退回上一版的情境，再確認兩個情境都有負責人。'
        }
      }
    }
  },
  'zh-Hans': {
    eyebrow: '学习证据规划器',
    title: '用最后留下的证据，选择学习来源',
    intro: '还没选来源，可以先做下方一个本机小练习；已有想核对的来源，才比较最多三个。两条路都不替平台排位或推荐。',
    privacy: '仅在本机运行：你填入的来源名称、URL、核对日期与课节只会暂时留在这一页的记忆中。规划器不会储存、发送或用来分析，也不会要求个人资料、雇主资料或账户。刷新就会清空；只有你主动复制计划时，这些资料才会离开页面。',
    modeHeading: '01 · 还没选来源，怎样开始？',
    modeHelp: '不必先报课程名称、开账户或选平台。真的有一页想核对时，才打开比较。',
    rehearseFirstLabel: '我还没选学习来源',
    rehearseFirstText: '先选 no-code 或 coder 路线，做下方的本机练习。尚未决定要比较哪个来源前，记录会写成 NOT_SELECTED_YET。',
    compareNamedSourceLabel: '我已有一个想核对的来源',
    compareNamedSourceText: '只记下官方页、核对日期和一个具体课节或作业。比较只看证据条件，不替供应商评分、排位或推荐。',
    sourceStatusHeading: '目前的来源状态',
    sourceNotSelected: 'NOT_SELECTED_YET（尚未选来源）',
    sourceNotSelectedText: '目前未选、未评分、未推荐任何来源。下方两张官方起步页只供你核对；先完成本机小练习，当真的有来源直接补到缺口，才打开比较。',
    gapHeading: '02 · 先定义缺少哪一种证据',
    gapLabel: '现在最需要补哪一种能力证据？',
    gapHelp: '一次选一个缺口。之后随时可以回来修改。',
    sourceHeading: '03 · 比较每个来源实际上让你做到什么',
    sourceCountLabel: '想比较几个来源？',
    sourceCountHelp: '只使用来源 01–03。重点是比较学习条件，不是比较名气。',
    sourceCountOptions: { 1: '一个来源', 2: '两个来源', 3: '三个来源' },
    sourceSlot: '来源栏位',
    unnamedHelp: '只记下核对自己选择所需的资料。尚未复制计划前，它们只会留在你目前打开的浏览器。',
    sourceDetailsHeading: '记下你核对过哪一页',
    sourceDetailsHelp: '四项都要填写，来源才会通过起步要求。资料只留在这一页；只有你主动复制计划时才会带走。',
    sourceDetails: {
      sourceTitle: { label: '来源名称', help: '照你核对那一页的课程、指南或提供者名称填写。', placeholder: '例如：Machine Learning Crash Course' },
      officialUrl: { label: '官方页面 URL', help: '贴上你实际核对过的 HTTPS 页面，不要贴搜索结果。', placeholder: 'https://example.com/learning-path' },
      checkedDate: { label: '你核对的日期', help: '记下最后阅读这一页的日期；内容有变动就要重新核对。', placeholder: '' },
      lessonAssignment: { label: '直接相关的课节／作业', help: '写明哪个单元、章节或作业直接补到这次缺口。', placeholder: '例如：第 2 单元 · 分类' }
    },
    fields: {
      artefact: { label: '可以带走的成果', help: '最后可以做出并保留什么成果？' },
      feedback: { label: '反馈机会', help: '谁或哪种安排可以帮你改进？' },
      assessment: { label: '检查方式', help: '有什么看得见的检查可以判断是否做到？' },
      cost: { label: '成本', help: '对第一周小实验来说，承诺是否已知且可承受？' },
      timeFit: { label: '本周时间是否匹配', help: '你能否写下本周预留的时段，以及一份能在该时段完成或复核的起步成果，而不会挤掉更优先的工作或作品集任务？' },
      freshness: { label: '内容是否够新', help: '材料对这次要做的成果来说是否够新？' },
      gapFit: { label: '是否补到这个缺口', help: '是否有一个说得出的课节或作业，直接补到上面选的缺口？' },
      entryFit: { label: '能否顺利起步', help: '开始前要懂什么、要准备什么，以及第一周任务是否清楚并能安全开始？' },
      stop: { label: '停止条件', help: '什么时候应该停，而不是再投入时间或金钱？' }
    },
    options: {
      artefact: [
        { value: 'unknown', label: '尚未核对' },
        { value: 'none', label: '没有可以核对的成果' },
        { value: 'preview', label: '只能看示例，不能保留自己的版本' },
        { value: 'keep', label: '可以做出并保留有版本的成果' }
      ],
      feedback: [
        { value: 'unknown', label: '尚未核对' },
        { value: 'none', label: '看不到取得反馈的方法' },
        { value: 'peer', label: '同伴或评审者可以回应我的作品' },
        { value: 'structured', label: '有清楚的评分准则、评审或修改循环' }
      ],
      assessment: [
        { value: 'unknown', label: '尚未核对' },
        { value: 'none', label: '看不到可观察检查' },
        { value: 'completion', label: '有一个小任务或完成检查' },
        { value: 'observable', label: '有测试、评分准则或可检查的作业' }
      ],
      cost: [
        { value: 'unknown', label: '尚未核对' },
        { value: 'high', label: '对这次小实验来说不清楚或太高' },
        { value: 'medium', label: '已知，但需要取舍' },
        { value: 'low', label: '已知且可承受' }
      ],
      timeFit: [
        { value: 'unknown', label: '尚未核对' },
        { value: 'unbounded', label: '说不出本周可预留的时段，或第一份成果需要多久仍不清楚' },
        { value: 'not-now', label: '会挤掉一项更优先的工作或作品集任务' },
        { value: 'bounded', label: '我已预留本周时段，第一份成果可在这个范围内完成或复核' }
      ],
      freshness: [
        { value: 'unknown', label: '尚未核对' },
        { value: 'dated', label: '过时或不清楚' },
        { value: 'current', label: '对这次要做的成果来说够新' },
        { value: 'maintained', label: '有版本或持续更新信号' }
      ],
      gapFit: [
        { value: 'unknown', label: '尚未核对' },
        { value: 'indirect', label: '有关联，但说不出哪个课节或作业补到这个缺口' },
        { value: 'direct', label: '有一个说得出的课节或作业直接补到这个缺口' }
      ],
      entryFit: [
        { value: 'unknown', label: '尚未核对' },
        { value: 'blocked', label: '开始前要懂什么、要准备什么或第一个任务仍不清楚' },
        { value: 'ready', label: '开始前要懂什么、要准备什么和安全的第一周任务都清楚' }
      ],
      stop: [
        { value: 'not-set', label: '承诺前先设置停止条件' },
        { value: 'artefact', label: '第一周结束仍无法做出并保留成果就停止' },
        { value: 'feedback', label: '没有人或评分准则可以给有用反馈就停止' },
        { value: 'assessment', label: '找不到可观察检查就停止' },
        { value: 'certainty', label: '承诺前无法确认成本或新鲜度就停止' }
      ]
    },
    scoreLabel: '这个来源写清楚了多少',
    scoreHelp: '这是透明的本机检查，满分 12 分；不是供应商评分，也不保证任何结果。本周时间是否匹配是必须核对的决定条件，不是用来加分。',
    decisionHeading: '04 · 建议下一步（可逆）',
    suggestedSource: '建议来源',
    suggestedDecision: '建议决定',
    suggestedStop: '建议停止点',
    noSource: '暂时还没有',
    readyDecision: '用这个来源栏位进行一个有范围的第一周检查。它目前通过证据底线，包括已记下核对页面、日期、课节，以及本周已预留的成果时间；一触发停止条件就重新检查。',
    pauseDecision: '先停在这里。现在还没有同时核对到来源名称、官方页面、核对日期、直接相关课节或作业、可保留的成果、取得反馈的方法、可观察的检查、够新的材料、安全起步条件、本周预留时间和停止条件。',
    weekHeading: '你的第一周起步计划',
    sourceReceipt: '来源收据',
    receiptGap: '能力缺口',
    receiptSource: '比较栏位',
    receiptSignal: '当前信号',
    receiptInputs: '已核对条件',
    receiptSourceDetails: '已核对的来源资料',
    notRecorded: '尚未记下',
    artefact: '可以带走的成果',
    nonGoal: '非目标',
    dataBoundary: '数据边界',
    firstEvaluation: '第一个检查情境',
    floorHeading: '决定规则',
    floorText: '只有当你记下来源名称、官方 HTTPS 页面、核对日期与直接相关课节或作业；能做出并保留成果；取得反馈；指出可观察的检查；材料够新；确认起步条件；预留本周完成或复核第一份成果的时间；并设定停止条件，这个来源才通过底线。成本会影响信心，但不会把薄弱或不匹配的来源变成证据。',
    copyBrief: '复制第一周说明',
    copySuccess: '已复制。你可以自行粘贴到私人笔记、项目说明草稿或工作记录；在你自己粘贴前，它不会离开这台设备。',
    copyError: '这个浏览器无法直接复制；你仍可在下方自行选取计划内容。',
    copyNote: '复制内容只包括你在本页所作的选择，以及填入的来源资料。规划器不会储存或发送它们。',
    sourceLabel: sourceName('来源'),
    gaps: {
      delivery: {
        label: '我会解释 AI 工作，但还拿不出有范围的交付记录',
        description: '把模糊的学习声称变成一份可以交给人核对的记录。',
        starter: {
          artefact: '为一个虚构或公开安全情境，做一页问题、验收方式和交接记录。',
          nonGoal: '本周不要做完整的自动化助手、应用程序或正式环境整合。',
          dataBoundary: '只使用小型合成或公开安全的练习资料；不要粘贴雇主、客户或个人资料。',
          firstEvaluation: '请一位评审者检查验收方式能否核对交接内容，并记下他指出的一个模糊处。'
        }
      },
      evaluation: {
        label: '我做得出原型，但无法证明它可靠',
        description: '从只看顺利的示范，走向一个小而看得见的检查。',
        starter: {
          artefact: '做一张五个情境的检查表：预期结果、实际结果和评审备注。',
          nonGoal: '不要追基准测试分数，也不要宣称正式环境品质。',
          dataBoundary: '只使用虚构或公开安全的情境；任何生成范例都要标示为练习资料。',
          firstEvaluation: '在执行或检查前，先写一个预期通过和一个预期失败。'
        }
      },
      'data-boundary': {
        label: '我会用大语言模型（LLM），但说不清资料或权限边界',
        description: '把允许输入、禁止输入和最后拍板的人写清楚。',
        starter: {
          artefact: '做一页资料使用边界：允许字段、禁止字段、保留假设和最后拍板的人。',
          nonGoal: '不要连接真实工具、收件箱、档案库或客户资料来源。',
          dataBoundary: '只使用练习资料，并写明不允许执行外部动作。',
          firstEvaluation: '测试一个禁止输入的情境，确认它交给人，而不是被处理。'
        }
      },
      'business-decision': {
        label: '我懂技术概念，但连不到一个业务决定',
        description: '说明哪个决定会变、目前的对照做法是什么，以及谁有最终决定权。',
        starter: {
          artefact: '做一份决定摘要：一个使用者、一个决定、一个对照做法、一个业务指标和一条安全界线。',
          nonGoal: '没有真实证据前，不要预测节省、采用率或 ROI。',
          dataBoundary: '使用虚构决定与标示为示例的合成数字，不要把它当成观察结果。',
          firstEvaluation: '询问输出是否会改变一个已命名决定；若不会，就缩小范围。'
        }
      },
      review: {
        label: '我会写程序或提示词，但还说不清别人怎么评审或何时退回上一版',
        description: '在改动变得不可逆之前，先让它能被安全检查。',
        starter: {
          artefact: '做一份改动记录：验收方式、评审者、何时退回上一版及由谁处理。',
          nonGoal: '不要部署、不要自动执行外部动作，也不要宣称已获批准。',
          dataBoundary: '只使用本机模拟或练习资料；不使用密钥、登入资料或真实系统存取。',
          firstEvaluation: '写一个安全情境与一个会退回上一版的情境，再确认两个情境都有负责人。'
        }
      }
    }
  }
});
