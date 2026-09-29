# PolicyPilot portfolio starter pack

**狀態：僅限內部草稿。** 這是一個讓學習者改造的合成案例，不是產品規格、客戶案例或生產部署指南。所有政策、情境、資料欄位與測試結果都必須由你自行虛構或明確取得授權。

## 一句話

PolicyPilot 是一個政策支援助手：它只從**已批准、已版本化的虛構政策文件**找資料，輸出附引用的回覆草稿，或建議交給人手處理。

它不會退款、改訂單、讀取真實帳戶、發送訊息或替人作最終決定。

## 這份作品要證明甚麼

- 你先界定商業決定和可量度的風險，而不是先選 RAG 框架。
- 你能以 baseline、測試集和 release gate 檢查系統，而不是只展示一段成功 demo。
- 你知道哪些資料、權限和行動必須留在人手手上。
- 你能誠實說明未驗證之處，而不是把本地 prototype 說成 production-ready。

## 建議使用次序

1. 用 [`problem-brief.md`](problem-brief.md) 選定一個小而可驗收的問題。
2. 用 [`data-card.md`](data-card.md) 建立合成資料與來源規則。
3. 先做最簡單的 keyword baseline，再寫 [`evaluation-plan.md`](evaluation-plan.md)。
4. 在加入模型、retrieval 或工具前，完成 [`threat-model.md`](threat-model.md)。
5. 用 [`release-checklist.md`](release-checklist.md) 決定是否只可本地 demo、需要修正，或應停止。
6. 最後用 [`portfolio-evidence-checklist.md`](portfolio-evidence-checklist.md) 整理可被面試追問的證據。

## 不可省略的邊界

若你改造成真實問題，先停下來確認資料權限、私隱、僱傭合約與人手批准流程。本 starter pack 不授權任何資料收集、第三方服務連接、外發訊息、收款或公開部署。

