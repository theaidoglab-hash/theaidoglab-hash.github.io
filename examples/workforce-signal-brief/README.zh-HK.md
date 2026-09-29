# Workforce Signal Brief

[English](README.md) · [繁體中文（台灣）](README.zh-TW.md) · [简体中文](README.zh-Hans.md)

> **狀態：本機、fixture-only 的作品集參考。** 它不是 ABS live integration、勞工市場預測器、招聘或薪酬工具、簽證／移民意見、已發布報告、已部署產品，亦不是 production-ready 證據。

這個案例示範怎樣將「想做 AI job-market project」收窄成一個可被檢查的問題：一位**虛構** workforce-planning research lead，要判斷一份公開統計資料的 source receipt 是否齊全，足以讓人手寫 context brief。repository 內的數列是 source-shaped synthetic data；它只記錄一個可能的 Australian Bureau of Statistics（ABS）公開資料路線，沒有 ABS observation。

## 本機開始

需要 Node.js 20 或以上，沒有 dependency 和 credential。

```powershell
# From this repository's root
npm test
npm run fixture:validate
npm run demo
npm run eval:diff
```

四個 command 都只用本機檔案：不 download 或 query ABS、不 call model 或 Promptfoo、不讀 key、不 forecast、不建議招聘或薪酬、不給簽證／移民意見、不 publish、不聯絡任何人、不寫入外部系統，亦不 deploy。

## 公開資料路線，和 repository 實際有甚麼

| 參考 | 為何記錄 | 本案例不聲稱甚麼 |
| --- | --- | --- |
| [ABS Data API user guide](https://www.abs.gov.au/statistics/application-programming-interfaces-apis/data-api-user-guide) | 日後才可能使用的 public-statistics acquisition route | 本 repo 曾經 fetch API、release、Data Explorer table 或 current statistic |
| [Labour Force, Australia](https://www.abs.gov.au/statistics/labour/employment-and-unemployment/labour-force-australia) | 讓讀者自己先檢查的公開 release collection | 這裡使用了某一條 series、value、revision 或 interpretation |
| [ABS source citation guide](https://www.abs.gov.au/how-cite-abs-sources) | source receipt 的提醒 | 一句 attribution 已經處理所有資料權利或使用條件 |

本機數列有 fictional geography、synthetic values，所有 observation 都標示 `synthetic`，manifest 亦標示 `synthetic_source_shaped_not_live_acquired`。不可以將它改稱真實勞工市場資料。

## 技術和交付上能展示甚麼

| 類別 | 可檢查 artefact | 意義 |
| --- | --- | --- |
| 技術：data contract | [`data/`](data)、[`src/source-validation.mjs`](src/source-validation.mjs)、[`schemas/`](schemas) | source route、metadata、synthetic status、freshness、private field、result shape 都有明確檢查 |
| 技術：baseline | [`src/workforce-signal-brief.mjs`](src/workforce-signal-brief.mjs) | 未有 model 前，先有保留事實和 boundary 的 context packet |
| 技術：test／regression | [`test/`](test)、[`evals/`](evals)、[`scripts/eval-diff.mjs`](scripts/eval-diff.mjs) | normal、missing、unordered、stale、private、injection、forecast request 都有 fixed case |
| 交付：owner／release | [`docs/demonstration-map.md`](docs/demonstration-map.md)、[`docs/evaluation-release-monitoring.md`](docs/evaluation-release-monitoring.md) | 人手保留 source suitability 和 release judgment；monitoring／rollback 是計劃，不是假裝商業成效 |

## 三層 framework，唔好混成一個分數

1. **Data contract＋deterministic tests**：檢查事實、boundary、route 和 action authority。
2. **Promptfoo fixed cases**：已有合格 contract 後，才檢查 prompt/model candidate 有沒有 regression。
3. **Human evidence review**：判斷資料是否合適、business context、release 和新增 permission。

完整比較和小型 NIST AI RMF Playbook 對照在 [`docs/framework-selection.md`](docs/framework-selection.md)；它不是 NIST compliance 聲稱。

## Optional GPT-5 mini 和 Promptfoo

[`src/responses-api-fixture.mjs`](src/responses-api-fixture.mjs) 是 `gpt-5-mini` Responses request shape 的 static fixture：`store: false`、沒有 SDK、沒有 key、沒有 network code、沒有 model output。它只讓人看見將來可能的 seam，絕不是 integration。

Promptfoo 有兩份 config：fixture 版本只 call 本機 deterministic provider；optional Responses 版本寫了 `openai:responses:gpt-5-mini` 和 response schema，但沒有 key，亦不會由 package script 或 CI 執行。local fixture pass 只證明本 repo 的 wiring。

## 不聲稱甚麼

- 沒有 ABS data acquisition、currentness check、API call 或 Data Explorer query。
- 沒有數字是 ABS value、公開統計數字、trend、forecast 或 causal conclusion。
- 沒有真實僱主、員工、求職者、薪酬、簽證、客戶或 operational data。
- 沒有 OpenAI API call、model output、Promptfoo run、key、cost、latency、quality 或 safety result。
- 沒有招聘、薪酬、簽證、移民、policy、investment、business、deployment、production 或外部結果聲稱。

要自己做一個版本，跟 [`docs/portfolio-tutorial.md`](docs/portfolio-tutorial.md) 的六日流程：先改 decision、source receipt、eval set、decision log 和 release gate，唔好只改 project 名。
