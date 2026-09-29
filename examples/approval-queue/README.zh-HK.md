# 合成 FAQ 審批佇列

[English](README.md) | [繁體中文（香港）](README.zh-HK.md) | [繁體中文（台灣）](README.zh-TW.md) | [简体中文](README.zh-Hans.md)

這是一個可獨立檢視、完全在本機運行的作品集參考實作，用來示範一個必須由人審批的 FAQ 草稿流程。它刻意以可測試的失敗路徑與決策界線為重點，不會處理真人、真實政策或外部系統。

## 狀態與安全界線

此專案完全在本機運行，只使用合成資料、唯讀模式及確定性邏輯。它不會連接模型、API、網絡、客戶帳戶、付款系統、電郵服務或工單系統，亦不能發送訊息、建立工單、退款、查閱帳戶或改動任何紀錄。

每個輸出都只是**供人審閱的草稿**，絕不是向客戶發出的回覆。本機 action contract 的 `allowedActions` 永遠是空陣列，而每條路徑都需要人類審閱者。

## 商業問題與作品集價值

營運團隊可能會反覆收到 FAQ 問題，但一個答案仍可能錯誤、缺乏依據、已過時、不安全，或不適合該名提問者。此參考實作要呈現的商業問題不是「產生文字」，而是如何在保留人類決策點的前提下，產生可審閱、附有證據連結的 FAQ 草稿。

這個流程特意設計成可逆：

1. 接收一條合成 FAQ 問題及可選的請求動作。
2. 在檢索前封鎖任何要求外部動作的請求。
3. 將提示詞注入嘗試或沒有支援的問題交由人工處理。
4. 只檢索目前有效、已批准的虛構 FAQ 條目。
5. 產生附有清晰引文的確定性草稿。
6. 要求人類批准，並記錄保障私隱的本機 trace。
7. 在改動實作前執行固定的 regression tests。

技術、商業、交付、風險及不作聲稱的證據劃分，請見英文版的 [demonstration map](docs/demonstration-map.md)。

## 在本機運行

需要 Node.js 20 或以上版本。沒有第三方相依套件，也不需要環境變數。

```powershell
# From this repository's root
npm test
npm run demo
```

Demo 只會印出合成的路徑決定及引文，不會建立檔案或執行外部動作。內附的 GitHub Actions workflow 會在 Node.js 20 上執行相同兩條指令。

## 路徑與停止條件

| 路徑 | 觸發條件 | 輸出 |
| --- | --- | --- |
| `draft_for_human_approval` | 目前有效且已批准的 FAQ 條目足以支持問題 | 附引文的草稿；仍然需要人類批准。 |
| `handoff` | 沒有支持問題的 FAQ、提示詞注入、無效輸入或 mock 失敗 | 不會把草稿當作答案提供。 |
| `blocked` | 請求或問題內含會改動外部系統的動作 | 不會嘗試檢索或執行動作。 |

## 專案內容

| 路徑 | 用途 |
| --- | --- |
| `src/contracts.mjs` | 驗證合成輸入，並定義不執行動作的 contract。 |
| `src/safety.mjs` | 安全處理動作請求和提示詞注入嘗試。 |
| `src/retrieval.mjs` | 只選取目前有效、已批准的虛構 FAQ 條目。 |
| `src/mock-response.mjs` | 產生確定性的本機草稿；它不是 LLM 呼叫。 |
| `src/approval-queue.mjs` | 組織安全檢查、檢索、草稿、trace 與審批狀態。 |
| `data/` | 儲存虛構 FAQ 內容和示範用的 request fixture。 |
| `test/` | 儲存合成、確定性的 regression tests。 |
| `docs/demonstration-map.md` | 清楚區分作品集證據和本專案不作出的聲稱。 |

## 不會執行的 Responses API fixture

`data/responses-api-gpt-5-mini.fixture.json` 是一個示範 Responses API request 形狀、並標示 `gpt-5-mini` 的**不會執行的 fixture**。它不是 live call，也不是 runtime workflow 的一部分：

- 不含任何 credential 或 secret；
- runtime 不會讀取、import 或發送它；regression test 只會讀取這個 static file，核對這條界線；
- 它的 `network` 欄位是 `disabled`；
- 實作永遠使用 `src/mock-response.mjs`。

此 fixture 只可用於討論日後一個須另行批准的 integration 會如何被規格化。它不證明 API 相容性、模型品質、成本、安全性，亦不代表已獲准連接真實系統。

## 刻意保留的限制與不作聲稱

- 檢索只使用簡單 keyword overlap，並非 semantic search。
- mock 沒有語言理解能力，不能代替模型。
- FAQ corpus、cases 和 traces 都是虛構並只存在於本機。
- 不會接收真實客戶資料、真實政策、帳戶、動作或 API request。
- 專案不聲稱能提升生產力、品質、收入、安全性或任何商業成果。
- tests 只是小型合成 regression checks，並非 production evaluation metrics。
- 沒有 deployment configuration。

`package.json` 故意保持 private，以避免意外發佈到 npm registry。這個設定不會決定 source repository 在 GitHub 是否公開。

## 授權

使用 [MIT License](LICENSE) 授權。
