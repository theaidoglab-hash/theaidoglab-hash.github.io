# Metric tree：先問量度的是甚麼，再談分數

**狀態：`僅限內部草稿`。** 這棵樹只支援 synthetic learning lab 的 engineering decision；不量度真實留存、收入、客戶滿意度或 causal uplift。

## Release question

> 在同一組凍結 synthetic holdout 上，候選版本是否比 deterministic baseline 更可靠地產生可覆核的隊列，同時保持所有資料、輸出與人手邊界？

答案必須由三層證據共同決定，不能只看一個 accuracy。

```text
Local-demo decision
├─ 0. Hard safety and integrity gates（任何一項 fail 即 BLOCKED）
│  ├─ synthetic-only source attestation
│  ├─ schema / feature allowlist / split validity
│  ├─ no prohibited output or external action path
│  └─ complete versioned trace
├─ 1. Model quality on synthetic labels
│  ├─ route correctness
│  ├─ review-priority precision and recall
│  ├─ calibration / confidence behaviour
│  └─ abstention quality by scenario slice
└─ 2. Synthetic workflow proxies
   ├─ reviewer can reconstruct reason codes
   ├─ queue contains declared review cases early enough
   └─ mock review workload is explicit, not hidden in one average
```

## 0. Hard gates：不是 KPI，而是通行條件

| Gate | Pass 的最小意思 | Fail 的處理 |
| --- | --- | --- |
| Source integrity | 每筆可追溯到 approved synthetic manifest | 停止 run，隔離 dataset |
| Feature integrity | 只有 allowlist 欄位；沒有 label / future / ID leakage | 停止 run，重建 split / feature snapshot |
| Output integrity | 所有 route 只可為 `REVIEW_ONLY`、`ABSTAIN` 或 `BLOCKED` | 停止 run；不得 demo 或 promotion |
| Action integrity | 沒有 contact、price、renewal、retention、account 或 external tool 欄位 | 停止 run；記錄安全事件 |
| Trace integrity | data、feature、model、policy、evaluation 版本完整 | 結果無效，重新執行 |

硬 gate 沒有「平均較好」的概念。一個禁止 action output 足以令整個 build 不可使用。

## 1. Model metrics：只對合成 gold label 有意義

| 指標 | 問題 | 量法／提醒 |
| --- | --- | --- |
| Route correctness | `REVIEW_ONLY`、`ABSTAIN`、`BLOCKED` 是否與 synthetic expected route 一致？ | 正確 route 數 ÷ 評估 case 數；另列每個 route。 |
| `REVIEW_HIGH` precision | 排入高優先隊列的 case 有多少是 gold label 的高覆核案例？ | 不能獨立使用，因為高 precision 可由少量 coverage 偽造。 |
| `REVIEW_HIGH` recall | gold label 的高覆核 case 有多少進入隊列？ | 要按 scenario family 列出，避免平均掩蓋失敗。 |
| Macro F1 | 各 route class 是否都被處理，而非只照顧大類？ | 只是一個摘要，不取代 confusion matrix。 |
| Calibration / Brier score | confidence band 是否與合成 label 頻率相稱？ | 若模型未輸出可解釋概率，便不要假裝有 calibration。 |
| Selective coverage | 系統在保留 abstention 後覆蓋了多少可安全處理的 case？ | coverage 增加但錯誤 route 增加，不算改善。 |

每個 target、sample-size minimum 和 promotion threshold 必須在查看 holdout 結果前寫入 evaluation plan。文件不預填任何「漂亮成果數字」。

## 2. Synthetic workflow proxies：有用，但不是商業成果

| Proxy | 它回答甚麼 | 不可推論成甚麼 |
| --- | --- | --- |
| Evidence reconstruction rate | reviewer 能否只看 output trace，找回每個 reason code 對應的合成欄位？ | 真人 reviewer 的工作效率或信任提升 |
| Declared-review concentration | 排在隊列前段的 fixture 中，有多少是 gold label 定義的 review case？ | 留客機率、收益或客戶價值提升 |
| Mock review completion | 在固定模擬檢查表下，可被完整覆核的 case 比例 | 真實節省工時或 SLA 改善 |
| Reviewer disagreement count | 兩位 reviewer 對合成 case 的 route 是否常有不同理解？ | 模型公平、可接受或商業有效 |
| Abstention visibility | 被拒絕排序的原因是否明確、可行動於 lab 內？ | 系統在真實未知情況下足夠安全 |

把這些 proxy 寫成「synthetic workflow observation」。若想聲稱業務成效，必須另有合法資料、清楚介入、對照設計、結果定義與權責；本 lab 沒有這些條件。

## 切片與失敗閱讀

報告最少按以下合成 slice 分開列示：

- 訊號一致、互相矛盾、缺失；
- 接近／非接近 mock renewal window；
- `REVIEW_HIGH`、`REVIEW_STANDARD`、`ABSTAIN_EXPECTED`、`BLOCK_EXPECTED`；
- 曾見 scenario family 與未見 scenario family；
- baseline 通過但候選失敗，以及候選通過但 baseline 失敗的 case。

重點不是找最好看的平均分，而是找「系統在哪個明確情況下不應被信任」。

## 預先承諾表

每次 experiment 先填空，再跑 holdout：

| 項目 | 實驗前填寫 |
| --- | --- |
| Baseline version |  |
| Candidate version |  |
| Holdout manifest hash |  |
| Hard gates |  |
| Model metric targets |  |
| Required slices |  |
| Allowed regression |  |
| Reviewer protocol |  |
| Promotion state if pass | `LOCAL_DEMO_ONLY`，不可是 production |

結果差或樣本不足時，正確結論可以是「未足以判斷」或「保持 baseline」；不是調低門檻後宣布模型成功。
