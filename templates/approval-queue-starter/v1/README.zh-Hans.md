# Approval Queue Starter（简体中文）

这是给读者阅读的简体中文入口页。代码、文件名、command、测试名称与 runtime string 保持英文，便于 reviewer 重跑；如需核对原始技术文字，请阅读 [English README](README.md)。

**状态：读者自行持有的本地练习。** 这个 folder 的每条 record、question、answer 与 result 都是虚构；它是 portfolio starter，不是 customer-support system 或 production approval queue。

这个 project 只问一个有范围的 business question：**一条 workflow 能否在不发送 message、不读取 account，也不代人作 decision 的情况下，为 human reviewer 准备一份有 source citation 的 draft？**

答案刻意很窄。固定 synthetic FAQ 可以支持 draft；任何没有支持、不安全、过期，或要求 action 的情况，都必须停止并交给人处理。

## 在本地运行

需要 Node.js 20 或以上。它没有 third-party dependency、install step、environment variable、credential、network call、model call 或 external action。

```powershell
# From the extracted folder that contains this README
npm test
npm run demo
```

`npm test` 会检查 supported route、missing support、instruction override、expired source、requested action、deterministic-template failure、invalid fixture 与 local-only boundary。`npm run demo` 会打印固定 synthetic route，不会写入任何 file 或联系任何地方。

## Fixture 展示什么

| Situation | Local result | Human next step |
| --- | --- | --- |
| Current approved synthetic FAQ 支持这个 question | 有 citation 的 draft | 人工 approve、reject 或 rewrite。 |
| 没有 current approved source 支持 question | Handoff，不产生 draft | 用既有 manual process 补回缺口。 |
| Question 尝试 override instruction | Retrieval 前先 handoff | 人工 review 这个不安全 request。 |
| Request 要求 refund、message、ticket 或其他 outside action | Blocked，不作 retrieval | 把 action 留在既有 manual process。 |

Draft 由 deterministic local template 建立，不是 LLM response。Trace 会储存 request fingerprint，而不是 raw synthetic question。

## 在 portfolio review 展示什么

- 一句 plain-language business decision：准备 draft，永不作最终 support decision。
- 一条 technical boundary：只有 current、approved 的 synthetic FAQ record 可以被 citation；action request 必须在 retrieval 前 blocked。
- 一条 operational boundary：每条 route 仍要写清 human next step。
- 可重跑 evidence：fixed test 与 demo report 同时覆盖 happy path 与 stop path。
- 一份不被误当作 result 的 measurement definition。未来另一个分开、另行 authorised 的 pilot，才可对照预先定义的 manual baseline，量度 reviewer-approved、source-supported draft rate；本 fixture 没有量度这些结果。

调整这个 exercise 前，请先阅读 [decision brief](docs/decision-brief.md)，再用 [evaluation and adaptation notes](docs/evaluation-and-adaptation.md) 把 local check 与未来 real-world proposal 分开。

## Package map

```text
data/       Invented FAQ snapshot and fixed request fixtures
src/        Validation, safety routing, retrieval, draft construction, and contracts
tests/      Node built-in test suite
scripts/    Repeatable local demo
docs/       Business decision, measurement boundary, and adaptation notes
```

## Scope boundary and non-claims

- 所有 `SYN-*` record 都是虚构，只供本练习使用。
- 唯一 output 是供人检查的 draft。Package 不可发送 message、建立 ticket、读取 account、退款、更新 record 或调用 model。
- 本地 test pass 只表示这个固定 synthetic exercise 可重跑；不代表 answer quality、safety performance、review-time saving、business impact、data permission、privacy approval、security approval、production readiness，或适合使用 live data。
- 未经 authorised owner 另外确认 data permission、privacy/security review、human reviewer path、manual baseline、metric definition、monitoring 与 release decision 前，不要把 fixture 换成真实 material。
