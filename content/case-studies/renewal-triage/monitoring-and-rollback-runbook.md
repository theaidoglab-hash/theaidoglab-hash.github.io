# Monitoring and rollback runbook：本地 lab 也要知道何時停止

**狀態：`僅限內部草稿`。** 這是 synthetic sandbox 的執行手冊，不是 production monitoring runbook。它監察的是資料、模型與合約的完整性；它不監察客戶、收入或真實留存成效。

## 適用範圍

每次本地訓練、evaluation、replay 或 demo 前後都使用本手冊。可監察的對象只有：

- approved synthetic manifest、schema、split 和 feature snapshot；
- baseline / candidate / policy / evaluator 版本；
- output route、reason code、trace completeness 與 reviewer checklist；
- synthetic distribution shift 和 regression fixture。

不存在 production SLA、真實續約 KPI、客戶名單或外部 webhook。任何要求連接它們的變更都超出此 lab，應停止而非加進 runbook。

## Run 前 checklist

- [ ] `synthetic_only_attestation=true`，且 manifest hash 已記錄。
- [ ] schema、label rule、feature allowlist、split manifest 均為已批准版本。
- [ ] holdout fixture 沒有被拿去 prompt / threshold / feature tuning。
- [ ] baseline 與 candidate 使用同一 evaluator、route policy 和 output validator。
- [ ] 沒有 contact、pricing、renewal、retention、account 或 external tool action。
- [ ] rollback target 已指定為上一個可重跑的 local baseline / candidate artifact。

任何一格未完成時，run state 是 `BLOCKED`，不是「先跑一次看看」。

## 每次 run 要記錄的訊號

| 訊號 | 為何重要 | 出現異常時 |
| --- | --- | --- |
| Manifest / schema / feature hash | 確保結果可重現 | 停止，查版本漂移。 |
| Forbidden-field count | 防止真實或越界資料混入 | 立即隔離 input，標為安全事件。 |
| Route distribution | 偵測全數硬排、全數 abstain 或異常 block | 與 fixture 版本比較，做 slice 檢查。 |
| Missing / conflict rate | 確保資料品質問題沒有被吞掉 | 檢查 generator 或 validator，不可自動補值。 |
| Reason-code reconstruction | 確保輸出仍可審核 | 不可重建時停止 promotion。 |
| Fixed regression suite | 防止修一個 case 壞多個 case | 任一 critical regression fail 即回退。 |
| Evaluation trace completeness | 防止無法說明結果從哪裡來 | 結果無效，重跑。 |

這些是 system-health signals，不是 customer outcome metrics。

## 事件分級與即時處理

| 等級 | 觸發例子 | 立即行動 | 可否繼續 demo？ |
| --- | --- | --- | --- |
| S1 — Safety boundary | 偵測真實資料、禁止欄位、external action key、`reviewer_required=false` | 停止 run、隔離 artifact、保存最小證據、通知 lab custodian | 否 |
| S2 — Integrity / leakage | split 重疊、future label、未知 schema、版本不匹配、trace 缺失 | 停止評估、標結果無效、重建資料／split | 否 |
| S3 — Quality regression | baseline 勝過 candidate、校準顯著變差、critical fixed case fail | 不升級，回退上個可重跑版本，寫 error analysis | 否，直至重新驗證 |
| S4 — Investigation | route distribution 改變、mock reviewer disagreement 增加、非 critical case fail | 凍結 promotion，建立診斷假設與額外 synthetic test | 只可明示為有已知問題的內部 debug |

任何事件都不應觸發資料刪除、客戶通知或外部補救，因為本 lab 沒有外部資料及行動。

## Rollback procedure

1. **停止目前 run**：不再產生新的 queue record 或 report。
2. **鎖住證據**：保存 run ID、版本、manifest hash、error tag、最小失敗 fixture ID；不要重寫或刪除既有紀錄。
3. **隔離候選 artifact**：標示 `DISABLED_LOCAL_ONLY`，不可再被 demo 選取。
4. **回退到已驗證 baseline**：只在 baseline 本身通過當前 hard gate 時使用；否則維持 `BLOCKED`，不是找一個舊模型代替。
5. **重跑 fixed safety suite**：確認回退版本沒有同一項安全／完整性失敗。
6. **寫 incident note**：說明觸發、影響範圍（只限 synthetic fixture）、已採取行動、尚未知道的事與重新評估條件。
7. **重新開放的條件**：根因、修正、獨立 regression evidence 和 lab custodian 審閱都完成；不可只因 demo deadline 而開放。

## Synthetic drift 的正確解讀

當新 generator version 改變 scenario family、label distribution 或 missingness，這叫 **fixture distribution shift**。它可以要求重新訓練、重新評估或保留 baseline，但不能被說成市場、客戶或續約行為的變化。

## Incident note 範本

```text
incident_id:
detected_at:
state_before:
severity:
run_id / artifact_versions:
synthetic fixture scope only: true
trigger and evidence:
external action possible: false
rollback target and verification:
root-cause hypothesis:
open questions:
re-evaluation gate:
```

## 禁止的「修復」

- 為讓 graph 漂亮而刪除失敗 fixture；
- 因為 candidate 表現較差便事後重寫 threshold 或 label；
- 將 S1 / S2 說成小 bug 並繼續 demo；
- 以真實資料「驗證一下」合成 lab；
- 把 synthetic proxy 變成 retention uplift、ROI 或客戶價值聲稱。
