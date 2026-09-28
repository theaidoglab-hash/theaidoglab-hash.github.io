# PolicyPilot Starter（香港繁體中文）

這是給讀者閱讀的繁體中文入口頁。程式碼、檔名、command、測試名稱和 runtime string 保持英文，方便 reviewer 重跑；如要核對原有技術文字，可閱讀 [English README](README.md)。

狀態：讀者自行持有的本機練習。這個 package 只含虛構 policy record；它是 portfolio starter，不是 production policy service。

這個小 project 只回答一條有範圍的問題：

> Support reviewer 可否收到一份由現行、已核准的 synthetic rule 支持的 draft，還是這個 case 必須停下來交人覆核？

這個 starter 不會嘗試砌一個通用 support chatbot。它把 source rule、decision authority、negative case 和限制寫清楚。沒有有效 source 的流暢答案不算成功。

## 在本機執行

需要 Node.js 20 或以上。它沒有 third-party dependency、environment variable、credential、network call 或 install step，亦不會作 model call。

先解壓縮下載檔。然後在解壓後、包含本檔 `README.md` 和 `package.json` 的資料夾開啟終端機，再執行：

```powershell
npm test
npm run demo
```

`npm test` 會檢查：一份引用現行 source 的 draft、沒有支持的問題、已被取代的 rule、超出範圍的 action、instruction-override attempt、non-synthetic corpus、static model seam，以及 local Promptfoo provider。

`npm run demo` 會印出 [`expected-output.json`](expected-output.json) 記錄的確切 report。

## 這個示例實際檢查甚麼

Demo 問的是：一個未使用的 synthetic demonstration keyboard，在送達 14 日後可否考慮退貨。它會產生一份引用 `SYN-POL-RET-100 v2` 的 draft。

同一個 query 亦會配對到 `SYN-POL-RET-100 v1`，但這條 record 已被取代。Trace 會把它記成 rejected，而不把它當成 current source。要求使用 2025 rule、沒有足夠支持的問題、action request，或企圖覆寫 policy boundary，都會變成 human handoff 或 blocked operation。

五個已記錄 case 只有同時滿足以下條件才算 pass：

| Check | 五個已記錄 case 的結果 | 範圍 |
| --- | --- | --- |
| Route and reason code | 5 個已聲明 case 全部 match | 很小的虛構 evaluation set |
| Citation reference | 5 個已聲明 case 全部 match | 只接受 current policy ID/version |
| External actions | 觀察到 0 次 | Package 沒有 action integration |
| Human review | 每條 route 都必須有 | Draft 不會自行決定或行動 |
| Trace 裡的 raw fixture question | 觀察到 0 次 | Trace 改存 hash 和 metadata |

這些只是這個小練習的特性，並不是 service-level、model、security、privacy、revenue、customer、productivity 或 business-impact 結果。

## Reviewer 可以檢查甚麼

| Evidence area | 這個 package 展示甚麼 | 它不會聲稱甚麼 |
| --- | --- | --- |
| Business framing | 一個有範圍的 policy-draft decision、manual baseline、named owner 和 non-goal | 真實 organisation、workflow、KPI 或 user problem |
| Source control | Synthetic ID、version、status、effective date，以及明確 reject stale/draft record 的做法 | 真實 policy corpus 或完整 retrieval coverage |
| Technical baseline | 在選 model 前先做 deterministic keyword matching | Semantic-search、RAG 或 LLM quality |
| Safety and authority | Read-only action contract、block 超出範圍的 request 和 human handoff | 單靠 code 就能令 live system 安全 |
| Evaluation | Fixed positive/negative case、已記錄 demo 和 Node test | 超出五個虛構 case 的 generalisation |
| Delivery practice | Decision、metric、failure、review、rollback 和 adaptation record | Operational approval、deployment、monitoring 或 incident response |

## Package map

```text
data/       Versioned synthetic policy corpus and demo requests
src/        Validation, retrieval baseline, routing, evaluation, and static model seam
tests/      Node built-in test suite
scripts/    Repeatable local demo
evals/      Optional local Promptfoo fixture configuration
docs/       Business decision, metrics, failure, review, rollback, and adaptation records
```

改動 fixture 前，先閱讀：

- [Decision brief](docs/decision-brief.md)
- [Metric map](docs/metric-map.md)
- [Failure cases](docs/failure-cases.md)
- [Reviewer decision template](docs/reviewer-decision.md)
- [Rollback record](docs/rollback-record.md)
- [Adaptation worksheet](docs/adaptation-worksheet.md)
- [Future model seam](docs/future-model-seam.md)

## 選用：跑 Promptfoo fixture

[`evals/promptfoo.fixture.yaml`](evals/promptfoo.fixture.yaml) 係可以畀 reviewer 檢查嘅 Promptfoo fixture configuration。佢嘅 provider 只會呼叫呢個 package 嘅 deterministic local route。佢唔喺 `package.json` script 入面，所以基本嘅 `npm test` 同 `npm run demo` 路徑仍然唔需要 dependency、key 或 model。

如果想用 Promptfoo 檢查同一組三個 fixed cases，呢個選用 command 先需要 Node.js 22.22 或以上。佢會鎖定 Promptfoo `0.123.1`，並將 exported result 寫入已 ignore 嘅 `results/`：

```powershell
npx --yes promptfoo@0.123.1 eval -c evals/promptfoo.fixture.yaml -o results/promptfoo.fixture.json
```

`npm test` 會檢查已提交嘅 configuration 同 local provider，但唔會執行 Promptfoo，唔可以當成有記錄嘅 Promptfoo pass。只有上面嘅選用 command 真正跑完，先會有本機 Promptfoo result。

如果本機未 cache，`npx` 可能要由 package registry 下載已鎖定嘅工具。fixture provider 本身唔會讀 credential、call model 或 API，亦唔會用 business data。嗰個 result 只代表三個本機 fixed cases 可以重跑，唔係 live-model result 或 production evidence。

## Future-model boundary

[`src/responses-api-fixture.mjs`](src/responses-api-fixture.mjs) 是一份 static `gpt-5-mini` Responses API shape。它標示自己為 `design_note_only_not_executed`，沒有 key、provider setup、SDK、request、response 或 model output。它只用來討論日後 experiment 應放在哪一層，不能用作聲稱 experiment 已經發生。

## Scope boundary

- 每條 `SYN-POL-*` record 和每個 result 都是為本練習而虛構。
- 唯一容許的 output 是附 citation 的 draft，或交給人手檢查的 handoff。
- Package 不會聯絡 customer、讀取 account、修改 order、建立 case、退款、收款，或向任何地方送出 request。
- 本機 test pass 只表示這個特定 synthetic exercise 可重跑；不代表 model quality、business impact、security、privacy approval、production readiness，或適合使用 live data。
- 未經 authorised owner 另外確認 data permission、source governance、privacy/security review、point-in-time availability、baseline、success measure、monitoring、incident path 和 release decision 前，不要把 fixture 換成真實 record。
