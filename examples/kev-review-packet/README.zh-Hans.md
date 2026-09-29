# KEV Review Packet

[English](README.md) · [繁體中文（香港）](README.zh-HK.md) · [繁體中文（台灣）](README.zh-TW.md)

> **状态：仅供本机、固定 fixture 的 portfolio reference。** 这不是已部署产品、漏洞管理系统、CISA live integration，也不表示已经可以用于 production。

这个示例展示如何把一条范围很小的公开 CISA KEV 漏洞记录，整理成可审阅的 evidence packet，而不是假装知道某个组织的资产、暴露情况、patch 状态、期限或业务影响。虚构的 security assurance reviewer 最多只能得到 source-grounded packet 或 `SOURCE_REJECTED`；没有第三种结果，也没有外部操作。

它不是「AI security chatbot」演示。可以检查的重点包括 source receipt、public-field allowlist、schema checks、rejection routes、no-action contract、fixed evaluation cases、Evidence Delta、release gate 和 rollback boundary。

## 在本机开始

需要 Node.js 20 或更高版本。这个 package 没有 dependency，也不需要 credential。

```powershell
# From this repository's root
npm test
npm run fixture:validate
npm run demo
npm run eval:diff
```

四个命令只使用 repo 内的本机文件：不会下载 CISA data、不会调用 model 或 Promptfoo、不会读取 credential、扫描 network、匹配 asset、patch system、创建 ticket、发送消息或 deploy。

## 公开数据路线与这个 repo 的实际范围

固定 fixture 的 source receipt 记录了以后可单独批准的公开数据路线：

| Source | 记录原因 | 这个 repo 没有声称的事 |
| --- | --- | --- |
| [CISA KEV Catalog](https://www.cisa.gov/known-exploited-vulnerabilities-catalog) 与 [canonical JSON feed](https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json) | 以后独立设计 acquisition 时可使用的 canonical route | 没有声称数据已下载、最新、完整或可以直接用于真实 workflow |
| [官方 CISA KEV schema repo](https://github.com/cisagov/kev-data/blob/develop/known_exploited_vulnerabilities_schema.json) | 限制 fixture field set 的公开 schema reference | 没有声称已经验证所有 live catalog 更新 |
| [CISA KEV CC0 license](https://www.cisa.gov/sites/default/files/licenses/kev/license.txt) | 公开数据路线的 licence receipt | 不是针对特定组织情境的法律意见 |
| [ACSC patch guidance](https://www.cyber.gov.au/sites/default/files/2025-03/Patching%20applications%20and%20operating%20systems%20%28November%202023%29.pdf) | 澳洲 operational context | CISA `dueDate` 不会因此成为澳洲 SLA、当地期限或 remediation instruction |

附带的数据是小型固定 teaching fixture，只包含允许的 public KEV fields。manifest 明确标为 `fixture_not_live_acquired`；它不是下载的 snapshot、当前 catalog 的声明、asset finding，也不是任何组织的结论。

## Workflow

```text
固定 public-field KEV record + fixture source receipt
  -> 拒绝 private、operational、stale、malformed、injected 或 action-seeking input
  -> 验证 allowlisted schema fields 与 source receipt
  -> EVIDENCE_PACKET_READY 或 SOURCE_REJECTED
  -> no-action result + privacy-minimised trace
  -> fixed local tests、Evidence Delta 与 human release gate
```

成功的 packet 只复制 public catalog fields 和 source prose，并将 source prose 当作 data，不当作 instruction。例如 fixture 的 `requiredAction` 会保留为证据，但 code 无法替人 apply update。`Known` 与 `Unknown` ransomware-use 会原样保留；`Unknown` 不会被改写成「没有 ransomware use」。

## 技术证据与非技术／业务证据

| 类别 | 可检查内容 | 对 portfolio 的意义 |
| --- | --- | --- |
| 技术：source 与 schema control | [`schemas/kev-review-contract.schema.json`](schemas/kev-review-contract.schema.json)、[`src/source-validation.mjs`](src/source-validation.mjs)、[`data/source-manifest.fixture.json`](data/source-manifest.fixture.json) | 可以看到 input 只允许 public KEV fields、fixture-only manifest 和完整 source receipt |
| 技术：safety 与 action authority | [`src/action-contract.mjs`](src/action-contract.mjs)、[`src/review-packet.mjs`](src/review-packet.mjs) | 只有 packet 或 `SOURCE_REJECTED`；allowed actions 是空集合 |
| 技术：test evidence | [`test/kev-review-packet.test.mjs`](test/kev-review-packet.test.mjs)、[`src/evaluation-cases.mjs`](src/evaluation-cases.mjs) | 可在本机重跑 normal、malformed、stale、private-field、injection、action-request 和 ambiguous-asset case |
| 技术：change evidence | [`scripts/eval-diff.mjs`](scripts/eval-diff.mjs)、[`docs/evidence-delta-change-001.md`](docs/evidence-delta-change-001.md) | 逐 case 显示 regression，而不是用单一总分掩盖问题 |
| 非技术／业务：workflow ownership | [`docs/demonstration-map.md`](docs/demonstration-map.md) | public catalog evidence 只是虚构人工 assurance review 的 input，不是 asset 或 remediation decision |
| 非技术／业务：release discipline | [`docs/release-gate.md`](docs/release-gate.md)、[`docs/decision-log.md`](docs/decision-log.md)、[`docs/rollback.md`](docs/rollback.md) | 展示谁需要决策、还缺少什么证据，以及 unsafe extension 如何停止 |

## Fixed evaluation set

本机 test suite 有十个小而明确的 case：

1. normal complete public record；
2. `Known` ransomware use 原样保留；
3. `Unknown` 原样保留，不做过度推论；
4. malformed CVE；
5. missing required field；
6. stale fixture snapshot；
7. prohibited private field；
8. injection wrapper；
9. action request；
10. ambiguous asset claim。

测试会检查 route、reason code、action authority、trace minimisation、ransomware value preservation、source receipt、static model fixture 和 illustrative Evidence Delta。PASS 只表示 fixed local fixture 符合自己的 contract；不衡量 live model、live data、任何组织的 security，或实际业务成果。

## Optional model 与 Promptfoo layer

[`src/responses-api-fixture.mjs`](src/responses-api-fixture.mjs) 是完全静态、不可执行的 `gpt-5-mini` Responses API request shape。它使用 `store: false`，但没有 SDK import、credential、network call 或 model output。它仅用于讨论未来模型边界，不是 OpenAI integration。request shape 参考 [GPT-5 mini docs](https://developers.openai.com/api/docs/models/gpt-5-mini) 和 [Responses API reference](https://developers.openai.com/api/reference/cli/resources/responses/methods/create)。

两份 Promptfoo config 让 evaluation design 可被审阅，但不会让 model 成为 core demo：

- [`evals/promptfoo.fixture.yaml`](evals/promptfoo.fixture.yaml) 使用 local deterministic JavaScript provider，没有 credential，也不会 access network。读者如果另行安装 Promptfoo，可以自行执行三个 fixture case；package scripts 和 CI 不会执行它。
- [`evals/promptfoo.responses.optional.yaml`](evals/promptfoo.responses.optional.yaml) 是可选的 `openai:responses:gpt-5-mini` config，含 `store: false` 和 strict response schema，但没有 key，package scripts 和 CI 不会执行。真正 experiment 仍需要独立的 approved credential、data handling review、representative evaluation set、human decision owner 和 release gate。

## Change、release 与 rollback evidence

`CHANGE-001` 把一条质量要求写清楚：source value `Unknown` 必须保持 `Unknown`。这个命令只比较 fixture-only before/after report：

```powershell
npm run eval:diff
```

只有两份 fixture report 的 fixture、source manifest、case set、action contract 和 evaluation protocol 都一致，结果才可以是 `NO_DECLARED_REGRESSION`；否则会停在 `COMPARISON_NOT_COMPARABLE`。两个结果都不是 release approval。调整这个 pattern 前，请一起阅读 [Evidence Delta](docs/evidence-delta-change-001.md)、[decision log](docs/decision-log.md)、[release gate](docs/release-gate.md) 和 [rollback plan](docs/rollback.md)。

## Non-claims

- 没有下载、查询或验证 live CISA feed。
- test、demo、CI 和 local Promptfoo fixture provider 都没有进行 CISA data acquisition。
- 没有 OpenAI API call、model response、Promptfoo run、credential read、cost、latency、quality 或 safety performance result。
- 没有 private、client、contact、network、inventory、asset、scan、patch、ticket、message、incident 或 business data。
- 没有声称 asset exposure、remediation priority、patch recommendation、Australian SLA、compliance result、security posture、production readiness、deployment 或 business outcome。

## License

这个本机 repo draft 包含 [MIT License](LICENSE)。公开 fork 或连接 live service 前，请自行确认 code ownership、third-party material、data terms、雇佣义务、security review 和 external-release authority。
