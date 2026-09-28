# PolicyPilot Starter（简体中文）

这是给读者阅读的简体中文入口页。代码、文件名、command、测试名称与 runtime string 保持英文，便于 reviewer 重跑；如需核对原始技术文字，请阅读 [English README](README.md)。

状态：读者自行持有的本地练习。这个 package 只含虚构 policy record；它是 portfolio starter，不是 production policy service。

这个小 project 只回答一个有范围的问题：

> Support reviewer 能否收到一份由当前、已批准的 synthetic rule 支持的 draft，还是这个 case 必须停止并交给人复核？

这个 starter 不会尝试建立通用 support chatbot。它把 source rule、decision authority、negative case 与限制写清楚。没有有效 source 的流畅答案不算成功。

## 在本地运行

需要 Node.js 20 或以上。它没有 third-party dependency、environment variable、credential、network call 或 install step，也不会执行 model call。

先解压下载文件。然后在解压后、包含本 `README.md` 和 `package.json` 的文件夹打开终端，再运行：

```powershell
npm test
npm run demo
```

`npm test` 会检查：一份引用当前 source 的 draft、没有支持的问题、已被替代的 rule、超出范围的 action、instruction-override attempt、non-synthetic corpus、static model seam，以及 local Promptfoo provider。

`npm run demo` 会打印 [`expected-output.json`](expected-output.json) 记录的确切 report。

## 这个示例实际检查什么

Demo 问的是：一把未使用的 synthetic demonstration keyboard，在送达 14 天后能否考虑退货。它会产生一份引用 `SYN-POL-RET-100 v2` 的 draft。

同一个 query 也会匹配到 `SYN-POL-RET-100 v1`，但这条 record 已被替代。Trace 会把它记为 rejected，而不把它当作 current source。要求使用 2025 rule、没有足够支持的问题、action request，或企图覆盖 policy boundary，都会变成 human handoff 或 blocked operation。

五个已记录 case 只有同时满足以下条件才算 pass：

| Check | 五个已记录 case 的结果 | 范围 |
| --- | --- | --- |
| Route and reason code | 5 个已声明 case 全部 match | 很小的虚构 evaluation set |
| Citation reference | 5 个已声明 case 全部 match | 只接受 current policy ID/version |
| External actions | 观察到 0 次 | Package 没有 action integration |
| Human review | 每条 route 都必须有 | Draft 不会自行决定或行动 |
| Trace 里的 raw fixture question | 观察到 0 次 | Trace 改存 hash 与 metadata |

这些只是这个小练习的特性，并不是 service-level、model、security、privacy、revenue、customer、productivity 或 business-impact 结果。

## Reviewer 可以检查什么

| Evidence area | 这个 package 展示什么 | 它不会声称什么 |
| --- | --- | --- |
| Business framing | 一个有范围的 policy-draft decision、manual baseline、named owner 与 non-goal | 真实 organisation、workflow、KPI 或 user problem |
| Source control | Synthetic ID、version、status、effective date，以及明确 reject stale/draft record 的做法 | 真实 policy corpus 或完整 retrieval coverage |
| Technical baseline | 在选 model 前先做 deterministic keyword matching | Semantic-search、RAG 或 LLM quality |
| Safety and authority | Read-only action contract、block 超出范围的 request 与 human handoff | 单靠 code 就能让 live system 安全 |
| Evaluation | Fixed positive/negative case、已记录 demo 与 Node test | 超出五个虚构 case 的 generalisation |
| Delivery practice | Decision、metric、failure、review、rollback 与 adaptation record | Operational approval、deployment、monitoring 或 incident response |

## Package map

```text
data/       Versioned synthetic policy corpus and demo requests
src/        Validation, retrieval baseline, routing, evaluation, and static model seam
tests/      Node built-in test suite
scripts/    Repeatable local demo
evals/      Optional local Promptfoo fixture configuration
docs/       Business decision, metrics, failure, review, rollback, and adaptation records
```

调整 fixture 前，请先阅读：

- [Decision brief](docs/decision-brief.md)
- [Metric map](docs/metric-map.md)
- [Failure cases](docs/failure-cases.md)
- [Reviewer decision template](docs/reviewer-decision.md)
- [Rollback record](docs/rollback-record.md)
- [Adaptation worksheet](docs/adaptation-worksheet.md)
- [Future model seam](docs/future-model-seam.md)

## 可选：运行 Promptfoo fixture

[`evals/promptfoo.fixture.yaml`](evals/promptfoo.fixture.yaml) 是可供 reviewer 检查的 Promptfoo fixture configuration。它的 provider 只会调用这个 package 的 deterministic local route。它不在 `package.json` script 内，因此基础的 `npm test` 和 `npm run demo` 路径仍不需要 dependency、key 或 model。

如果想用 Promptfoo 检查同一组三个 fixed cases，这个可选 command 才需要 Node.js 22.22 或以上。它会锁定 Promptfoo `0.123.1`，并将 exported result 写入已 ignore 的 `results/`：

```powershell
npx --yes promptfoo@0.123.1 eval -c evals/promptfoo.fixture.yaml -o results/promptfoo.fixture.json
```

`npm test` 会检查已提交的 configuration 和 local provider，但不会执行 Promptfoo，不能当成已经记录的 Promptfoo pass。只有实际跑完上面的可选 command，才会有本地 Promptfoo result。

如果本机没有 cache，`npx` 可能需要从 package registry 下载已锁定的工具。fixture provider 本身不会读取 credential、call model 或 API，也不会使用 business data。那个 result 只表示三个本地 fixed cases 可以重跑，不是 live-model result 或 production evidence。

## Future-model boundary

[`src/responses-api-fixture.mjs`](src/responses-api-fixture.mjs) 是一份 static `gpt-5-mini` Responses API shape。它标示自己为 `design_note_only_not_executed`，没有 key、provider setup、SDK、request、response 或 model output。它只用来说明未来 experiment 应放在哪一层，不能用来宣称 experiment 已经发生。

## Scope boundary

- 每条 `SYN-POL-*` record 与每个 result 都是为本练习而虚构。
- 唯一允许的 output 是附 citation 的 draft，或交给人检查的 handoff。
- Package 不会联系 customer、读取 account、修改 order、建立 case、退款、收款，或向任何地方发送 request。
- 本地 test pass 只表示这个特定 synthetic exercise 可重跑；不代表 model quality、business impact、security、privacy approval、production readiness，或适合使用 live data。
- 未经 authorised owner 另外确认 data permission、source governance、privacy/security review、point-in-time availability、baseline、success measure、monitoring、incident path 与 release decision 前，不要把 fixture 换成真实 record。
