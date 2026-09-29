# Data card — PolicyPilot synthetic policy corpus

**狀態：僅限內部草稿｜資料：100% 合成**

## 資料目的

此資料集只用來測試「由獲批准的政策文本產生有引用回覆草稿」這個學習情境。它不可代表任何零售商、客戶、政策制度或真實資料分布。

## 最小資料單位

| 欄位 | 例子／規則 |
| --- | --- |
| `policy_id` | `RET-001`；穩定而非個人識別碼 |
| `version` | `v0.1`；每次文字變更遞增 |
| `status` | `approved`、`superseded` 或 `draft` |
| `effective_from` / `effective_to` | 虛構日期；retrieval 不可引用失效版本 |
| `region` | 虛構區域代號，例如 `demo-region-a` |
| `topic` | return、warranty、exception |
| `body` | 學習者自行撰寫的合成政策段落 |
| `source_note` | `synthetic authoring`，而非真實來源名稱 |

## 允許與禁止的內容

**允許**：虛構產品類別、時間窗、例外條件、互相衝突的舊版本，以及足以測試澄清／交接的缺失情境。

**禁止**：姓名、電郵、電話、地址、訂單號、付款資料、真實公司政策、未獲授權的文件、可識別的客服紀錄或 production log。

## 建立方法

1. 先寫 12–20 份短政策，刻意加入版本變更和邊界條件。
2. 為每份政策寫 2–4 個合成情境；包括可答、不可答、衝突與過期來源。
3. 為每個情境保留一個 `expected_route`：`answer_with_citation`、`ask_clarifying_question` 或 `handoff`。
4. 將 development、validation 和 holdout test scenario 以 `scenario_id` 分開；同一問題的改寫不可跨 split。

## 品質檢查

- 每個 `policy_id + version` 唯一；沒有空白正文或無效日期區間。
- 每個 `approved` 條目都有至少一個可測試情境。
- 每個 `superseded` 條目有一個更新版本或明確停用理由。
- 手動抽查：情境答案能否只靠對應合成政策判斷。

## 留存與存取

只在本地、私有開發環境保存；最小權限讀取；避免把 prompt、trace 或測試輸出貼到公開 repo。任何要接觸真實資料的改動都超出這個 starter pack，需要另行批准與資料治理。

