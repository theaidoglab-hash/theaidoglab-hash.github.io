# Evaluation and release plan：只讓證據推進到本地 demo

**狀態：`僅限內部草稿`。** 本計畫的最高可達狀態是 `LOCAL_DEMO_ONLY`。它不會授權 production、真實資料、客戶聯絡、定價、續約或 retention action。

## Evaluation question

在已凍結的 synthetic holdout 和安全 fixture 上，候選版本是否：

1. 保持完整 source、schema、feature、split 和 trace 合約；
2. 比 deterministic baseline 更準確地處理合成 review route；
3. 在缺失、矛盾、未知與禁止輸入時 abstain 或 block；
4. 讓 reviewer 能重建每個 reason code，而不是看一個無法審核的分數？

不問「會否提高續約」或「有多少 uplift」。本 lab 沒有真實 outcome、干預組或對照組，因果效果未證實。

## 評估資產要在建模前凍結

| 資產 | 最低要求 |
| --- | --- |
| Train / validation / holdout manifest | 以 `scenario_family` 不重疊的 split；fixture ID 一經凍結不可重用作 tuning。 |
| Baseline spec | 可讀、可重跑的 rule order、threshold 和版本。 |
| Candidate spec | 模型、feature snapshot、訓練 seed、threshold、reason-code method。 |
| Safety fixture set | source error、schema error、禁止欄位、缺值、矛盾、future-label、unsupported output。 |
| Reviewer checklist | 不看模型名稱也可判斷證據是否足夠、route 是否合理。 |
| Metric target sheet | hard gates、model targets、required slices 和 allowed regression 在看結果前填寫。 |

## 必跑 test matrix

| 類別 | 例子 | 預期 |
| --- | --- | --- |
| Normal routing | 完整、訊號一致的 synthetic fixture | 依 gold route 進入 `REVIEW_ONLY`，reason code 可重建。 |
| Missing evidence | 必要合成欄位缺失 | `ABSTAIN` 或 `BLOCKED`；不猜補。 |
| Contradictory signals | `synthetic_signal_consistency=CONFLICTING` | `ABSTAIN`，列明衝突。 |
| Prohibited input | 出現 customer / pricing / contact / label leakage 欄位 | `BLOCKED`，不得靜默刪除後繼續。 |
| Schema / version mismatch | unknown enum、schema version 不符 | `BLOCKED` 並有 error tag。 |
| Unseen scenario family | holdout 未見的合成情境 | 顯示行為與 confidence；不可以用它調參後再算 holdout。 |
| Output-contract attack | 不允許的 action key 或 `reviewer_required=false` | `BLOCKED`。 |
| Regression case | baseline 通過、候選曾失敗的固定 case | 新版不得掩蓋或刪除。 |

## 比較 protocol

1. 用同一 input manifest、同一 evaluator 和同一 route policy 跑 baseline 與 candidate。
2. 不在 evaluation 期間改 label、split、threshold 或 definition of pass。
3. 先呈現 hard-gate 結果，再呈現 route correctness、precision / recall、calibration、coverage 和 slice。
4. 把 synthetic workflow proxy 獨立列出，並標明它們不是 business metrics。
5. 至少挑選三個失敗例：baseline 勝、candidate 勝、兩者皆失敗；寫出下一輪假設或停止理由。

## 人手覆核 protocol

對一組事前選定的 synthetic fixture，reviewer 只使用 evidence snapshot 和檢查表，記錄：

- 是否能由 reason code 找回對應允許欄位；
- route 是否符合 gold route；
- 是否應拒絕因為缺失、矛盾或越權；
- 是否看見任何暗示外部行動的文字或欄位。

可計算 reviewer agreement 或 evidence reconstruction rate，但只可稱為 synthetic workflow proxy。這不等於真實員工效率、信任或客戶成果。

## Release states

| State | 條件 | 可以做 | 不可以做 |
| --- | --- | --- | --- |
| `PLANNING_ONLY` | 未有凍結資料、baseline 或測試 | 設計文件與合成 fixture | 訓練、demo、聲稱結果 |
| `LOCAL_EVALUATION` | data contract、baseline、安全測試可跑 | 本地比較與 error analysis | 對外展示成產品、連接任何資料 |
| `LOCAL_DEMO_ONLY` | 所有 hard gate pass；目標按預先承諾評估；失敗已記錄 | 本地、清楚標示 synthetic 的 demo | production、客戶行動、商業成效聲稱 |
| `BLOCKED` | 任一 hard gate fail、結果不可重現、資料／輸出越界 | 停止、隔離、修正、回退 | 繼續 demo、調低門檻或忽略 evidence |

即使 `LOCAL_DEMO_ONLY`，也不可推論已適合 production。

## 最小 evaluation report

```text
run_id / date / local-only status
dataset + split + feature + baseline + candidate version
precommitted targets and hard-gate result
model metric table, confusion matrix and required slices
synthetic workflow proxy table (clearly labelled)
top failure cases and reviewer findings
release state + named reason
known limits: no real data, no customer action, no causal uplift claim
```

如果樣本太少、scenario 太相似、reviewer 標準不一致，報告必須寫「未足以判斷」。這是正常的 evaluation 結果，不是需要用故事包裝的失敗。
