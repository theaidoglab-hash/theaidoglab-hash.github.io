# AI Batch Worker Starter

[English source](README.md) · [繁中（台灣）](README.zh-TW.md) · [简体中文](README.zh-Hans.md)

狀態：由讀者自行持有嘅本機練習。呢個 package 只包含虛構 work item；佢係 portfolio starter，唔係已部署嘅 worker、queue、model integration 或 document system。

呢個小 project 只問一條刻意收窄嘅問題：當一個有上限嘅 batch 被中斷、重新送入、rate limited，或者因 spending guardrail 停低時，reviewer 可唔可以睇到每一個合成 work item 發生過乜，而 worker 又唔會採取任何真實 action？

唯一容許嘅結果，係一份供人手 review 嘅本機 enrichment record。worker 唔會更新 document、聯絡任何人、向帳戶收費、寫入 external system，亦唔會 call model。

## 喺本機跑

需要 Node.js 20 或以上。呢個 package 冇 third-party dependency、environment variable、API key 或其他 credential、network call、model call，亦唔使安裝。

先解壓縮下載檔。然後在解壓後、包含本檔 `README.md` 和 `package.json` 的資料夾開啟終端機，再執行：

```powershell
npm test
npm run demo
```

test suite 會檢查已記錄嘅 two-run walkthrough、retry 同 resume、terminal duplicate suppression、invalid work item、budget stop、retry exhaustion、錯誤 fixture provenance、out-of-scope request，同埋靜態嘅 future-model seam。

demo 會印出同 `expected-output.json` 一樣嘅 deterministic report。本機 pass 只證明呢個虛構練習可以按所述方式重跑。

## 固定練習會展示乜

| 情況 | 本機行為 | 讀者可核對嘅內容 |
| --- | --- | --- |
| First delivery | 有效嘅 synthetic item 會入 queue，然後完成或者被 checkpoint。 | Run ID、job trace、attempt trace 同 terminal route。 |
| Timeout | item 會保持 pending，直至計算出嘅 retry time。 | Retry category、deterministic backoff 同 checkpoint。 |
| Resume | 之後一次本機 invocation 只會處理合資格嘅 pending work。 | 同一個 idempotency key 同新嘅 attempt trace。 |
| Redelivery after completion | item 會喺再次 attempt 或產生 synthetic cost 前被 suppress。 | Terminal duplicate route 同之前嘅 terminal state。 |
| Invalid work item | item 會喺任何 attempt 前進入本機 dead-letter record。 | Reason code、零 attempt count 同 human-review boundary。 |
| Budget stop | pending item 會喺超過 synthetic cap 前保持原狀。 | Budget-stop route、未變嘅 attempt count 同 checkpoint。 |
| Exhausted retry | 可 retry 嘅 failure 會喺固定上限後變成 dead letter。 | Attempt count、terminal record 同 redelivery suppression。 |

## Package 地圖

| Path | 用途 |
| --- | --- |
| `data/` | 虛構 work-item 同 request fixtures。 |
| `src/` | Validation、idempotency、checkpoint、retry 同本機 routing code。 |
| `tests/` | Node built-in test suite，覆蓋 success 同 failure routes。 |
| `scripts/` | 可重跑嘅 two-run local walkthrough。 |
| `docs/` | Decision、failure、metric、review、rollback、adaptation 同 future-model notes。 |
| `expected-output.json` | 已提交、由 local walkthrough 產生嘅 deterministic report。 |
| `CONTENTS.md` | 呢個 starter 入面每一個 file 嘅簡明列表。 |

## Portfolio review 可以點講

- 由 duplicate 或 timeout 開始，而唔係只展示 happy-path answer。
- 展示 idempotency key 點樣綁定一個 synthetic source revision。
- 解釋 checkpoint 只係畀之後一次本機 invocation 嘅記錄，唔係 durable production store 嘅證明。
- 喺讀取任何 simulated provider outcome 前，展示 cost stop。
- 指出一個 failure case、一份 manual-review record，同一個 rollback condition。
- 將靜態 `gpt-5-mini` request shape 同可執行 worker 分開。佢只記錄一個可能嘅將來 experiment；唔會 call API。

## 改 code 前先睇

- `docs/decision-brief.md`
- `docs/failure-cases.md`
- `docs/metric-map.md`
- `docs/manual-review-record.md`
- `docs/rollback-record.md`
- `docs/adaptation-worksheet.md`
- `docs/future-model-seam.md`

## Scope boundary 同唔會聲稱嘅事

- 呢個 package 入面每個 work item、identifier、outcome、cost unit、timestamp 同 trace 都係虛構。
- worker 只會產生一份需要人手 review 嘅本機 record。
- worker 冇 credential、SDK、model request、network call、persistent queue、database、concurrent worker、external action 或真實 spending。
- 固定嘅 synthetic outcome 唔係 provider behaviour、delivery semantics、exactly-once processing、privacy approval、security、真實 cost control、model quality、performance、business value 或 production readiness 嘅證明。
- 未經 authorised owner 分別確認 data permission、security 同 privacy review、retention rules、durable-storage design、retry 同 provider contracts、evaluation plan、monitoring、incident ownership 同 release decision 前，唔好用真實 data 取代 fixture。
