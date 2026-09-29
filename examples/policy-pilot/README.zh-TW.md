# PolicyPilot：本地合成作品集參考實作

[English](README.md) · [繁體中文（香港）](README.zh-HK.md) · [简体中文](README.zh-Hans.md)

> **狀態：合成、本地作品集參考。** 這不是已部署產品、真實政策服務，也不表示已具備 production readiness。

PolicyPilot 示範一個可檢查的政策回覆草稿流程：接收一條虛構零售政策問題，只從仍然有效且已核准的合成政策中尋找證據；有足夠支持才產生附來源的草稿，否則交由人工處理。它沒有外部整合、客戶資料、API 呼叫或寫入權限。

重點不是展示一個泛用 chatbot，而是展示一個有邊界的業務流程背後需要哪些工程與交付證據：來源是否合格、唯讀 action contract、固定 evaluation cases、trace 隱私，以及明確的失敗處理。

## 本機執行

需要 Node.js 20 或以上；沒有第三方相依套件，也不需要 credential。

```powershell
# From this repository's root
npm test
npm run demo
```

`npm test` 會執行固定的合成 evaluation 和安全 assertions；`npm run demo` 會輸出本機 evaluation report。兩者都只是本機證據，不會部署、傳送資料，也無法證明真實環境表現。

## 作品集應展示什麼

| 範圍 | 可檢查的證據 | 不應聲稱的事 |
| --- | --- | --- |
| 業務問題 | 需要由現行已核准政策支持的客服草稿流程 | 真實公司、真實政策、KPI 或已上線流程 |
| 技術 | keyword baseline、有效期間／狀態篩選、政策 ID 和版本引用 | 語意搜尋、RAG 或 LLM 準確度 |
| 風險與交付 | 唯讀 action contract；不支持、過期、越權或 injection 都 handoff | 單靠程式已讓外部系統安全 |
| Evaluation | 五個固定合成 cases；route、citation、無外部動作和 trace 隱私 hard gates | production coverage、benchmark、成本節省或業務成果 |

完整說明請看英文版 [demonstration map](docs/demonstration-map.md)：其中分開列出業務問題、技術展示、非技術交付／風險展示、端到端流程、測試證據和不作出的聲稱。

## 可選模型位置：僅為 mock

[`src/responses-api-fixture.mjs`](src/responses-api-fixture.mjs) 是標示為 `mock_only_not_executed` 的靜態 request-shape fixture，用於討論未來在另行核准的實驗中，`gpt-5-mini` Responses API 可以放在哪一層。

它不是 integration：不 import SDK、不讀取環境變數、不含 credential、不呼叫網路，也不產生 model output。現有 baseline 和 tests 不依賴它。它只參考 [GPT-5 mini model page](https://developers.openai.com/api/docs/models/gpt-5-mini) 和 [Responses API reference](https://developers.openai.com/api/reference/cli/resources/responses/methods/create) 的 request fields，不代表 API 可用性、表現、成本、延遲或安全性。

## 延伸時應保留的原則

不要只加入 key 和 network call 就當作完成。真實系統還需要另外審閱資料權限、來源治理、evaluation set、model／prompt 實驗、外部動作權限、人工核准、監控、事件處理、隱私、安全和 release controls；這些全部不在本參考實作的聲稱範圍內。

若要改造成自己的作品，先定義業務決策、只使用已授權資料、在實作前寫負面 cases、清楚列出 action authority，並記錄 tests 沒有證明什麼。

## 授權

本機草稿附有 [MIT License](LICENSE)。在公開 fork 或建立 public repository 前，請自行確認程式擁有權、第三方材料、僱傭責任和外部發佈權限。
