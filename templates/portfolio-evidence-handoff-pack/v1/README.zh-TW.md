# 作品集證據交接包

[English source](README.md) · [繁中（香港）](README.zh-HK.md) · [简体中文](README.zh-Hans.md)

狀態：由讀者自行保存的本機範本。它協助你把一個 fixture-first 作品專案整理成 reviewer 可檢查的交接資料；不含 repository、credential、network step、自動發布，也不聲稱存在 live system。

這份包不是把 demo 包裝成大型專案。它的用途是分開已被本機證據支持的內容，以及仍然未知的內容。

## 文件和用途

| 文件 | 幫 reviewer 判斷的問題 |
| --- | --- |
| project brief | 哪個人需要做哪個小決策，哪些事情不在範圍內？ |
| source and data receipt | 每個 input 從哪裡來，是否可用於這個用途？ |
| run receipt | 實際在本機跑了什麼、使用哪些有界限材料、結果為何？ |
| claims and non-claims | 哪些結論有根據，哪些不能主張？ |
| reviewer decision | 誰檢查過材料，做了什麼決定？ |
| rollback record | 若 candidate 有問題，哪些東西可以停止或還原？ |
| license decision | 是否有分享 code 或 material 的書面依據？ |
| repository candidate checklist | 是否可交給 owner 考慮 GitHub candidate？ |

剛開始出現「Not recorded」和「NOT_RUN」是正確狀態。未知就保留未知，不要補上看似完整但沒有證據的內容。

## 使用方式

需要 Node.js 20 以上，不需要安裝 package。

1. 將本包放在一個本機作品專案旁邊。
2. 只記錄你能親自核對的資料；不知道就維持 unknown state。
3. 完成有界限的本機 run 後才更新 receipt，不要因為 code 存在就假定已執行。
4. 在 pack 目錄執行：

       node scripts/validate-portfolio-evidence.mjs

5. 請合適的 owner 或 reviewer 決定未來是否可分享。

`ci/local-evidence-check.yml.example` 是刻意不會生效的 CI candidate。它不在 `.github/workflows` 內，只示範未來經 owner 審查 repository、資料邊界與 command path 後，可如何保留一條唯讀結構檢查。原樣不會執行，也不代表已有 CI、repository 或發布安排。

通過 check 只表示交接結構可供 owner review。它不證明 run、evaluation、data permission、repository 安全、approval、發布、deployment、business value 或 production readiness。

## 重要界限

- fixture、synthetic、public、licensed 與 owner-provided material 必須分開記錄。
- 不要放入 secret、私人 prompt、internal screenshot、個人資料、customer data、employer material 或未核准的 source extract。
- 本機 pass 不等於真實業務會得到相同結果。
- checklist 沒有自動批准機制；reviewer 可以要求修改、拒絕分享，或維持 private。
- 在 authorised owner 明確決定前，不要建立、命名、連結或發布 public repository。

建議 walkthrough 順序：先說明 decision 與 non-goal，再看 source receipt，接著才看 run receipt，讀清楚 non-claims，最後說明 reviewer decision 與 rollback。這樣才能展現判斷，而不是只展示漂亮 output。
