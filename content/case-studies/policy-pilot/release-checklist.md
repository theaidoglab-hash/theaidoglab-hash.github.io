# Release checklist — PolicyPilot

**狀態：僅限內部草稿。完成清單只代表可作指定範圍的本地 demo，不代表 production approval。**

## 範圍與資料

- [ ] 問題、使用者、輸出和非目標已在 `problem-brief.md` 寫清楚。
- [ ] 全部政策、情境和測試輸入均為合成，且不含真實個資／內部資料。
- [ ] 每個可檢索文件有 ID、版本、狀態、有效日期和 `synthetic authoring` 出處。
- [ ] development、validation 和 holdout test 已分開，沒有把 holdout 答案帶回 prompt。

## 行為與評估

- [ ] keyword baseline 的結果已存檔；候選版本在同一 holdout set 評估。
- [ ] 每個答案都顯示來源和版本；沒有來源便澄清或交接。
- [ ] 已測試過期版本、衝突政策、無答案、範圍外請求和 prompt injection。
- [ ] 已記錄硬性 gate 是否通過，以及所有高嚴重度失敗。
- [ ] 人手審閱者能看見輸入、輸出、引用、route 和系統版本。

## 安全與運作

- [ ] 沒有連接訂單、帳戶、付款、電郵、訊息或其他寫入工具。
- [ ] 日誌不收集秘密或真實個資；錯誤輸出可按本地留存規則移除。
- [ ] 有清楚的停用方式：關閉 demo、撤回 corpus version、改為純人手流程。
- [ ] 已列出已知限制，而非把缺失默認為「模型會處理」。

## Demo 與作品聲明

- [ ] Demo 以「合成、本地、未部署」清楚標示。
- [ ] 沒有聲稱節省成本、改善 KPI、真實用戶採用或 production reliability。
- [ ] README 說明誰對輸出負責，以及哪些決定不能自動化。
- [ ] `portfolio-evidence-checklist.md` 的證據與可追問限制已完成。

**決定紀錄模板：** `日期｜版本｜資料版本｜gate 結果｜已知風險｜決定（繼續／修正／停止）｜負責人`。

