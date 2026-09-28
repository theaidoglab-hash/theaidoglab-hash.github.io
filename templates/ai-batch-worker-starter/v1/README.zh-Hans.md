# AI Batch Worker Starter

[English source](README.md) · [繁中（香港）](README.zh-HK.md) · [繁中（台湾）](README.zh-TW.md)

状态：由读者自行持有的本地练习。这个 package 只包含虚构 work item；它是 portfolio starter，不是已部署的 worker、queue、model integration 或 document system。

这个小 project 只问一个刻意收窄的问题：当一个有上限的 batch 被中断、重新送入、rate limited，或因 spending guardrail 停止时，reviewer 能否看见每一个合成 work item 发生了什么，而 worker 又不会采取任何真实 action？

唯一允许的结果是一份供人工 review 的本地 enrichment record。worker 不会更新 document、联络任何人、向账户收费、写入 external system，也不会 call model。

## 在本地运行

需要 Node.js 20 或以上。这个 package 没有 third-party dependency、environment variable、API key 或其他 credential、network call、model call，也不需要安装。

先解压下载文件。然后在解压后、包含本 `README.md` 和 `package.json` 的文件夹打开终端，再运行：

```powershell
npm test
npm run demo
```

test suite 会检查已记录的 two-run walkthrough、retry 与 resume、terminal duplicate suppression、invalid work item、budget stop、retry exhaustion、错误 fixture provenance、out-of-scope request，以及静态的 future-model seam。

demo 会打印与 `expected-output.json` 相同的 deterministic report。本地 pass 只证明这个虚构练习可以按所述方式重跑。

## 固定练习会展示什么

| 情况 | 本地行为 | 读者可核对的内容 |
| --- | --- | --- |
| First delivery | 有效的 synthetic item 会进入 queue，然后完成或被 checkpoint。 | Run ID、job trace、attempt trace 与 terminal route。 |
| Timeout | item 会保持 pending，直到计算出的 retry time。 | Retry category、deterministic backoff 与 checkpoint。 |
| Resume | 后续一次本地 invocation 只会处理合资格的 pending work。 | 同一个 idempotency key 与新的 attempt trace。 |
| Redelivery after completion | item 会在再次 attempt 或产生 synthetic cost 前被 suppress。 | Terminal duplicate route 与之前的 terminal state。 |
| Invalid work item | item 会在任何 attempt 前进入本地 dead-letter record。 | Reason code、零 attempt count 与 human-review boundary。 |
| Budget stop | pending item 会在超过 synthetic cap 前保持原状。 | Budget-stop route、未变的 attempt count 与 checkpoint。 |
| Exhausted retry | 可 retry 的 failure 会在固定上限后变成 dead letter。 | Attempt count、terminal record 与 redelivery suppression。 |

## Package 地图

| Path | 用途 |
| --- | --- |
| `data/` | 虚构 work-item 与 request fixtures。 |
| `src/` | Validation、idempotency、checkpoint、retry 与本地 routing code。 |
| `tests/` | Node built-in test suite，覆盖 success 与 failure routes。 |
| `scripts/` | 可重跑的 two-run local walkthrough。 |
| `docs/` | Decision、failure、metric、review、rollback、adaptation 与 future-model notes。 |
| `expected-output.json` | 已提交、由 local walkthrough 产生的 deterministic report。 |
| `CONTENTS.md` | 这个 starter 内每一个 file 的简明列表。 |

## Portfolio review 可以怎么讲

- 从 duplicate 或 timeout 开始，而不是只展示 happy-path answer。
- 展示 idempotency key 如何绑定一个 synthetic source revision。
- 解释 checkpoint 只是给后续一次本地 invocation 的记录，不是 durable production store 的证明。
- 在读取任何 simulated provider outcome 前，展示 cost stop。
- 指出一个 failure case、一份 manual-review record，以及一个 rollback condition。
- 将静态 `gpt-5-mini` request shape 与可执行 worker 分开。它只记录一个可能的未来 experiment；不会 call API。

## 改 code 前先看

- `docs/decision-brief.md`
- `docs/failure-cases.md`
- `docs/metric-map.md`
- `docs/manual-review-record.md`
- `docs/rollback-record.md`
- `docs/adaptation-worksheet.md`
- `docs/future-model-seam.md`

## Scope boundary 与不会声称的事

- 这个 package 内每个 work item、identifier、outcome、cost unit、timestamp 与 trace 都是虚构。
- worker 只会产生一份需要人工 review 的本地 record。
- worker 没有 credential、SDK、model request、network call、persistent queue、database、concurrent worker、external action 或真实 spending。
- 固定的 synthetic outcome 不是 provider behaviour、delivery semantics、exactly-once processing、privacy approval、security、真实 cost control、model quality、performance、business value 或 production readiness 的证明。
- 未经 authorised owner 分别确认 data permission、security 与 privacy review、retention rules、durable-storage design、retry 与 provider contracts、evaluation plan、monitoring、incident ownership 与 release decision 前，不要用真实 data 取代 fixture。
