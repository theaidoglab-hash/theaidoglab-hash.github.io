# 低程式 AI 審批隊列：可改寫的 starter pack

**狀態：`僅限內部草稿`**

**用途：** 用完全合成或已公開批准的 FAQ，練習把 AI 變成本地 sandbox 中「只出草稿、必經人手覆核」的小工具。它不是可直接接入客戶系統的產品，也不是 production 安全或合規證明。

## 這個案例要證明甚麼

很多低程式作品只展示「模型答得流暢」。這套文件改為展示六件較接近工作現實的事：

1. 你能把模糊需求縮成可驗收的工作；
2. 你能寫清楚資料邊界與禁止動作；
3. 你有一套預先寫好的 failure cases；
4. 你不把 model output 當成最終決定；
5. 你能留下可重跑、去識別化的證據；
6. 你知道何時應停止，而不是不停加 prompt。

本例的唯一功能是：讀取一段**合成或公開批准**的問題文字，從一組同樣合成／公開的 FAQ 產生「分類、可追溯引用、回覆草稿、交接原因」。它不連接帳戶、不發送訊息、不修改訂單、不處理付款，也不保存真實個人資料。

## 使用次序

| 次序 | 文件 | 你要完成的事 |
| --- | --- | --- |
| 1 | [automation-brief.md](automation-brief.md) | 選一個小而可逆的問題，先寫 action contract。 |
| 2 | [acceptance-tests.md](acceptance-tests.md) | 在建造前寫出期望行為和拒答情況。 |
| 3 | [risk-register.md](risk-register.md) | 為每個高風險 failure 指派 control、owner 和 stop condition。 |
| 3.5 | [coding-agent-review-loop.md](coding-agent-review-loop.md) | 在接受 coding agent 改動前，審核 plan、tests、檔案範圍和人手決定。 |
| 4 | [human-review-runbook.md](human-review-runbook.md) | 寫清楚 reviewer 看到甚麼、能批准甚麼、不能批准甚麼。 |
| 5 | [portfolio-evidence-checklist.md](portfolio-evidence-checklist.md) | 整理 README、測試、trace 樣本和限制，做成可面試的證據包。 |

## 最小完成定義

在任何工具裡建 app 前，以下五項都必須可由另一個人檢查：

- input、output、資料來源和禁止動作已寫進 brief；
- 至少有一組正常、無答案、矛盾資料、越權要求與 prompt injection 的測試；
- 每個測試有 expected behaviour，而不只是「看起來合理」；
- 所有輸出都標為 draft、handoff 或 blocked，沒有直接執行的路徑；
- 結果只使用合成／公開批准資料，並以版本和 case ID 保存。

## 你可以怎樣改成自己的案例

保留安全形狀，換掉領域即可。例如把「FAQ 回覆草稿」換成：

- 公開政策文件的內部摘要草稿；
- 會議筆記的 action-item 草稿；
- 教學資源的分流和引用建議；
- 公開文件的資料完整性檢查清單。

不要把它改成自動寄信、退款、改帳戶、作醫療／法律／金融決定，或把未獲授權的真實資料放入測試。若你的真正需求必須做這些事，這個 starter pack 已超出適用範圍，應先由有權限的人另行定義資料、權限、法律和審批要求。

## 與網站內容的關係

- [非工程師也可驗收的 AI 自動化流程](/zh-HK/articles/build-a-low-code-ai-automation)
- [PolicyPilot：把 RAG demo 變成作品證據](/zh-HK/articles/enterprise-ai-portfolio-policy-pilot)
- [AI Engineer Interview Lab：evaluation 與 tool 權限](/zh-HK/articles/ai-engineer-interview-learning-map)

這些文件是本地練習材料；使用者自行改寫後，仍須自行判斷工具、資料和實際工作場景是否適用。
