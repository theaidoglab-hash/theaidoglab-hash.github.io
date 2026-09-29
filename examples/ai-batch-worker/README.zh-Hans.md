# AI 批处理工作器参考实现

[English](README.md) · [繁體中文（香港）](README.zh-HK.md) · [繁體中文（台灣）](README.zh-TW.md)

> **状态：合成数据、本地作品集参考实现。** 它不是已部署的 worker、真实 queue、live model integration，也不代表已经具备 production readiness。

本项目以虚构场景演示：如何为一批内部文档生成待人工审核的补充结果，同时避免同一文档版本被重复处理、避免无限重试永久错误，并在预设的合成成本上限前停止。输出只是**供人工审核的合成 enrichment record**，不会修改任何文档或外部系统。

它刻意是 **serial** 示范：`maxItemsPerRun` 只限制一次 invocation 的本地 fixture attempt，`maxQueuedJobs` 只限制 pending item；没有 concurrent worker、requests-per-time-window limiter、provider `Retry-After` handling 或 rate-limit enforcement。

## 本地运行

需要 Node.js 20 或更高版本。没有第三方依赖、credential、环境变量、网络调用或安装步骤。

```powershell
# From this repository's root
npm test
npm run demo
npm run demo -- --json
```

这些命令只会运行固定的合成测试并打印本地演示摘要；`npm run demo -- --json` 对应可重跑的 [`artifacts/run-report.json`](artifacts/run-report.json)。它们不会 deploy、发送文档、创建真实 queue、调用 model、花钱或证明商业效果。

## 这个作品集可以检查什么

| 能力 | 可检查证据 | 不作出的声明 |
| --- | --- | --- |
| Serial queue 与 invocation cap | `maxQueuedJobs` 限制 pending item，`maxItemsPerRun` 限制一次 serial fixture attempt。 | 这不是 distributed queue、concurrency control 或 rate limiter。 |
| Idempotency | pending duplicate 是 `duplicate_suppressed`；有非空 key 的 completed 或 dead-letter record 则是 `terminal_duplicate_suppressed`。 | 不证明真实 broker 或 database 的 exactly-once delivery。 |
| Retry | 固定的 HTTP 429 和 timeout fixture 会进入分类重试、指数 backoff 和确定性 jitter。 | 不代表真实 provider SLA 或 reliability。 |
| Checkpoint / resume | Pending retry work 会保存到可序列化 checkpoint，并在可重试时间后 resume。 | 不证明 durable storage 或 disaster recovery。 |
| Dead letter | Invalid input 和 queue overflow 会进入可检查的 dead-letter route。 | 没有真实处理团队或 ticket system。 |
| Cost stop | 下一次尝试超过 `maxCostCents` 前会停止，工作仍留在 checkpoint。 | 合成 cents 不是 API bill 或已批准 budget。 |
| Trace | 每个 event 有 `runId`、稳定 job-level `corr-*` trace 和独立 `attempt-*` ID，audit event 不含文档正文。 | 这不是完整 privacy 或 audit program。 |

完整的技术、非技术交付、测试、workflow 和不作声明划分，请参阅英文 [demonstration map](docs/demonstration-map.md)。

可直接检查的固定 artefact 是 [`artifacts/run-report.json`](artifacts/run-report.json) 和 [`artifacts/dead-letter-fixture.json`](artifacts/dead-letter-fixture.json)；后者展示 retry exhaustion 后不能重复花费。

## 不会执行的 GPT-5 mini Responses API 示范接口

`src/responses-api-gpt-5-mini-adapter.mjs` 只是一个标记为 `mock_only_not_executed` 的 frozen request shape。它没有被 worker import，不会读取 key 或环境变量，不包含 SDK、authorization header 或网络调用，也不会产生 model output。实际可执行流程只读取固定的本地 fixture outcome。

因此它不是 API integration，也不证明 model quality、成本、延迟、安全性、兼容性或未来使用权限。

## 限制和下一步

请把它看作工程判断的作品集证据，而不是 production system：先展示 pending／terminal duplicate、429、timeout、invalid input、cost stop 和 checkpoint resume，再清楚说明真实服务仍需要授权数据、durable storage、concurrency 与 rate control、monitoring、incident response、隐私／安全审查、人工流程和正式 release approval。

本项目不使用任何真人、真实文档、客户、公司、API account 或 credential，也不会执行外部动作、声明商业效果或保证求职结果。

## 授权

使用 [MIT License](LICENSE)。在公开 fork 或 repository 前，请先确认 code ownership、第三方材料、雇佣责任、数据权限和发布授权。
