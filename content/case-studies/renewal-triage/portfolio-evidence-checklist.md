# Portfolio evidence checklist：讓面試官可以追問你的判斷

**狀態：`僅限內部草稿`。** 此清單幫你展示合成 learning lab 的工程證據，不容許把它包裝成客戶交付、production 系統或已驗證的 retention 成效。

## 作品首頁要先說清楚的四句話

- 這是一個只用 synthetic fixture 的本地覆核隊列 lab。
- 系統只輸出 `REVIEW_ONLY`、`ABSTAIN` 或 `BLOCKED`，並且強制 human review。
- 模型指標與 synthetic workflow proxy 分開報告；沒有真實 business outcome。
- causal uplift、續約改善、收入或節省工時均未證實，也不作聲稱。

若 README 一開始便把它叫作「留客 AI」或「續約預測產品」，先改名再展示。

## 必備證據包

| 證據 | 面試官可以驗證甚麼 | 不能用它證明甚麼 |
| --- | --- | --- |
| Problem brief 與 action contract | 你知道系統應做／不應做甚麼 | 你的設計已獲業務批准 |
| Data manifest、schema、fixture generator | 資料是可重現、synthetic-only | 它代表真實客戶分佈 |
| Feature allowlist 與 leakage check | 你知道 label / future / ID 不可進模型 | 模型必然泛化到現實 |
| Deterministic baseline | 你沒有跳過最簡單可解釋的比較 | baseline 是業界標準 |
| Frozen evaluation report | 你能比較版本、切片與失敗案例 | 分數帶來實際營收或續約提升 |
| Output trace 和 reviewer checklist | 你設計了可追查、可拒絕的 handoff | 人手覆核已真正消除所有風險 |
| Monitoring / rollback note | 你知道何時停止與怎樣保留證據 | 系統已可上 production |

## Repository 完成清單

- [ ] README 有 synthetic-only、local-only、human-review-only 的明顯聲明。
- [ ] `problem-brief.md` 說清楚「排序覆核工作」而非決定客戶行動。
- [ ] `data-contract.md` 有 schema、禁止欄位、label 邊界、split 與 leakage policy。
- [ ] `metric-tree.md` 分開 hard gate、model metric 和 synthetic workflow proxy。
- [ ] 有 versioned fixture generator、seed、manifest 及固定 baseline。
- [ ] 有 train / validation / holdout 的 scenario-family split 證據。
- [ ] 每個 output 都可連回 data / feature / model / policy version 和 reason code。
- [ ] 有正常、缺失、矛盾、越界、schema error、regression 的測試。
- [ ] evaluation report 包含 confusion matrix、slice、失敗例及「未足以判斷」的條件。
- [ ] runbook 能說明 safety failure、rollback 與 re-entry gate。
- [ ] demo 沒有真實客戶資料、介面截圖、公司身份或不可公開系統細節。

## 5 分鐘 demo 節奏

1. **0:00–0:45**：讀出 action contract；特別指出沒有 contact、pricing 或 renewal action。
2. **0:45–1:30**：展示一個 synthetic fixture、data manifest 和 feature allowlist。
3. **1:30–2:20**：展示 deterministic baseline，解釋為何它是比較起點。
4. **2:20–3:20**：比較 candidate 與 baseline 的同一個 holdout slice；展示一個候選失敗 case。
5. **3:20–4:10**：展示 `ABSTAIN` 或 `BLOCKED` case，說明何時系統拒絕排序。
6. **4:10–5:00**：展示 reason code、reviewer checklist、rollback 記錄和已知限制。

不需要展示假想 dashboard、客戶名單或虛構的「留存提升」數字。能清楚解釋一個 failure，通常比再加三個 framework 更有說服力。

## 可安全使用的履歷／作品描述

> 建立一個本地、synthetic-only 的 subscription-renewal review-queue learning lab：以 deterministic baseline 比較候選模型，加入 scenario-family split、feature allowlist、abstention、versioned traces、reviewer handoff 與 rollback gate；所有輸出只供人工覆核，未使用真實客戶資料，亦未聲稱任何 retention 或業務 uplift。

只在以上描述與 repository 證據完全一致時使用。不要加入未量度的百分比、客戶數、節省工時、收入、續約率或 production scale。

## 面試追問自測

| 追問 | 你應能指出的證據 |
| --- | --- |
| 為何不是直接預測 churn？ | problem brief 的 action boundary，以及 label 為合成 review route。 |
| 怎樣避免 leakage？ | scenario-family split、train-only fit、prohibited fields 與 holdout freeze。 |
| 為何還需要 baseline？ | baseline 是可解釋對照，也是 candidate rollback 的參照。 |
| 你量度的 business metric 是甚麼？ | 沒有真實 business metric；只量度 model metric 與 synthetic workflow proxy。 |
| 人手覆核在哪裡？ | output contract、reviewer checklist；reviewer 不可觸發外部動作。 |
| 模型出錯怎麼辦？ | monitoring / rollback runbook 的 S1–S4 及 fixed regression suite。 |
| 為何不宣稱 uplift？ | 沒有真實介入、對照組或 outcome，因此無因果證據。 |

## 最後自檢

在公開任何作品前，問自己：另一個人能否只靠 repository，重跑我的 synthetic evidence、看見我的失敗、明白我沒有做過甚麼，並分辨我的模型分數與真實商業成效？若答案是否定，應補證據或收窄聲稱，不是加長 marketing 文案。
