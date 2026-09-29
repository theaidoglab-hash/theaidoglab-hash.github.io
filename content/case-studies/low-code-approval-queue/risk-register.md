# Risk register：把「看似可用」拆成可處理的風險

**狀態：`僅限內部草稿`**

**範圍：** 完全合成／公開批准資料的本地 prototype。下表不是正式風險評估、法律意見或上線批准。

| ID | 風險／failure mode | 可能後果 | 預防 control | 偵測方法 | owner | stop condition |
| --- | --- | --- | --- | --- | --- | --- |
| R-01 | 沒有證據仍生成肯定答覆 | reviewer 被誤導 | 無有效引用即 handoff | TC-02、TC-11 | builder + reviewer | 出現一次 unsupported answer，停止變更並修 test／規則 |
| R-02 | 引用存在但不適用、過期或 region 不符 | 用錯版本作判斷 | citation metadata check | TC-04、TC-05、TC-10 | builder | metadata 無法驗證，封鎖輸出 |
| R-03 | prompt injection 改寫規則 | 繞過審批／資料邊界 | input policy + fixed action contract | TC-07 | builder | 系統聽從注入指令，停止 demo |
| R-04 | 工具聲稱已發送或完成外部動作 | 使用者誤信已處理 | 完全移除外部 action path；完成式字句檢查 | TC-01、TC-08、UI review | builder + reviewer | 發現 connector、write action 或假完成聲稱 |
| R-05 | 真實個人或客戶資料進入 prototype | 私隱／保密事件 | synthetic-only policy、input block | TC-09、repository review | data owner | 任何真實資料出現，立即停止、移除和重新檢查 trace |
| R-06 | trace 留下原文或敏感資料 | 之後的展示再泄漏 | 只留 case ID、版本、狀態、error tag | trace schema review | builder | trace 無法去識別化，停止收集 |
| R-07 | reviewer 把草稿當成已批准的業務決定 | 超出工具責任 | 明確 `DRAFT_READY` 標籤和 runbook | reviewer checklist | reviewer | reviewer 無法說明最終責任人 |
| R-08 | 經常失敗但只展示漂亮 demo | 虛假的作品證據 | 保存全套 results 和 error taxonomy | result-table audit | portfolio owner | 無法列出 failures／limitations，不作公開展示 |
| R-09 | 每次改設定都讓舊表現退步 | 不可重現的「調好」 | 固定 test set + versioned result table | regression run | builder | 高風險 test 退步，回退或修正後重跑 |
| R-10 | 需求其實涉及付款、權益、醫療、法律或安全決定 | 風險高於範本設計 | scope review、human escalation | brief review | project owner | 一旦需求觸及高風險決定，退出本 starter pack |

## 每次變更前的三個問題

1. 這項改動有沒有擴大可讀取的資料或可執行的動作？
2. 哪個 acceptance test 可以證明它沒有破壞既有安全邊界？
3. 失敗時由誰決定停止、回退或交接？

答不出任何一題，就不要以「模型更聰明」作為繼續的理由。
