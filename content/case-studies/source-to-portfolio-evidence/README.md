# 由教學來源到作品證據：可改寫的 starter pack

**狀態：`僅限內部草稿`**

這套文件讓你把一份教學、文章、影片、課程單元或公開 repository，轉成一個可被追問的**原創練習作品**。它不是課程推薦、供應商認可、轉載授權，亦不保證作品已達 production 或求職準備程度。

## 核心原則

教學來源只是一個**輸入**：它可以幫你發現概念、失敗模式或練習起點；它不替你定義商業問題、資料權利、評估標準或最終設計。你的作品證據來自你可展示的判斷、改動、測試、限制和重現方式。

不要把「我完成了某課程」寫成「我能在真實公司部署這個系統」。更可靠的說法是：你在一個受限的合成／已授權情境中，做了哪些決定、如何和 baseline 比較、在哪些 case 失敗，以及哪些事情仍未驗證。

## 這套材料包含甚麼

| 文件 | 用途 | 完成時應能回答 |
| --- | --- | --- |
| [source-receipt.md](source-receipt.md) | 保存來源、版本、權利和重用邊界 | 我可否使用這一小部分材料？我有沒有把它當成推薦？ |
| [change-and-decision-log.md](change-and-decision-log.md) | 分開來源輸入與你的設計取捨 | 哪些東西沿用、改寫、刪除或自行新增？為甚麼？ |
| [evaluation-record.md](evaluation-record.md) | 記錄 baseline、固定評估和失敗 | 我的改動真的改善了甚麼，又在哪裡沒有改善？ |
| [contribution-statement.md](contribution-statement.md) | 寫可查證而不誇大的作品說明 | 我實際做了甚麼，哪些不是我的貢獻？ |
| [five-minute-defence.md](five-minute-defence.md) | 練習面試式解釋與反問 | 我能否在五分鐘內交代決定、證據和限制？ |
| [release-and-privacy-check.md](release-and-privacy-check.md) | 決定只留本地、待審閱或停止 | 內容是否安全、可公開，及誰有權批准？ |

## 建議使用次序

1. 先填 [source-receipt.md](source-receipt.md)。沒有 URL、版本／日期、存取日期或重用邊界，就不要開始改寫。
2. 把來源啟發的題目縮成一個小而可驗收的問題，並在 [change-and-decision-log.md](change-and-decision-log.md) 寫下你沒有照搬的部分。
3. 只使用合成資料、公開資料或已取得明確授權的資料；絕不可放入僱主、客戶、同事或真實使用者資料。
4. 在加模型、agent 或漂亮 UI 前，先建立一個簡單 baseline 和固定 evaluation cases，記入 [evaluation-record.md](evaluation-record.md)。
5. 用同一個本地 command、版本和輸入重跑結果；失敗也要保留。
6. 最後填 [contribution-statement.md](contribution-statement.md) 和 [five-minute-defence.md](five-minute-defence.md)，只寫你能以檔案或結果支持的事。
7. 未經負責人審閱，請在 [release-and-privacy-check.md](release-and-privacy-check.md) 保持 `僅限內部草稿`；不要上載、發佈、收費、收集資料或連接外部帳戶。

## 最小完成定義

另一位讀者應能從你的本地 repository 找到以下證據：

- 原始來源的 URL、版本／日期、存取日期、授權或條款狀態；
- 清楚的「直接複製、摘要、改寫、完全自行新增」記錄；
- 資料來源、資料權限和去識別化／合成化說明；
- 一個可信的 baseline、一組不隨結果改動的 evaluation cases，以及至少一個失敗或未達標 case；
- 重現本地結果所需的環境、指令和輸出位置；
- 作品的真實貢獻、未驗證範圍和停止條件；
- 負責人對任何公開動作的明確決定。

缺少其中一項，作品仍可作私人練習，但不應被描述為完整 portfolio evidence。

## 不在本 pack 範圍內

- 這不是特定課程、平台、模型、IDE 或 repository 的背書。
- 這不是資料權利、版權、僱傭合約、私隱或合規意見。
- 這不是 production 安全、商業成果、招聘能力或工作表現的證明。
- 這不授權你使用真實企業資料、客戶資料、受限 API、付費帳戶或第三方內容。

如果你無法確認資料權利或來源重用條款，最安全的選擇是：只保留概念層面的學習筆記，完全自行重做問題、資料、文案、程式和視覺材料。
