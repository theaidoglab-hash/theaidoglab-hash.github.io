import type { PortfolioShapeId } from '@/lib/portfolio-evidence-planner';
import type { Locale } from '@/lib/types';
import { canonicalLocaleRecord } from '@/lib/types';

export const PORTFOLIO_PROOF_PACK_DOWNLOAD_HREF = '/templates/portfolio-proof-pack/v1/portfolio-proof-pack.md';

export type PortfolioRouteRecommendation = {
  title: string;
  description: string;
  technicalHeading: string;
  technical: string;
  deliveryHeading: string;
  delivery: string;
  action: string;
  href: string;
  sourceStatus: string;
};

export const portfolioProofPackMarkdown = `# Portfolio Proof Pack

Use this as a portable, local-first scaffold for one portfolio project. It is a template, not a claim that a system is live, deployed, or useful to a real business.

Keep the source code and filenames in English so a reviewer can navigate it. You may write a translated README for readers. Use only synthetic, public, or explicitly authorised material. Never commit secrets, customer data, private prompts, internal screenshots, or a made-up repository URL.

## Suggested folder layout

\`\`\`
README.md
docs/
  brief.md
  source-and-data-receipt.md
  baseline-and-change.md
  contribution.md
  five-minute-defence.md
  release-and-privacy-check.md
eval/
  evaluation-plan.md
  results-and-failure-log.md
\`\`\`

Copy the sections below into those files. Delete unused prompts only after recording why they do not apply.

## README.md

# [Project name]

## One-sentence decision

[Named human role] uses this project only to decide [small, reviewable question]. The project does not [prohibited action or neighbouring business decision].

## What a reviewer can inspect

- Problem brief: docs/brief.md
- Data receipt and boundary: docs/source-and-data-receipt.md
- Baseline and candidate change: docs/baseline-and-change.md
- Evaluation plan: eval/evaluation-plan.md
- Results and failures: eval/results-and-failure-log.md
- My contribution: docs/contribution.md
- Five-minute defence: docs/five-minute-defence.md
- Release and privacy check: docs/release-and-privacy-check.md

## Local status

This package is local and fixture-first. [State exactly what was run locally.] It has no public repository until an owner publishes and reviews one. Do not replace this sentence with an invented GitHub link.

## Non-claims

- A local test pass does not prove business impact, production readiness, security approval, or user adoption.
- Synthetic fixtures do not describe a real customer, employer, market, or system.
- [Add the most tempting unsupported claim for this project.]

## docs/brief.md

# Brief

## Decision and owner

- Human owner: [role, not a person's name]
- Decision supported: [one decision]
- Decision deadline or cadence: [for example: weekly review]
- What remains human-only: [approval, sending, pricing, eligibility, security response, etc.]

## User and cost of error

- Primary user: [role]
- Current workaround: [manual rule, spreadsheet, search, queue, or no action]
- Error that matters: [wrong priority, unsafe draft, wasted review capacity, misleading context]
- Reversible scope: [what can be held, retried, or rolled back]

## In scope

- [Input]
- [Output]
- [Human review point]

## Out of scope

- [External action the project cannot take]
- [Decision it cannot make]
- [Claim it cannot make]

## Acceptance and stop conditions

- Pass only when: [fixed observable condition]
- Hold when: [missing source, unsafe output, stale data, cost threshold, or no owner]
- Roll back to: [baseline/manual route]

## docs/source-and-data-receipt.md

# Source and data receipt

## Material used

| Item | Source or fixture | Permission / terms | Retrieved or created | Version / date | Contains personal or confidential data? |
| --- | --- | --- | --- | --- | --- |
| [item] | [public URL, synthetic fixture, or authorised source] | [licence / approval / not applicable] | [how it entered the project] | [version] | [yes/no and boundary] |

## Data contract

- Required fields: [fields and units]
- Time boundary: [as-of date or point-in-time rule]
- Freshness rule: [how stale material is rejected]
- Allowed use: [what the material may support]
- Prohibited use: [what it must not support]

## Receipt decision

- READY / REJECTED / UNKNOWN: [one]
- Reason: [specific evidence]
- Human owner for exceptions: [role]

## docs/baseline-and-change.md

# Baseline and candidate change

## Baseline

- Baseline method: [manual rule, keyword retrieval, deterministic validation, previous model, or queue order]
- Baseline input version: [fixture or public-data version]
- Baseline result: [measured result or "not measured yet"]
- Why the baseline is an honest comparison: [same cases, same capacity, same time boundary]

## Candidate change

- One change: [prompt, model, feature, threshold, schema, retry policy, or ranking method]
- Hypothesis: [what should improve and what must not degrade]
- Fixed comparison context: [case set, capacity, source version, and owner]
- Rollback target: [baseline version]

## Decision

- KEEP / HOLD / REVERT: [one]
- Evidence: [link to result rows or case IDs]
- Human approver: [role]

## eval/evaluation-plan.md

# Evaluation plan

Choose the narrowest method that tests the output contract. Do not add an LLM evaluation merely to signal sophistication.

## A. Deterministic contract

Use this when validation, retrieval, queueing, ranking, schema handling, permissions, or prohibited actions can be checked with fixed rules.

- Contract: [required output and forbidden output]
- Fixed cases: [normal, missing, malformed, stale, duplicate, unsafe]
- Measures: [pass rate, rejection correctness, queue coverage, latency/cost proxy]
- Release gate: [minimum pass and any hard failure]
- Evidence location: [test command and results file]

## B. Bounded LLM output with Promptfoo

Use this only when generated language or structured model output is inside a bounded contract. Keep the deterministic core and action boundary separately tested.

- Model seam: [for example: optional static gpt-5-mini Responses request fixture]
- No-key default: [yes/no; explain]
- Promptfoo case matrix: [case IDs and expected properties]
- Assertions: [schema, citation, refusal, no prohibited action, regression delta]
- Human review: [what a human still judges]
- Evidence Delta: [how a prompt/model/config change is compared with the baseline]

## C. Predictive model or review queue

Use this for a scored or ranked queue, not an autonomous customer or business decision.

- Point-in-time rule: [how future information is excluded]
- Baseline and candidate: [methods]
- Capacity: [fixed number of human reviews]
- Measures: [model, queue, and workflow-proxy metrics kept separate]
- Leakage checks: [tests]
- Monitoring and rollback: [signals, owner, and baseline route]

## Selected evaluation

- Choice: [A / B / C]
- Why it matches the decision: [short explanation]
- Why the other options are unnecessary or unsafe: [short explanation]

## eval/results-and-failure-log.md

# Results and failure log

## Run receipt

- Run ID: [local identifier]
- Date: [date]
- Input / fixture version: [version]
- Baseline version: [version]
- Candidate version: [version]
- Command or repeatable steps: [command]
- Environment boundary: local fixture-only / public-data-only / other approved boundary

## Result summary

| Measure | Baseline | Candidate | Gate | Outcome |
| --- | --- | --- | --- | --- |
| [measure] | [value] | [value] | [threshold] | PASS / HOLD / REVERT |

## Failure log

| Case ID | What failed or was rejected | Expected safe behaviour | Actual behaviour | Disposition | Owner |
| --- | --- | --- | --- | --- | --- |
| [case] | [failure] | [expected] | [actual] | [fix / hold / accepted boundary] | [role] |

## Honest reading

- What the result supports: [local contract claim only]
- What it does not support: [business, security, production, or outcome claim]
- Next reversible action: [fix a case, keep baseline, request lawful data access, or stop]

## docs/contribution.md

# Contribution

## I designed or implemented

- [Specific artefact: contract, fixture, test, baseline, pipeline step, dashboard, trace, documentation]

## I adapted with attribution

- [Public tool, library, dataset, or documentation and what was changed]

## I did not build

- [Model, hosted service, public dataset, framework, or starter component]

## Review questions I can answer

- Why this decision and not a larger automation?
- What is the baseline?
- What happens on the highest-risk failure?
- Which evidence is synthetic, public, or authorised?

## docs/five-minute-defence.md

# Five-minute defence

## 0:00–0:45 — problem

[Describe the human decision, user, cost of error, and non-goal.]

## 0:45–1:45 — inputs and baseline

[Show the source receipt, data boundary, and baseline.]

## 1:45–3:00 — change and evaluation

[Show one candidate change, fixed cases, and the selected evaluation method.]

## 3:00–4:00 — failure and operations

[Show a real rejected case, human handoff, monitoring signal, and rollback.]

## 4:00–5:00 — honest conclusion

[State what the package proves locally, what it cannot claim, and the next reversible step.]

## docs/release-and-privacy-check.md

# Release and privacy check

Mark every item before sharing a repository, video, or PDF.

- [ ] No secrets, API keys, tokens, credentials, internal URLs, private prompts, or proprietary code.
- [ ] No customer, employee, candidate, employer, health, financial, or other personal/confidential data.
- [ ] Every dataset or fixture is synthetic, public under recorded terms, or explicitly authorised for this use.
- [ ] Screenshots, traces, and logs are redacted and do not reveal identities or internal systems.
- [ ] The README states local/fixture status and does not claim deployment, impact, approval, or adoption without evidence.
- [ ] External actions remain disabled or explicitly out of scope.
- [ ] A human owner, stop condition, and rollback route are visible.
- [ ] If no repository is public, the site says so plainly instead of inventing a GitHub URL.

## Before publishing

STOP and get the relevant owner or legal/security review if any item is uncertain. A portfolio package should demonstrate judgment, not bypass a boundary.
`;

type ProofPackCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  includesHeading: string;
  includes: string[];
  sourceLanguage: string;
  download: string;
  downloadHelp: string;
  copy: string;
  copyHelp: string;
  copySuccess: string;
  copyError: string;
  boundary: string;
  routeEyebrow: string;
  routeHeading: string;
};

export const portfolioProofPackCopy: Record<Locale, ProofPackCopy> = canonicalLocaleRecord({
  'zh-HK': {
    eyebrow: '可搬走的證據包',
    title: '把一個 project 變成可追問的 Portfolio Proof Pack',
    intro: '呢份新寫的空白 template，幫你由 brief、資料收據、baseline、evaluation、failure log，一路留到 release 檢查。它不是另一個 demo，也不會替你虛構成效。',
    includesHeading: 'Template 包含',
    includes: ['問題 brief 與 human owner', 'source／data receipt 與資料邊界', 'baseline、單一改動與 rollback', 'deterministic、bounded LLM Promptfoo 或 predictive queue 的評估選擇', 'result 與 failure log', '個人 contribution 與五分鐘 defence', 'release、privacy 與 non-claim 檢查'],
    sourceLanguage: 'Template 內容和檔名用英文，方便放進 repository；呢頁的說明會跟目前語言顯示。',
    download: '下載 Markdown template',
    downloadHelp: '空白、可攜帶的 source scaffold；不含任何帳號、key 或外部連接。',
    copy: '複製完整 template',
    copyHelp: '只複製到你的 clipboard，不會儲存輸入或傳送資料。',
    copySuccess: 'Template 已複製。請先換走方括號中的 placeholder，再開始做自己的 case。',
    copyError: '未能存取 clipboard。你可以改為下載 Markdown template。',
    boundary: '只用合成、公開或明確獲授權的資料。local fixture pass 只證明該次 contract，並不證明 production、商業成效或安全批准。',
    routeEyebrow: '下一步：對照一個相近的 Lab pattern',
    routeHeading: '你的選擇可由呢個案例開始校對'
  },
  'zh-TW': {
    eyebrow: '可帶走的專案紀錄',
    title: '把一個專案整理成別人能追問的作品紀錄',
    intro: '這份空白範本把問題、資料從哪裡來、簡單對照、測試、失敗情況和分享前檢查放在同一處。它不能替你補出沒有發生過的結果。',
    includesHeading: '範本內有什麼',
    includes: ['問題範圍與最後負責的人', '資料從哪裡來，以及可以／不可以怎樣用', '原本做法、一次改動與回退方式', '依輸出選測試：固定規則、受限模型輸出（用 Promptfoo 檢查固定案例），或人工覆核排序', '每次執行的結果與失敗紀錄', '自己做了什麼，以及五分鐘講解稿', '公開前的私隱檢查與不應聲稱的事'],
    sourceLanguage: '範本和檔名維持英文，放進程式儲存庫時較容易讓人檢查；本頁說明依你選擇的語言顯示。',
    download: '下載 Markdown 範本',
    downloadHelp: '空白的本地範本，沒有帳號、金鑰或外部連線。',
    copy: '複製完整範本',
    copyHelp: '只會複製到你的剪貼簿，不會儲存輸入或傳送資料。',
    copySuccess: '範本已複製。先替換方括號中的預留文字，再開始自己的案例。',
    copyError: '無法存取剪貼簿。你可以改為下載 Markdown 範本。',
    boundary: '只使用合成、公開或有明確授權的資料。本地固定測試只說明這一次的規則是否通過；不能當成真實環境可用、帶來商業成果或已獲安全核准的證明。',
    routeEyebrow: '接著看：相近練習的做法',
    routeHeading: '用這個案例檢查你想做的方向'
  },
  'zh-Hans': {
    eyebrow: '可带走的项目记录',
    title: '把一个项目整理成别人能追问的作品记录',
    intro: '这份空白模板把问题、数据来自哪里、简单对照、测试、失败情况和分享前检查放在同一处。它不能替你补出没有发生过的结果。',
    includesHeading: '模板里有什么',
    includes: ['问题范围和最后负责的人', '数据来自哪里，以及可以／不可以怎么用', '原有做法、一次改动和回退方式', '按输出选择测试：固定规则、受限模型输出（用 Promptfoo 检查固定案例），或人工复核排序', '每次执行的结果和失败记录', '自己做了什么，以及五分钟讲解稿', '发布前的隐私检查和不应声称的事'],
    sourceLanguage: '模板和文件名保持英文，放进代码仓库时更容易让人核对；本页说明按你选择的语言显示。',
    download: '下载 Markdown 模板',
    downloadHelp: '空白的本地模板，没有账号、密钥或外部连接。',
    copy: '复制完整模板',
    copyHelp: '只会复制到你的剪贴板，不会储存输入或发送数据。',
    copySuccess: '模板已复制。先替换方括号中的预留文字，再开始自己的案例。',
    copyError: '无法访问剪贴板。你可以改为下载 Markdown 模板。',
    boundary: '只使用合成、公开或有明确授权的数据。本地固定测试只能说明这一次的规则是否通过；不能作为真实环境可用、商业成效或已获安全批准的证明。',
    routeEyebrow: '接着看：相近练习的做法',
    routeHeading: '用这个案例检查你想做的方向'
  },
  en: {
    eyebrow: 'A portable project record',
    title: 'Make one project easy for a reviewer to inspect',
    intro: 'This blank template keeps the problem, data receipt, simple comparison, tests, failures, and pre-sharing check in one place. It cannot manufacture a result or turn a local exercise into real-world proof.',
    includesHeading: 'What the template records',
    includes: ['Problem scope and the responsible human', 'Where material came from and what it may support', 'The existing approach, one change, and how to go back', 'A test choice: fixed rules, constrained model output checked with Promptfoo, or a human-review queue', 'Run results and a failure record', 'Your contribution and a five-minute walkthrough', 'A privacy check and claims to avoid'],
    sourceLanguage: 'The template and filenames stay in English so a reviewer can navigate a code repository. The guidance on this page follows your selected language.',
    download: 'Download the Markdown template',
    downloadHelp: 'A blank local template with no account, key, or external connection.',
    copy: 'Copy the full template',
    copyHelp: 'Copies only to your clipboard; it does not save inputs or send data.',
    copySuccess: 'Template copied. Replace the bracketed placeholders before starting your own case.',
    copyError: 'Clipboard access was unavailable. Download the Markdown template instead.',
    boundary: 'Use synthetic, public, or explicitly authorised material only. A local fixture run only shows whether the stated rule passed for those inputs. It is not evidence of real-world readiness, business impact, or security approval.',
    routeEyebrow: 'Next: a related practice case',
    routeHeading: 'Check your project choice against this case'
  }
});

export const portfolioRouteRecommendationCopy: Record<Locale, Record<PortfolioShapeId, PortfolioRouteRecommendation>> = canonicalLocaleRecord({
  'zh-HK': {
    approval: {
      title: 'Approval Queue：草稿只可以留喺草稿',
      description: '想練習不寫程式的工作流程，可以由呢個情境開始：系統只寫 FAQ 回覆初稿，既不能發出訊息，亦不能改資料。',
      technicalHeading: '系統部分，可以檢查乜',
      technical: '用虛構 FAQ、可預期的假輸出同固定情境，檢查系統有冇按規則起草；遇到提示注入或被禁止的要求，就留低一條不放行的紀錄。',
      deliveryHeading: '用喺工作上，要交代乜',
      delivery: '清楚分開「寫一段回覆」同「真正送出」。指定誰可以覆核、誰批准、出錯留低乜，同埋幾時要停。',
      action: '看看 Approval Queue 練習',
      href: '/zh-HK/articles/approval-queue-low-code-portfolio',
      sourceStatus: '完整範例目前只作本地固定測試（fixture-only）的學習材料，未有已核實的公開程式儲存庫（public repository）；本站不會虛構 GitHub 連結。'
    },
    triage: {
      title: 'Renewal Triage：只核對排序邏輯，唔假裝預測挽留成效',
      description: '如果想練習風險排序，呢個例子只會把候選個案按固定人手容量排隊，唔會決定應否挽留任何客戶。',
      technicalHeading: '系統部分，可以檢查乜',
      technical: '先定清資料喺當日可唔可以用，測試有冇偷睇未來，保留規則做對照，再比較候選排序；同時記錄隊列容量、監察項目同撤回方法。',
      deliveryHeading: '用喺工作上，要交代乜',
      delivery: '寫清模型分數、工作流程可觀察的替代指標同負責人；系統唔會聯絡客戶，亦唔會替人作挽留決定。',
      action: '看看 Renewal Triage 練習',
      href: '/zh-HK/articles/renewal-triage-mlops',
      sourceStatus: '完整範例目前只作本地固定測試（fixture-only）的學習材料，未有已核實的公開程式儲存庫（public repository）；本站不會虛構 GitHub 連結。'
    },
    draft: {
      title: 'PolicyPilot：先由有根據的草稿同交人處理開始',
      description: '如果你想練習一個「只可按核准文件起草、遇到例外要交人」的 LLM 流程，呢個案例可以由細開始。',
      technicalHeading: '系統部分，可以檢查乜',
      technical: '把關鍵字搜尋同檢索版本放喺相同固定情境比較；保留測試個案、刪減敏感內容的紀錄、放行關卡、回退方式，同可選的 Promptfoo 固定測試。',
      deliveryHeading: '用喺工作上，要交代乜',
      delivery: '先列出客服查詢答錯會有咩後果、哪些資料不可用、由誰放行，以及本地練習仍然未知乜；答得流暢唔等於真係幫到工作。',
      action: '看看 PolicyPilot 練習',
      href: '/zh-HK/articles/enterprise-ai-portfolio-policy-pilot',
      sourceStatus: '完整範例目前只作本地固定測試（fixture-only）的學習材料，未有已核實的公開程式儲存庫（public repository）；本站不會虛構 GitHub 連結。'
    },
    reliability: {
      title: 'AI Batch Worker：先處理中斷同重覆，先好談擴大',
      description: '如果想練習批次工作的失敗處理，呢個例子只建立畀人複核的補充紀錄；重覆工作、重試、中斷後續跑同無法處理的項目都要睇得到。',
      technicalHeading: '系統部分，可以檢查乜',
      technical: '設定有限的一條處理隊列；每項工作有不會重覆完成的結果、按原因重試、固定等候、斷點後再跑、成本上限同無法處理的收集位。gpt-5-mini 只係未執行的請求示意。',
      deliveryHeading: '用喺工作上，要交代乜',
      delivery: '結果只可交人複核，並要寫明預算上限、覆核負責人同失敗去向。固定測試資料唔代表每項工作只做一次、資料會永久保存、服務表現或商業成果。',
      action: '看看 AI Batch Worker 練習',
      href: '/zh-HK/articles/build-a-resumable-ai-batch-worker',
      sourceStatus: '完整範例目前只作本地固定測試（fixture-only）的學習材料，未有已核實的公開程式儲存庫（public repository）；本站不會虛構 GitHub 連結。'
    },
    'public-data': {
      title: 'KEV Review Packet：先核對公開證據，先好談解讀',
      description: '如果想練習公開資料核對，呢個例子只會交出一份有來源的證據包或拒絕結果，絕不推論任何機構有冇受影響。',
      technicalHeading: '系統部分，可以檢查乜',
      technical: '保留來源紀錄，只准指定公開欄位，檢查資料結構；規則是交出證據包，否則拒絕，並有固定拒絕情境同逐例差異。可選的 Promptfoo／gpt-5-mini 只係未執行的測試示意。',
      deliveryHeading: '用喺工作上，要交代乜',
      delivery: '先由人判斷證據是否足夠。固定教學資料唔係當前數據，亦唔等同資產配對、掃描、修補、開工作單、安全審批或補救。',
      action: '看看 KEV Review Packet 練習',
      href: '/zh-HK/articles/build-a-public-data-kev-review-packet',
      sourceStatus: '完整範例目前只作本地固定測試（fixture-only）的學習材料，未有已核實的公開程式儲存庫（public repository）；本站不會虛構 GitHub 連結。'
    },
    'context-brief': {
      title: 'Workforce Signal Brief：先決定資料夠唔夠寫背景摘要',
      description: '如果想練習由公開來源寫背景摘要，呢個例子只幫人判斷資料夠唔夠，絕不把虛構數列講成招聘市場預測。',
      technicalHeading: '系統部分，可以檢查乜',
      technical: '先看來源紀錄、欄位、時間順序、更新日期、私有欄位同「不可採取行動」規則；先交不靠模型的資料包，可選 gpt-5-mini／Promptfoo 只作未執行的回歸設計。',
      deliveryHeading: '用喺工作上，要交代乜',
      delivery: '由一位負責人決定來源適唔適合寫摘要；唔可以聲稱有即時 ABS 資料、最新勞動市場判斷、預測、招聘／薪酬／簽證意見或已發佈結果。',
      action: '閱讀 Workforce Signal Brief 練習',
      href: '/zh-HK/articles/build-a-source-bound-context-brief',
      sourceStatus: '完整範例目前只作本地固定測試（fixture-only）的學習材料，未有已核實的公開程式儲存庫（public repository）；本站不會虛構 GitHub 連結。'
    }
  },
  'zh-TW': {
    approval: {
      title: 'Approval Queue：草稿留在草稿階段',
      description: '這個練習只產生 FAQ 回覆草稿。它不會自行送出訊息，也不會改動資料。',
      technicalHeading: '程式與測試會讓人看見什麼',
      technical: '用虛構 FAQ、固定輸出和一組固定案例，檢查草稿有沒有遵守規則。遇到提示注入或禁止操作的要求，系統會留下拒絕放行的紀錄。',
      deliveryHeading: '工作判斷與風險要寫清楚什麼',
      delivery: '分開「起草回覆」和「真的送出」；列出誰覆核、誰批准、出錯後留下什麼，以及何時停下來交人處理。',
      action: '查看 Approval Queue 練習',
      href: '/zh-TW/articles/approval-queue-low-code-portfolio',
      sourceStatus: '完整範例目前只作本地固定測試（fixture-only）的學習材料，尚未有經核實的公開程式儲存庫（public repository）；本站不會虛構 GitHub 連結。'
    },
    triage: {
      title: 'Renewal Triage：只核對排序，不宣稱挽留成效',
      description: '這個範例把候選個案排成固定人手容量可查看的順序，不會決定是否挽留任何客戶。',
      technicalHeading: '程式與測試會讓人看見什麼',
      technical: '先定義資料在當日是否可用，測試有沒有用到未來資訊，再用一條規則當作對照，才比較候選排序；同時記下隊列容量、要監察的信號和回退方式。',
      deliveryHeading: '工作判斷與風險要寫清楚什麼',
      delivery: '分開記錄模型表現、流程可觀察的代用指標和誰負責。系統不會聯絡客戶，也不代替人作挽留決定；本地結果不能聲稱帶來挽留成效。',
      action: '查看 Renewal Triage 練習',
      href: '/zh-TW/articles/renewal-triage-mlops',
      sourceStatus: '完整範例目前只作本地固定測試（fixture-only）的學習材料，尚未有經核實的公開程式儲存庫（public repository）；本站不會虛構 GitHub 連結。'
    },
    draft: {
      title: 'PolicyPilot：依據文件起草，遇到例外交人處理',
      description: '這個練習只可根據核准的虛構文件寫草稿；遇到例外時要交給人。',
      technicalHeading: '程式與測試會讓人看見什麼',
      technical: '在相同固定案例中比較關鍵字搜尋和文件檢索。留下測試案例、已遮掉敏感內容的紀錄、放行關卡、回退方式，以及可選的 Promptfoo 固定案例測試。',
      deliveryHeading: '工作判斷與風險要寫清楚什麼',
      delivery: '寫出答錯客服問題的可能後果、不可使用的資料和誰可放行；再說明本地練習仍無法確定什麼。流暢的文字不能證明工作變好。',
      action: '查看 PolicyPilot 練習',
      href: '/zh-TW/articles/enterprise-ai-portfolio-policy-pilot',
      sourceStatus: '完整範例目前只作本地固定測試（fixture-only）的學習材料，尚未有經核實的公開程式儲存庫（public repository）；本站不會虛構 GitHub 連結。'
    },
    reliability: {
      title: 'AI Batch Worker：看得到中斷、重試與重跑',
      description: '這個範例只建立供人覆核的補充紀錄；重複工作、重試、斷點續跑和無法處理的項目都應留下痕跡。',
      technicalHeading: '程式與測試會讓人看見什麼',
      technical: '用有限的一條處理隊列開始。每項工作只能記錄一次完成結果，按失敗原因重試，固定等待後再試，並可從中斷處續跑；另有成本上限、無法處理項目的收集處，以及每次執行、工作和嘗試的紀錄。gpt-5-mini 僅是未執行的請求示意。',
      deliveryHeading: '工作判斷與風險要寫清楚什麼',
      delivery: '輸出只可供人工覆核，並標明預算上限、覆核負責人和失敗去向。固定測試資料不能證明每項工作只會完成一次、資料可永久保存、服務水準、處理量或商業成果。',
      action: '查看 AI Batch Worker 練習',
      href: '/zh-TW/articles/build-a-resumable-ai-batch-worker',
      sourceStatus: '完整範例目前只作本地固定測試（fixture-only）的學習材料，尚未有經核實的公開程式儲存庫（public repository）；本站不會虛構 GitHub 連結。'
    },
    'public-data': {
      title: 'KEV Review Packet：先核對公開資料，再談解讀',
      description: '這個範例只交出有來源的證據包，或回傳 SOURCE_REJECTED；它不推斷任何機構有沒有受到影響。',
      technicalHeading: '程式與測試會讓人看見什麼',
      technical: '記下資料來源，只取允許的公開欄位並檢查格式。規則很簡單：能組成證據包才交出，否則拒絕；再用固定拒絕案例和逐案比較記錄變更。可選的 Promptfoo／gpt-5-mini 僅是未執行的測試示意。',
      deliveryHeading: '工作判斷與風險要寫清楚什麼',
      delivery: '人先決定資料是否足夠。未即時取得的固定教學資料不是最新資料，也不代表資產比對、掃描、修補、開單、安全核准或補救。',
      action: '查看 KEV Review Packet 練習',
      href: '/zh-TW/articles/build-a-public-data-kev-review-packet',
      sourceStatus: '完整範例目前只作本地固定測試（fixture-only）的學習材料，尚未有經核實的公開程式儲存庫（public repository）；本站不會虛構 GitHub 連結。'
    },
    'context-brief': {
      title: 'Workforce Signal Brief：先看資料能否支持背景摘要',
      description: '這個範例只幫人判斷資料是否足夠寫背景摘要，不會把虛構數列當成就業市場預測。',
      technicalHeading: '程式與測試會讓人看見什麼',
      technical: '檢查來源紀錄、欄位、時間順序、更新日期、私有欄位及「不可採取行動」規則。先產出不靠模型的資料包；可選的 gpt-5-mini／Promptfoo 固定資料只描述日後怎樣檢查改動，並未執行。',
      deliveryHeading: '工作判斷與風險要寫清楚什麼',
      delivery: '由負責人決定來源適不適合用來寫摘要。不要宣稱有即時 ABS 資料、最新勞動市場判斷、預測、招聘／薪資／簽證建議或已發佈結果。',
      action: '閱讀 Workforce Signal Brief',
      href: '/zh-TW/articles/build-a-source-bound-context-brief',
      sourceStatus: '完整範例目前只作本地固定測試（fixture-only）的學習材料，尚未有經核實的公開程式儲存庫（public repository）；本站不會虛構 GitHub 連結。'
    }
  },
  'zh-Hans': {
    approval: {
      title: 'Approval Queue：草稿留在草稿阶段',
      description: '这个练习只产生 FAQ 回复草稿。它不会自行发送消息，也不会改动数据。',
      technicalHeading: '程序和测试能让人看见什么',
      technical: '用虚构 FAQ、固定输出和一组固定案例，检查草稿有没有遵守规则。遇到提示注入或禁止操作的要求，系统会留下拒绝放行的记录。',
      deliveryHeading: '工作判断与风险要写清楚什么',
      delivery: '分开“起草回复”和“真的发送”；列出谁复核、谁批准、出错后留下什么，以及何时停下来交人处理。',
      action: '查看 Approval Queue 练习',
      href: '/zh-Hans/articles/approval-queue-low-code-portfolio',
      sourceStatus: '完整示例目前只作本地固定测试（fixture-only）的学习材料，尚未有经核实的公开代码仓库（public repository）；本站不会虚构 GitHub 链接。'
    },
    triage: {
      title: 'Renewal Triage：只核对排序，不声称挽留成效',
      description: '这个示例把候选个案排成固定人手容量可查看的顺序，不会决定是否挽留任何客户。',
      technicalHeading: '程序和测试能让人看见什么',
      technical: '先定义数据在当天是否可用，测试有没有用到未来信息，再用一条规则作为对照，才比较候选排序；同时记下队列容量、要监测的信号和回退方式。',
      deliveryHeading: '工作判断与风险要写清楚什么',
      delivery: '分开记录模型表现、流程可观察的代用指标和谁负责。系统不会联系客户，也不代替人做挽留决定；本地结果不能声称带来挽留成效。',
      action: '查看 Renewal Triage 练习',
      href: '/zh-Hans/articles/renewal-triage-mlops',
      sourceStatus: '完整示例目前只作本地固定测试（fixture-only）的学习材料，尚未有经核实的公开代码仓库（public repository）；本站不会虚构 GitHub 链接。'
    },
    draft: {
      title: 'PolicyPilot：依据文件起草，遇到例外交人处理',
      description: '这个练习只能根据获批的虚构文件写草稿；遇到例外时要交给人。',
      technicalHeading: '程序和测试能让人看见什么',
      technical: '在相同固定案例中比较关键词搜索和文件检索。留下测试案例、已遮掉敏感内容的记录、放行关卡、回退方式，以及可选的 Promptfoo 固定案例测试。',
      deliveryHeading: '工作判断与风险要写清楚什么',
      delivery: '写出答错客服问题的可能后果、不可使用的数据和谁可放行；再说明本地练习仍无法确定什么。流畅的文字不能证明工作变好。',
      action: '查看 PolicyPilot 练习',
      href: '/zh-Hans/articles/enterprise-ai-portfolio-policy-pilot',
      sourceStatus: '完整示例目前只作本地固定测试（fixture-only）的学习材料，尚未有经核实的公开代码仓库（public repository）；本站不会虚构 GitHub 链接。'
    },
    reliability: {
      title: 'AI Batch Worker：看得见中断、重试与重跑',
      description: '这个示例只建立供人复核的补充记录；重复工作、重试、断点续跑和无法处理的项目都应留下痕迹。',
      technicalHeading: '程序和测试能让人看见什么',
      technical: '用有限的一条处理队列开始。每项工作只能记录一次完成结果，按失败原因重试，固定等待后再试，并可从中断处续跑；另有成本上限、无法处理项目的收集处，以及每次运行、工作和尝试的记录。gpt-5-mini 仅是未执行的请求示意。',
      deliveryHeading: '工作判断与风险要写清楚什么',
      delivery: '输出只可供人工复核，并标明预算上限、复核负责人和失败去向。固定测试数据不能证明每项工作只会完成一次、数据可永久保存、服务水平、处理量或商业成果。',
      action: '查看 AI Batch Worker 练习',
      href: '/zh-Hans/articles/build-a-resumable-ai-batch-worker',
      sourceStatus: '完整示例目前只作本地固定测试（fixture-only）的学习材料，尚未有经核实的公开代码仓库（public repository）；本站不会虚构 GitHub 链接。'
    },
    'public-data': {
      title: 'KEV Review Packet：先核对公开数据，再谈解读',
      description: '这个示例只交出有来源的证据包，或返回 SOURCE_REJECTED；它不推断任何机构有没有受到影响。',
      technicalHeading: '程序和测试能让人看见什么',
      technical: '记下数据来源，只取允许的公开字段并检查格式。规则很简单：能组成证据包才交出，否则拒绝；再用固定拒绝案例和逐案比较记录变更。可选的 Promptfoo／gpt-5-mini 仅是未执行的测试示意。',
      deliveryHeading: '工作判断与风险要写清楚什么',
      delivery: '人先决定数据是否足够。未实时取得的固定教学数据不是最新数据，也不代表资产比对、扫描、修补、开单、安全批准或补救。',
      action: '查看 KEV Review Packet 练习',
      href: '/zh-Hans/articles/build-a-public-data-kev-review-packet',
      sourceStatus: '完整示例目前只作本地固定测试（fixture-only）的学习材料，尚未有经核实的公开代码仓库（public repository）；本站不会虚构 GitHub 链接。'
    },
    'context-brief': {
      title: 'Workforce Signal Brief：先看数据能否支持背景摘要',
      description: '这个示例只帮人判断数据是否足够写背景摘要，不会把虚构数列当成就业市场预测。',
      technicalHeading: '程序和测试能让人看见什么',
      technical: '检查来源记录、字段、时间顺序、更新日期、私有字段及“不可采取行动”规则。先产出不依赖模型的数据包；可选的 gpt-5-mini／Promptfoo 固定数据只描述日后怎样检查改动，并未执行。',
      deliveryHeading: '工作判断与风险要写清楚什么',
      delivery: '由负责人决定来源适不适合用来写摘要。不要声称有实时 ABS 数据、最新劳动力市场判断、预测、招聘／薪资／签证建议或已发布结果。',
      action: '阅读 Workforce Signal Brief',
      href: '/zh-Hans/articles/build-a-source-bound-context-brief',
      sourceStatus: '完整示例目前只作本地固定测试（fixture-only）的学习材料，尚未有经核实的公开代码仓库（public repository）；本站不会虚构 GitHub 链接。'
    }
  },
  en: {
    approval: {
      title: 'Approval Queue: drafts stop before sending',
      description: 'This exercise produces FAQ reply drafts only. It cannot send a message or change data.',
      technicalHeading: 'What the code and tests make visible',
      technical: 'Synthetic FAQs, fixed outputs, and fixed cases show whether drafting follows the rules. A prompt-injection or prohibited-action request creates a record that stops it from proceeding.',
      deliveryHeading: 'What the decision and risk record must state',
      delivery: 'Separate writing a reply from sending it. Name the reviewer, approver, record kept after an error, and point at which the case goes to a person.',
      action: 'View the Approval Queue exercise',
      href: '/en/articles/approval-queue-low-code-portfolio',
      sourceStatus: 'The reference package is currently local, fixture-only learning material. No verified public repository exists, so this site does not invent a GitHub URL.'
    },
    triage: {
      title: 'Renewal Triage: check ordering, do not claim retention',
      description: 'This example orders candidate cases within a fixed human-review capacity. It does not decide whether any customer should be retained.',
      technicalHeading: 'What the code and tests make visible',
      technical: 'Define what data was available on the day, test that future information was not used, keep a rule as the comparison, then compare the candidate ordering. Record queue capacity, signals to watch, and the route back to the rule.',
      deliveryHeading: 'What the decision and risk record must state',
      delivery: 'Keep model behaviour, observable workflow proxies, and the responsible person separate. The system never contacts customers or makes a retention decision, and a local result cannot claim retention impact.',
      action: 'View the Renewal Triage exercise',
      href: '/en/articles/renewal-triage-mlops',
      sourceStatus: 'The reference package is currently local, fixture-only learning material. No verified public repository exists, so this site does not invent a GitHub URL.'
    },
    draft: {
      title: 'PolicyPilot: draft from approved documents, hand off exceptions',
      description: 'This exercise writes drafts only from approved fictional documents. Any exception goes to a person.',
      technicalHeading: 'What the code and tests make visible',
      technical: 'Compare keyword search and document retrieval on the same fixed cases. Keep the cases, traces with sensitive content removed, a gate before release, a return path, and an optional Promptfoo check of fixed cases.',
      deliveryHeading: 'What the decision and risk record must state',
      delivery: 'State the likely cost of a wrong support answer, the data that is out of bounds, and who may approve a draft. Also state what the local exercise cannot establish; fluent text is not proof that work improved.',
      action: 'View the PolicyPilot exercise',
      href: '/en/articles/enterprise-ai-portfolio-policy-pilot',
      sourceStatus: 'The reference package is currently local, fixture-only learning material. No verified public repository exists, so this site does not invent a GitHub URL.'
    },
    reliability: {
      title: 'AI Batch Worker: make interruption, retry, and reruns visible',
      description: 'This example creates an enrichment record for human review only. Duplicate work, retries, resuming after interruption, and unprocessable items should all leave a trace.',
      technicalHeading: 'What the code and tests make visible',
      technical: 'Use one bounded processing queue. Each job records only one completed outcome; retries depend on the error type and use fixed waits; work can resume from a checkpoint. The example also has a cost cap, a place for unprocessable items, and records for every run, job, and attempt. The gpt-5-mini request shape is static and never run.',
      deliveryHeading: 'What the decision and risk record must state',
      delivery: 'Outputs are for human review only. Show the budget cap, review owner, and failure route. Fixed test data cannot prove exactly-once completion, durable storage, service levels, throughput, or business impact.',
      action: 'View the AI Batch Worker exercise',
      href: '/en/articles/build-a-resumable-ai-batch-worker',
      sourceStatus: 'The reference package is currently local, fixture-only learning material. No verified public repository exists, so this site does not invent a GitHub URL.'
    },
    'public-data': {
      title: 'KEV Review Packet: check public data before interpreting it',
      description: 'This example returns a sourced evidence packet or SOURCE_REJECTED. It never infers whether an organisation is affected.',
      technicalHeading: 'What the code and tests make visible',
      technical: 'Record the source, accept only named public fields, and check the structure. The rule is simple: return a packet only when one can be assembled; otherwise reject it. Fixed reject cases and case-by-case comparisons record changes. Optional Promptfoo and gpt-5-mini shapes are test sketches, not executed requests.',
      deliveryHeading: 'What the decision and risk record must state',
      delivery: 'A person decides whether the evidence is sufficient. Fixed teaching material that was not acquired live is not current data, asset matching, scanning, patching, ticketing, security approval, or remediation.',
      action: 'View the KEV Review Packet exercise',
      href: '/en/articles/build-a-public-data-kev-review-packet',
      sourceStatus: 'The reference package is currently local, fixture-only learning material. No verified public repository exists, so this site does not invent a GitHub URL.'
    },
    'context-brief': {
      title: 'Workforce Signal Brief: check whether the data supports a context brief',
      description: 'This example helps a person decide whether the material is sufficient for a context brief. It does not present a fictional series as a job-market forecast.',
      technicalHeading: 'What the code and tests make visible',
      technical: 'Check the source record, fields, time order, update date, private fields, and the rule that no action may be taken. Produce a packet without a model first; optional fixed gpt-5-mini and Promptfoo material only describes how a later change would be checked and is never run.',
      deliveryHeading: 'What the decision and risk record must state',
      delivery: 'The responsible person decides whether a source is suitable for a brief. Do not claim live ABS data, current labour-market judgement, a forecast, hiring, pay, or visa advice, or a published result.',
      action: 'Read the Workforce Signal Brief',
      href: '/en/articles/build-a-source-bound-context-brief',
      sourceStatus: 'The reference package is currently local, fixture-only learning material. No verified public repository exists, so this site does not invent a GitHub URL.'
    }
  }
});
