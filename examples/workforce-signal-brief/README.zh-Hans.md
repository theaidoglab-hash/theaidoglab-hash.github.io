# Workforce Signal Brief

[English](README.md) · [繁體中文（香港）](README.zh-HK.md) · [繁體中文（台湾）](README.zh-TW.md)

> **状态：本机、fixture-only 的作品集参考。** 它不是 ABS live integration、劳动力市场预测器、招聘或薪资工具、签证／移民建议、已发布报告、已部署产品，也不是 production-ready 证据。

这个案例演示如何把“想做 AI job-market project”收窄成可检查的问题：一位**虚构** workforce-planning research lead，需要判断公开统计资料的 source receipt 是否完整，足以让人工撰写 context brief。repository 内的数列是 source-shaped synthetic data；它只记录一个可能的 Australian Bureau of Statistics（ABS）公开资料路径，没有 ABS observation。

## 在本机开始

需要 Node.js 20 或更高版本，没有 dependency 和 credential。

```powershell
# From this repository's root
npm test
npm run fixture:validate
npm run demo
npm run eval:diff
```

四个 command 都只使用本机文件：不 download 或 query ABS、不 call model 或 Promptfoo、不读 key、不 forecast、不建议招聘或薪资、不提供签证／移民建议、不 publish、不联系任何人、不写入外部系统，也不 deploy。

## 公开资料路径与本 repository 的边界

| 参考 | 为什么记录 | 本案例不声称什么 |
| --- | --- | --- |
| [ABS Data API user guide](https://www.abs.gov.au/statistics/application-programming-interfaces-apis/data-api-user-guide) | 未来才可能使用的 public-statistics acquisition route | 本 repo 曾 fetch API、release、Data Explorer table 或 current statistic |
| [Labour Force, Australia](https://www.abs.gov.au/statistics/labour/employment-and-unemployment/labour-force-australia) | 让读者先检查的公开 release collection | 这里使用某个 series、value、revision 或 interpretation |
| [ABS source citation guide](https://www.abs.gov.au/how-cite-abs-sources) | source receipt 的提醒 | 一句 attribution 已处理所有资料权利或使用条件 |

本机数列包含 fictional geography、synthetic values，所有 observation 都标示 `synthetic`，manifest 也标示 `synthetic_source_shaped_not_live_acquired`。不可以改称真实劳动力市场资料。

## 可展示的技术与交付证据

| 类别 | 可检查 artifact | 意义 |
| --- | --- | --- |
| 技术：data contract | [`data/`](data)、[`src/source-validation.mjs`](src/source-validation.mjs)、[`schemas/`](schemas) | source route、metadata、synthetic status、freshness、private field、result shape 都有明确检查 |
| 技术：baseline | [`src/workforce-signal-brief.mjs`](src/workforce-signal-brief.mjs) | 在 model 前先建立保留事实和 boundary 的 context packet |
| 技术：test／regression | [`test/`](test)、[`evals/`](evals)、[`scripts/eval-diff.mjs`](scripts/eval-diff.mjs) | normal、missing、unordered、stale、private、injection、forecast request 都有 fixed case |
| 交付：owner／release | [`docs/demonstration-map.md`](docs/demonstration-map.md)、[`docs/evaluation-release-monitoring.md`](docs/evaluation-release-monitoring.md) | 人工保留 source suitability 与 release judgment；monitoring／rollback 是计划，不是假装商业成效 |

## 三层 framework，不要混成一个分数

1. **Data contract＋deterministic tests**：检查事实、boundary、route 与 action authority。
2. **Promptfoo fixed cases**：已有合格 contract 后，才检查 prompt/model candidate 是否 regression。
3. **Human evidence review**：判断资料是否合适、business context、release 与新增 permission。

完整比较和小型 NIST AI RMF Playbook 对照在 [`docs/framework-selection.md`](docs/framework-selection.md)；这不是 NIST compliance 声称。

## Optional GPT-5 mini 与 Promptfoo

[`src/responses-api-fixture.mjs`](src/responses-api-fixture.mjs) 是 `gpt-5-mini` Responses request shape 的 static fixture：`store: false`、没有 SDK、没有 key、没有 network code、没有 model output。它只是未来可能的 seam，并不是 integration。

Promptfoo 有两份 config：fixture 版本只 call 本机 deterministic provider；optional Responses 版本写了 `openai:responses:gpt-5-mini` 和 response schema，但没有 key，也不会由 package script 或 CI 执行。local fixture pass 只证明本 repo 的 wiring。

## 不声称什么

- 没有 ABS data acquisition、currentness check、API call 或 Data Explorer query。
- 没有数字是 ABS value、公开统计数字、trend、forecast 或 causal conclusion。
- 没有真实雇主、员工、求职者、薪资、签证、客户或 operational data。
- 没有 OpenAI API call、model output、Promptfoo run、key、cost、latency、quality 或 safety result。
- 没有招聘、薪资、签证、移民、policy、investment、business、deployment、production 或外部结果声称。

想做自己的版本，请跟 [`docs/portfolio-tutorial.md`](docs/portfolio-tutorial.md) 的六日流程：先改 decision、source receipt、eval set、decision log 与 release gate，不要只改 project 名称。
