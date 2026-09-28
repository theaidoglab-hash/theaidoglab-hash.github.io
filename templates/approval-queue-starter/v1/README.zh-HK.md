# Approval Queue Starter（香港繁體中文）

這是給讀者閱讀的繁體中文入口頁。程式碼、檔名、command、測試名稱和 runtime string 保持英文，方便 reviewer 重跑；如要核對原有技術文字，可閱讀 [English README](README.md)。

**狀態：讀者自行持有的本機練習。** 這個 folder 每條 record、question、answer 和 result 都是虛構；它是 portfolio starter，不是 customer-support system 或 production approval queue。

這個 project 只問一條有範圍的 business question：**一條 workflow 可否在不送出 message、不讀取 account，亦不代人作 decision 的情況下，為 human reviewer 準備一份有 source citation 的 draft？**

答案刻意很窄。一份固定 synthetic FAQ 可以支持 draft；任何沒有支持、不安全、過期，或要求 action 的情況，都必須停下來交人處理。

## 在本機執行

需要 Node.js 20 或以上。它沒有 third-party dependency、install step、environment variable、credential、network call、model call 或 external action。

```powershell
# From the extracted folder that contains this README
npm test
npm run demo
```

`npm test` 會檢查 supported route、missing support、instruction override、expired source、requested action、deterministic-template failure、invalid fixture 和 local-only boundary。`npm run demo` 會印出固定 synthetic route，不會寫入任何 file 或聯絡任何地方。

## Fixture 展示甚麼

| Situation | Local result | Human next step |
| --- | --- | --- |
| Current approved synthetic FAQ 支持這條 question | 有 citation 的 draft | 人手 approve、reject 或 rewrite。 |
| 沒有 current approved source 支持 question | Handoff，不產生 draft | 用既有 manual process 補回缺口。 |
| Question 嘗試 override instruction | Retrieval 前先 handoff | 人手 review 這個不安全 request。 |
| Request 要求 refund、message、ticket 或其他 outside action | Blocked，不作 retrieval | 把 action 留在既有 manual process。 |

Draft 由 deterministic local template 建立，不是 LLM response。Trace 會儲存 request fingerprint，而不是 raw synthetic question。

## 在 portfolio review 展示甚麼

- 一句 plain-language business decision：準備 draft，永不作最終 support decision。
- 一條 technical boundary：只有 current、approved 的 synthetic FAQ record 可被 citation；action request 必須在 retrieval 前 blocked。
- 一條 operational boundary：每條 route 仍要寫清 human next step。
- 可重跑 evidence：fixed test 和 demo report 同時覆蓋 happy path 與 stop path。
- 一份不被誤當作 result 的 measurement definition。日後一個分開、另行 authorised 的 pilot，才可對照預先定義的 manual baseline，量度 reviewer-approved、source-supported draft rate；本 fixture 沒有量度這些結果。

改動這個 exercise 前，先閱讀 [decision brief](docs/decision-brief.md)，再用 [evaluation and adaptation notes](docs/evaluation-and-adaptation.md) 把 local check 與日後 real-world proposal 分開。

## Package map

```text
data/       Invented FAQ snapshot and fixed request fixtures
src/        Validation, safety routing, retrieval, draft construction, and contracts
tests/      Node built-in test suite
scripts/    Repeatable local demo
docs/       Business decision, measurement boundary, and adaptation notes
```

## Scope boundary and non-claims

- 所有 `SYN-*` record 都是虛構，只供本練習使用。
- 唯一 output 是供人手檢查的 draft。Package 不可送出 message、建立 ticket、讀取 account、退款、更新 record 或呼叫 model。
- 本機 test pass 只表示這個固定 synthetic exercise 可重跑；不代表 answer quality、safety performance、review-time saving、business impact、data permission、privacy approval、security approval、production readiness，或適合使用 live data。
- 未經 authorised owner 另外確認 data permission、privacy/security review、human reviewer path、manual baseline、metric definition、monitoring 和 release decision 前，不要把 fixture 換成真實 material。
