# Renewal Triage Lab：合成續約覆核隊列的 MLOps starter pack

**狀態：`僅限內部草稿`。** 這是一個本地學習案例，不是客戶案例、產品規格、部署指南或留客方案。它只可使用完全合成的 fixture；不得匯入真實客戶、訂閱、帳戶、交易、使用紀錄或可識別資料。

## 一句話

Renewal Triage Lab 模擬一個「先由人手覆核」的工作隊列：系統根據已聲明的**合成**訊號，為 fixture 排出覆核次序，並在證據不足時 abstain（拒絕排序）。它不會聯絡任何人、提出價格、改變訂閱、作留客決定，亦不會把 model output 當成最終判斷。

這個練習的問題不是「誰會續約」，而是：**在一批完全合成的紀錄中，候選版本能否比一個可解釋的規則 baseline 更安全、可追溯地把需要查核的項目交給 reviewer？**

## 先分清三件事

| 名稱 | 在本 lab 的意思 | 不代表甚麼 |
| --- | --- | --- |
| `review_priority` | 合成覆核隊列中的閱讀次序 | 客戶價值、流失風險或應採取的行動 |
| 模型指標 | 對合成 label、route 與校準的量度 | 真實業務成效 |
| synthetic workflow proxy | 在預先寫好的模擬任務中，隊列是否較容易被 reviewer 檢查 | 節省真人時間、提升續約率或增加收入 |

因此，任何「causal uplift（因果提升）」在此 lab 都是**未證實**。沒有真實受眾、介入、對照組和結果資料，就不能聲稱改善了留存、續約或任何商業指標。

## 這份作品要證明甚麼

- 你先寫 action contract 和拒絕條件，才選模型。
- 你能區分 model quality、workflow proxy 和真實 business outcome。
- 你會用 deterministic baseline、固定 holdout、slice、error analysis 和 release gate，而不是只展示一段順利 demo。
- 你會把資料版本、feature、模型、決策路由和 reviewer 結果串成可檢查的 trace。
- 你知道「human review」不是一句免責聲明：reviewer 要有可見證據、可拒絕輸出，且沒有任何自動外部行動。

## 使用次序

1. 閱讀 [`problem-brief.md`](problem-brief.md)，先確認這個 lab 只處理排序與覆核，不處理客戶行動。
2. 用 [`data-contract.md`](data-contract.md) 建立可重生、可驗證的合成資料與 label 邊界。
3. 在寫 model 前，以 [`metric-tree.md`](metric-tree.md) 預先定義安全、模型與 workflow proxy 指標。
4. 依 [`pipeline-and-feature-contract.md`](pipeline-and-feature-contract.md) 寫 feature allowlist、baseline、輸出 schema 和 trace。
5. 依 [`evaluation-and-release-plan.md`](evaluation-and-release-plan.md) 建立 holdout、回歸測試和只限本地的 release state。
6. 用 [`monitoring-and-rollback-runbook.md`](monitoring-and-rollback-runbook.md) 練習何時停止、隔離與回退。
7. 最後以 [`portfolio-evidence-checklist.md`](portfolio-evidence-checklist.md) 整理可在面試中展示、可被追問的證據。

## 最小 action contract

**允許：**

- 讀取 versioned synthetic fixture；
- 在本地產生 `REVIEW_ONLY`、`ABSTAIN` 或 `BLOCKED` 的結構化結果；
- 把 model / data / feature / evaluation version 寫進本地 trace；
- 讓 reviewer 對「這個 fixture 是否值得進一步查核」作出接受、拒絕或要求補資料的判斷。

**禁止：**

- 讀取真實 CRM、billing、support、product analytics 或 email 資料；
- 產生聯絡名單、訊息、折扣、報價、退款、續約或留客建議；
- 直接改訂閱、帳戶、價格、權限或任何外部系統；
- 將 synthetic label 說成客戶行為、流失概率或已驗證的商業結果；
- 將 reviewer 結果自動轉成下一步行動。

## 完成的最低標準

在宣稱「完成本地 learning lab」之前，另一位讀者應可從 repository 找到：

- synthetic data 的來源、seed、版本、schema 與禁止欄位；
- 一個無 ML 的 deterministic baseline；
- 不曾參與 prompt / feature 調整的 holdout fixture；
- 模型指標、synthetic workflow proxy、失敗案例與未知範圍；
- 任何 output 為何進入 `REVIEW_ONLY`、`ABSTAIN` 或 `BLOCKED`；
- rollout 被阻止或回退時的證據。

這些材料只能支持「我能在合成 sandbox 中展示可靠的工程判斷」。它們不支持「我已建立 production retention system」或「我改善了真實續約」。

## 真實問題的停止點

如果日後想把此形狀套用到真實續約工作，先停止建造。資料權限、私隱、僱傭合約、資料保留、決策責任、客戶溝通、價格政策、法律及人手審批，均需由有權限的人另行界定。本 starter pack 不授權其中任何一項。
