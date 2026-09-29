# KEV Review Packet

[English](README.md) · [繁體中文（台灣）](README.zh-TW.md) · [简体中文](README.zh-Hans.md)

> **狀態：只供本機、固定 fixture 的 portfolio reference。** 這不是已部署產品、漏洞管理系統、CISA live integration，亦不代表 production ready。

這個示範的重點，是把一筆範圍非常窄的公開 CISA KEV 漏洞記錄，整理成可供人審閱的 evidence packet，而不是扮作知道某間公司的資產、暴露面、patch 狀態、deadline 或業務影響。虛構的 security assurance reviewer 最多只會收到 source-grounded packet 或 `SOURCE_REJECTED`；沒有第三條路，亦沒有外部操作。

它刻意不做「AI security chatbot」式 demo。你可以直接檢查 source receipt、public-field allowlist、schema checks、rejection routes、no-action contract、fixed evaluation cases、Evidence Delta、release gate 和 rollback boundary。

## 本機開始

需要 Node.js 20 或以上。這個 package 沒有 dependency，也不需要 credential。

```powershell
# From this repository's root
npm test
npm run fixture:validate
npm run demo
npm run eval:diff
```

四個指令都只讀取 repo 內的本機檔案：不會下載 CISA data、不會 call model 或 Promptfoo、不會讀 credential、掃 network、比對 asset、patch system、開 ticket、發訊息或 deploy。

## 真正的公開資料路線，與這個 repo 實際做的事

固定 fixture 的 source receipt 已記錄日後可另行批准的公開資料路線：

| Source | 為何記錄 | 這個 repo 不聲稱甚麼 |
| --- | --- | --- |
| [CISA KEV Catalog](https://www.cisa.gov/known-exploited-vulnerabilities-catalog) 及 [canonical JSON feed](https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json) | 日後獨立設計 acquisition 時的 canonical route | 沒有聲稱下載過、資料是最新、完整或適合真實 workflow |
| [官方 CISA KEV schema repo](https://github.com/cisagov/kev-data/blob/develop/known_exploited_vulnerabilities_schema.json) | 限制 fixture field set 的公開 schema reference | 沒有聲稱已驗證全部 live catalog 變更 |
| [CISA KEV CC0 license](https://www.cisa.gov/sites/default/files/licenses/kev/license.txt) | 公開資料路線的 licence receipt | 不是任何特定組織使用情境的法律意見 |
| [ACSC patch guidance](https://www.cyber.gov.au/sites/default/files/2025-03/Patching%20applications%20and%20operating%20systems%20%28November%202023%29.pdf) | 澳洲 operational context | CISA `dueDate` 不會因而變成澳洲 SLA、本地 deadline 或 remediation instruction |

內附的是小型、固定、只包含容許的 public KEV fields 的 teaching fixture。manifest 清楚標為 `fixture_not_live_acquired`；它不是下載回來的 snapshot、當前 catalog 的聲稱、asset finding，亦不是關於任何組織的聲稱。

## Workflow

```text
固定 public-field KEV record + fixture source receipt
  -> 拒絕 private、operational、stale、malformed、injected 或 action-seeking input
  -> 驗證 allowlisted schema fields 和 source receipt
  -> EVIDENCE_PACKET_READY 或 SOURCE_REJECTED
  -> no-action result + privacy-minimised trace
  -> fixed local tests、Evidence Delta 和 human release gate
```

成功的 packet 只會複製 public catalog fields 和 source prose，並把 source prose 當成 data，不當成 instruction。例如 fixture 的 `requiredAction` 會保留作證據，但 code 不可能替人 apply update。`Known` 與 `Unknown` ransomware-use 會原樣保留；`Unknown` 不會被寫成「沒有 ransomware use」。

## 技術證據與非技術／業務證據

| 類別 | 可檢查內容 | 對 portfolio 有甚麼價值 |
| --- | --- | --- |
| 技術：source 與 schema control | [`schemas/kev-review-contract.schema.json`](schemas/kev-review-contract.schema.json)、[`src/source-validation.mjs`](src/source-validation.mjs)、[`data/source-manifest.fixture.json`](data/source-manifest.fixture.json) | 看得到 input 只容許 public KEV fields、fixture-only manifest 與完整 source receipt |
| 技術：safety 與 action authority | [`src/action-contract.mjs`](src/action-contract.mjs)、[`src/review-packet.mjs`](src/review-packet.mjs) | 只有 packet 或 `SOURCE_REJECTED`；allowed actions 是空白 |
| 技術：test evidence | [`test/kev-review-packet.test.mjs`](test/kev-review-packet.test.mjs)、[`src/evaluation-cases.mjs`](src/evaluation-cases.mjs) | 可重跑 normal、malformed、stale、private-field、injection、action-request 和 ambiguous-asset case |
| 技術：change evidence | [`scripts/eval-diff.mjs`](scripts/eval-diff.mjs)、[`docs/evidence-delta-change-001.md`](docs/evidence-delta-change-001.md) | 逐 case 顯示 regression，而不是用一個漂亮的總分掩蓋 |
| 非技術／業務：workflow ownership | [`docs/demonstration-map.md`](docs/demonstration-map.md) | public catalog evidence 只是虛構人手 assurance review 的 input，不是 asset 或 remediation decision |
| 非技術／業務：release discipline | [`docs/release-gate.md`](docs/release-gate.md)、[`docs/decision-log.md`](docs/decision-log.md)、[`docs/rollback.md`](docs/rollback.md) | 展示誰要決定、還欠哪些證據，以及 unsafe extension 如何停下來 |

## Fixed evaluation set

本機 test suite 有十個細小但刻意的 case：

1. normal complete public record；
2. `Known` ransomware use 原樣保留；
3. `Unknown` 原樣保留而不過度推論；
4. malformed CVE；
5. missing required field；
6. stale fixture snapshot；
7. prohibited private field；
8. injection wrapper；
9. action request；
10. ambiguous asset claim。

測試會檢查 route、reason code、action authority、trace minimisation、ransomware value preservation、source receipt、static model fixture 與 illustrative Evidence Delta。PASS 只表示 fixed local fixture 符合它自己的 contract；不量度 live model、live data、任何組織的 security，或真實業務成效。

## Optional model 與 Promptfoo layer

[`src/responses-api-fixture.mjs`](src/responses-api-fixture.mjs) 是一個完全靜態、不可執行的 `gpt-5-mini` Responses API request shape。它用了 `store: false`，但沒有 SDK import、credential、network call 或 model output。它只用來討論日後模型界線，不是 OpenAI integration。request shape 參考 [GPT-5 mini docs](https://developers.openai.com/api/docs/models/gpt-5-mini) 和 [Responses API reference](https://developers.openai.com/api/reference/cli/resources/responses/methods/create)。

兩份 Promptfoo config 讓人看得到 evaluation 設計，但不令 model 成為 core demo：

- [`evals/promptfoo.fixture.yaml`](evals/promptfoo.fixture.yaml) 使用 local deterministic JavaScript provider，沒有 credential，也不會 access network。讀者若自行安裝 Promptfoo，可另外跑三個 fixture case；package scripts 和 CI 絕不會跑它。
- [`evals/promptfoo.responses.optional.yaml`](evals/promptfoo.responses.optional.yaml) 是可選的 `openai:responses:gpt-5-mini` config，包含 `store: false` 和 strict response schema，但完全沒有 key，package scripts 和 CI 絕不會跑。真正 experiment 還要另外有 approved credential、data handling review、representative evaluation set、human decision owner 與 release gate。

## Change、release 與 rollback evidence

`CHANGE-001` 把一條品質要求寫清楚：source value `Unknown` 必須仍然是 `Unknown`。下列指令只比較 fixture-only before/after report：

```powershell
npm run eval:diff
```

只有兩份 fixture report 的 fixture、source manifest、case set、action contract 和 evaluation protocol 都一致，結果才可以是 `NO_DECLARED_REGRESSION`；否則會停在 `COMPARISON_NOT_COMPARABLE`。兩個結果都不是 release approval。改用這個 pattern 前，請一併閱讀 [Evidence Delta](docs/evidence-delta-change-001.md)、[decision log](docs/decision-log.md)、[release gate](docs/release-gate.md) 和 [rollback plan](docs/rollback.md)。

## Non-claims

- 沒有下載、查詢或驗證 live CISA feed。
- test、demo、CI 和 local Promptfoo fixture provider 都沒有做 CISA data acquisition。
- 沒有 OpenAI API call、model response、Promptfoo run、credential read、cost、latency、quality 或 safety performance result。
- 沒有 private、client、contact、network、inventory、asset、scan、patch、ticket、message、incident 或 business data。
- 沒有聲稱 asset exposure、remediation priority、patch recommendation、Australian SLA、compliance result、security posture、production readiness、deployment 或 business outcome。

## License

這個本機 repo draft 附有 [MIT License](LICENSE)。公開 fork 或連接任何 live service 前，請自行確認 code ownership、third-party material、data terms、僱傭義務、security review 和 external-release authority。
