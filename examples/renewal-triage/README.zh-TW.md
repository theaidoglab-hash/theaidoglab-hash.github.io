# 續約分流參考實作

> 一個完全合成、僅在本機執行的決策支援流程：示範在有限人工審查名額下，通用風險排序指標較高，仍不足以核准候選佇列。

[English](README.md) · [繁體中文（香港）](README.zh-HK.md) · [繁體中文（台灣）](README.zh-TW.md) · [简体中文](README.zh-Hans.md)

## 作品集定位

這是一個可公開展示、可獨立執行的作品集 reference，不是 production 系統。它以小型且具版本的合成資料，模擬企業式續約審查流程。範例刻意設計成：candidate 的 average precision 較高，但在固定審查容量下，offline synthetic queue utility 較低，因此 release gate 會阻擋 candidate。

這個負面結果是設計目標，說明預測排序、商業價值、人力容量、決策權限與結果衡量必須分別驗證。

## 在本機執行

需要 Node.js 20 或更新版本。沒有第三方 runtime dependency、環境變數或安裝步驟。

```powershell
# 在這個 repository 的 root 執行
npm test
npm run demo
```

固定的合成結果為：baseline 的 average precision 為 `0.8762`，candidate 為 `1`；baseline 的 queue utility 為 `33`，candidate 為 `1` 個 synthetic units；candidate 的 release gate 為 `BLOCKED`；monitoring 結果為 `ROLLBACK_REQUIRED`，僅提出需要人工核准的 rollback proposal。

被 gate 阻擋是安全檢查確實運作的證據，不是部署失敗、真實商業成果或留存成效的聲稱。

## 邊界

- 所有 `SYN-*` 紀錄都是作者手寫的合成資料，沒有真實客戶、帳戶、聯絡資料、公司系統或憑證。
- 流程僅在本機執行，不會發出網路請求或呼叫外部 API。
- 佇列只會產生 `human_review_only` 草稿；不會自動聯絡、變更帳戶或價格，也不會做續約決定。
- 分數是透明的合成排序，並非已訓練或校準的 production model，也不是對個別對象的行動建議。
- offline synthetic utility 只會在合成 outcome 出現後計算；它不是收入、留存、介入效果或因果影響的證據。

## 文件

- [English problem brief](docs/brief.md)：虛構決定、時間邊界、人工容量、baseline/candidate 比較與停止條件。
- [English demonstration map](docs/demonstration-map.md)：完整列出商業價值、技術實作、交付與風險控制、端到端流程、測試證據與明確不作的聲稱。
- [English portfolio tutorial](docs/portfolio-tutorial.md)：從有限決定、point-in-time data、baseline 比較、capacity-aware evaluation，一步步走到本地 release gate 的建造順序。
- [English pilot measurement map](docs/pilot-measurement-map.md)：日後若有授權 team，討論真實 pilot 前仍需補上的獨立證據。
- [MIT License](LICENSE)
- [English README](README.md) · [繁體中文（香港）](README.zh-HK.md) · [简体中文](README.zh-Hans.md)

除 README 翻譯外，技術文件、原始碼、合成資料、測試文字與 runtime output 一律使用英文。
