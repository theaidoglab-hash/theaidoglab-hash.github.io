# AI.DOG 學習者體驗自評

狀態：`僅限內部草稿`

日期：2026-09-26

範圍：本地 `public-site`，以香港繁體中文路線為主，兼看英文及其他中文 locale 的共用元件。

## 自評問題

這一輪不是只看頁面是否漂亮，而是從第一次到訪的學習者角度檢查：

- 我能否在一分鐘內知道網站幫甚麼人、不能承諾甚麼？
- 我是 coder 或 non-coder，都能否找到一個不需先理解全站架構的起點？
- 我只有 15 分鐘、數日或一星期時，建議會否把我帶到相稱的任務？
- 我從診斷、學習、練習到 portfolio，前後文會否遺失？
- 我能否看見下一步、完成條件、證據及不能聲稱的成果？
- 長頁面是否容許逐步展開，而不是一次要求我閱讀全部內容？
- 搜尋、篩選、分頁、鍵盤焦點、標題層級及狀態提示是否清楚？
- 本地儲存或複製失敗時，介面會否錯誤聲稱成功？
- scoped release 會否保留指向未發佈內容的死連結？
- 學習者完成路線後，能否組合一份可檢查而不誇大的 AI portfolio evidence pack？

## 已發現並修正的主要問題

| 問題 | 對學習者的影響 | 本輪處理 |
| --- | --- | --- |
| 15 分鐘選項仍可能帶到 30–45 分鐘路線 | 建議與可用時間不一致 | 快速 concept 路線改到資源庫；快速 build／portfolio 路線改到可立即開始的 lab 或 planner |
| coder 診斷進入 Labs 後會遺失所選案例 | 要重新找入口，路線斷裂 | 用 `case` query 保留案例，並在 Lab → Portfolio 用 `starter` query 傳遞起點 |
| Portfolio 頁一次顯示太多參考內容 | 首次使用者難以辨認主要任務 | 主要 capstone／planner 保持可見；worked examples 與 handoff 參考改為按需展開 |
| Roadmap、Interview Lab、Labs 形成極長頁面 | 掃讀成本高，難以逐步完成 | Roadmap 每次只 render 一個 phase；Interview Lab 先顯示五條起步路線；Labs 先顯示一個已選案例。次要目錄按需展開，舊 deep link 仍會轉到正確 phase 或自動展開所屬段落 |
| 資源庫一次列出全部結果 | 難以掃讀及回到原位置 | 每頁 12 項，保留所有篩選參數，加入可見標籤、結果範圍及 `aria-current` |
| scoped release 可能顯示沒有目標的錨點，或選了 Labs route 但沒有 `build-lab` 內容 | 點擊後沒有反應，甚至通過檢查後仍出現 404 | 連結與目標使用同一 visibility 條件；沒有診斷時回到 Start Here；release catalog 要求一條連同實際內容與連結依賴的 runnable portfolio path，缺一項便 fail closed |
| Portfolio 本地儲存失敗仍可能顯示已保存 | 造成錯誤安全感 | 儲存／刪除加入成功、等待及失敗狀態；只有實際寫入成功才顯示已保存 |
| 複製動作的回饋離按鈕太遠 | 鍵盤或低視力使用者難以確認動作 | 把單一、簡短的狀態提示放回觸發它的 action group，避免重複 live announcement |
| 重要學習步驟用普通段落充當標題 | 螢幕閱讀器難以用 heading navigation 理解流程 | 核心步驟改用 `h2`／`h3`，並修正 `aria-labelledby` |
| 黃色小字與部分 metadata 對比／字級不足 | 閱讀疲勞，尤其在長學習頁 | 使用較深 focus 色、提高有意義 metadata 字級、取消中文標題負 tracking |
| Traditional Chinese starter README 路徑錯誤 | 點擊下載後找不到正確語言版本 | 所有 starter asset 經 locale-aware static path 映射；逐一以本地 HTTP 200 驗證 |
| 文章只顯示共用學習提示 | 不知道開始條件、實際所需時間或應留下甚麼 | 62 篇文章各自顯示 prerequisite、按本語言內容長度計算的閱讀估算、獨立練習估算與具體 evidence；沒有 generic fallback |
| Roadmap 每站沿用相同完成 checklist | 「完成」無法反映不同技術能力 | 19 站各有兩項可觀察驗收與一項 stop／return condition，四個 source locale 逐站編寫並由 validator 檢查唯一性 |
| 直接開啟收合區內的 roadmap deep link 會出現 hydration warning | 內容雖可見，但 browser 與 React 初始狀態不一致 | 保留瀏覽器為 fragment 自動展開的狀態，並在該 disclosure 明確處理 hydration 差異；fresh-tab console QA 無 warning |

## 第二次自評：修正後結果

完成上述修正後，再以「第一次來到這裡的 non-coder」及「已有開發底子的 learner」各走一次主要路線。這一輪的本地結論是：**主要入口已容易辨認，內容次序亦能先給一個可開始的小任務，再按需要展示完整資料。** 尚未把這個結論當成真實使用者研究結果。

| 檢查面向 | 第二次自評證據 | 結果 |
| --- | --- | --- |
| 首頁優先次序 | 首屏先講學習者價值、三題診斷及四條主要路線；自選支持位於學習入口之後 | 通過 |
| 桌面導覽 | 主要導覽只保留「由呢度開始、學習地圖、做第一個 workflow、面試練習」；Portfolio、Resources、Planner、Labs 等放入「更多」 | 通過 |
| 展開後的 mobile menu | 實際在 320、360、390 px 展開；menu 左右邊界均在 viewport 內，十個連結沒有文字 clipping 或水平 overflow | 通過 |
| active navigation | Article／category／download 會標示 Resources；no-code／coding starter 會標示 Labs；「更多」同時顯示 active child | 通過 |
| non-coder 起步 | 六個詞語解釋在第一個下載／複製動作之前；15 分鐘 prompt 只要求五項輸出；公開 `zh-Hant` 使用香港用字及 `zh-HK` assets | 通過 |
| developer 起步 | 診斷可直接帶到 `audience=developer` 的 Resources，或帶到 Portfolio 15 分鐘起步卡；英文 Labs 在 360 px 沒有 overflow | 通過 |
| Build Lab | 先顯示一個已選案例、`15–30 分鐘`及 prerequisite；八個案例的完整目錄預設收合 | 通過 |
| Portfolio | `#portfolio-quick-start` 會聚焦到三題起步卡；只要求 user、現行做法及 human decision boundary，並清楚說明「已開始」不等於完成作品或證據 | 通過 |
| Interview Lab | 首層只顯示五條 learner starter paths；進階分類、能力分組與 14 個準備範圍在 disclosure 內；單題頁先顯示真實題面，答案地圖與長筆記預設收合 | 通過 |
| 文章層級 | beginner article 先提供五分鐘路線；learning contract、路線位置／目錄及其他相關指南預設收合；讀者先看到正文而非多層操作說明 | 通過 |
| Resources readiness | 六個搜尋／篩選控制在 390 px 排成一欄；新增 coder／non-coder 及所需時間，card 同時顯示程式程度和估算總時間；零結果有清除篩選入口 | 通過 |
| Roadmap 負荷 | 預設只 render Foundations 的八站；選其他 phase 只 render 該 phase。香港中文預設 route 的 raw HTML 為 490,510 bytes，較第一次自評的 1,016,400 bytes 約少 52% | 通過 |
| Roadmap 舊連結 | 直接開 `#roadmap-stage-12` 會轉成 `?phase=production#roadmap-stage-12`，再把焦點放到該站；不會落在不存在的 fragment | 通過 |
| locale fragment | locale link 會把現有 query／hash 寫入 `next`；本地 API redirect 實測由 `zh-Hant#learner-start` 到 `en#learner-start` | 通過 |
| destructive local action | Roadmap reset 使用 `role="alertdialog"`；先聚焦「取消」，Escape 關閉後焦點返回「重設本機進度」 | 通過 |
| reveal semantics | coding reference target 在 reveal 前已存在，按鈕有 `aria-controls`、`aria-expanded="false"`，target 為 `hidden`；完成前按鈕保持 disabled | 通過 |
| browser runtime | 本輪走過 homepage、兩個 starter labs、Resources、Portfolio、Interview Lab／單題、Roadmap、download 及 article route；console 沒有 warning 或 error | 通過 |

這表示目前的本地資訊架構已由「先理解全站」改成「先做一個選擇或一個小任務」。它仍不證明術語對所有第一次接觸 AI 的讀者都足夠簡單；這一點要由下一輪去識別化 learner session 驗證。

## 第三次自評：平行修正後複核（2026-09-27）

這次用三個獨立角度重新檢查導航、非開發者文字和窄螢幕互動，再由主檢查走一次實際路線。發現的問題均已在本地修正：

| 發現 | 修正與複核結果 |
| --- | --- |
| scoped release 的首頁 roadmap fallback 曾指向已被 compact preview 移除的 `#roadmap-stage-00` | preview 在可用時提供真實 target；導覽與 phase link 同時保留 phase context。release route-surface 與 1,732 條 internal link 檢查通過。 |
| 三題診斷的「15 分鐘＋資源庫」把 `effort=quick` 傳入沒有任何 30 分鐘內指南的篩選，會顯示零結果 | 仍保留 coding audience，但把最短可完成指南的篩選改為 `effort=session`；頁面以「開始最短可用指南」而非承諾 15 分鐘完成。實際複核 developer 為 41 篇、non-coder 為 16 篇結果。 |
| 320 px 下長檔名 `AGENT_PROMPT_PACK.md` 與 learning probe 會造成水平 overflow；部分 menu／disclosure 原生控制項過小 | 加入只限相關元件的換行與最小寬度規則，並把可點擊目標調整為至少 44 px，保留原生 disclosure marker 和 3 px keyboard focus。320、360、390 px 重新檢查均無 horizontal overflow。 |
| coding starter 的第一屏把 pure function、API key、repository、diff、connector 和 write permission 混入英文術語 | 香港繁體、台灣繁體及簡體均改為中文優先並在首次出現處加短定義；英文檔名仍保留，方便對照本機學習檔。non-coder 路線亦維持 glossary 先於下載或可選 AI 動作。 |

### 第三次自評結論

- **non-coder 路線：** 三題選擇可直達本機 no-code first run；頁首先解釋六個詞語，才出現下載、複製或可選 chat 動作。
- **developer 路線：** 概念缺口＋15 分鐘選擇會產生有結果的 developer／90 分鐘內資源入口；有實作底子的 portfolio 選擇仍直達受限的 Build Lab 或 15 分鐘起步卡。
- **行動與可讀性：** coding starter 以「一個純函式、六個固定案例、先人手後比對」交代任務、邊界與下一步。長檔名在窄螢幕會換行，而不是把頁面撐闊。
- **導覽與前後文：** Resources 的 locale link 保留 query/hash；mobile menu、skip link、收合區和答案 reveal 仍可用鍵盤理解和操作。
- **本地回歸：** 最終 `npm run build` 通過 lint、CSS、TypeScript、62 篇文章／496 downloads、所有 content/release/CSP/Worker 檢查、1,732 internal links、Vinext build 及 client-weight budget（156.0 KiB shared gzip、21.9 KiB CSS gzip）。fresh-tab console 沒有 warning 或 error。

本次結論仍只是**本地介面與內容 contract 已通過複核**，不代表真實學習者已理解、完成或獲得職涯成果。

## 第四次自評：兩種 learner 的實際走讀（2026-09-27）

第三次自評把「有非空的 90 分鐘內結果」當作 15 分鐘選擇的可接受結果；這個判斷不夠嚴格。這次不用 HTTP 200、卡片數量或 validator 成功代替學習者走讀，而是由首頁逐項選擇，再跟隨畫面給出的下一步。

| learner 選擇與實際路徑 | 走讀時發現 | 本輪修正 | 修正後親自複核 |
| --- | --- | --- | --- |
| `第一次把 AI 用進可覆核的工作` → `不寫程式` → `約 15 分鐘` | 起點原本容易先讓人以為要用 chat／複製 prompt；手動記錄表在頁面較前的位置，和「不用帳戶」承諾不相連。 | quick route 直接聚焦「唔使登入都可以完成：先做手動基準」；頁內已展開 Reviewer 記錄，第一步可查看、用紙或記事本記低答案，毋須下載、複製或登入。 | 跟隨到 AC-01，展開參考處理結果為 `DRAFT_REVIEW_NOTE`，並看見 source ID 與「不可提出 action」的覆核依據。 |
| `補一個 AI／工程概念缺口` → `可以自行修改、執行與除錯` → `約 15 分鐘` | 原來去了 Resources 的「90 分鐘內」結果，第一批文章是 35–40 分鐘，和選擇不相符。 | 直接去 request-path 練習；頂部明說只做預設「短 request · warm cache」、指出先看的 path slice 和五個要記下的欄位，不要求讀完約 100 分鐘文章。 | 首屏可見 15 分鐘邊界、禁止切換其他情境、預設情境和明確停止條件。 |
| 直接開 Resources 的 `30 分鐘內` 篩選 | 沒有結果時只顯示「搵唔到」，把誠實選擇時間的讀者困在死路。 | 保留 `30 分鐘內` 篩選，清楚說目前沒有符合指南，拒絕把較長內容說成 30 分鐘；按 audience 提供 90 分鐘內指南和真正有界限的本機起點。 | developer 路線顯示 41 篇較長時段指南及 15 分鐘作品起步卡；non-coder 路線顯示 16 篇較長時段指南及 no-code 練習。 |
| `開始建立一個 AI 作品` → `可以自行修改、執行與除錯` → `一星期逐步完成` | Build Lab 只寫 45–60 分鐘 starter；要走向一星期作品的 handoff 原本要讀到長頁最底部。 | 在已選 Coder Starter 卡下直接標示它只是第一段，解釋六個固定案例只是練習，並給出同一 starter 的 portfolio link、自己的正常／失敗案例和非採用原因。 | 跟隨至 planner 的 `#portfolio-capstone`，保留 Coder Starter context，並帶到相稱的 developer reliability 練習方向。 |
| 在已選 Build Lab 或已篩選 Resources 改變語言 | locale link 曾丟掉 query 與 hash，learner 會失去已選 Lab、篩選條件和閱讀位置。 | locale redirect 在啟動時讀取當前 query／fragment，而不是只使用 server 初始 pathname。 | `labs?case=coding-starter#lab-case-selector-title` 轉成簡體後仍保留相同 case 與 anchor；篩選後的 Resources 同樣保留 query／hash。 |

### 第四次自評結論

- **non-developer：** 我能在首次到訪時選出不需帳戶的路線，直接做一個可理解的手動案例；optional chat 在完成核心任務之後才出現。
- **developer：** 我能選到真正 15 分鐘的概念起步，而不是被較長文章的非空清單誤導；一星期作品路線亦在 starter 前就交代第一段、下一段及不可誇大的邊界。
- **導航與文字：** 每個測得的死路、上下文遺失或時間承諾不實都改為可見說明和下一步。技術字詞仍保留在 developer 練習中，但起步任務先說明需要作出的判斷、要留下的欄位及何時停止。

這仍是一次由產品作者進行的本地走讀；它證明指定路徑可跟隨、文字與互動相符，**不是**五位或更多真實 learner 的理解度研究。

## 第五次自評：把時間承諾和續接當成導航合約（2026-09-27）

這次特意不用「有一個可去的頁面」當作完成。每一條由三題診斷選出的路線，都要在第一屏說清楚：今次只做甚麼、甚麼不需要做、完成後是否有一個相稱的下一步。

| learner 選擇與實際路徑 | 走讀時發現 | 本輪修正 | 修正後親自複核 |
| --- | --- | --- | --- |
| `第一次把 AI 用進可覆核的工作` → `不寫程式` → `15 分鐘` | 手動練習雖然可開始，但舊的 Reviewer 記錄連結會跳到很遠的資產區，打斷由 AC-01 開始的次序。 | 把記錄表放入手動路線內，以 disclosure 原地展開；可選 chat 移到六個手動案例之後。 | 由診斷直達 `#no-code-lab-manual-title`；開記錄、看 AC-01、先寫決定，再自行揭示參考答案。全程不需帳戶、下載或外部動作。 |
| `第一次把 AI 用進可覆核的工作` → `看得懂小段程式與測試` → `15 分鐘` | 原本會到完整 Coder Starter Lab；雖然有價值，但沒有履行 15 分鐘的選擇。 | 新增兩個相反固定案例的 quick start：只判斷 TC-01、TC-06 和為何 BLOCKED 優先，並明說完整 lab 另需 45–60 分鐘。 | 診斷顯示唯一的兩案例任務，anchor 直達該段；畫面清楚說明毋須下載、寫程式或開 AI 助手。 |
| `練習 AI Engineer 面試` → 任意程式程度 → `15 分鐘` | 原本推薦四題路線，和短時段不相稱。 | 快速推薦改為一條獨立問題：先用 90 秒試答，再按需要打開答案地圖；四題路線留給較長時段。 | 診斷直達一條題面，首屏只要求「先用自己的話答這條題」，詳細筆記維持收合。 |
| non-coder 的 Resources `30 分鐘內` 零結果，以及其他短時段入口 | 個別入口仍指向可選 chat 區，而不是無帳戶手動起點。 | 統一 Resources、early route 和 roadmap entry 的 anchor，全部指向手動起點；零結果仍保留原本篩選，誠實提供 90 分鐘指南或 15 分鐘本機練習。 | 帶 `audience=non-coder&effort=quick` 的 Resources 頁保留篩選，按起點後聚焦手動標題。 |
| Coder Starter → Portfolio 一星期續接 | 舊的 planner mapping 可把 Coder Starter 帶到不相稱的 batch-recovery 方向。 | 改為預先選擇同一個「為人手批核準備草稿」方向，並在 capstone 明確分開 starter 與 learner 自己新增的問題、案例和檢查。 | Portfolio planner 保留 `starter=coding-starter` context，顯示相稱的 Approval Queue／人手批核方向。 |

### 第五次自評結論

- **時間不再只是篩選標籤：** 15 分鐘路線現在各有可完成、可停止的最小任務；完整指南、四題路線和完整 lab 都明確留給下一段時間。
- **續接不再假設所有人從零開始：** 完成六個 no-code 案例的人會進入 capstone 續接；剛進 planner、只有短時段的人仍可用三題 quick start。兩條路都說清楚 starter 並不等於個人作品。
- **導航 context 可保留：** 語言切換保留 Resources 的 query／fragment；篩選、分頁返回、roadmap 和 interview 的深層連結都帶回對應位置，而不是重置到頁首。

以上是一次更嚴格的本地自評，仍然只證明互動、文案和頁內焦點的 contract 可跟隨；不證明真實讀者的理解、完成率、作品品質或職涯結果。

## 第六次自評：把錯選、空結果與短時段當成正式路徑（2026-09-27）

這次把「learner 會照預期一路前進」視為不安全假設，刻意測試他們會做的事：在已選的 Lab 改選案例、在零結果的 Resources 尋找下一步、直接開 15 分鐘的 hash link、以及把 15 分鐘起步誤認為完整作品規劃。以下修正以桌面和真實 320 × 800 px 瀏覽器走讀複核。

| learner 情境與實際路徑 | 走讀時發現 | 本輪修正 | 修正後親自複核 |
| --- | --- | --- | --- |
| Coder Starter Lab 改選 Approval Queue，再重新整理或切換語言 | 畫面雖已顯示新案例，URL 仍保留舊 `case`；重新整理後選擇會倒退，切換語言也可能失去剛才的工作上下文。 | selector 現在把已選 case 寫回 URL，同時保留 locale、其餘 query 和 selector anchor。 | 改選後的 URL 為 `?case=approval#lab-case-selector-title`；重新整理和切到英文仍保留 Approval Queue。 |
| developer 於 Resources 選「30 分鐘內」而得到零結果 | 空狀態誠實說沒有短指南，但只提供 portfolio 起步；一個真正 15 分鐘的 coding 判斷練習被藏起來。 | zero-result state 同時提供 15 分鐘 coding judgement 和 15 分鐘 portfolio 起步，並保留較長指南作下一段，而不把它冒充成短時段。 | developer 可看見兩條不同目的的短路徑；non-coder 仍只看見不需寫程式的手動起點。 |
| non-coder 直接開手動 Reviewer 記錄 | 頁面說「填寫記錄」，但顯示的是不可編輯的 Markdown 區塊，初學者容易以為表格壞了或要先找工具。 | 明示這是「喺紙上／記事本填寫」的範本，補上不可直接編輯的提示和只在本機執行的複製按鈕。 | 直接 hash link 第一屏能理解：毋須帳戶、可用紙／記事本完成、參考格式只供抄寫。 |
| learner 由「15 分鐘 portfolio 起步」進入 planner | 舊頁把三題 15 分鐘承諾直接接到六個方向、12 個檢查和五項量度細節；任務範圍與時間承諾不相稱。 | 第一屏新增三個可直接填寫的文字欄，只問目標情境、現時處理和人手最終決定；完整 planner 被清楚標為之後較長的一段。 | 三題輸入只留在目前頁面、不儲存或上載；其後才看見完整 planner 的 12 個檢查和五項量度細節。 |
| 320 px 手機直接開 no-code 的 15 分鐘手動 anchor | 全站 smooth scroll 令 deep link 在數秒內仍向目標滑動；在窄螢幕上，承諾的「即時開始」實際上像失敗。 | 只對程式主動處理的 fragment 跳轉暫時使用 instant scroll；一般瀏覽仍保持 smooth scroll。locale menu link 在 mobile 亦調整到至少 44 × 44 px。 | 真實 320 × 800 px 新分頁內，手動標題在不足一秒到達頁頂、保留焦點，且沒有 horizontal overflow。 |
| 完成 no-code 五分鐘路徑後閱讀 low-code automation 文章 | 首段接連使用 retrieval、mock、fixture、prompt injection、trace 等字，未先說它們對第一次任務代表甚麼。 | 四種 locale 的首現術語均改為中文優先的短定義，並重申 synthetic、local-only、non-sending、不可取代人手決定的邊界。 | 390 px 文章走讀沒有水平溢出；初學者可先完成五分鐘任務，再按需要認識技術標籤。 |

### 第六次自評結論

- **導航是可恢復的狀態：** 改選案例、重新整理、切換語言、空結果和直接 deep link 都會保留或交代下一步，而不是只在順利首次到訪時可用。
- **短時段承諾是實際範圍：** developer 的 15 分鐘練習、non-coder 的紙上記錄和 portfolio 的三題起步，現在都在指定入口可直接完成；較長內容被明確留作下一段。
- **文字先交代任務，再交代工具字：** 不可編輯範本、資料留存位置和首次技術術語都說明了讀者此刻要做甚麼及不用做甚麼。
- **mobile 不是縮小桌面：** 320 px 的 direct link、觸控目標、焦點與橫向溢出被視為正式驗收，而非純視覺檢查。

本輪完整本地 build、內容／連結／release／CSP／Worker 驗證及 client-weight budget 均通過；fresh-tab 瀏覽器走讀沒有 console warning 或 error。這仍只證明本地介面和內容 contract；不代表已部署、已招募 learner，或真實理解度與職涯成果已被證實。

## 本地驗證範圍

- 桌面，以及 320、360、390 px 展開 mobile menu 的實際瀏覽器路線檢查；主要內容以 390 × 844 viewport 複核。
- 診斷 quick route、coder Lab context、Lab → Portfolio context、直接 hash deep link。
- 資源庫第一／第二頁、篩選參數保留、mobile control 寬度及 horizontal overflow。
- Roadmap phase 切換及舊 deep link 遷移、Interview Lab 五條起步路線、單題答案 disclosure，以及 Labs 已選案例／完整目錄層級。
- 首頁與文章的內容先後次序、non-coder glossary、Portfolio 三題 quick start、Resources audience／effort filters、download locale／version。
- Traditional Chinese starter README 的本地 HTTP response。
- TypeScript、ESLint、CSS、內容／路線／release validators、1,732 條 internal-link 檢查、client-weight budgets、Worker config 及 production build。

以上只證明本地 fixture、路線及介面 contract 通過檢查；不證明已部署、已發佈、真實學習者已成功完成，或 portfolio 能帶來招聘結果。

## 尚未完成的實證缺口

文章與 roadmap 的內容 contract 已在本輪補完。以下工作不能用更多本地程式檢查代替：

1. 現時只完成本地專家審閱及 synthetic／fixture QA；仍需用少量去識別化 learner sessions 量度首次選路、迷路位置及 portfolio handoff 理解度。
2. 這個短 session protocol 不會量度真正的一星期完成率、知識變化或作品品質；這些要另行批准 longitudinal study。
3. 在未取得上述證據前，不應把這輪修正描述成已驗證的學習成效。

## 下一輪可量度驗收準則

- 新訪客能在 60 秒內選出一條 coder 或 non-coder 起步路線。
- 15 分鐘選項的第一個任務可在頁內立即開始，不要求先閱讀完整 roadmap。
- Lab 使用者進入 Portfolio 後，仍看見原本選擇的案例和對應 project shape。
- 使用鍵盤可完成診斷、搜尋／分頁、展開學習內容、保存選擇及複製材料。
- 五名去識別化試用者中，每人都能指出「完成證據」與「不能聲稱的成果」；若有人混淆，先修內容，再擴大測試。

實際小樣本 session 必須依照 [學習者可用性驗證協定](./learner-usability-validation-protocol.md) 執行：先取得負責人對招募、同意、儲存位置與刪除日期的明確批准，並將「本地導航通過」與「學習成效已驗證」分開。

## 發佈邊界

`content/release-manifest.json` 維持 `LOCAL_REVIEW_ONLY`，所有 selection 陣列為空。本輪沒有部署、發佈、上載、聯絡學習者或建立收費流程。
