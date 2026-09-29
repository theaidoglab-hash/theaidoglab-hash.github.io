# 续约分流参考实现

> 一个完全合成、只在本机运行的决策支持流程：演示在有限人工审核名额下，通用风险排序指标更高，仍不足以批准候选队列。

[English](README.md) · [繁體中文（香港）](README.zh-HK.md) · [繁體中文（台灣）](README.zh-TW.md) · [简体中文](README.zh-Hans.md)

## 作品集定位

这是一个可公开展示、可独立运行的作品集 reference，不是 production 系统。它以小型、可版本化的合成数据模拟企业式续约审核流程。示例经过刻意设计：candidate 的 average precision 更高，但在固定审核容量下，offline synthetic queue utility 更低，因此 release gate 会阻止 candidate。

这个负面结果是设计目标，说明预测排序、商业价值、人力容量、决策权限和结果衡量必须分别验证。

## 在本机运行

需要 Node.js 20 或更高版本。没有第三方 runtime dependency、环境变量或安装步骤。

```powershell
# 在这个 repository 的 root 运行
npm test
npm run demo
```

固定的合成结果为：baseline 的 average precision 为 `0.8762`，candidate 为 `1`；baseline 的 queue utility 为 `33`，candidate 为 `1` 个 synthetic units；candidate 的 release gate 为 `BLOCKED`；monitoring 结果为 `ROLLBACK_REQUIRED`，只提出需要人工批准的 rollback proposal。

被 gate 阻止是安全检查正常工作的证据，不是部署失败、真实商业结果或留存效果声明。

## 边界

- 所有 `SYN-*` 记录都是作者手写的合成数据，没有真实客户、账户、联系资料、公司系统或凭据。
- 流程只在本机运行，不会发出网络请求或调用外部 API。
- 队列只会产生 `human_review_only` 草稿；不会自动联系、修改账户或价格，也不会作出续约决定。
- 分数是透明的合成排序，并非已训练或校准的 production model，也不是对个别对象的行动建议。
- offline synthetic utility 只会在合成 outcome 出现后计算；它不是收入、留存、干预效果或因果影响的证据。

## 文档

- [English problem brief](docs/brief.md)：虚构决策、时间边界、人工容量、baseline/candidate 对比和停止条件。
- [English demonstration map](docs/demonstration-map.md)：完整列出商业价值、技术实现、交付与风险控制、端到端流程、测试证据和明确不作的声明。
- [English portfolio tutorial](docs/portfolio-tutorial.md)：从有限决策、point-in-time data、baseline 对比、capacity-aware evaluation，一步步走到本地 release gate 的构建顺序。
- [English pilot measurement map](docs/pilot-measurement-map.md)：日后若有授权 team，讨论真实 pilot 前仍需补上的独立证据。
- [MIT License](LICENSE)
- [English README](README.md) · [繁體中文（香港）](README.zh-HK.md) · [繁體中文（台灣）](README.zh-TW.md)

除 README 翻译外，技术文档、源代码、合成数据、测试文字和 runtime output 一律使用英文。
