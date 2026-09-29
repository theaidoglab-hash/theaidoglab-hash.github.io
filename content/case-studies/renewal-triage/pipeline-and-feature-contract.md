# Pipeline and feature contract：讓每一步都可被拒絕

**狀態：`僅限內部草稿`。** 這是本地 synthetic pipeline 的設計，不連接 CRM、billing、email、subscription、pricing 或任何其他外部系統。

## 最小架構

```text
approved synthetic fixture manifest
        │
        ▼
schema + source + leakage validator ──fail──> BLOCKED evidence record
        │
        ▼
scenario-family split + feature snapshot
        │
        ├──> deterministic baseline
        │
        └──> candidate model (optional)
                    │
                    ▼
            policy / output validator
                    │
                    ▼
       REVIEW_ONLY | ABSTAIN | BLOCKED queue record
                    │
                    ▼
      mock reviewer checklist + local evaluation report
```

沒有從最後一格返回外部世界的箭頭。queue record 不觸發聯絡、報價、續約、留客或帳戶修改。

## Feature allowlist

只有以下已版本化、完全合成的欄位可成為 feature：

| Feature | 可回答的局部問題 | 使用限制 |
| --- | --- | --- |
| `mock_renewal_window_band` | 合成 case 是否在指定的 mock window | 只可視為場景元素，不可解讀成真實合約日。 |
| `synthetic_activity_trend` | fixture 的人為活動情境 | enum 必須來自 schema。 |
| `synthetic_support_signal_band` | fixture 是否有預設支援摩擦訊號 | 不可含原始 ticket 或文字。 |
| `synthetic_documentation_complete` | 證據是否完整 | 缺失時優先 abstain，不可猜測。 |
| `synthetic_signal_consistency` | 訊號是否互相支持 | `CONFLICTING`、`UNKNOWN` 要有明確拒絕／交接規則。 |

以下永遠不是 feature：ID、seed、scenario family、label、reviewer 結果、future outcome、任何價格／付款／個人／帳戶資料，以及 generator 的 hidden answer rule。

## Feature snapshot contract

每個候選 build 需輸出不可變的 feature snapshot manifest：

```yaml
feature_snapshot_id: <immutable ID>
dataset_manifest_hash: <hash>
split_manifest_hash: <hash>
feature_allowlist_version: 1
fit_scope: train_only
prohibited_feature_check: pass
missing_value_policy:
  synthetic_documentation_complete: abstain_when_false
  other_required_fields: block_when_missing
```

任何 feature 工程只可用 train split fit；validation 和 holdout 只能 transform。若需要在 holdout case 上「補一補規則」才能通過，該 case 已被污染，必須更換。

## Baseline first

在選擇 ML 方法前，實作一個 deterministic baseline。範例 policy：

1. schema 或 source 不合格 → `BLOCKED`；
2. 必要合成證據缺失或互相矛盾 → `ABSTAIN`；
3. 預先寫明的合成 review trigger 同時滿足 → `REVIEW_ONLY` + `HIGH`；
4. 其餘可解釋 case → `REVIEW_ONLY` + `STANDARD`。

baseline 不是「很笨的東西」；它是候選模型必須超過、也可在回退時接管的可讀參照。若候選模型無法在固定 protocol 下清楚勝過 baseline，應保留 baseline 或停止。

## Candidate model contract

模型可以是簡單線性分類器、樹模型或其他可重跑的方法；genAI 不是要求。無論模型類型，必須：

- 接受相同 feature snapshot，而非臨時手填欄位；
- 輸出 priority / confidence / reason code 的結構化欄位；
- 在不足或超出範圍時輸出 `ABSTAIN`，而非硬給分；
- 將每個 reason code 映射回 allowlisted synthetic feature；
- 與 baseline 使用同一個 holdout、route policy 和 output validator；
- 將模型版本、訓練資料 manifest、threshold、seed 和 code revision 寫入 trace。

不准用「模型覺得可疑」作理由；無法映射到已批准 feature 的理由必須 `BLOCKED`。

## Output contract

```json
{
  "fixture_id": "synthetic-case-0001",
  "route": "REVIEW_ONLY",
  "review_priority": "HIGH",
  "confidence_band": "CHECK",
  "reason_codes": ["ACTIVITY_DECLINE", "SUPPORT_FRICTION"],
  "evidence_snapshot_id": "feature-snapshot-...",
  "model_version": "candidate-...",
  "policy_version": "route-policy-...",
  "reviewer_required": true
}
```

允許的 route 僅為 `REVIEW_ONLY`、`ABSTAIN`、`BLOCKED`。output 不得含 `customer_name`、`contact_channel`、`message_draft`、`discount`、`price`、`retention_action`、`renewal_decision`、`account_update` 或 external tool call。

## Reviewer handoff contract

reviewer 看到的是：fixture ID、route、reason code、allowlisted evidence snapshot、missing/contradiction flag、版本及「此項只供覆核」標記。reviewer 可選：

- `ACCEPT_FOR_SYNTHETIC_REVIEW`；
- `REJECT_AS_UNSUPPORTED`；
- `REQUEST_MORE_SYNTHETIC_EVIDENCE`；
- `KEEP_BLOCKED`。

這些結果只回寫本地 evaluation record，不能造成客戶或商業動作。reviewer 接受一個 fixture，也不代表接受任何真實續約處理。

## 最小 trace

每一筆結果至少保留：`run_id`、fixture / dataset / split / feature snapshot / baseline-or-model / threshold / policy version、route、reason code、validation status、reviewer result 和 error tag。trace 的目的在於重跑、debug 和反駁模型；不是收集更多資料。
