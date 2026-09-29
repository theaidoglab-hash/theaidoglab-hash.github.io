# Workforce Signal Brief Starter

[English source](README.md) · [繁中（香港）](README.zh-HK.md) · [繁中（台湾）](README.zh-TW.md)

状态：由读者自行持有的本地练习。这个 package 中每一个 value 都是虚构。
它不是 live public-statistics integration、labour-market forecast，也不是关于 hiring、salary、visa、migration、investment、policy 或 release 的建议。

这个小 project 只问一个问题：一张 synthetic source receipt 是否完整到足以让一个人写一份 no-action context brief？program 只会返回一份 allowlisted context packet 给人 review，或拒绝 source。它永远不会 retrieve data、call model、send message、publish brief，或作 external decision。

## 在本地运行

需要 Node.js 20 或以上。这个 package 没有 dependency、credential、environment variable、安装步骤、network call 或 model call。

先解压下载文件。然后在解压后、包含本 `README.md` 和 `package.json` 的文件夹打开终端，再运行：

```powershell
npm test
npm run demo
```

`npm test` 会检查七个 fixed cases。`npm run demo` 会打印一份 deterministic report；`expected-output.json` 记录它应该产生的 summary。本地 pass 只证明这个虚构 fixture 遵守已写明的 rules。

## 可以检查什么

| Path | 它回答的问题 |
| --- | --- |
| `data/source-receipt.mjs` | 有哪些曾经／没有曾经被 acquired？ |
| `data/synthetic-series.mjs` | 本地 fixture 允许哪些 fields？ |
| `src/evaluate.mjs` | source receipt 何时要在 draft packet 前停止？ |
| `tests/workforce-signal-brief.test.mjs` | normal 与 failure cases 有没有守住 boundary？ |
| `docs/decision-brief.md` | 谁拥有决定？什么是禁止？ |
| `docs/reviewer-record.md` | keep、hold 或 revert 一个 change 前，reviewer 会记录什么？ |
| `docs/rollback-record.md` | 本地 candidate 怎么退回之前的 rule？ |

## 建议的 portfolio walkthrough

展示 chart 前先展示 source receipt。接着展示一个 accepted fixture、一个 rejected fixture、reason code、reviewer questions 与空白 decision record。解释 program 只是检查一个人是否有足够、且有边界的 material 可以写 context；它不是预测 job market。

## 不会声称的事

- 没有下载、query、cache 或 reproduce ABS 或任何其他 public release。
- 没有 employer、employee、candidate、customer、salary、visa 或 operational data。
- 没有 API key、OpenAI Responses request、Promptfoo run、model output 或 external service。
- 本地 test pass 不证明 source quality、current statistic、forecasting ability、business value、security approval、production readiness 或 user adoption。
- 未经 authorised owner 分别确认 source terms、data permission、privacy 与 security review、retention rules、evaluation、monitoring 与 release authority 前，不要用真实 data 取代这个 fixture。

请看 `workforce-signal-brief-starter.md` 取得配套的 manual worksheet。
