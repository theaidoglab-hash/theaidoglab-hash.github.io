# AI 批次工作器參考實作

[English](README.md) · [繁體中文（香港）](README.zh-HK.md) · [简体中文](README.zh-Hans.md)

> **狀態：合成資料、本機作品集參考實作。** 它不是已部署的 worker、真實 queue、live model integration，也不代表已具備 production readiness。

此專案以虛構情境示範：如何為一批內部文件產生待人工審閱的增補結果，同時避免同一文件版本重複處理、避免無限重試永久錯誤，並在預設的合成成本上限前停止。輸出只是**供人工審閱的合成 enrichment record**，不會改動任何文件或外部系統。

它刻意是 **serial** 示範：`maxItemsPerRun` 只限制一次 invocation 的本機 fixture attempt，`maxQueuedJobs` 只限制 pending item；沒有 concurrent worker、requests-per-time-window limiter、provider `Retry-After` handling 或 rate-limit enforcement。

## 在本機運行

需要 Node.js 20 或以上。沒有第三方相依套件、credential、環境變數、網路呼叫或安裝步驟。

```powershell
# From this repository's root
npm test
npm run demo
npm run demo -- --json
```

指令只會執行固定的合成測試並輸出本機示範摘要；`npm run demo -- --json` 對應可重跑的 [`artifacts/run-report.json`](artifacts/run-report.json)。它們不會 deploy、傳送文件、建立真實 queue、呼叫 model、花費金錢或證明商業成效。

## 這個作品集可檢視的內容

| 能力 | 可檢視證據 | 不作出的聲稱 |
| --- | --- | --- |
| Serial queue 與 invocation cap | `maxQueuedJobs` 限制 pending item，`maxItemsPerRun` 限制一次 serial fixture attempt。 | 這不是 distributed queue、concurrency control 或 rate limiter。 |
| Idempotency | pending duplicate 是 `duplicate_suppressed`；有非空 key 的 completed 或 dead-letter record 則是 `terminal_duplicate_suppressed`。 | 不證明真實 broker 或 database 的 exactly-once delivery。 |
| Retry | 固定的 HTTP 429 和 timeout fixture 會進入分類重試、指數 backoff 與確定性 jitter。 | 不代表真實 provider SLA 或 reliability。 |
| Checkpoint / resume | Pending retry work 會儲存至可序列化 checkpoint，並在可重試時間後 resume。 | 不證明 durable storage 或 disaster recovery。 |
| Dead letter | Invalid input 與 queue overflow 會進入可檢視的 dead-letter route。 | 沒有真實處理團隊或 ticket system。 |
| Cost stop | 下一次嘗試超過 `maxCostCents` 前會停止，工作仍留在 checkpoint。 | 合成 cents 不是 API bill 或已核准 budget。 |
| Trace | 每個 event 有 `runId`、穩定 job-level `corr-*` trace 和獨立 `attempt-*` ID，audit event 不含文件正文。 | 這不是完整 privacy 或 audit program。 |

完整的技術、非技術交付、測試、workflow 及不作聲稱劃分，請見英文 [demonstration map](docs/demonstration-map.md)。

可直接檢查的固定 artefact 是 [`artifacts/run-report.json`](artifacts/run-report.json) 和 [`artifacts/dead-letter-fixture.json`](artifacts/dead-letter-fixture.json)；後者展示 retry exhaustion 後不能重複花費。

## 不會執行的 GPT-5 mini Responses API 示範介面

`src/responses-api-gpt-5-mini-adapter.mjs` 只是一個標記為 `mock_only_not_executed` 的 frozen request shape。它沒有被 worker import，不會讀取 key 或環境變數，不含 SDK、authorization header 或網路呼叫，也不會產生 model output。實際可執行流程只讀取固定的本機 fixture outcome。

因此它不是 API integration，也不證明 model quality、成本、延遲、安全性、相容性或未來使用權限。

## 限制與下一步

請把它視為工程判斷的作品集證據，而不是 production system：先展示 pending／terminal duplicate、429、timeout、invalid input、cost stop 和 checkpoint resume，再清楚說明真實服務仍需要授權資料、durable storage、concurrency 與 rate control、monitoring、incident response、隱私／安全審查、人工作業流程及正式 release approval。

此專案不使用任何真人、真實文件、客戶、公司、API account 或 credential，也不會執行外部動作、聲稱商業成效或保證求職結果。

## 授權

使用 [MIT License](LICENSE)。在公開 fork 或 repository 前，請先確認 code ownership、第三方資料、僱傭責任、資料權限及發佈授權。
