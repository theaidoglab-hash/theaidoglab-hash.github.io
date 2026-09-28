# Renewal Triage Starter（繁體中文）

這是給讀者閱讀的繁體中文入口頁。程式碼、檔名、command、測試名稱與 runtime string 保持英文，方便 reviewer 重跑；如需核對原始技術文字，請閱讀 [English README](README.md)。

狀態：讀者自行持有的本機練習。Package 只含虛構 record；它是 portfolio starter，不是 production renewal system。

這個小 project 只回答一個有範圍的問題：**當兩位 reviewer 只能看兩筆 record 時，只按 raw risk score 排序，是否會得出與按 synthetic business-priority value 排序相同的 draft queue？**

它刻意產生兩條不同 queue。這個差異就是重點：技術上整齊的 score，不等於對既定 capacity 有用的 decision queue。

## 在本機執行

需要 Node.js 20 或以上。它沒有 third-party dependency、environment variable、credential、network call、model call 或 install step。

先解壓縮下載檔。然後在解壓後、包含本檔 `README.md` 與 `package.json` 的資料夾開啟終端機，再執行：

```powershell
npm test
npm run demo
```

`npm test` 會檢查已記錄 result、risk ranking 與 queue utility 的差異、ineligible-record rule、no-action boundary、out-of-scope request、non-synthetic fixture 與 invalid capacity。

`npm run demo` 會印出 [`expected-output.json`](expected-output.json) 記錄的確切 report。

## Fixed fixture 展示什麼

Capacity 是兩筆 record。

| Draft strategy | 入選的 synthetic record | Offline synthetic queue utility |
| --- | --- | ---: |
| Raw risk score，由高至低 | `SYN-RN-001`, `SYN-RN-002` | `16` units |
| Risk score × synthetic renewal value，由高至低 | `SYN-RN-002`, `SYN-RN-004` | `26` units |

Utility figure 來自 hidden-for-selection synthetic fixture label。它只在 queue 建成後，用來比較兩個 local draft；它不是 revenue、retained value、customer outcome、model metric、intervention result 或 causal evidence。

`SYN-RN-005` 有最高 raw signal，但它不合資格，因此兩個 draft 都不能選它。較高 numerical value 永遠不可越過 eligibility boundary。

## 在 portfolio review 可以指出什麼

- 一份說明 owner、allowed output、capacity 與 non-goal 的 decision brief。
- Queue 建立前的 deterministic fixture validation。
- 兩條清楚不同的 ranking rule：raw risk 與 business priority。
- 一個看人實際會 review 的 queue、而不只看 score 的 evaluation。
- Failure route 的 test 與可重跑的 expected report。
- 一份將 local demonstration 與真實 approval 分開的 reviewer decision 與 rollback record。

## Package map

```text
data/       Synthetic snapshot and allowed/blocked request fixtures
src/        Validation, queue construction, route boundary, and contracts
tests/      Node built-in test suite
scripts/    Repeatable local demo
docs/       Decision, metric, failure, review, rollback, and adaptation records
```

調整它前，請先閱讀：

- [Decision brief](docs/decision-brief.md)
- [Metric map](docs/metric-map.md)
- [Failure cases](docs/failure-cases.md)
- [Reviewer decision template](docs/reviewer-decision.md)
- [Rollback record](docs/rollback-record.md)
- [Adaptation worksheet](docs/adaptation-worksheet.md)
- [Future model seam](docs/future-model-seam.md)

## Scope boundary

- 每條 `SYN-RN-*` record 與每個 value 都是為本練習而虛構。
- 唯一允許的 output 是供人檢查的 draft queue。
- Package 不會聯絡 customer、修改 price、作出 renewal decision、寫入 external system，或向任何地方送出 request。
- 本機 test pass 只表示這個特定 synthetic exercise 可重跑；不代表 model quality、business impact、security、privacy approval、production readiness，或適合使用 live data。
- 未經 authorised owner 另外確認 data permission、privacy/security review、point-in-time availability、intervention design、success measure、monitoring 與 release decision 前，不要把 fixture 換成真實 record。
