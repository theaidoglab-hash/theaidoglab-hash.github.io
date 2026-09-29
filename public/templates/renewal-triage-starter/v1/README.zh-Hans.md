# Renewal Triage Starter（简体中文）

这是给读者阅读的简体中文入口页。代码、文件名、command、测试名称与 runtime string 保持英文，便于 reviewer 重跑；如需核对原始技术文字，请阅读 [English README](README.md)。

状态：读者自行持有的本地练习。Package 只含虚构 record；它是 portfolio starter，不是 production renewal system。

这个小 project 只回答一个有范围的问题：**当两位 reviewer 只能看两条 record 时，只按 raw risk score 排序，是否会得到与按 synthetic business-priority value 排序相同的 draft queue？**

它刻意产生两条不同 queue。这个差异就是重点：技术上整齐的 score，不等于对既定 capacity 有用的 decision queue。

## 在本地运行

需要 Node.js 20 或以上。它没有 third-party dependency、environment variable、credential、network call、model call 或 install step。

先解压下载文件。然后在解压后、包含本 `README.md` 和 `package.json` 的文件夹打开终端，再运行：

```powershell
npm test
npm run demo
```

`npm test` 会检查已记录 result、risk ranking 与 queue utility 的差异、ineligible-record rule、no-action boundary、out-of-scope request、non-synthetic fixture 与 invalid capacity。

`npm run demo` 会打印 [`expected-output.json`](expected-output.json) 记录的确切 report。

## Fixed fixture 展示什么

Capacity 是两条 record。

| Draft strategy | 入选的 synthetic record | Offline synthetic queue utility |
| --- | --- | ---: |
| Raw risk score，由高至低 | `SYN-RN-001`, `SYN-RN-002` | `16` units |
| Risk score × synthetic renewal value，由高至低 | `SYN-RN-002`, `SYN-RN-004` | `26` units |

Utility figure 来自 hidden-for-selection synthetic fixture label。它只在 queue 建成后，用来比较两个 local draft；它不是 revenue、retained value、customer outcome、model metric、intervention result 或 causal evidence。

`SYN-RN-005` 有最高 raw signal，但它不合资格，因此两个 draft 都不能选它。较高 numerical value 永远不可越过 eligibility boundary。

## 在 portfolio review 可以指出什么

- 一份说明 owner、allowed output、capacity 与 non-goal 的 decision brief。
- Queue 建立前的 deterministic fixture validation。
- 两条清楚不同的 ranking rule：raw risk 与 business priority。
- 一个看人实际会 review 的 queue、而不只看 score 的 evaluation。
- Failure route 的 test 与可重跑的 expected report。
- 一份将 local demonstration 与真实 approval 分开的 reviewer decision 与 rollback record。

## Package map

```text
data/       Synthetic snapshot and allowed/blocked request fixtures
src/        Validation, queue construction, route boundary, and contracts
tests/      Node built-in test suite
scripts/    Repeatable local demo
docs/       Decision, metric, failure, review, rollback, and adaptation records
```

调整它前，请先阅读：

- [Decision brief](docs/decision-brief.md)
- [Metric map](docs/metric-map.md)
- [Failure cases](docs/failure-cases.md)
- [Reviewer decision template](docs/reviewer-decision.md)
- [Rollback record](docs/rollback-record.md)
- [Adaptation worksheet](docs/adaptation-worksheet.md)
- [Future model seam](docs/future-model-seam.md)

## Scope boundary

- 每条 `SYN-RN-*` record 与每个 value 都是为本练习而虚构。
- 唯一允许的 output 是供人检查的 draft queue。
- Package 不会联系 customer、修改 price、作出 renewal decision、写入 external system，或向任何地方发送 request。
- 本地 test pass 只表示这个特定 synthetic exercise 可重跑；不代表 model quality、business impact、security、privacy approval、production readiness，或适合使用 live data。
- 未经 authorised owner 另外确认 data permission、privacy/security review、point-in-time availability、intervention design、success measure、monitoring 与 release decision 前，不要把 fixture 换成真实 record。
