# PolicyPilot：本地合成作品集參考實作

[English](README.md) · [繁體中文（台灣）](README.zh-TW.md) · [简体中文](README.zh-Hans.md)

> **狀態：合成、本地作品集參考。** 這不是已部署產品、真實政策服務，亦不代表已達 production readiness。

PolicyPilot 示範一個可檢查的政策回覆草稿流程：讀取一條虛構零售政策問題，只從仍然有效而且已批准的合成政策中找證據；有足夠支持才產生附來源的草稿，否則交由人手處理。它沒有外部整合、客戶資料、API 呼叫或寫入權限。

重點不是展示一個泛用 chatbot，而是展示一個有邊界的業務流程背後要有甚麼工程與交付證據：來源是否合資格、只讀 action contract、固定 evaluation cases、trace 私隱，以及清楚的失敗處理。

## 本地執行

需要 Node.js 20 或以上；沒有第三方依賴，亦不需要 credential。

```powershell
# From this repository's root
npm test
npm run demo
```

`npm test` 會執行固定的合成 evaluation 和安全 assertions；`npm run demo` 會印出本地 evaluation report。兩者都只屬本地證據，不會部署、傳送資料，亦不能證明真實環境表現。

## 作品集應展示甚麼

| 範圍 | 可檢查的證據 | 不應聲稱的事 |
| --- | --- | --- |
| 業務問題 | 需要由現行已批准政策支持的客服草稿流程 | 有真實公司、真實政策、KPI 或已落地流程 |
| 技術 | keyword baseline、有效期／狀態篩選、政策 ID 和版本引用 | 語意搜尋、RAG 或 LLM 準確度 |
| 風險與交付 | 只讀 action contract；不支持、過期、越權或 injection 都 handoff | 單靠程式已令外部系統安全 |
| Evaluation | 五個固定合成 cases；route、citation、無外部動作和 trace 私隱 hard gates | production coverage、benchmark、節省成本或業務成效 |

完整說明請看英文版 [demonstration map](docs/demonstration-map.md)：當中分開列出業務問題、技術展示、非技術交付／風險展示、端到端流程、測試證據和不作出的聲稱。

## 可選模型位置：只屬 mock

[`src/responses-api-fixture.mjs`](src/responses-api-fixture.mjs) 是標示為 `mock_only_not_executed` 的靜態 request-shape fixture，用來討論日後在另行批准的實驗中，`gpt-5-mini` Responses API 可放在哪一層。

它不是 integration：不 import SDK、不讀取環境變數、不含 credential、不呼叫網絡，也不產生 model output。現有 baseline 和 tests 不依賴它。它只參考 [GPT-5 mini model page](https://developers.openai.com/api/docs/models/gpt-5-mini) 和 [Responses API reference](https://developers.openai.com/api/reference/cli/resources/responses/methods/create) 的 request fields，不代表 API 可用性、表現、成本、延遲或安全性。

## 延伸時要保留的原則

不要只加入 key 和 network call 就當成完成。真實系統還要另外審閱資料權限、來源治理、evaluation set、model／prompt 實驗、外部動作權限、人手批准、監察、事故處理、私隱、安全和 release controls；這些全部不在本參考實作的聲稱範圍內。

如要改造成自己的作品，先定義業務決定、只用已授權資料、在實作前寫負面 cases、清楚列出 action authority，並記錄 tests 沒有證明甚麼。

## 授權

本地草稿附有 [MIT License](LICENSE)。在公開 fork 或建立 public repository 前，請自行確認程式擁有權、第三方材料、僱傭責任和外部發佈權限。
