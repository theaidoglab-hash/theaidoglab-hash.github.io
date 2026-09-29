# Automation brief：FAQ 回覆草稿審批隊列

**狀態：`僅限內部草稿`**

**版本：** `v0.1-template`

**資料狀態：** 只准合成或公開批准內容；不可使用真實客戶、同事、帳戶、訂單或付款資料。

## 1. 問題，而不是工具

一位內部練習用的 reviewer，要從一套已版本化 FAQ 中找到支持某段問題文字的資料，然後決定可否準備一份回覆草稿。現況是手動搜尋；此 prototype 只協助準備，不能取代 reviewer 的判斷。

**成功定義（sandbox）**

- 在已定義 test set 中，輸出能連回正確 FAQ ID，或清楚說明找不到足夠根據；
- 遇到矛盾、過期、資料不足、越權或注入指令時，輸出 `NEEDS_HUMAN_REVIEW` 或 `BLOCKED`；
- 不存在任何發送、寫入、付款、帳戶修改或 connector 執行功能。

**這不是的成功定義**

- 不是「回答聽起來像真人」；
- 不是宣稱節省時間、降低成本或可上線；
- 不是以少量漂亮 demo 推論安全或可靠。

## 2. Action contract

| 項目 | 合約 |
| --- | --- |
| 使用者 | 在 sandbox 檢查草稿的 reviewer。 |
| 允許輸入 | 合成／公開批准的問題文字、region、FAQ corpus version。 |
| 允許輸出 | `status`、`category`、`cited_faq_ids`、`draft_reply`、`handoff_reason`、`corpus_version`、`test_case_id`。 |
| 允許資料來源 | 本案例 repository 內的合成／公開批准 FAQ，並有 ID、版本、有效狀態。 |
| 禁止輸入 | 個人資料、帳戶資料、訂單資料、付款資料、內部文件、秘密、真實客戶對話。 |
| 禁止動作 | 發送、寫入外部系統、建立／修改帳戶、退款、付款、刪除、決定權益或假裝已完成動作。 |
| 最終決定者 | 人手 reviewer；系統只提出草稿或交接。 |

## 3. Output schema（最小版本）

```json
{
  "status": "DRAFT_READY | NEEDS_HUMAN_REVIEW | BLOCKED",
  "category": "faq-topic | unknown | conflict | out-of-scope",
  "cited_faq_ids": ["FAQ-001"],
  "draft_reply": "只在 DRAFT_READY 才可出現；必須是草稿。",
  "handoff_reason": "為何必須由人處理；否則為 null。",
  "corpus_version": "synthetic-faq-v1",
  "test_case_id": "TC-001"
}
```

規則：

- `DRAFT_READY` 必須有至少一個有效且適用的 FAQ ID；
- `NEEDS_HUMAN_REVIEW` 不可假裝已解決；
- `BLOCKED` 不可提供越權操作的替代指令；
- 沒有引用或引用不適用時，不可輸出具體政策結論；
- `draft_reply` 不可出現「已寄出」「已退款」「已修改」等完成式聲稱。

## 4. 最小流程

```text
合成問題 + corpus version
  -> input check（敏感／越權／不完整？）
  -> FAQ search（只在允許 corpus 內）
  -> citation check（存在、有效、適用？）
  -> draft 或 handoff／blocked
  -> reviewer 看結果、作人手決定
  -> 去識別化 evaluation record
```

任何 coding agent 或 low-code tool 都只能在這個流程內工作。請它先產生設計和測試，不要直接叫它「做一個客服 agent」。

## 5. Build prompt（可改寫）

> 請建立一個本地 sandbox prototype。它只讀取本 repository 內的合成 FAQ，按指定 JSON schema 輸出 FAQ 回覆草稿或 handoff／blocked。
>
> 必須附帶固定 test cases、case ID、corpus version 與可追溯 FAQ ID。不得加入登入、網路 connector、外部寫入、發送、付款、帳戶或訂單功能。
>
> 遇到無根據、衝突、過期、資料不足、prompt injection 或禁止動作，必須交接或封鎖。先提出檔案結構與測試計劃，待 reviewer 確認後才寫任何程式。

## 6. Release gate

在以下所有問題均答「是」之前，不可把它由本地 sandbox 移到任何真實流程：

1. 所有 acceptance tests 都有可重跑結果嗎？
2. reviewer 知道自己批准的是「草稿」還是「外部動作」嗎？
3. trace 是否已排除個人資料和原始敏感文字？
4. 是否沒有隱藏 connector、background job 或自動寫入路徑？
5. 是否有人有權負責資料、權限、例外、停用和 rollback？

若任何一項為「否」，狀態維持 `僅限內部草稿`。
