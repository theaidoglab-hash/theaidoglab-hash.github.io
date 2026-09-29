# Problem brief：排序的是覆核工作，不是客戶

**狀態：`僅限內部草稿`。** 本 brief 的所有名詞、情境、欄位與 label 均為合成設計；不可替換成真實客戶資料後繼續使用。

## 讀者情境

你想做一個「續約相關」作品集案例，卻不想再做一個只輸出 risk score 的 notebook。更接近 AI / ML 工程工作的做法，是先限制它能做甚麼：系統只在一批 synthetic fixture 中，協助 reviewer 決定**先看哪一個 case**；它不能決定任何人的價格、聯絡、權益、續約或留客處理。

## 問題定義

在每個合成 snapshot batch 中，假設 reviewer 的閱讀容量有限。系統需要將 fixture 分成：

- `REVIEW_ONLY`：有足夠、可追溯的合成訊號，值得排入覆核隊列；
- `ABSTAIN`：訊號不足、互相矛盾、超出訓練範圍或缺少必要欄位；
- `BLOCKED`：資料、schema、版本、權限或輸出合約不合格。

`REVIEW_ONLY` 的意思僅是「供人查看」，不是高風險客戶、應給優惠、應聯絡，或必然不會續約。

## 需要作出的工程決定

> 在固定、未參與調整的 synthetic holdout 上，候選版本能否在不越過 action contract 的前提下，比 deterministic baseline 更準確地辨認應覆核、應 abstain 和應 blocked 的 fixture？

這是可驗收的工程問題；它不是「能否提高續約率」。本 lab 沒有真實介入、對照組、客戶結果或因果設計，故 causal uplift 一律標為未知。

## 角色與責任

| 角色 | 可做 | 不可做 |
| --- | --- | --- |
| Learner / builder | 建 fixture、baseline、模型、測試與本地 trace | 匯入真實資料、連接外部系統、把結果說成業務成效 |
| Mock reviewer | 接受、拒絕或標記需要更多合成證據 | 聯絡任何人、改價格、作續約或留客決定 |
| Lab custodian | 凍結版本、審閱 release evidence、停止 run | 把本地 demo 當 production approval |

## 輸入、輸出與拒絕條件

| 項目 | 合約 |
| --- | --- |
| Input | 只接受 versioned synthetic fixture 與已批准的 feature allowlist。 |
| Output | `fixture_id`、route、priority band、confidence band、reason code、版本和 `reviewer_required=true`。 |
| Local trace | 記錄 data / feature / model / policy / evaluation 版本及 error tag；不含個人資料或外部帳戶資料。 |
| Required refusal | 缺欄位、未知 schema、未批准 source、future label、禁止欄位、不能解釋的輸出、無法重現版本。 |
| External action | 永遠沒有。沒有 email、CRM、billing、price、subscription 或 retention tool。 |

## 非目標

這個案例不會：

- 預測真實客戶的續約、取消或價值；
- 估計 intervention effect、uplift、ROI、revenue 或 churn reduction；
- 取代人手覆核、客戶成功、銷售、法務或定價決策；
- 驗證公平性、合規或 production readiness；
- 以漂亮 dashboard 或單一 accuracy 掩蓋資料與行動邊界。

## 可驗收的成功定義

一個候選版本只可被評為「可作本地 demo」，當以下各項都有可重跑證據：

1. **資料完整**：每筆 input 都可追溯至 synthetic fixture version 和 scenario family。
2. **行動安全**：所有 output 只落在 `REVIEW_ONLY`、`ABSTAIN` 或 `BLOCKED`；禁止 action 欄位為零。
3. **決策品質**：在預先凍結的 holdout 上，以同一 protocol 與 baseline 比較 model metric。
4. **可操作性**：reviewer 能看見 reason code、缺失項和版本，而非只看黑箱分數。
5. **誠實邊界**：報告明確把 synthetic workflow proxy 與真實 business outcome 分開，並聲明因果成效未證實。

## 先寫下的假設與反例

| 假設 | 如何測試 | 反例／停止條件 |
| --- | --- | --- |
| 候選模型可改善 synthetic review-label 的辨認 | 與 baseline 在凍結 holdout 比較 | 樣本太小、slice 劣化或無穩定改善時，不升級 |
| Reason code 令 reviewer 更容易檢查 | 以合成檢查表做 blinded review | code 與 input 不一致或 reviewer 無法重建理由時，block |
| Abstention 比硬排所有 case 更安全 | 測試缺值、矛盾、out-of-distribution fixture | 為提高 coverage 而回答未知 case 時，block |
| queue proxy 可以輔助設計 | 量度模擬隊列的可檢查性 | 任何人把 proxy 解讀成留存改善時，停止並修正文案 |

## Definition of done

完成不是訓練出一個分數最高的模型，而是能回答以下追問：

- 為何這個 fixture 只值得覆核，而不是任何客戶行動？
- label 從哪裡來，為何它不等於真實續約結果？
- baseline 是甚麼，候選版本在哪些 slice 失敗？
- 若輸入來源、schema 或 output contract 出錯，系統會如何停止？
- 人手覆核究竟可看到甚麼，又不能批准甚麼？
