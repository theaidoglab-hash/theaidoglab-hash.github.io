# Human-review runbook：草稿不是決定

**狀態：`僅限內部草稿`**

**Reviewer 的角色：** 檢查草稿是否可作為下一步的候選文字；不是把 AI output 自動變成對外行動。

## A. 開始前

在開啟 prototype 前，reviewer 確認：

- [ ] 這次只使用合成／公開批准的 fixture；
- [ ] corpus version 已顯示，且來源只屬於本 sandbox；
- [ ] 沒有登入、網路 connector、外部寫入、發送、帳戶或付款功能；
- [ ] 今天的目的只是檢查 test case，不是處理真實問題；
- [ ] 如出現個人資料、內部資料或高風險請求，會立即停止。

任何一項未勾選，狀態是 `BLOCKED`，不要開始測試。

## B. 每一筆輸出怎樣看

按以下順序檢查，而不是先看文句是否好看：

1. **Case identity**：是否有 `test_case_id` 和 `corpus_version`？
2. **Status**：`DRAFT_READY`、`NEEDS_HUMAN_REVIEW` 或 `BLOCKED` 是否符合情境？
3. **Evidence**：每個具體結論是否有有效、適用的 FAQ ID？
4. **Scope**：是否假定了未提供的資料、region、身份或例外？
5. **Action boundary**：有沒有「已發送／已修改／已退款」等假完成語句？有沒有暗示可越權？
6. **Handoff**：遇到無答案、衝突、過期、敏感資料或禁止動作時，是否清楚交給人？

## C. Reviewer 可作的四個決定

| 決定 | 何時使用 | 記錄內容 | 系統接下來可做甚麼 |
| --- | --- | --- | --- |
| `ACCEPT_DRAFT_FOR_LEARNING` | 引用、範圍和 status 都正確；只作 learning record | case ID、原因、reviewer initials（不可用真名作公開 artefact） | 不做外部動作；只保存去識別化結果 |
| `REQUEST_REVISION` | 草稿可能可修正，但目前不可靠 | error tag、要修的 rule／test | 只可重跑 sandbox case |
| `HANDOFF_REQUIRED` | 有衝突、缺資料、例外或判斷責任 | handoff reason | 系統停止給具體結論 |
| `BLOCK_AND_STOP` | 有敏感資料、越權、注入、外部寫入或未知版本 | stop reason、時間、build/version | 停止 session；不可用 output 作展示 |

`ACCEPT_DRAFT_FOR_LEARNING` 不等於批准對外發送、客戶決定或任何工作流程改動。

## D. 發現問題時的處理

1. 截止使用該次 output；不要複製到真實系統或訊息中。
2. 把 case 標為 fail，加入一個具體 error tag。
3. 記錄 build/version、corpus version 和不含敏感原文的描述。
4. 把同一 failure 變成固定 acceptance test，才改 prompt 或流程。
5. 改完後重跑全套 tests；不能只重跑剛好修好的 case。

## E. Session close-out

每次 sandbox session 完成後，reviewer 留下：

- 通過／失敗 case 數量（不是 business 成效）；
- 新增的 error tag 或測試；
- 是否有資料邊界／權限問題；
- 下一次允許做的最小改動；
- 明確一句：`沒有執行任何外部動作。`

若將來有人想接上真實資料或系統，這個 runbook 不再足夠；必須重新定義權限、資料最小化、責任人、審批與停用程序。
