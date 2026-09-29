# Workforce Signal Brief Starter

[English source](README.md) · [繁中（香港）](README.zh-HK.md) · [简体中文](README.zh-Hans.md)

狀態：由讀者自行持有的本機練習。這個 package 中每一個 value 都是虛構。
它不是 live public-statistics integration、labour-market forecast，也不是關於 hiring、salary、visa、migration、investment、policy 或 release 的建議。

這個小 project 只問一個問題：一張 synthetic source receipt 是否完整到足以讓一個人寫一份 no-action context brief？program 只會回傳一份 allowlisted context packet 給人 review，或拒絕 source。它永遠不會 retrieve data、call model、send message、publish brief，或作 external decision。

## 在本機執行

需要 Node.js 20 或以上。這個 package 沒有 dependency、credential、environment variable、安裝步驟、network call 或 model call。

先解壓縮下載檔。然後在解壓後、包含本檔 `README.md` 與 `package.json` 的資料夾開啟終端機，再執行：

```powershell
npm test
npm run demo
```

`npm test` 會檢查七個 fixed cases。`npm run demo` 會印出一份 deterministic report；`expected-output.json` 記錄它應該產生的 summary。本機 pass 只證明這個虛構 fixture 遵守已寫明的 rules。

## 可以檢查什麼

| Path | 它回答的問題 |
| --- | --- |
| `data/source-receipt.mjs` | 有哪些曾經／沒有曾經被 acquired？ |
| `data/synthetic-series.mjs` | 本機 fixture 允許哪些 fields？ |
| `src/evaluate.mjs` | source receipt 何時要在 draft packet 前停止？ |
| `tests/workforce-signal-brief.test.mjs` | normal 與 failure cases 有沒有守住 boundary？ |
| `docs/decision-brief.md` | 誰擁有決定？什麼是禁止？ |
| `docs/reviewer-record.md` | keep、hold 或 revert 一個 change 前，reviewer 會記錄什麼？ |
| `docs/rollback-record.md` | 本機 candidate 怎麼退回之前的 rule？ |

## 建議的 portfolio walkthrough

展示 chart 前先展示 source receipt。接著展示一個 accepted fixture、一個 rejected fixture、reason code、reviewer questions 與空白 decision record。解釋 program 只是檢查一個人是否有足夠、且有邊界的 material 可以寫 context；它不是預測 job market。

## 不會聲稱的事

- 沒有下載、query、cache 或 reproduce ABS 或任何其他 public release。
- 沒有 employer、employee、candidate、customer、salary、visa 或 operational data。
- 沒有 API key、OpenAI Responses request、Promptfoo run、model output 或 external service。
- 本機 test pass 不證明 source quality、current statistic、forecasting ability、business value、security approval、production readiness 或 user adoption。
- 未經 authorised owner 分別確認 source terms、data permission、privacy 與 security review、retention rules、evaluation、monitoring 與 release authority 前，不要用真實 data 取代這個 fixture。

請看 `workforce-signal-brief-starter.md` 取得配套的 manual worksheet。
