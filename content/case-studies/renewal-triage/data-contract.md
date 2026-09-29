# Data contract：只讓合成資料進入 lab

**狀態：`僅限內部草稿`。** 本文件定義的資料只可由 fixture generator 產生。沒有「先匿名化再使用真實資料」的例外；遇到真實資料或未獲批准的來源，一律 `BLOCKED`。

## Dataset identity

每次 run 必須能指出：

| 欄位 | 規則 |
| --- | --- |
| `dataset_id` | 例如 `renewal-triage-synthetic-v0.1`；不可使用客戶或公司名稱。 |
| `fixture_generator_version` | 生成規則的 Git revision 或不可變版本。 |
| `seed` | 只用於重現合成 fixture；不得混入真實值。 |
| `schema_version` | input 與 output contract 的版本。 |
| `created_at` | fixture 生成時間，不是客戶事件時間。 |
| `scenario_family` | 合成情境群組，用於 split 與 slice；不是人、帳戶或地區。 |

## 允許 schema

下表是概念 schema。所有值均為人為產生的 band、boolean 或 enum，而非原始交易或行為資料。

| 欄位 | 類型 | 用途 | Feature 可用？ |
| --- | --- | --- | --- |
| `fixture_id` | string | 重跑與 trace key | 否 |
| `snapshot_id` | string | 合成批次版本 | 否 |
| `scenario_family` | enum | split、slice 與 error analysis | 否 |
| `mock_renewal_window_band` | enum | 合成時間範圍，例如 `NEAR`、`LATER` | 是 |
| `synthetic_activity_trend` | enum | 人為定義的活動變化情境 | 是 |
| `synthetic_support_signal_band` | enum | 人為定義的支援摩擦情境 | 是 |
| `synthetic_documentation_complete` | boolean | 是否有足夠合成佐證 | 是 |
| `synthetic_signal_consistency` | enum | `CONSISTENT`、`CONFLICTING`、`UNKNOWN` | 是 |
| `synthetic_review_label` | enum | 由 generator rule 指定的 gold label | 只限 train / validation / evaluation |
| `label_rule_version` | string | label 的生成規則版本 | 否 |

`mock_renewal_window_band` 只是一個合成場景元素；不可把它誤稱為合約日期、付款日期或真實續約事件。

## 明確禁止的資料

以下資料不屬於此 lab，即使看似已去識別化也不可使用：

- 姓名、email、電話、地址、IP、裝置、帳戶、訂單、票據、CRM 或 billing ID；
- 真實產品使用、付款、價格、折扣、支援、合約、續約、取消、收入或留存紀錄；
- 自由文字訊息、call transcript、客服摘要或可反推個人／公司身份的 metadata；
- 種族、健康、性別、年齡、簽證、國籍或其他敏感／受保護屬性；
- `reviewer_result`、任何未來 mock outcome、生成 label 的 hidden rule 或其他會造成 leakage 的欄位；
- 不可驗證來源、手動貼入 spreadsheet、第三方 connector 或外部 API 回傳。

## Label contract

`synthetic_review_label` 僅表示 generator 對一條**虛構**案例設定的預期路由：

| Label | 在本 lab 的意思 |
| --- | --- |
| `REVIEW_HIGH` | fixture 的已批准合成訊號值得優先由 reviewer 看。 |
| `REVIEW_STANDARD` | fixture 可在一般覆核次序處理。 |
| `ABSTAIN_EXPECTED` | 資料不足、矛盾或不適用，系統應拒絕排序。 |
| `BLOCK_EXPECTED` | schema、來源、feature 或安全合約應阻止該 case。 |

它不是 churn label、續約概率、客戶價值或真人標註結果。label rule 要在訓練前版本化；每次變更 label rule 都必須重新建立 split、baseline 和 evaluation report。

## Split 與 leakage 防線

1. 先以 `scenario_family` 分 train、validation、holdout，禁止同一 family 分散到多個 split。
2. 每個 split 先凍結 fixture ID，再開始 feature、prompt 或 threshold 調整。
3. `synthetic_review_label`、reviewer 結果、future outcome、fixture ID 和 generator seed 不可成為 inference feature。
4. 任何 transform（encoding、imputation、scaling）只可 fit 在 train split，再套用到 validation / holdout。
5. 若發現 case 曾被用作 debug、prompt tuning 或 demo，便不再是 holdout，需由新 seed 重新產生。

## 資料品質 gate

每次 run 前，validator 至少檢查：

- schema、欄位名稱、enum 和 null 規則符合目前版本；
- 每筆均有 `fixture_id`、`snapshot_id`、`scenario_family` 和 source manifest；
- 沒有禁止欄位、未知欄位或未批准 feature；
- 同一 `fixture_id` 沒有跨 split 出現；
- label distribution、missingness 和 scenario family 分佈已記錄，但不自動解讀為業務分佈；
- dataset / generator / label rule / code version 可以一起重現。

任何一項失敗都要輸出 `BLOCKED`，而不是靜默補值、刪欄或換另一份資料。

## 最小 manifest 範本

```yaml
dataset_id: renewal-triage-synthetic-v0.1
fixture_generator_version: <immutable revision>
seed: <integer>
schema_version: 1
label_rule_version: 1
split_method: scenario_family_disjoint
contains_real_customer_data: false
contains_external_connector_data: false
synthetic_only_attestation: true
```

缺少上述任何聲明，不代表「大概是合成資料」；代表資料尚未可用。
