# KEV Review Packet

[English](README.md) · [繁體中文（香港）](README.zh-HK.md) · [简体中文](README.zh-Hans.md)

> **狀態：僅供本機、固定 fixture 的 portfolio reference。** 這不是已部署產品、漏洞管理系統、CISA live integration，也不代表已可在 production 使用。

這個範例示範如何把一筆範圍很小的公開 CISA KEV 漏洞紀錄，整理成可審閱的 evidence packet，而不是假裝知道某個組織的資產、曝露情況、patch 狀態、期限或業務影響。虛構的 security assurance reviewer 最多只會取得 source-grounded packet 或 `SOURCE_REJECTED`；沒有第三種結果，也沒有外部操作。

它不是「AI security chatbot」展示。可檢查的重點包括 source receipt、public-field allowlist、schema checks、rejection routes、no-action contract、fixed evaluation cases、Evidence Delta、release gate 與 rollback boundary。

## 在本機執行

需要 Node.js 20 以上版本。這個 package 沒有 dependency，也不需要 credential。

```powershell
# From this repository's root
npm test
npm run fixture:validate
npm run demo
npm run eval:diff
```

四個指令只使用 repo 裡的本機檔案：不會下載 CISA data、不會呼叫 model 或 Promptfoo、不會讀取 credential、掃描 network、比對 asset、patch system、建立 ticket、傳送訊息或 deploy。

## 公開資料路線與這個 repo 的實際範圍

固定 fixture 的 source receipt 記錄了日後可另行核准的公開資料路線：

| Source | 記錄原因 | 這個 repo 沒有聲稱的事 |
| --- | --- | --- |
| [CISA KEV Catalog](https://www.cisa.gov/known-exploited-vulnerabilities-catalog) 與 [canonical JSON feed](https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json) | 日後獨立設計 acquisition 時可用的 canonical route | 沒有聲稱資料已下載、最新、完整或可直接用於真實 workflow |
| [官方 CISA KEV schema repo](https://github.com/cisagov/kev-data/blob/develop/known_exploited_vulnerabilities_schema.json) | 限制 fixture field set 的公開 schema reference | 沒有聲稱已驗證所有 live catalog 更新 |
| [CISA KEV CC0 license](https://www.cisa.gov/sites/default/files/licenses/kev/license.txt) | 公開資料路線的 licence receipt | 不是針對特定組織情境的法律意見 |
| [ACSC patch guidance](https://www.cyber.gov.au/sites/default/files/2025-03/Patching%20applications%20and%20operating%20systems%20%28November%202023%29.pdf) | 澳洲 operational context | CISA `dueDate` 不會因此成為澳洲 SLA、在地期限或 remediation instruction |

附帶的資料是小型固定 teaching fixture，只含允許的 public KEV fields。manifest 明確標為 `fixture_not_live_acquired`；它不是下載的 snapshot、當前 catalog 的宣稱、asset finding，也不是關於任何組織的結論。

## Workflow

```text
固定 public-field KEV record + fixture source receipt
  -> 拒絕 private、operational、stale、malformed、injected 或 action-seeking input
  -> 驗證 allowlisted schema fields 與 source receipt
  -> EVIDENCE_PACKET_READY 或 SOURCE_REJECTED
  -> no-action result + privacy-minimised trace
  -> fixed local tests、Evidence Delta 與 human release gate
```

成功的 packet 只複製 public catalog fields 與 source prose，並將 source prose 視為 data，不視為 instruction。例如 fixture 的 `requiredAction` 會保留為證據，但 code 無法替人 apply update。`Known` 與 `Unknown` ransomware-use 會完整保留；`Unknown` 不會被轉成「沒有 ransomware use」。

## 技術證據與非技術／業務證據

| 類別 | 可檢查項目 | 對 portfolio 的意義 |
| --- | --- | --- |
| 技術：source 與 schema control | [`schemas/kev-review-contract.schema.json`](schemas/kev-review-contract.schema.json)、[`src/source-validation.mjs`](src/source-validation.mjs)、[`data/source-manifest.fixture.json`](data/source-manifest.fixture.json) | 看得到 input 僅允許 public KEV fields、fixture-only manifest 與完整 source receipt |
| 技術：safety 與 action authority | [`src/action-contract.mjs`](src/action-contract.mjs)、[`src/review-packet.mjs`](src/review-packet.mjs) | 只有 packet 或 `SOURCE_REJECTED`；allowed actions 是空集合 |
| 技術：test evidence | [`test/kev-review-packet.test.mjs`](test/kev-review-packet.test.mjs)、[`src/evaluation-cases.mjs`](src/evaluation-cases.mjs) | 可在本機重跑 normal、malformed、stale、private-field、injection、action-request 與 ambiguous-asset case |
| 技術：change evidence | [`scripts/eval-diff.mjs`](scripts/eval-diff.mjs)、[`docs/evidence-delta-change-001.md`](docs/evidence-delta-change-001.md) | 逐 case 顯示 regression，而不是用單一總分掩蓋問題 |
| 非技術／業務：workflow ownership | [`docs/demonstration-map.md`](docs/demonstration-map.md) | public catalog evidence 只是虛構人工 assurance review 的 input，不是 asset 或 remediation decision |
| 非技術／業務：release discipline | [`docs/release-gate.md`](docs/release-gate.md)、[`docs/decision-log.md`](docs/decision-log.md)、[`docs/rollback.md`](docs/rollback.md) | 呈現誰需要決策、還缺少什麼證據，以及 unsafe extension 如何停止 |

## Fixed evaluation set

本機 test suite 有十個小而明確的 case：

1. normal complete public record；
2. `Known` ransomware use 原樣保留；
3. `Unknown` 原樣保留，沒有過度推論；
4. malformed CVE；
5. missing required field；
6. stale fixture snapshot；
7. prohibited private field；
8. injection wrapper；
9. action request；
10. ambiguous asset claim。

測試檢查 route、reason code、action authority、trace minimisation、ransomware value preservation、source receipt、static model fixture 與 illustrative Evidence Delta。PASS 僅代表 fixed local fixture 符合自己的 contract；不衡量 live model、live data、任何組織的 security，或實際業務成果。

## Optional model 與 Promptfoo layer

[`src/responses-api-fixture.mjs`](src/responses-api-fixture.mjs) 是完全靜態、不可執行的 `gpt-5-mini` Responses API request shape。它使用 `store: false`，但沒有 SDK import、credential、network call 或 model output。它僅用於討論未來的模型界線，不是 OpenAI integration。request shape 參考 [GPT-5 mini docs](https://developers.openai.com/api/docs/models/gpt-5-mini) 與 [Responses API reference](https://developers.openai.com/api/reference/cli/resources/responses/methods/create)。

兩份 Promptfoo config 讓 evaluation design 可被審閱，但不會讓 model 成為 core demo：

- [`evals/promptfoo.fixture.yaml`](evals/promptfoo.fixture.yaml) 使用 local deterministic JavaScript provider，沒有 credential，也不會 access network。讀者若另行安裝 Promptfoo，可以自行執行三個 fixture case；package scripts 與 CI 不會執行它。
- [`evals/promptfoo.responses.optional.yaml`](evals/promptfoo.responses.optional.yaml) 是可選的 `openai:responses:gpt-5-mini` config，含 `store: false` 和 strict response schema，但沒有 key，package scripts 與 CI 不會執行。真正 experiment 仍需要獨立的 approved credential、data handling review、representative evaluation set、human decision owner 與 release gate。

## Change、release 與 rollback evidence

`CHANGE-001` 將一條品質要求寫清楚：source value `Unknown` 必須維持 `Unknown`。這個指令只比較 fixture-only before/after report：

```powershell
npm run eval:diff
```

只有兩份 fixture report 的 fixture、source manifest、case set、action contract 和 evaluation protocol 都一致，結果才可以是 `NO_DECLARED_REGRESSION`；否則會停在 `COMPARISON_NOT_COMPARABLE`。兩個結果都不是 release approval。調整這個 pattern 前，請一起閱讀 [Evidence Delta](docs/evidence-delta-change-001.md)、[decision log](docs/decision-log.md)、[release gate](docs/release-gate.md) 與 [rollback plan](docs/rollback.md)。

## Non-claims

- 沒有下載、查詢或驗證 live CISA feed。
- test、demo、CI 與 local Promptfoo fixture provider 都沒有進行 CISA data acquisition。
- 沒有 OpenAI API call、model response、Promptfoo run、credential read、cost、latency、quality 或 safety performance result。
- 沒有 private、client、contact、network、inventory、asset、scan、patch、ticket、message、incident 或 business data。
- 沒有聲稱 asset exposure、remediation priority、patch recommendation、Australian SLA、compliance result、security posture、production readiness、deployment 或 business outcome。

## License

此本機 repo draft 包含 [MIT License](LICENSE)。公開 fork 或連接 live service 前，請自行確認 code ownership、third-party material、data terms、雇用義務、security review 與 external-release authority。
