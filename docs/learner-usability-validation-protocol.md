# AI.DOG 學習者可用性驗證協定

狀態：`僅限內部草稿`

版本：`1.0`

日期：2026-09-26

範圍：本地 `public-site` prototype，首輪以香港繁體中文路線為主。這是小樣本、人工主持的可用性問題發現方法；不是 analytics 計畫、學習成效研究、公開發佈授權或招聘結果評估。

## 1. 這輪可以與不可以回答什麼

這輪只檢查：新使用者能否不依賴主持人教路，根據自己的程式基礎和可用時間選出起點，開始一個任務，並理解它與 portfolio evidence 的關係。

可報告：

- 在指定版本、locale、任務和主持方式下，多少人獨立完成指定導航任務。
- 他們在哪一步犢豫、回頭、需要提示或誤解頁面邊界。
- 修正後，同一阻塞是否在後續本地 session 中再出現。

不可報告：

- 「網站已驗證易用」、「讀者學會了」或「學習成效得到證明」。
- 「一星期路線會令學習者掌握技能」。本協定只測試能否找到及解釋這條路線，不是一星期學習成果。
- portfolio 可令人就業、通過面試、獲得招聘者認可或反映 production readiness。
- 任何代表全部目標讀者的比率、因果效應或市場需求。

## 2. 開始前的 go／no-go 門檻

以下項目必須由負責人對同一版 protocol 明確批准，否則不得招募、聯絡或開始 session：

1. 測試 commit／release identifier、locale、裝置、瀏覽器與日期。
2. 五個去識別化對象的抽樣格、招募渠道與主持人。本文件本身不授權聯絡任何人。
3. 知情同意文字、本地儲存位置、唯一存取者、刪除日期和退出處理。
4. 一個受控的本地環境，analytics 關閉，不對外暴露 server，不連接個人帳戶、上載檔案或啟用追蹤。
5. 空白瀏覽器 profile 和可公開的 synthetic／fixture 資料。每次 session 後清除該 profile 的本地儲存。

開始前先做一次主持人 dry run。Dry run 只記為 `LOCAL_QA`，不計入參與者樣本。

## 3. 五個 session 的抽樣格

這是問題發現樣本，不是統計代表樣本。程式基礎由參與者自述；不要測驗或推斷對方能力。

| Session ID | 自述基礎 | 固定目標情境 | 時間情境 | 預期路線家族 |
| --- | --- | --- | --- | --- |
| `C15-01` | 能修改、執行及除錯 | 第一次把 AI 用進可覆核工作 | 約 15 分鐘 | coding starter → portfolio |
| `N15-01` | 不寫程式／暫不想寫 | 第一次把 AI 用進可覆核工作 | 約 15 分鐘 | no-code first run → portfolio |
| `CW-01` | 能修改、執行及除錯 | 開始建立一個 AI 作品 | 一星期逐步完成 | Build Lab → evidence plan |
| `NW-01` | 不寫程式／暫不想寫 | 開始建立一個 AI 作品 | 一星期逐步完成 | no-code → evidence plan |
| `MIX-01` | 自述「不確定」或只看懂小段程式 | 補一個 AI／工程概念缺口 | 先用 15 分鐘，再改為一星期 | resources → roadmap |

不收集年齡、性別、種族、僱主、職銜、薪金、簽證或醫療／殘障資料。如對方主動要求特定操作方式，只記「鍵盤」、「屏幕閱讀器」或「字體放大」等設定，不記原因或醫療標籤。

## 4. 同意與資料最小化

主持人必須照讀：

> 這是自願的 prototype 導航測試，我們測試網站，不是測試你。請不要輸入、上載或說出真實 CV、姓名、電郵、僱主、客戶、內部系統或其他私密資料。我們不錄音、錄影或錄屏幕；筆記只用 session ID。你可跳過任何問題或隨時停止。這次不評估學習成效、求職能力或 portfolio 品質。你是否同意開始？

只記錄 `session ID + 同意／不同意 + 日期 + protocol 版本`，不記姓名或簽名。「不同意」即結束，不留其他資料。將 session ID 交給對方；如在筆記刪除前撤回，對方以這個 ID 指定要刪除的記錄，無須提供身份。

### 可記錄

- session ID、程式基礎三級類別、指定時間情境、locale 和操作方式。
- 每項任務的完成狀態、用時、回頭次數、提示級別和公開 route／content ID。
- 去識別化行為摘述，例如「在篩選與搜尋之間往返三次」。

### 不可記錄

- 姓名、電郵、用戶名、影像、聲音、IP、user agent、fingerprint 或精確位置。
- CV、repository、實際作品、僱主／客戶資料、內部系統、工作類別、薪金、簽證或聯絡方式。
- 資源庫搜尋字串、planner 輸入、剪貼簿或下載檔案內容、waitlist／支付資料。
- 音訊、影片、屏幕錄影、原始 chat log 或整頁截圖。

筆記必須放在負責人事先批准、受存取限制且不進入 public bundle 的位置。Session-level 筆記整理成去識別化問題清單後即刪，最遲不超過 30 日；撤回同意時刪除該 session 筆記。只可長期保留不含引言、身份或個人輸入的聚合問題紀錄。如儲存位置和刪除日期尚未批准，不開始 session。

## 5. 固定任務與可觀察完成條件

主持人只讀情境，不說正確頁面或按鈕名稱。

| ID | 情境 | 可觀察完成條件 | 註 |
| --- | --- | --- | --- |
| `T0` 首屏理解 | 「先看這頁，60 秒後說它給誰、幫你做什麼，以及一件它不會承諾的事。」 | 能說出可行動學習／作品證據用途和至少一項非承諾。 | 這是資訊架構理解，不是知識測驗。 |
| `T1` 選起點 | 「請以表格指定的目標、你自述的程式基礎和時間，選今天第一步。」 | 60 秒內完成診斷選擇，並能解釋推薦為何符合目標、時間和基礎。 | 每人的目標情境在 session 前固定；不為了得到預期頁面而中途更改。 |
| `T2-15` 立即開始 | 給 `C15-01`、`N15-01`、`MIX-01`：「由推薦結果開始一個現在就做得到的動作，停在你知道接下來做什麼的位置。」 | 由推薦卡到 coding、no-code 或 resource 可操作第一步不超過 2 分鐘，無需先讀完 roadmap。 | 到達可開始任務 ≠ 15 分鐘已學會。 |
| `T2-W` 一星期路線 | 給 `CW-01`、`NW-01`：「假設你有一星期，找出第一天做什麼、何時算完成，以及會保留哪一件產物。」`MIX-01` 把原本目標保持不變，只把時間改為一星期後重做診斷。 | 找到第一步、完成條件和 evidence 產物，並指出至少一個本地產物不能聲稱的結果。 | 不將找到計劃誤報為完成一星期學習。 |
| `T3` Lab → Portfolio | 給 `C15-01`、`N15-01`、`CW-01`、`NW-01`：「把剛才的案例變成一個可供別人覆核的 portfolio 計劃。」 | 由 Lab 進入 Portfolio 後，原 starter／case 上下文仍可見，並能分別可檢查 evidence 與不能聲稱的成果。 | 只用 fixture，不輸入真實專案或 CV。 |
| `T4` 找資源 | 「在資源庫找一份指定 fixture 主題的材料，翻一頁，再回到結果清單。」 | 能使用搜尋或篩選，翻頁後條件仍保留，並能說出目前結果範圍。 | 主持人提供中性字詞；不記搜尋字串。 |
| `T5` 鍵盤重走 | 「不用滑鼠，再做一次選路、展開一段內容、翻一頁，再回主要任務。」 | 焦點可見、次序合理，主要動作和 deep link 可用。 | 基本鍵盤檢查 ≠ 無障礙認證。 |

## 6. 主持與提示級別

每個 session 最長 45 分鐘。請對方用 think-aloud 說正在找什麼；不解釋界面，不用肯定或否定反應暗示答案。

| Hint | 定義 | 處理 |
| --- | --- | --- |
| `H0` | 無提示 | 靜默觀察。 |
| `H1` | 中性重讀任務 | 例如「你現在想完成的是什麼？」 |
| `H2` | 中性定位 | 例如「你會在這頁還是其他頁找？」，不說控件名稱。 |
| `H3` | 直接指出頁面或控件 | 任務記為未獨立完成；只為保護 session 時間才指路。 |

停頓 90 秒先用 `H1`；再停頓 90 秒才可用 `H2`。一項任務累計 5 分鐘無進展，記為阻塞，不反覆暗示至對方猜中。

## 7. 可觀察量度與嚴重度

每項任務只用這些欄位：

```text
session_id | task_id | start_time | end_time | outcome | highest_hint |
backtracks | route_or_content_id | observed_issue | severity
```

`outcome` 定義：

- `INDEPENDENT`：在 `H0`／`H1` 下完成。
- `ASSISTED`：需要 `H2`。
- `DIRECTED`：需要 `H3`；不計為獨立完成。
- `BLOCKED`：五分鐘無進展、死路或無法完成關鍵動作。
- `STOPPED`：依停止條件結束；不當成使用者失敗。

量度包括：首屏理解（受眾／用途／非承諾各為清楚、部分或錯誤）、選路用時、到首個可執行動作的用時、任務結果、最高 hint、回頭次數、死路、starter context 是否保留、evidence／fixture／外部結果邊界理解，以及鍵盤焦點與狀態回饋。

嚴重度：

- `P0 CRITICAL`：私密資料洩露／收集、虛假聲稱已儲存／已成功、非授權外部操作，或主路線完全斷裂。
- `P1 MAJOR`：主任務需 `H3`／無法完成，或將 local fixture 錯當學習、production 或招聘證據。
- `P2 MODERATE`：可復原，但多次回頭、犢豫超過 90 秒、誤解標籤或需 `H2`。
- `P3 MINOR`：不阻塞任務的字詞、間距、層級或單次犢豫。

小樣本報告使用原始分母，例如「4/5 人在 60 秒內選出起點」，不只寫百分比。列出逐人用時或最小值／中位數／最大值；不跑顯著性檢定，不推廣到目標市場。

## 8. 停止條件

立即停止單一 session：

- 對方不同意、撤回、要求停止或表現不適。
- 對方說出或準備輸入可識別自己、僱主、客戶或未公開系統的資料。主持人即時阻止，不抄錄，刪除／澆消已記片段。
- 網站、本地 server 或裝置失靈；記為技術事故，不記為參與者失敗。
- 同意、儲存或身份邊界變得不清楚。
- 單項任務 5 分鐘無進展，或全次已達 45 分鐘。

暫停整個 pilot：

- 任何一個 `P0`。
- 同一主路線在兩個 session 出現同一 `P1`。
- 出現未預期外部請求、追蹤、個人資料留存或無法按時刪除資料。
- 必須更改任務、提示或成功定義才能繼續。開新 protocol 版本，新舊結果不混用。

修正後先 dry run，再用新 session ID 複測。不可刪除原失敗結果來把 pilot 改寫為全數通過。

## 9. 內部驗收門檻

以下只是五個本地 session 的修正門檻，不是 product KPI 或學習成效目標：

1. 零個 `P0`，沒有 dead link、無反應主要動作或虛假成功狀態。
2. 至少 4/5 人在 60 秒內、無 `H2`／`H3` 選出符合自述基礎與時間的起點。
3. `C15-01` 和 `N15-01` 都在開啟推薦後兩分鐘內到達可立即開始的第一步。
4. `CW-01` 和 `NW-01` 都能說出一星期路線的第一步、完成條件和會保留的產物。
5. 5/5 人都能指出一件可檢查 evidence 與一項不能聲稱的結果；如有混淆，先修文案，不擴大測試。
6. 進行 `T3` 的人在 Portfolio 仍看見原 starter／case 上下文，無需重選。
7. 鍵盤任務沒有焦點陷阱，主要動作全部可操作。

全部通過時，唯一允許狀態為 `LOCAL_MODERATED_USABILITY_GATE_PASS`。它不會自動改變 `content/release-manifest.json` 的 `LOCAL_REVIEW_ONLY`，也不證明公開發佈、真實學習成果或就業結果。

## 10. 結果樣板與用語邊界

每輪只產生一份去識別化內部總結：

```text
Protocol version:
Prototype commit/release identifier:
Locale / browser / viewport / input mode:
Session matrix completed:
Task results by raw denominator:
P0 / P1 / P2 / P3 issue counts:
Observed blockers and supporting session IDs:
Changes proposed / retest required:
Evidence status: LOCAL_MODERATED_USABILITY_GATE_PASS | NEEDS_REVISION | PILOT_STOPPED
Explicit non-claims:
Session-note deletion confirmed on:
```

可用：

> 在 version X 的五個去識別化、人工主持本地 session 中，4/5 人無定向提示便在 60 秒內選出起點。這是可用性問題發現證據，不代表學習成效、代表性或公開部署。

不可用：

> 使用者驗證這個網站很易用，能幫人學會 AI 並建立有效 portfolio。

若日後要評估真正的一星期完成、知識變化或作品品質，必須另建負責人批准的 longitudinal learning study，預先定義內容特定 assessment、baseline、完成證據、掉隊處理、同意、儲存與刪除方案。不得從本協定的導航任務推斷這些結果。

## 11. 現時邊界

- TypeScript、lint、build、internal-link、fixture runtime 和瀏覽器檢查仍是 `LOCAL_QA`，只證明各自的技術 contract。
- 本協定不加入 analytics、cookie、server event 或外部傳送。日後要做上線後量度，應另依 [Owner-review measurement plan](./owner-review-measurement-plan.md) 取得 provider、consent、retention 與刪除流程批准。
- 可用性通過不會批准發佈、上載、對外連結、收集電郵、收款或更改 release manifest。
- 目前只建立此協定；沒有招募、聯絡、session、參與者資料、analytics、發佈或學習成效結果。
