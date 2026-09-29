import type { Locale } from './types';
import { canonicalLocaleRecord } from './types';

export type CodingStarterLabAssetId = 'readme' | 'brief' | 'sourceSkeleton' | 'testCases' | 'referenceAnswers' | 'agentPrompt' | 'reviewerRollbackRecord';

export type CodingStarterLabSourceAsset = {
  id: CodingStarterLabAssetId;
  fileName: string;
  content: string;
};

type AssetLabel = {
  title: string;
  description: string;
};

export type CodingStarterLabCopy = {
  eyebrow: string;
  sectionEyebrows: {
    setup: string;
    assets: string;
    manual: string;
    reference: string;
    prompt: string;
    output: string;
    handoff: string;
  };
  title: string;
  intro: string;
  boundary: string;
  quickStart: {
    eyebrow: string;
    title: string;
    intro: string;
    steps: string[];
    referenceTitle: string;
    reference: string;
    boundary: string;
    fullLabAction: string;
  };
  practiceMap: {
    eyebrow: string;
    title: string;
    workflowTitle: string;
    workflow: string[];
    decisionTitle: string;
    decision: string[];
  };
  setupTitle: string;
  setup: Array<{ title: string; text: string }>;
  assetsTitle: string;
  assetsIntro: string;
  assetsNotice: string;
  assetLabels: Record<CodingStarterLabAssetId, AssetLabel>;
  copyAction: string;
  downloadAction: string;
  bundleCopy: string;
  bundleDownload: string;
  manualTitle: string;
  manualIntro: string;
  manualSteps: string[];
  referenceGateTitle: string;
  referenceGateIntro: string;
  referenceGateConfirmation: string;
  referenceGateAction: string;
  referenceGateRevealed: string;
  promptTitle: string;
  promptIntro: string;
  promptPackNotice: string;
  promptCopy: string;
  promptDownload: string;
  copySuccess: string;
  copyError: string;
  outputTitle: string;
  outputItems: string[];
  handoffTitle: string;
  handoffText: string;
  handoffAction: string;
  portfolioAction: string;
};

function asset(id: CodingStarterLabAssetId, fileName: string, lines: string[]): CodingStarterLabSourceAsset {
  return { id, fileName, content: lines.join('\n') };
}

export const codingStarterLabSourceAssets: CodingStarterLabSourceAsset[] = [
  asset('readme', 'README.md', [
    '# Coder Starter Lab',
    '',
    'Status: local learning fixture only.',
    '',
    'This is a fictional, disposable pure-function change. It has no keys, network calls, accounts, real data, package setup, or deployment path. The page that supplied it does not run the code or claim that any test has passed.',
    '',
    '## What this pack contains',
    '',
    '- `CHANGE_BRIEF.md`: one bounded change and its non-goals.',
    '- `src/review-route.ts`: an intentionally incomplete pure-function skeleton.',
    '- `tests/review-route.cases.ts`: fixed inputs without the answer key.',
    '- `AGENT_PROMPT.md`: a plan/diff/tests-only request with external actions forbidden.',
    '- `REVIEWER_ROLLBACK_RECORD.md`: a manual baseline, review decision, and discard path.',
    '',
    '`tests/review-route.reference.ts` is deliberately excluded from this learner pack. After recording all six expected routes in the reviewer record, return to the lab page, confirm the manual-baseline gate, and reveal the reference as a separate file.',
    '',
    '## Manual first',
    '',
    'Read the brief and fixed cases before asking an agent for anything. Write the expected route for each case, then compare a proposed plan, diff, and tests against the brief. Record PASS, REVISE, or STOP. A passing local exercise is not a production, security, reliability, or business-result claim.',
    '',
    '## Scope boundary',
    '',
    'Use only these supplied fictional strings. Do not add a real repository, customer data, credentials, API key, network request, package, connector, browser session, command, commit, pull request, deployment, message, or other external action.'
  ]),
  asset('brief', 'CHANGE_BRIEF.md', [
    '# Change Brief: block non-local requests before review',
    '',
    '## Fictional context',
    '',
    'A disposable local helper decides whether a synthetic evidence request may move to a human reviewer. It never approves an external action.',
    '',
    '## Change requested',
    '',
    'Extend `decideReviewRoute` so it returns `BLOCKED` before any other route when either `dataScope` is not `synthetic-only` or `externalActionRequested` is true.',
    '',
    '## Fixed contract',
    '',
    '1. `dataScope !== "synthetic-only"` returns `BLOCKED`.',
    '2. `externalActionRequested === true` returns `BLOCKED`.',
    '3. A missing named reviewer returns `NEEDS_REVISION` when the request is otherwise within scope.',
    '4. Missing fixed acceptance cases returns `NEEDS_REVISION` when the request is otherwise within scope.',
    '5. Only a synthetic-only, no-action request with a named reviewer and fixed cases returns `READY_FOR_REVIEW`.',
    '',
    '## Non-goals',
    '',
    '- Do not read files, call a service, send a message, write a record, change an account, or make a business decision.',
    '- Do not introduce a framework, package, persistence layer, environment variable, configuration file, or network dependency.',
    '- Do not claim the function is production-ready or that a route authorises any action.'
  ]),
  asset('sourceSkeleton', 'src/review-route.ts', [
    'export type ReviewRequest = {',
    "  dataScope: 'synthetic-only' | 'unapproved';",
    '  externalActionRequested: boolean;',
    '  hasNamedReviewer: boolean;',
    '  hasFixedAcceptanceCases: boolean;',
    '};',
    '',
    "export type ReviewRoute = 'READY_FOR_REVIEW' | 'NEEDS_REVISION' | 'BLOCKED';",
    '',
    'export function decideReviewRoute(request: ReviewRequest): ReviewRoute {',
    '  // Starter skeleton: the requested BLOCKED boundary has not been added yet.',
    '  if (!request.hasNamedReviewer || !request.hasFixedAcceptanceCases) {',
    "    return 'NEEDS_REVISION';",
    '  }',
    "  return 'READY_FOR_REVIEW';",
    '}'
  ]),
  asset('testCases', 'tests/review-route.cases.ts', [
    "import type { ReviewRequest } from '../src/review-route';",
    '',
    'type FixedCase = {',
    '  id: string;',
    '  request: ReviewRequest;',
    '};',
    '',
    'export const fixedCases: FixedCase[] = [',
    "  { id: 'TC-01-ready-synthetic-review', request: { dataScope: 'synthetic-only', externalActionRequested: false, hasNamedReviewer: true, hasFixedAcceptanceCases: true } },",
    "  { id: 'TC-02-missing-reviewer', request: { dataScope: 'synthetic-only', externalActionRequested: false, hasNamedReviewer: false, hasFixedAcceptanceCases: true } },",
    "  { id: 'TC-03-missing-cases', request: { dataScope: 'synthetic-only', externalActionRequested: false, hasNamedReviewer: true, hasFixedAcceptanceCases: false } },",
    "  { id: 'TC-04-unapproved-scope-is-blocked', request: { dataScope: 'unapproved', externalActionRequested: false, hasNamedReviewer: true, hasFixedAcceptanceCases: true } },",
    "  { id: 'TC-05-external-action-is-blocked', request: { dataScope: 'synthetic-only', externalActionRequested: true, hasNamedReviewer: true, hasFixedAcceptanceCases: true } },",
    "  { id: 'TC-06-blocking-wins-over-missing-reviewer', request: { dataScope: 'unapproved', externalActionRequested: true, hasNamedReviewer: false, hasFixedAcceptanceCases: false } },",
    '];',
    '',
    '// Write your expected route for every input before opening review-route.reference.ts.'
  ]),
  asset('agentPrompt', 'AGENT_PROMPT.md', [
    '# Plan, diff, and tests only',
    '',
    'You are helping with a fictional local learning exercise. Use only the supplied change brief, source skeleton, and fixed test cases.',
    '',
    'Do not access the internet, files outside the supplied text, accounts, browser sessions, terminals, tools, APIs, connectors, package registries, or version-control services. Do not run commands, install packages, create, modify, delete, upload, commit, publish, deploy, send a message, or take any external action.',
    '',
    'Return only:',
    '1. a short plan that names the decision order and the non-goals;',
    '2. one minimal unified diff for `src/review-route.ts` only;',
    '3. proposed checks for every fixed case, including why `BLOCKED` wins over `NEEDS_REVISION`.',
    '',
    'Do not claim the diff was applied, the code ran, tests passed, or a system is safe for real use. Stop after the plan, diff, and tests.'
  ]),
  asset('reviewerRollbackRecord', 'REVIEWER_ROLLBACK_RECORD.md', [
    '# Reviewer and Rollback Record',
    '',
    'Fixture status: fictional, disposable, local-only.',
    '',
    '## Manual baseline before an agent',
    '',
    '| Fixed case | Expected route before reading a diff | Actual proposed route | PASS / REVISE / STOP | Note |',
    '| --- | --- | --- | --- | --- |',
    '| TC-01 | ____________________ | ____________________ | ____________________ | ____________________ |',
    '| TC-02 | ____________________ | ____________________ | ____________________ | ____________________ |',
    '| TC-03 | ____________________ | ____________________ | ____________________ | ____________________ |',
    '| TC-04 | ____________________ | ____________________ | ____________________ | ____________________ |',
    '| TC-05 | ____________________ | ____________________ | ____________________ | ____________________ |',
    '| TC-06 | ____________________ | ____________________ | ____________________ | ____________________ |',
    '',
    '## Review checks',
    '',
    '- Diff changes only `src/review-route.ts`.',
    '- `BLOCKED` is evaluated before reviewer or acceptance-case completeness.',
    '- No dependency, network, file, account, tool, command, package, or external action is introduced.',
    '- Every proposed test maps to a supplied fixed case.',
    '- The output makes no production, security, reliability, or business-impact claim.',
    '',
    'Final local decision: PASS / REVISE / STOP',
    'Reviewer name or alias: ____________________',
    'Reason or unresolved risk: ____________________',
    '',
    '## Rollback or discard',
    '',
    'If the diff exceeds the brief, a fixed case fails, or an external action is suggested, record STOP and discard the proposed change. Return to the supplied starter skeleton; do not attempt a repair in a real repository or claim a rollback was tested.'
  ])
];

export const codingStarterLabReferenceAnswer = asset('referenceAnswers', 'tests/review-route.reference.ts', [
  "import type { ReviewRoute } from '../src/review-route';",
  '',
  '// Reveal only after recording your own baseline for TC-01 to TC-06.',
  'export const referenceRoutes: Record<string, ReviewRoute> = {',
  "  'TC-01-ready-synthetic-review': 'READY_FOR_REVIEW',",
  "  'TC-02-missing-reviewer': 'NEEDS_REVISION',",
  "  'TC-03-missing-cases': 'NEEDS_REVISION',",
  "  'TC-04-unapproved-scope-is-blocked': 'BLOCKED',",
  "  'TC-05-external-action-is-blocked': 'BLOCKED',",
  "  'TC-06-blocking-wins-over-missing-reviewer': 'BLOCKED',",
  '};',
  '',
  '// These are reference expectations, not evidence that code ran or tests passed.'
]);

export const codingStarterLabCopy: Record<Locale, CodingStarterLabCopy> = canonicalLocaleRecord({
  'zh-HK': {
    eyebrow: '寫程式入門練習',
    sectionEyebrows: {
      setup: '先做手動判斷',
      assets: '英文來源檔',
      manual: '手動基準與覆核',
      reference: '寫下基準答案後',
      prompt: '可選 AI 助手比對',
      output: '完成後留下',
      handoff: '下一個本地參考'
    },
    title: '第一個寫程式練習：覆核一個小型函式改動',
    intro: '不用由大型專案或開發框架開始。這個練習只改一個「純函式」（pure function）：它只按輸入回傳結果，不讀取檔案、不連網，也不寫入資料。你會先自行判斷六個案例，再比較 AI 助手提出的計劃、程式差異和測試，最後由人作決定。',
    boundary: '所有來源檔均為英文、虛構且可丟棄，只供本機學習。當中沒有應用程式介面金鑰（API key）、真實資料、網絡連線、套件設定或部署步驟。不要把它貼入公司的程式碼倉庫（repository），也不要讓 AI 助手使用工具、執行指令、修改檔案、提交版本（commit）、發送內容或部署。',
    quickStart: {
      eyebrow: '15 分鐘起步',
      title: '先判斷兩個相反的固定案例',
      intro: '今次不用下載、寫程式或打開 AI 助手。只在紙上或筆記寫下兩個 route；這是完整練習的起步，不是完成全部六個案例。',
      steps: ['TC-01：資料只限合成資料、沒有外部動作，並有指定覆核人和固定案例。寫下它應走哪一個 route。', 'TC-06：資料未獲批准而且要求外部動作，亦沒有指定覆核人和固定案例。寫下它應走哪一個 route。', '用一句理由解釋：為何 BLOCKED 要先於 NEEDS_REVISION。'],
      referenceTitle: '寫完才核對答案',
      reference: 'TC-01 是 READY_FOR_REVIEW；TC-06 是 BLOCKED。BLOCKED 要先處理，因為資料範圍或要求的動作已跨越這個本機練習的界線。',
      boundary: '15 分鐘完成這兩個判斷，不代表你已寫程式差異、跑測試或完成 Coder Starter Lab。',
      fullLabAction: '有 45–60 分鐘時，完成整個 Coder Starter Lab'
    },
    practiceMap: {
      eyebrow: '你會練習的兩件事',
      title: '先寫清楚要改甚麼，再判斷提案是否值得保留',
      workflowTitle: '程式與驗證',
      workflow: ['先讀改動說明（change brief），找出為何「停止處理」（BLOCKED）要先於資料是否齊全的檢查。', '用六個固定案例（fixed cases）把改動限於一個純函式和一份最小程式差異（diff），並為每個案例列出檢查方法。'],
      decisionTitle: '交付與判斷',
      decision: ['AI 助手的輸出只是一份待覆核提案；不要把它貼入程式碼倉庫、執行或當作已完成。', '在覆核與撤回記錄中寫下通過（PASS）、修改（REVISE）或停止（STOP），並記錄丟棄提案的原因。']
    },
    setupTitle: '先自行判斷，再請 AI 助手提出程式差異',
    setup: [
      { title: '只使用本頁的學習檔案', text: '先有六份學習來源檔（learner source assets），全部描述同一個虛構純函式。第七份是獨立參考答案，只有你寫下人手基準後才顯示。英文檔名方便在本機編輯器打開，但不代表程式可供真實系統使用。' },
      { title: '先寫下人手基準答案', text: '閱讀改動說明和六個固定案例。在看任何程式差異前，先決定每個案例應是準備覆核（READY_FOR_REVIEW）、需要修改（NEEDS_REVISION）還是停止處理（BLOCKED）。' },
      { title: 'AI 助手只交計劃、程式差異和測試', text: '如選擇在現有工具練習，只貼上本頁提供的檔案，並關閉工具、終端機、瀏覽器、連接器（connector）和寫入權限（write permission）。' },
      { title: '由人決定保留或丟棄', text: '用覆核與撤回記錄核對範圍、判斷次序和案例。結果只有通過、修改或停止，不會自動合併任何程式碼。' }
    ],
    assetsTitle: '六份英文來源檔，另有一份延後顯示的參考答案',
    assetsIntro: '這些本機來源檔可以逐份複製、下載和打開核對。內容保留英文，讓程式碼、程式差異和測試名稱一致；頁面導讀仍按你選擇的語言顯示。',
    assetsNotice: '所有下載均為純文字，不含登入憑證、網絡呼叫或可執行的安裝步驟。網站不會執行內容或保存你的結果。',
    assetLabels: {
      readme: { title: '使用說明（README）', description: '說明檔案包的範圍、人手流程和不可作出的聲稱。' },
      brief: { title: '改動說明（change brief）', description: '一項小改動、固定判斷次序和不會處理的事項。' },
      sourceSkeleton: { title: '程式骨架（source skeleton）', description: '刻意未完成的純函式；不讀取檔案、不連網、不寫入資料。' },
      testCases: { title: '固定案例輸入（fixed cases）', description: '六個未附答案的輸入；先自行寫下預期結果。' },
      referenceAnswers: { title: '參考答案（reference answers）', description: '寫下人手基準答案後，才顯示六個預期結果。' },
      agentPrompt: { title: 'AI 助手提示詞（agent prompt）', description: '只要求計劃、最小程式差異和測試檢查，明確禁止外部動作。' },
      reviewerRollbackRecord: { title: '覆核與撤回記錄', description: '記錄人手基準、範圍檢查、通過／修改／停止和丟棄方法。' }
    },
    copyAction: '複製',
    downloadAction: '下載檔案',
    bundleCopy: '複製學習來源檔包（不含答案）',
    bundleDownload: '下載學習來源檔包（不含答案）',
    manualTitle: '手動基準與覆核流程',
    manualIntro: '核心練習不需要帳戶、模型或 AI 助手。只靠改動說明、程式骨架和測試案例，已可完成一次可覆核的判斷；AI 助手只是之後可選的比對。',
    manualSteps: [
      '先在覆核記錄寫下 TC-01 至 TC-06 的預期結果；暫時不要看 AI 助手的輸出。',
      '閱讀改動說明，圈出兩個停止處理條件，以及它們為何必須先於資料是否齊全的檢查。',
      '如有一份程式差異提案，只檢查它有否改動唯一容許的來源檔、依指定次序判斷，並涵蓋全部固定案例。',
      '填寫通過、修改或停止；如提案超出範圍、要求外部動作或仍有未解決案例，便選擇停止並丟棄程式差異。'
    ],
    referenceGateTitle: '寫下六個預期結果，再顯示參考答案',
    referenceGateIntro: '學習來源檔包和 AI 助手提示詞包刻意不含答案。請先在覆核記錄寫下 TC-01 至 TC-06 的結果；以下確認只是你的本機自我檢查，網站不會儲存或驗證。',
    referenceGateConfirmation: '我已為 TC-01 至 TC-06 全部寫下預期結果，準備比較參考答案。',
    referenceGateAction: '揭示獨立參考答案',
    referenceGateRevealed: '參考答案已顯示。請逐個案例比較理由；這份答案不代表程式已執行、測試已通過或系統可供真實使用。',
    promptTitle: '可選：只請 AI 助手提交計劃、程式差異和測試',
    promptIntro: '這段提示詞不會連接任何模型。只可在能確認已關閉工具和寫入權限的現有對話或編輯器中使用，並只貼上本頁的虛構檔案。如無法確認，便停在人手基準。',
    promptPackNotice: 'AI 助手提示詞包包括 AGENT_PROMPT.md、CHANGE_BRIEF.md、src/review-route.ts 和案例輸入；刻意不含參考答案，以免 AI 助手直接照抄。',
    promptCopy: '複製完整 AI 助手提示詞包',
    promptDownload: '下載完整 AI 助手提示詞包',
    copySuccess: '已複製到剪貼簿。',
    copyError: '未能自動複製；可直接選取文字再複製。',
    outputTitle: '完成後，可以向別人展示甚麼',
    outputItems: ['一份列明不處理事項的改動說明', '一份未受 AI 助手影響的人手基準答案', '一份只改純函式、可供覆核的程式差異提案', '六個案例的覆核記錄，以及通過、修改或停止的理由'],
    handoffTitle: '下一步：繼續練習，或整理這次證據',
    handoffText: '如想延伸這次小改動，可閱讀「用 AI 協作寫程式」，了解功能、非目標、驗收條件、程式差異、測試和覆核決定如何放入工程流程。如想先整理作品，可用規劃工具留下改動說明、基準答案、程式差異、測試和丟棄原因。兩個方向都只使用本機、合成和由人決定的材料。',
    handoffAction: '閱讀 AI 協作寫程式流程',
    portfolioAction: '整理成作品證據'
  },
  'zh-TW': {
    eyebrow: '寫程式入門練習',
    sectionEyebrows: {
      setup: '先做手動判斷',
      assets: '英文來源檔',
      manual: '手動基準與覆核',
      reference: '寫下基準答案後',
      prompt: '選用 AI 助手比對',
      output: '完成後留下',
      handoff: '下一個本機參考'
    },
    title: '第一個寫程式練習：覆核一個小型函式改動',
    intro: '不必從大型專案或開發框架開始。這個練習只改一個「純函式」（pure function）：它只依輸入回傳結果，不讀取檔案、不連網，也不寫入資料。你會先自行判斷六個案例，再比較 AI 助手提出的計畫、程式差異與測試，最後由人決定。',
    boundary: '所有來源檔均為英文、虛構且可丟棄，只供本機學習。內容沒有應用程式介面金鑰（API key）、真實資料、網路連線、套件設定或部署步驟。不要把它貼入公司的程式碼儲存庫（repository），也不要讓 AI 助手使用工具、執行指令、修改檔案、提交版本（commit）、傳送內容或部署。',
    quickStart: {
      eyebrow: '15 分鐘起步',
      title: '先判斷兩個相反的固定案例',
      intro: '這次不用下載、寫程式或開啟 AI 助手。只在紙上或筆記寫下兩個 route；這是完整練習的起步，不是完成全部六個案例。',
      steps: ['TC-01：資料只限合成資料、沒有外部動作，並有指定覆核人與固定案例。寫下它應走哪一個 route。', 'TC-06：資料未獲核准且要求外部動作，也沒有指定覆核人與固定案例。寫下它應走哪一個 route。', '用一句理由解釋：為何 BLOCKED 要先於 NEEDS_REVISION。'],
      referenceTitle: '寫完才核對答案',
      reference: 'TC-01 是 READY_FOR_REVIEW；TC-06 是 BLOCKED。BLOCKED 要先處理，因為資料範圍或要求的動作已跨越這個本機練習的界線。',
      boundary: '15 分鐘完成這兩個判斷，不代表你已寫程式差異、跑測試或完成 Coder Starter Lab。',
      fullLabAction: '有 45–60 分鐘時，完成整個 Coder Starter Lab'
    },
    practiceMap: {
      eyebrow: '你會練到的兩件事',
      title: '這個小改動，練怎麼寫清楚要改什麼、怎麼驗收、何時要丟棄提議',
      workflowTitle: '程式與驗證',
      workflow: ['先讀改動說明（change brief），找出為何「停止處理」（BLOCKED）要先於資料是否齊全的檢查。', '用六個固定案例（fixed cases）把改動限於一個純函式和一份最小程式差異（diff），並為每個案例列出檢查方法。'],
      decisionTitle: '交付與判斷',
      decision: ['AI 助手的輸出只是一份待覆核提案；不要貼入程式碼儲存庫、執行或當作已完成。', '在覆核與復原記錄中寫下通過（PASS）、修改（REVISE）或停止（STOP），並記錄丟棄提案的原因。']
    },
    setupTitle: '先自行判斷，再請 AI 助手提出程式差異',
    setup: [
      { title: '只使用本頁的學習檔案', text: '先有六份學習來源檔（learner source assets），全部描述同一個虛構純函式。第七份是獨立參考答案，只有你寫下人工基準後才會顯示。英文檔名方便在本機編輯器開啟，但不代表程式可供真實系統使用。' },
      { title: '先寫下人工基準答案', text: '閱讀改動說明與六個固定案例。在看任何程式差異前，先決定每個案例應是準備覆核（READY_FOR_REVIEW）、需要修改（NEEDS_REVISION）或停止處理（BLOCKED）。' },
      { title: 'AI 助手只交計畫、程式差異與測試', text: '若選擇在現有工具練習，只貼上本頁提供的檔案，並關閉工具、終端機、瀏覽器、連接器（connector）與寫入權限（write permission）。' },
      { title: '由人決定保留或丟棄', text: '用覆核與復原記錄核對範圍、判斷順序與案例。結果只有通過、修改或停止，不會自動合併任何程式碼。' }
    ],
    assetsTitle: '六份英文來源檔，另有一份延後顯示的參考答案',
    assetsIntro: '這些本機來源檔可逐份複製、下載與打開核對。內容用英文，讓 code、diff 與 test name 保持一致；頁面導讀仍按你選擇的語言顯示。',
    assetsNotice: '所有下載都是純文字，沒有 credential、network call 或可執行 setup。網站本身不會執行這些內容或保存你的結果。',
    assetLabels: {
      readme: { title: 'README', description: 'Pack 的範圍、手動流程與不可聲稱事項。' },
      brief: { title: '改動說明（change brief）', description: '一項小改動、固定判斷順序與不會處理的事項。' },
      sourceSkeleton: { title: '程式骨架（source skeleton）', description: '刻意未完成的純函式；不讀取檔案、不連網、不寫入資料。' },
      testCases: { title: '固定案例輸入（fixed cases）', description: '六個沒有附答案的輸入；先自行寫下預期結果。' },
      referenceAnswers: { title: '參考答案（reference answers）', description: '寫下人工基準答案後，才顯示六個預期結果。' },
      agentPrompt: { title: 'AI 助手提示詞（agent prompt）', description: '只要求計畫、最小程式差異與測試檢查，明確禁止外部動作。' },
      reviewerRollbackRecord: { title: '覆核與復原記錄', description: '記錄人工基準、範圍檢查、通過／修改／停止與丟棄方法。' }
    },
    copyAction: '複製',
    downloadAction: '下載檔案',
    bundleCopy: '複製學習來源檔包（不含答案）',
    bundleDownload: '下載學習來源檔包（不含答案）',
    manualTitle: '手動基準與覆核流程',
    manualIntro: '核心練習不需要帳號、模型或 AI 助手。只靠改動說明、程式骨架與測試案例，就能完成一次可覆核的判斷；AI 助手只是之後可選的比對。',
    manualSteps: [
      '先在覆核記錄寫下 TC-01 到 TC-06 的預期結果；暫時不要看 AI 助手的輸出。',
      '閱讀改動說明，標出兩個停止處理條件，以及它們為何必須先於資料是否齊全的檢查。',
      '若有一份程式差異提案，只檢查它是否改動唯一允許的來源檔、依指定順序判斷，並涵蓋全部固定案例。',
      '填寫通過、修改或停止；若提案超出範圍、要求外部動作或仍有未解決案例，便選擇停止並丟棄程式差異。'
    ],
    referenceGateTitle: '寫下六個預期 route，再揭示參考答案',
    referenceGateIntro: '來源檔包與 agent prompt pack 都刻意不包含答案。先在 reviewer record 寫下 TC-01 到 TC-06 的 route；以下確認只是你的本機記錄，網站不會儲存或驗證。',
    referenceGateConfirmation: '我已為 TC-01 到 TC-06 全部寫下預期 route，準備好比較參考答案。',
    referenceGateAction: '揭示獨立參考答案',
    referenceGateRevealed: '參考答案已揭示。請逐一比較每個 case 的理由；這份答案不代表程式已執行、測試已通過或系統可供真實使用。',
    promptTitle: '選用：只請 AI 助手提交計畫、程式差異與測試',
    promptIntro: '這段提示詞不會連接任何模型。只可在能確認已關閉工具與寫入權限的現有對話或編輯器中使用，並只貼上本頁的虛構檔案。若無法確認，就停在人工基準。',
    promptPackNotice: '這個 agent prompt pack 包含 AGENT_PROMPT.md、CHANGE_BRIEF.md、src/review-route.ts 與 case inputs；刻意不包含 reference answers，避免 agent 直接照抄答案。',
    promptCopy: '複製完整 agent prompt pack',
    promptDownload: '下載完整 agent prompt pack',
    copySuccess: '已複製到剪貼簿。',
    copyError: '無法自動複製；可以直接選取文字再複製。',
    outputTitle: '做完後，可以給人看什麼',
    outputItems: ['一份列明不處理事項的改動說明', '一份未受 AI 助手影響的人工基準答案', '一份只改純函式、可供覆核的程式差異提案', '六個案例的覆核記錄，以及通過、修改或停止的理由'],
    handoffTitle: '下一步：繼續練習，或整理這次證據',
    handoffText: '想延伸這次小改動，可以閱讀「用 AI 協作寫程式」，查看 feature、non-goal、acceptance、diff、test 與 reviewer decision 如何放進工程工作流。想先整理作品，就用 planner 留下這次的 brief、baseline、diff、tests 與 discard 原因。兩個方向都只用本機、合成與人工決定的材料。',
    handoffAction: '閱讀 AI 協作寫程式流程',
    portfolioAction: '整理成作品證據'
  },
  'zh-Hans': {
    eyebrow: '写程序入门练习',
    sectionEyebrows: {
      setup: '先做手动判断',
      assets: '英文源文件',
      manual: '手动基准与复核',
      reference: '写下基准答案后',
      prompt: '可选 AI 助手对照',
      output: '完成后留下',
      handoff: '下一个本地参考'
    },
    title: '第一个写程序练习：复核一个小型函数改动',
    intro: '不用从大型项目或开发框架开始。这个练习只改一个“纯函数”（pure function）：它只根据输入返回结果，不读取文件、不联网，也不写入数据。你会先自行判断六个案例，再比较 AI 助手提出的计划、程序差异和测试，最后由人决定。',
    boundary: '所有源文件均为英文、虚构且可丢弃，只供本地学习。内容没有应用程序接口密钥（API key）、真实数据、网络连接、依赖设置或部署步骤。不要把它粘贴到公司的代码仓库（repository），也不要让 AI 助手使用工具、运行命令、修改文件、提交版本（commit）、发送内容或部署。',
    quickStart: {
      eyebrow: '15 分钟起步',
      title: '先判断两个相反的固定案例',
      intro: '这次不用下载、写程序或打开 AI 助手。只在纸上或笔记写下两个 route；这是完整练习的起步，不是完成全部六个案例。',
      steps: ['TC-01：数据只限合成数据、没有外部动作，并有指定复核人和固定案例。写下它应走哪一个 route。', 'TC-06：数据未经批准且要求外部动作，也没有指定复核人和固定案例。写下它应走哪一个 route。', '用一句理由解释：为何 BLOCKED 要早于 NEEDS_REVISION。'],
      referenceTitle: '写完才核对答案',
      reference: 'TC-01 是 READY_FOR_REVIEW；TC-06 是 BLOCKED。BLOCKED 要先处理，因为数据范围或要求的动作已跨越这个本地练习的界线。',
      boundary: '15 分钟完成这两个判断，不代表你已写程序差异、运行测试或完成 Coder Starter Lab。',
      fullLabAction: '有 45–60 分钟时，完成整个 Coder Starter Lab'
    },
    practiceMap: {
      eyebrow: '你会练到的两件事',
      title: '这个小改动，练怎么写清要改什么、怎么验收、何时丢弃提议',
      workflowTitle: '程序与验证',
      workflow: ['先读改动说明（change brief），找出为何“停止处理”（BLOCKED）要早于数据是否齐全的检查。', '用六个固定案例（fixed cases）把改动限于一个纯函数和一份最小程序差异（diff），并为每个案例列出检查方法。'],
      decisionTitle: '交付与判断',
      decision: ['AI 助手的输出只是一份待复核提案；不要粘贴到代码仓库、运行或当作已经完成。', '在复核与回退记录中写下通过（PASS）、修改（REVISE）或停止（STOP），并记录丢弃提案的原因。']
    },
    setupTitle: '先自行判断，再请 AI 助手提出程序差异',
    setup: [
      { title: '只使用本页的学习文件', text: '先有六份学习源文件（learner source assets），全部描述同一个虚构纯函数。第七份是独立参考答案，只有你写下人工基准后才会显示。英文文件名方便在本地编辑器打开，但不代表程序可用于真实系统。' },
      { title: '先写下人工基准答案', text: '阅读改动说明和六个固定案例。在看任何程序差异前，先决定每个案例应是准备复核（READY_FOR_REVIEW）、需要修改（NEEDS_REVISION）还是停止处理（BLOCKED）。' },
      { title: 'AI 助手只交计划、程序差异和测试', text: '如果选择在现有工具练习，只粘贴本页提供的文件，并关闭工具、终端、浏览器、连接器（connector）和写入权限（write permission）。' },
      { title: '由人决定保留还是丢弃', text: '用复核与回退记录检查范围、判断顺序和案例。结果只有通过、修改或停止，不会自动合并任何程序代码。' }
    ],
    assetsTitle: '六份英文源文件，另有一份延后显示的参考答案',
    assetsIntro: '这些本地源文件可逐份复制、下载与打开核对。内容用英文，让 code、diff 与 test name 保持一致；页面导读仍按你选择的语言显示。',
    assetsNotice: '所有下载都是纯文字，没有 credential、network call 或可执行 setup。网站本身不会运行这些内容或保存你的结果。',
    assetLabels: {
      readme: { title: 'README', description: 'Pack 的范围、手动流程与不可声明事项。' },
      brief: { title: '改动说明（change brief）', description: '一项小改动、固定判断顺序和不会处理的事项。' },
      sourceSkeleton: { title: '程序骨架（source skeleton）', description: '刻意未完成的纯函数；不读取文件、不联网、不写入数据。' },
      testCases: { title: '固定案例输入（fixed cases）', description: '六个没有附答案的输入；先自行写下预期结果。' },
      referenceAnswers: { title: '参考答案（reference answers）', description: '写下人工基准答案后，才显示六个预期结果。' },
      agentPrompt: { title: 'AI 助手提示词（agent prompt）', description: '只要求计划、最小程序差异和测试检查，明确禁止外部动作。' },
      reviewerRollbackRecord: { title: '复核与回退记录', description: '记录人工基准、范围检查、通过／修改／停止和丢弃方法。' }
    },
    copyAction: '复制',
    downloadAction: '下载文件',
    bundleCopy: '复制学习源文件包（不含答案）',
    bundleDownload: '下载学习源文件包（不含答案）',
    manualTitle: '手动基准与复核流程',
    manualIntro: '核心练习不需要账户、模型或 AI 助手。只靠改动说明、程序骨架和测试案例，就能完成一次可复核的判断；AI 助手只是之后可选的对照。',
    manualSteps: [
      '先在复核记录写下 TC-01 到 TC-06 的预期结果；暂时不要看 AI 助手的输出。',
      '阅读改动说明，标出两个停止处理条件，以及它们为何必须早于数据是否齐全的检查。',
      '如果有一份程序差异提案，只检查它是否改动唯一允许的源文件、按指定顺序判断，并涵盖全部固定案例。',
      '填写通过、修改或停止；如果提案超出范围、要求外部动作或仍有未解决案例，就选择停止并丢弃程序差异。'
    ],
    referenceGateTitle: '写下六个预期 route，再揭示参考答案',
    referenceGateIntro: '源文件包与 agent prompt pack 都刻意不包含答案。先在 reviewer record 写下 TC-01 到 TC-06 的 route；以下确认只是你的本地记录，网站不会保存或验证。',
    referenceGateConfirmation: '我已为 TC-01 到 TC-06 全部写下预期 route，准备好比较参考答案。',
    referenceGateAction: '揭示独立参考答案',
    referenceGateRevealed: '参考答案已揭示。请逐一比较每个 case 的理由；这份答案不代表程序已运行、测试已通过或系统可供真实使用。',
    promptTitle: '可选：只请 AI 助手提交计划、程序差异和测试',
    promptIntro: '这段提示词不会连接任何模型。只可在能确认已关闭工具和写入权限的现有对话或编辑器中使用，并只粘贴本页的虚构文件。如果无法确认，就停在人工基准。',
    promptPackNotice: '这个 agent prompt pack 包含 AGENT_PROMPT.md、CHANGE_BRIEF.md、src/review-route.ts 与 case inputs；刻意不包含 reference answers，避免 agent 直接照抄答案。',
    promptCopy: '复制完整 agent prompt pack',
    promptDownload: '下载完整 agent prompt pack',
    copySuccess: '已复制到剪贴板。',
    copyError: '无法自动复制；可以直接选取文字再复制。',
    outputTitle: '做完后，可以给人看什么',
    outputItems: ['一份列明不处理事项的改动说明', '一份未受 AI 助手影响的人工基准答案', '一份只改纯函数、可供复核的程序差异提案', '六个案例的复核记录，以及通过、修改或停止的理由'],
    handoffTitle: '下一步：继续练习，或整理这次证据',
    handoffText: '想延伸这次小改动，可以阅读“用 AI 协作写代码”，查看 feature、non-goal、acceptance、diff、test 和 reviewer decision 如何放进工程工作流。想先整理作品，就用 planner 留下这次的 brief、baseline、diff、tests 和 discard 原因。两个方向都只用本地、合成与人工决定的材料。',
    handoffAction: '阅读 AI 协作写代码流程',
    portfolioAction: '整理成作品证据'
  },
  en: {
    eyebrow: 'CODER STARTER LAB',
    sectionEyebrows: {
      setup: 'MANUAL FIRST',
      assets: 'SOURCE PACK',
      manual: 'BASELINE AND REVIEW',
      reference: 'AFTER THE BASELINE',
      prompt: 'OPTIONAL AGENT CHECK',
      output: 'WHAT TO RETAIN',
      handoff: 'NEXT LOCAL REFERENCE'
    },
    title: 'Your first Coder Starter Lab: review a pure-function change',
    intro: 'Do not start with a large project or framework. This exercise changes one pure function: it returns a result from its input without reading files, using a network, or writing data. First decide six cases yourself; then compare an optional agent proposal and make the final human decision.',
    boundary: 'Every source asset is English, fictional, and disposable for local learning only. There are no API keys, real data, network calls, package setup, or deployment. Do not paste it into a company repository or let an agent use tools, run commands, edit files, commit, send, or deploy.',
    quickStart: {
      eyebrow: '15-MINUTE START',
      title: 'Judge two contrasting fixed cases first',
      intro: 'Do not download, write code, or open an AI assistant this time. Write the route for two cases on paper or in a note; this begins the full exercise but does not complete all six cases.',
      steps: ['TC-01: the request uses synthetic-only data, asks for no external action, and has a named reviewer and fixed cases. Write its route.', 'TC-06: the data is unapproved and an external action is requested; it also lacks a named reviewer and fixed cases. Write its route.', 'In one sentence, explain why BLOCKED must take priority over NEEDS_REVISION.'],
      referenceTitle: 'Check only after you have answered',
      reference: 'TC-01 is READY_FOR_REVIEW; TC-06 is BLOCKED. BLOCKED wins because the data scope or requested action has already crossed this local exercise boundary.',
      boundary: 'Finishing these two judgments in 15 minutes does not mean you wrote a diff, ran tests, or completed the Coder Starter Lab.',
      fullLabAction: 'When you have 45–60 minutes, complete the full Coder Starter Lab'
    },
    practiceMap: {
      eyebrow: 'TWO THINGS YOU PRACTISE',
      title: 'This small change practises what to change, how to check it, and when to discard a proposal',
      workflowTitle: 'Code and verification',
      workflow: ['Use the change brief to identify why BLOCKED must precede completeness checks.', 'Use six fixed cases to constrain the change to one pure function, a minimal diff, and proposed checks for every case.'],
      decisionTitle: 'Delivery and judgment',
      decision: ['Treat an agent output only as a review proposal: do not paste it into a repository, run it, or call it completed.', 'Use the reviewer/rollback record to decide PASS, REVISE, or STOP and record why a proposal must be discarded.']
    },
    setupTitle: 'Judge the change before asking an agent for a diff',
    setup: [
      { title: 'Use only the learner files supplied here', text: 'The six learner source assets describe one fictional pure function. A seventh file—the separate reference answers—appears only after you confirm the manual baseline. English file names and content make them portable to a local editor; they are not production-ready code.' },
      { title: 'Write the manual baseline first', text: 'Read the brief and six fixed cases. Before seeing a diff, decide whether each should be READY_FOR_REVIEW, NEEDS_REVISION, or BLOCKED.' },
      { title: 'Ask an agent for plan, diff, and tests only', text: 'If you choose to practise in an existing tool, paste only the supplied assets and turn off every tool, terminal, browser, connector, and write permission.' },
      { title: 'Let a reviewer keep or discard the proposal', text: 'Use the reviewer/rollback record to check scope, decision order, and cases. The only outcomes are PASS, REVISE, or STOP; nothing is automatically merged.' }
    ],
    assetsTitle: 'Six English source assets, plus a gated reference answer',
    assetsIntro: 'These local source assets can be copied, downloaded, and opened one at a time for inspection. Their content stays in English so code, diff, and test names remain consistent; the learning guide remains localized.',
    assetsNotice: 'Every download is plain text with no credential, network call, or runnable setup. This website does not execute the material or retain your result.',
    assetLabels: {
      readme: { title: 'README', description: 'The pack boundary, manual workflow, and claims it cannot make.' },
      brief: { title: 'Change brief', description: 'One small change, a fixed decision order, and non-goals.' },
      sourceSkeleton: { title: 'Source skeleton', description: 'An intentionally incomplete pure function; it reads, calls, and writes nothing.' },
      testCases: { title: 'Fixed case inputs', description: 'Six inputs without expected routes. Record your baseline first.' },
      referenceAnswers: { title: 'Reference answers', description: 'Reveal the six expected routes only after recording the manual baseline.' },
      agentPrompt: { title: 'Agent prompt', description: 'Requests only a plan, minimal diff, and test checks; external actions are forbidden.' },
      reviewerRollbackRecord: { title: 'Reviewer/rollback record', description: 'Manual baseline, scope checks, PASS/REVISE/STOP, and a discard path.' }
    },
    copyAction: 'Copy',
    downloadAction: 'Download file',
    bundleCopy: 'Copy learner source pack (no answers)',
    bundleDownload: 'Download learner source pack (no answers)',
    manualTitle: 'Manual baseline and review workflow',
    manualIntro: 'The core exercise needs no account, model, or agent. You can complete a reviewable decision from the brief, skeleton, and cases alone; an agent is only an optional later comparison.',
    manualSteps: [
      'Write the expected route for TC-01 through TC-06 in the reviewer record before reading any agent output.',
      'Read the change brief and mark the two BLOCKED conditions and why they must precede completeness checks.',
      'If you have a proposed diff, check only whether it changes the sole permitted source file, implements the required order, and covers every fixed case.',
      'Record PASS, REVISE, or STOP. If scope expands, an external action is proposed, or a case remains unresolved, STOP and discard the diff.'
    ],
    referenceGateTitle: 'Record all six routes before revealing the reference',
    referenceGateIntro: 'The learner source pack and agent prompt pack deliberately omit the answers. First record routes for TC-01 through TC-06 in the reviewer record. This confirmation is only your local self-check; the site does not store or verify it.',
    referenceGateConfirmation: 'I recorded an expected route for every case from TC-01 through TC-06 and am ready to compare the reference.',
    referenceGateAction: 'Reveal the separate reference answers',
    referenceGateRevealed: 'Reference answers revealed. Compare the reasoning case by case; this key is not evidence that code ran, tests passed, or a system is ready for real use.',
    promptTitle: 'Optional: ask an agent for a plan, diff, and tests only',
    promptIntro: 'This prompt does not connect to a model. Use it only in an existing chat or editor where you can verify there is no tool or write permission, and paste only the fictional assets supplied here. If you cannot verify that, stay with the manual baseline.',
    promptPackNotice: 'This agent prompt pack contains AGENT_PROMPT.md, CHANGE_BRIEF.md, src/review-route.ts, and the case inputs. It deliberately excludes the reference answers so an agent cannot simply reproduce the key.',
    promptCopy: 'Copy complete agent prompt pack',
    promptDownload: 'Download complete agent prompt pack',
    copySuccess: 'Copied to your clipboard.',
    copyError: 'Automatic copy did not work. Select the text and copy it directly.',
    outputTitle: 'What you can show someone when you finish',
    outputItems: ['A change brief with explicit non-goals', 'A manual baseline not influenced by an agent', 'A reviewable proposed diff limited to one pure function', 'A six-case reviewer record with PASS, REVISE, or STOP and a discard reason'],
    handoffTitle: 'Next: continue practising, or package this evidence',
    handoffText: 'To extend this tiny change, read Use AI as a coding partner and see how the feature, non-goals, acceptance, diff, tests, and reviewer decision fit into an engineering workflow. To package this work first, use the planner to retain the brief, baseline, diff, tests, and discard reason. Both routes stay local, synthetic, and human-decided.',
    handoffAction: 'Read the coding-partner workflow',
    portfolioAction: 'Package portfolio evidence'
  }
});

export function codingStarterLabAssets(locale: Locale) {
  const labels = codingStarterLabCopy[locale].assetLabels;
  return codingStarterLabSourceAssets.map(source => ({
    ...source,
    title: labels[source.id].title,
    description: labels[source.id].description
  }));
}

export function codingStarterLabReferenceAsset(locale: Locale) {
  const label = codingStarterLabCopy[locale].assetLabels.referenceAnswers;
  return {
    ...codingStarterLabReferenceAnswer,
    title: label.title,
    description: label.description
  };
}

export function codingStarterLabSourcePack() {
  return codingStarterLabSourceAssets.map(source => `--- ${source.fileName} ---\n${source.content}`).join('\n\n');
}

export function codingStarterLabAgentPrompt() {
  return codingStarterLabSourceAssets.find(source => source.id === 'agentPrompt')?.content ?? '';
}

export function codingStarterLabAgentPromptPack() {
  const promptAssetIds = ['agentPrompt', 'brief', 'sourceSkeleton', 'testCases'] as const;
  return promptAssetIds
    .map(id => codingStarterLabSourceAssets.find(source => source.id === id))
    .filter((source): source is CodingStarterLabSourceAsset => Boolean(source))
    .map(source => `--- ${source.fileName} ---\n${source.content}`)
    .join('\n\n');
}
