# KEV Review Packet Starter

[English source](README.md) · [繁中（香港）](README.zh-HK.md) · [繁中（台湾）](README.zh-TW.md)

状态：由读者自行持有的本地练习。这个 package 中每一笔 record 都是虚构；它是 portfolio starter，不是 vulnerability-management system、live catalog integration，也不是关于任何 organisation 的 finding。

这个 package 只回答一个刻意收窄的问题：

> 一笔固定、模仿 public field 形状的 teaching record，能否变成给指定 human reviewer 的 review packet，还是必须拒绝 source？

code 不会 scan environment、match asset、计算 exposure、建议 patch、create ticket、send message 或 call model。它只会建立一份 read-only packet，或返回 `SOURCE_REJECTED`。

## 在本地运行

需要 Node.js 20 或以上。这个 package 没有 dependency、credential、environment variable、安装步骤、network call 或 model call。

先解压下载文件。然后在解压后、包含本 `README.md` 和 `package.json` 的文件夹打开终端，再运行：

```powershell
npm test
npm run fixture:validate
npm run demo
```

三个 command 都只使用已提交的本地 file。pass 只代表这个小型 synthetic exercise 符合已写明的 contract，不证明 live-data quality、model quality、security、remediation readiness 或 business impact。

## 这个 starter 会作的决定

```text
Synthetic public-field-shaped record + local source receipt
  -> validate fields, dates, source status, and requested operation
  -> EVIDENCE_PACKET_READY or SOURCE_REJECTED
  -> human reviewer decides what happens next
```

成功的 packet 会保留 source record 作为 evidence，但不会将 `requiredAction` 变成给 computer 的 instruction。值为 `Unknown` 就维持 `Unknown`；它绝不会变成“某件事有／没有发生”的 claim。

## Reviewer 可以核对什么

| 范围 | 可检查的内容 | 在本地可证明什么 |
| --- | --- | --- |
| Decision boundary | [`src/contracts.mjs`](src/contracts.mjs) | 不允许任何 external action，而且永远需要 human review。 |
| Input boundary | [`src/validate.mjs`](src/validate.mjs) | 只接受固定的 public-field-shaped record 与 synthetic local source receipt。 |
| Packet construction | [`src/build-review-packet.mjs`](src/build-review-packet.mjs) | 一条 deterministic packet 或 rejection route；没有 model 参与。 |
| Fixed cases | [`tests/kev-review-packet.test.mjs`](tests/kev-review-packet.test.mjs) | Normal、`Unknown`、malformed date、prohibited field、non-synthetic source 与 unsafe operation cases。 |
| Optional evaluation shape | [`evals/promptfoo.fixture.yaml`](evals/promptfoo.fixture.yaml) | 一个可由读者另行以 Promptfoo 运行的 local deterministic provider shape；package scripts 不会 invoke Promptfoo。 |
| Static-source receipt template | [`docs/reader-owned-static-source-receipt.md`](docs/reader-owned-static-source-receipt.md) | 一份由读者自行持有的空白 static copy 记录；它不是 package input，也不表示这个 starter 曾取得数据。 |
| Manual decision | [`docs/reviewer-decision.md`](docs/reviewer-decision.md) | 未来使用、source、evaluation 与 release decision 由谁拥有。 |
| Stop or rollback | [`docs/rollback-record.md`](docs/rollback-record.md) | 何时停止使用 assisted path，退回 manual review。 |

## 建议的 portfolio 解说

展示 code 前先讲清楚决定：“这个 exercise 只接受一笔本地虚构、模仿 public field 形状的 record，并将它整理成给 reviewer 的 packet。它不知道任何真实 organisation 是否受影响，也不能采取 remediation action。”

然后让 reviewer 看 record、source receipt、一个 accepted case、一个 rejected case、action boundary 与空白 decision record。这样 limits 可以被核对，而不会被一个好看的 answer 掩盖。

## 日后如果你另行保留 public static copy

下载文件附有一份空白 [`reader-owned static-source receipt`](docs/reader-owned-static-source-receipt.md)。它一开始是 `NOT_ACQUIRED`，让你日后为自行合法保留的 copy 记下 URL、terms、version、hash、field boundary、reviewer 与 stop condition。它不属于可运行 exercise：不能交给这个 starter，也不会让虚构 fixture 变成 public data。

## Package 地图

```text
data/       Synthetic record, local source receipt, and fixed case inputs
src/        Contract, input checks, packet builder, and fixed-case evaluation
tests/      Node built-in tests
scripts/    Repeatable local validation and demo commands
docs/       Decision brief、failure cases、static-source receipt template、manual reviewer record 与 rollback record
expected-output.json  Recorded successful local demo
```

## 可选：运行 Promptfoo fixture

[`evals/promptfoo.fixture.yaml`](evals/promptfoo.fixture.yaml) 指向 [`src/promptfoo-fixture-provider.mjs`](src/promptfoo-fixture-provider.mjs) 中的 deterministic local provider。它会使用这个 package 已有的 fixed cases。Promptfoo 刻意不是 package dependency，因此基础的 `npm test`、`npm run fixture:validate` 与 `npm run demo` 路径仍不需要 key 或 model。

如果想用 Promptfoo 检查这组 fixed cases，这个可选 command 才需要 Node.js 22.22 或以上。它会锁定 Promptfoo `0.123.1`，并将 exported result 写入已 ignore 的 `results/`：

```powershell
npx --yes promptfoo@0.123.1 eval -c evals/promptfoo.fixture.yaml -o results/promptfoo.fixture.json
```

核心 command 只会检查已提交的 fixed cases 和 configuration，没有一个会跑 Promptfoo，不能当成已经记录的 Promptfoo pass。只有实际跑完上面的可选 command，才会有本地 Promptfoo result。

如果本机没有 cache，`npx` 可能需要从 package registry 下载已锁定的工具。fixture provider 本身不会读取 credential、call model 或 API，也不会使用 business data。那个 result 只表示这组本地 fixed cases 可以重跑，不是 live-model result 或 production evidence。

## Future-model boundary

[`src/responses-api-fixture.mjs`](src/responses-api-fixture.mjs) 是一份静态 `gpt-5-mini` Responses API design note。它有 `store: false`，但没有 API key、SDK、provider setup、request、response 或 model output，也不会由 package scripts 使用。

## 不会声称的事

- 没有下载、query、store 或 validate 任何真实 KEV 或 CISA feed。
- 没有使用真实 CVE、vendor、asset、network、customer、contact、incident 或 business data。
- 已提交的 exercise 没有 model output、已保存的 Promptfoo result、credential、API request、external system 或 paid service。
- 没有声称 exposure、priority、patch instruction、deadline、security posture、compliance result、production readiness、deployment 或 business outcome。
- 包内的 static-source receipt 是空白 `NOT_ACQUIRED` template，不表示这个 package 曾取得 public record。
- 未经 authorised owner 另行决定 data permissions、source governance、privacy 与 security review、point-in-time availability、evaluation、monitoring、incident path 与 release authority 前，不要用真实 data 取代 fixture。

## License 与 adaptation note

这个 starter 是 internal local exercise package。发布 derivative 或连接 live service 前，请确认 code ownership、source terms、employer obligations 与 external-release authority。
