# AI Batch Worker Starter

[English source](README.md) · [繁中（香港）](README.zh-HK.md) · [简体中文](README.zh-Hans.md)

狀態：由讀者自行持有的本機練習。這個 package 只包含虛構 work item；它是 portfolio starter，不是已部署的 worker、queue、model integration 或 document system。

這個小 project 只問一個刻意縮小的問題：當一個有上限的 batch 被中斷、重新送入、rate limited，或因 spending guardrail 停止時，reviewer 能否看見每一個合成 work item 發生了什麼，而 worker 又不會採取任何真實 action？

唯一允許的結果是一份供人工 review 的本機 enrichment record。worker 不會更新 document、聯絡任何人、向帳戶收費、寫入 external system，也不會 call model。

## 在本機執行

需要 Node.js 20 或以上。這個 package 沒有 third-party dependency、environment variable、API key 或其他 credential、network call、model call，也不需要安裝。

先解壓縮下載檔。然後在解壓後、包含本檔 `README.md` 與 `package.json` 的資料夾開啟終端機，再執行：

```powershell
npm test
npm run demo
```

test suite 會檢查已記錄的 two-run walkthrough、retry 與 resume、terminal duplicate suppression、invalid work item、budget stop、retry exhaustion、錯誤 fixture provenance、out-of-scope request，以及靜態的 future-model seam。

demo 會印出與 `expected-output.json` 相同的 deterministic report。本機 pass 只證明這個虛構練習可以依所述方式重跑。

## 固定練習會展示什麼

| 情況 | 本機行為 | 讀者可核對的內容 |
| --- | --- | --- |
| First delivery | 有效的 synthetic item 會進入 queue，然後完成或被 checkpoint。 | Run ID、job trace、attempt trace 與 terminal route。 |
| Timeout | item 會維持 pending，直到計算出的 retry time。 | Retry category、deterministic backoff 與 checkpoint。 |
| Resume | 後續一次本機 invocation 只會處理合資格的 pending work。 | 同一個 idempotency key 與新的 attempt trace。 |
| Redelivery after completion | item 會在再次 attempt 或產生 synthetic cost 前被 suppress。 | Terminal duplicate route 與先前的 terminal state。 |
| Invalid work item | item 會在任何 attempt 前進入本機 dead-letter record。 | Reason code、零 attempt count 與 human-review boundary。 |
| Budget stop | pending item 會在超過 synthetic cap 前保持原狀。 | Budget-stop route、未變的 attempt count 與 checkpoint。 |
| Exhausted retry | 可 retry 的 failure 會在固定上限後變成 dead letter。 | Attempt count、terminal record 與 redelivery suppression。 |

## Package 地圖

| Path | 用途 |
| --- | --- |
| `data/` | 虛構 work-item 與 request fixtures。 |
| `src/` | Validation、idempotency、checkpoint、retry 與本機 routing code。 |
| `tests/` | Node built-in test suite，覆蓋 success 與 failure routes。 |
| `scripts/` | 可重跑的 two-run local walkthrough。 |
| `docs/` | Decision、failure、metric、review、rollback、adaptation 與 future-model notes。 |
| `expected-output.json` | 已提交、由 local walkthrough 產生的 deterministic report。 |
| `CONTENTS.md` | 這個 starter 內每一個 file 的簡明列表。 |

## Portfolio review 可以怎麼講

- 從 duplicate 或 timeout 開始，而不是只展示 happy-path answer。
- 展示 idempotency key 如何綁定一個 synthetic source revision。
- 解釋 checkpoint 只是給後續一次本機 invocation 的記錄，不是 durable production store 的證明。
- 在讀取任何 simulated provider outcome 前，展示 cost stop。
- 指出一個 failure case、一份 manual-review record，以及一個 rollback condition。
- 將靜態 `gpt-5-mini` request shape 與可執行 worker 分開。它只記錄一個可能的未來 experiment；不會 call API。

## 改 code 前先看

- `docs/decision-brief.md`
- `docs/failure-cases.md`
- `docs/metric-map.md`
- `docs/manual-review-record.md`
- `docs/rollback-record.md`
- `docs/adaptation-worksheet.md`
- `docs/future-model-seam.md`

## Scope boundary 與不會聲稱的事

- 這個 package 內每個 work item、identifier、outcome、cost unit、timestamp 與 trace 都是虛構。
- worker 只會產生一份需要人工 review 的本機 record。
- worker 沒有 credential、SDK、model request、network call、persistent queue、database、concurrent worker、external action 或真實 spending。
- 固定的 synthetic outcome 不是 provider behaviour、delivery semantics、exactly-once processing、privacy approval、security、真實 cost control、model quality、performance、business value 或 production readiness 的證明。
- 未經 authorised owner 分別確認 data permission、security 與 privacy review、retention rules、durable-storage design、retry 與 provider contracts、evaluation plan、monitoring、incident ownership 與 release decision 前，不要用真實 data 取代 fixture。
