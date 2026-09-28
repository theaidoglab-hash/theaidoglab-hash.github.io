# 作品集證據交接包

[English source](README.md) · [繁中（台灣）](README.zh-TW.md) · [简体中文](README.zh-Hans.md)

狀態：由讀者自行持有嘅本機範本。佢幫你將一個 fixture-first 作品 project 整理成 reviewer 睇得明嘅交接材料；唔包含 repository、credential、network step、自動發佈，亦唔聲稱有 live system。

呢份包唔係用嚟將 demo 包裝到好似大 project。作用係分清：邊啲嘢真係有本機證據，邊啲仲係未知。

## 包入面有乜

| 文件 | 幫 reviewer 判斷乜 |
| --- | --- |
| project brief | 邊個人要作咩小決定，乜嘢仍然唔喺範圍內？ |
| source and data receipt | 每個 input 由邊度嚟，有冇權用？ |
| run receipt | 實際喺本機跑過乜、用咗咩有界限 material、結果係乜？ |
| claims and non-claims | 邊啲結論有根據，邊啲唔可以講？ |
| reviewer decision | 邊個睇過，決定係乜？ |
| rollback record | 如果 candidate 有問題，乜嘢可以停低或退返？ |
| license decision | 有冇記錄到分享 code 或 material 嘅依據？ |
| repository candidate checklist | 可唔可以交畀 owner 考慮 GitHub candidate？ |

起步時見到「Not recorded」同「NOT_RUN」係正常。未知就保留未知，唔好補一個睇落完整但冇證據嘅答案。

## 點用

需要 Node.js 20 或以上，唔使 install package。

1. 將呢個 pack 放喺一個本機作品 project 旁邊。
2. 只記錄你可以親自核對嘅資料；唔知就保留 unknown state。
3. 做咗有界限嘅本機 run 先更新 receipt，唔好由 code 存在推斷已經跑過。
4. 喺 pack 目錄執行：

       node scripts/validate-portfolio-evidence.mjs

5. 交畀合適嘅 owner 或 reviewer 決定日後係咪可以分享。

`ci/local-evidence-check.yml.example` 係刻意唔會生效嘅 CI candidate。佢唔喺 `.github/workflows` 入面，只係示範日後經 owner 覆核 repository、資料界線同 command path 之後，可以點樣保留一條只讀結構檢查。原樣唔會執行，亦唔代表有 CI、repository 或發佈安排。

通過 check 只代表結構上可以交畀 owner review。佢唔證明 run、evaluation、data permission、repository 安全、approval、發佈、deployment、business value 或 production readiness。

## 重要界限

- fixture、synthetic、public、licensed 同 owner-provided material 要分開記錄。
- 唔好放 secret、私人 prompt、internal screenshot、個人資料、customer data、employer material 或未批准 source extract。
- 本機 pass 唔等於真實業務都會有相同效果。
- checklist 冇自動批准；reviewer 可以要求修改、拒絕分享，或者保留 private。
- 未有 authorised owner 明確決定前，唔好建立、命名、連結或發佈 public repository。

建議 walkthrough 次序：先講 decision 同 non-goal，再睇 source receipt，之後先睇一個 run receipt，讀清楚 non-claims，最後講 reviewer decision 同 rollback。咁先睇到你有判斷，而唔係只展示一個靚 output。
