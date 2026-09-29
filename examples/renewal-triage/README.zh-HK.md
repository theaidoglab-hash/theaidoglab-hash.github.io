# 續約分流參考實作

> 一個完全合成、只在本機執行的決策支援流程：示範在有限人手覆核名額下，通用風險排序指標較高，並不足以批准候選隊列。

[English](README.md) · [繁體中文（香港）](README.zh-HK.md) · [繁體中文（台灣）](README.zh-TW.md) · [简体中文](README.zh-Hans.md)

## 作品集定位

這是一個可公開展示、可獨立執行的作品集 reference，不是 production 系統。它以細小而有版本的合成資料，模擬企業式續約覆核流程。範例刻意設計成：candidate 的 average precision 較高，但在固定覆核容量下，offline synthetic queue utility 較低，因此 release gate 會把 candidate 擋下來。

這個負面結果是設計目標，說明預測排序、商業價值、人手容量、決策權限及結果量度必須分開驗證。

## 在本機執行

需要 Node.js 20 或以上。沒有第三方 runtime dependency、環境變數或安裝步驟。

```powershell
# 在這個 repository 的 root 執行
npm test
npm run demo
```

固定的合成結果是：baseline 的 average precision 為 `0.8762`，candidate 為 `1`；baseline 的 queue utility 為 `33`，candidate 為 `1` 個 synthetic units；candidate 的 release gate 是 `BLOCKED`；monitoring 結果是 `ROLLBACK_REQUIRED`，只提出需人手批准的 rollback proposal。

被 gate 擋下是安全檢查運作的證據，不是部署失敗、真實商業結果或留存效果聲稱。

## 邊界

- 所有 `SYN-*` 記錄都是作者手寫合成資料，沒有真實客戶、帳戶、聯絡資料、公司系統或憑證。
- 流程只在本機執行，不會作網絡請求或呼叫外部 API。
- 隊列只會產生 `human_review_only` 草稿；不會自動聯絡、改帳戶或價格，亦不會作續約決定。
- 分數是透明的合成排序，並非已訓練或校準的 production model，也不是對個別人的行動建議。
- offline synthetic utility 只會在合成 outcome 出現後計算；它不是收入、留存、介入成效或因果影響的證據。

## 文件

- [English problem brief](docs/brief.md)：虛構決定、時間邊界、人手容量、baseline/candidate 比較及停止條件。
- [English demonstration map](docs/demonstration-map.md)：完整列出商業價值、技術實作、交付與風險控制、端到端流程、測試證據及明確不作的聲稱。
- [English portfolio tutorial](docs/portfolio-tutorial.md)：由有限決定、point-in-time data、baseline 比較、capacity-aware evaluation，一步步走到本地 release gate 的建造次序。
- [English pilot measurement map](docs/pilot-measurement-map.md)：日後若有授權 team，討論真實 pilot 前仍要補上的獨立證據。
- [MIT License](LICENSE)
- [English README](README.md) · [繁體中文（台灣）](README.zh-TW.md) · [简体中文](README.zh-Hans.md)

除 README 翻譯外，技術文件、原始碼、合成資料、測試文字及 runtime output 均使用英文。
