# Workforce Signal Brief Starter

[English source](README.md) · [繁中（台灣）](README.zh-TW.md) · [简体中文](README.zh-Hans.md)

狀態：由讀者自行持有嘅本機練習。呢個 package 入面每一個 value 都係虛構。
佢唔係 live public-statistics integration、labour-market forecast，亦唔係關於 hiring、salary、visa、migration、investment、policy 或 release 嘅建議。

呢個小 project 只問一條問題：一張 synthetic source receipt 夠唔夠完整，令一個人可以寫一份 no-action context brief？program 只會回傳一份 allowlisted context packet 畀人 review，或者拒絕 source。佢永遠唔會 retrieve data、call model、send message、publish brief，或者作 external decision。

## 喺本機跑

需要 Node.js 20 或以上。呢個 package 冇 dependency、credential、environment variable、安裝步驟、network call 或 model call。

先解壓縮下載檔。然後在解壓後、包含本檔 `README.md` 和 `package.json` 的資料夾開啟終端機，再執行：

```powershell
npm test
npm run demo
```

`npm test` 會檢查七個 fixed cases。`npm run demo` 會印出一份 deterministic report；`expected-output.json` 記錄佢應該產生嘅 summary。本機 pass 只證明呢個虛構 fixture 遵守已寫明嘅 rules。

## 可以檢查乜

| Path | 佢回答嘅問題 |
| --- | --- |
| `data/source-receipt.mjs` | 有乜曾經／冇曾經被 acquired？ |
| `data/synthetic-series.mjs` | 本機 fixture 容許邊啲 fields？ |
| `src/evaluate.mjs` | source receipt 何時要喺 draft packet 前停低？ |
| `tests/workforce-signal-brief.test.mjs` | normal 同 failure cases 有冇守住 boundary？ |
| `docs/decision-brief.md` | 邊個擁有決定？乜嘢係禁止？ |
| `docs/reviewer-record.md` | keep、hold 或 revert 一個 change 前，reviewer 會記錄乜？ |
| `docs/rollback-record.md` | 本機 candidate 點樣退返之前嘅 rule？ |

## 建議嘅 portfolio walkthrough

展示 chart 前先展示 source receipt。之後展示一個 accepted fixture、一個 rejected fixture、reason code、reviewer questions 同空白 decision record。解釋 program 只係檢查一個人有冇足夠、而且有邊界嘅 material 去寫 context；佢唔係預測 job market。

## 不會聲稱嘅事

- 冇下載、query、cache 或 reproduce ABS 或任何其他 public release。
- 冇 employer、employee、candidate、customer、salary、visa 或 operational data。
- 冇 API key、OpenAI Responses request、Promptfoo run、model output 或 external service。
- 本機 test pass 唔證明 source quality、current statistic、forecasting ability、business value、security approval、production readiness 或 user adoption。
- 未經 authorised owner 分別確認 source terms、data permission、privacy 同 security review、retention rules、evaluation、monitoring 同 release authority 前，唔好用真實 data 取代呢個 fixture。

請睇 `workforce-signal-brief-starter.md` 取得配套嘅 manual worksheet。
