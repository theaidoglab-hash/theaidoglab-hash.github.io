# 合成 FAQ 审批队列

[English](README.md) | [繁體中文（香港）](README.zh-HK.md) | [繁體中文（台灣）](README.zh-TW.md) | [简体中文](README.zh-Hans.md)

这是一个可独立查看、完全在本地运行的作品集参考实现，用于演示一个必须由人工审批的 FAQ 草稿流程。它刻意聚焦于可测试的失败路径和决策边界，不会处理真人、真实政策或外部系统。

## 状态与安全边界

此项目完全在本地运行，只使用合成数据、只读模式和确定性逻辑。它不会连接模型、API、网络、客户账户、支付系统、电子邮件服务或工单系统，也不能发送消息、创建工单、退款、查看账户或修改任何记录。

每个输出都只是**供人工审核的草稿**，绝不是面向客户的回复。本地 action contract 的 `allowedActions` 始终是空数组，而每条路径都需要人工审核者。

## 商业问题与作品集价值

运营团队可能会反复收到 FAQ 问题，但一个答案仍可能错误、缺乏依据、已经过时、不安全，或不适合该提问者。此参考实现要展示的商业问题不是“生成文本”，而是如何在保留人工决策点的前提下，生成可审核、附有证据链接的 FAQ 草稿。

该流程特意设计为可逆：

1. 接收一条合成 FAQ 问题及可选的请求动作。
2. 在检索前阻止任何要求外部动作的请求。
3. 将提示注入尝试或没有支持的问题转交人工处理。
4. 只检索当前有效、已批准的虚构 FAQ 条目。
5. 生成附有清晰引用的确定性草稿。
6. 要求人工批准，并记录保护隐私的本地 trace。
7. 在修改实现前运行固定的 regression tests。

有关技术、商业、交付、风险以及不作声明的证据划分，请参阅英文版 [demonstration map](docs/demonstration-map.md)。

## 在本地运行

需要 Node.js 20 或更高版本。没有第三方依赖，也不需要环境变量。

```powershell
# From this repository's root
npm test
npm run demo
```

Demo 只会输出合成的路径决定和引用，不会创建文件或执行外部动作。内置的 GitHub Actions workflow 会在 Node.js 20 上运行相同两条命令。

## 路径与停止条件

| 路径 | 触发条件 | 输出 |
| --- | --- | --- |
| `draft_for_human_approval` | 当前有效且已批准的 FAQ 条目足以支持问题 | 附引用的草稿；仍需要人工批准。 |
| `handoff` | 没有支持问题的 FAQ、提示注入、无效输入或 mock 失败 | 不会把草稿作为答案提供。 |
| `blocked` | 请求或问题内含会修改外部系统的动作 | 不会尝试检索或执行动作。 |

## 项目内容

| 路径 | 用途 |
| --- | --- |
| `src/contracts.mjs` | 验证合成输入，并定义不执行动作的 contract。 |
| `src/safety.mjs` | 安全处理动作请求和提示注入尝试。 |
| `src/retrieval.mjs` | 只选取当前有效、已批准的虚构 FAQ 条目。 |
| `src/mock-response.mjs` | 生成确定性的本地草稿；它不是 LLM 调用。 |
| `src/approval-queue.mjs` | 组织安全检查、检索、草稿、trace 与审批状态。 |
| `data/` | 保存虚构 FAQ 内容和示范用的 request fixture。 |
| `test/` | 保存合成、确定性的 regression tests。 |
| `docs/demonstration-map.md` | 清楚区分作品集证据和本项目不作出的声明。 |

## 不会执行的 Responses API fixture

`data/responses-api-gpt-5-mini.fixture.json` 是一个展示 Responses API request 形状、并标明 `gpt-5-mini` 的**不会执行的 fixture**。它不是 live call，也不是 runtime workflow 的一部分：

- 不含任何 credential 或 secret；
- runtime 不会读取、import 或发送它；regression test 只会读取这个 static file，核对这条边界；
- 它的 `network` 字段是 `disabled`；
- 实现始终使用 `src/mock-response.mjs`。

此 fixture 只能用于讨论未来一个必须另行批准的 integration 会如何被规范化。它不证明 API 兼容性、模型质量、成本、安全性，也不代表已获准连接真实系统。

## 刻意保留的限制与不作声明

- 检索只使用简单 keyword overlap，并非 semantic search。
- mock 没有语言理解能力，不能替代模型。
- FAQ corpus、cases 和 traces 都是虚构并只存在于本地。
- 不会接收真实客户数据、真实政策、账户、动作或 API request。
- 项目不声明能提升生产力、质量、收入、安全性或任何商业成果。
- tests 只是小型合成 regression checks，并非 production evaluation metrics。
- 没有 deployment configuration。

`package.json` 故意保持 private，以避免意外发布到 npm registry。该设置不会决定 source repository 在 GitHub 是否公开。

## 许可证

使用 [MIT License](LICENSE) 授权。
