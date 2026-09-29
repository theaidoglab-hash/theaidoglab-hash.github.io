# PolicyPilot：本地合成作品集参考实现

[English](README.md) · [繁體中文（香港）](README.zh-HK.md) · [繁體中文（台灣）](README.zh-TW.md)

> **状态：合成、本地作品集参考。** 这不是已部署产品、真实政策服务，也不表示具备 production readiness。

PolicyPilot 展示一个可检查的政策回复草稿流程：接收一条虚构零售政策问题，只从仍然有效且已批准的合成政策中寻找证据；有足够支持才产生附来源的草稿，否则交由人工处理。它没有外部集成、客户数据、API 调用或写入权限。

重点不是展示一个通用 chatbot，而是展示一个有边界的业务流程背后需要哪些工程与交付证据：来源是否合格、只读 action contract、固定 evaluation cases、trace 隐私，以及清楚的失败处理。

## 本地运行

需要 Node.js 20 或以上；没有第三方依赖，也不需要 credential。

```powershell
# From this repository's root
npm test
npm run demo
```

`npm test` 会运行固定的合成 evaluation 和安全 assertions；`npm run demo` 会输出本地 evaluation report。两者都只是本地证据，不会部署、传送数据，也不能证明真实环境表现。

## 作品集应展示什么

| 范围 | 可检查的证据 | 不应声称的事 |
| --- | --- | --- |
| 业务问题 | 需要由现行已批准政策支持的客服草稿流程 | 真实公司、真实政策、KPI 或已上线流程 |
| 技术 | keyword baseline、有效期／状态筛选、政策 ID 和版本引用 | 语义搜索、RAG 或 LLM 准确度 |
| 风险与交付 | 只读 action contract；不支持、过期、越权或 injection 都 handoff | 单靠程序已让外部系统安全 |
| Evaluation | 五个固定合成 cases；route、citation、无外部动作和 trace 隐私 hard gates | production coverage、benchmark、成本节省或业务成果 |

完整说明请看英文版 [demonstration map](docs/demonstration-map.md)：当中分开列出业务问题、技术展示、非技术交付／风险展示、端到端流程、测试证据和不作出的声称。

## 可选模型位置：仅为 mock

[`src/responses-api-fixture.mjs`](src/responses-api-fixture.mjs) 是标示为 `mock_only_not_executed` 的静态 request-shape fixture，用于讨论未来在另行批准的实验中，`gpt-5-mini` Responses API 可以放在哪一层。

它不是 integration：不 import SDK、不读取环境变量、不含 credential、不调用网络，也不产生 model output。现有 baseline 和 tests 不依赖它。它只参考 [GPT-5 mini model page](https://developers.openai.com/api/docs/models/gpt-5-mini) 和 [Responses API reference](https://developers.openai.com/api/reference/cli/resources/responses/methods/create) 的 request fields，不代表 API 可用性、表现、成本、延迟或安全性。

## 延伸时应保留的原则

不要只加入 key 和 network call 就当作完成。真实系统还需要另外审阅数据权限、来源治理、evaluation set、model／prompt 实验、外部动作权限、人工批准、监控、事件处理、隐私、安全和 release controls；这些全部不在本参考实现的声称范围内。

若要改造成自己的作品，先定义业务决策、只使用已授权数据、在实现前写负面 cases、清楚列出 action authority，并记录 tests 没有证明什么。

## 授权

本地草稿附有 [MIT License](LICENSE)。在公开 fork 或建立 public repository 前，请自行确认代码拥有权、第三方材料、雇佣责任和外部发布权限。
