# KEV Review Packet Starter

[English source](README.md) · [繁中（香港）](README.zh-HK.md) · [简体中文](README.zh-Hans.md)

狀態：由讀者自行持有的本機練習。這個 package 中每一筆 record 都是虛構；它是 portfolio starter，不是 vulnerability-management system、live catalog integration，也不是關於任何 organisation 的 finding。

這個 package 只回答一個刻意縮小的問題：

> 一筆固定、模仿 public field 形狀的 teaching record，能否變成給指定 human reviewer 的 review packet，還是必須拒絕 source？

code 不會 scan environment、match asset、計算 exposure、建議 patch、create ticket、send message 或 call model。它只會建立一份 read-only packet，或回傳 `SOURCE_REJECTED`。

## 在本機執行

需要 Node.js 20 或以上。這個 package 沒有 dependency、credential、environment variable、安裝步驟、network call 或 model call。

先解壓縮下載檔。然後在解壓後、包含本檔 `README.md` 與 `package.json` 的資料夾開啟終端機，再執行：

```powershell
npm test
npm run fixture:validate
npm run demo
```

三個 command 都只使用已提交的本機 file。pass 只代表這個小型 synthetic exercise 符合已寫明的 contract，不證明 live-data quality、model quality、security、remediation readiness 或 business impact。

## 這個 starter 會作的決定

```text
Synthetic public-field-shaped record + local source receipt
  -> validate fields, dates, source status, and requested operation
  -> EVIDENCE_PACKET_READY or SOURCE_REJECTED
  -> human reviewer decides what happens next
```

成功的 packet 會保留 source record 作為 evidence，但不會將 `requiredAction` 變成給 computer 的 instruction。值為 `Unknown` 就維持 `Unknown`；它絕不會變成「某件事有／沒有發生」的 claim。

## Reviewer 可以核對什麼

| 範圍 | 可檢查的內容 | 在本機可證明什麼 |
| --- | --- | --- |
| Decision boundary | [`src/contracts.mjs`](src/contracts.mjs) | 不允許任何 external action，而且永遠需要 human review。 |
| Input boundary | [`src/validate.mjs`](src/validate.mjs) | 只接受固定的 public-field-shaped record 與 synthetic local source receipt。 |
| Packet construction | [`src/build-review-packet.mjs`](src/build-review-packet.mjs) | 一條 deterministic packet 或 rejection route；沒有 model 參與。 |
| Fixed cases | [`tests/kev-review-packet.test.mjs`](tests/kev-review-packet.test.mjs) | Normal、`Unknown`、malformed date、prohibited field、non-synthetic source 與 unsafe operation cases。 |
| Optional evaluation shape | [`evals/promptfoo.fixture.yaml`](evals/promptfoo.fixture.yaml) | 一個可由讀者另行以 Promptfoo 執行的 local deterministic provider shape；package scripts 不會 invoke Promptfoo。 |
| Static-source receipt template | [`docs/reader-owned-static-source-receipt.md`](docs/reader-owned-static-source-receipt.md) | 一份由讀者自行持有的空白 static copy 紀錄；它不是 package input，也不表示這個 starter 曾取得資料。 |
| Manual decision | [`docs/reviewer-decision.md`](docs/reviewer-decision.md) | 未來使用、source、evaluation 與 release decision 由誰擁有。 |
| Stop or rollback | [`docs/rollback-record.md`](docs/rollback-record.md) | 何時停止使用 assisted path，退回 manual review。 |

## 建議的 portfolio 解說

展示 code 前先說清楚決定：「這個 exercise 只接受一筆本機虛構、模仿 public field 形狀的 record，並將它整理成給 reviewer 的 packet。它不知道任何真實 organisation 是否受影響，也不能採取 remediation action。」

然後讓 reviewer 看 record、source receipt、一個 accepted case、一個 rejected case、action boundary 與空白 decision record。這樣 limits 可以被核對，而不會被一個好看的 answer 掩蓋。

## 日後如果你另行保留 public static copy

下載檔附有一份空白 [`reader-owned static-source receipt`](docs/reader-owned-static-source-receipt.md)。它一開始是 `NOT_ACQUIRED`，讓你日後為自行合法保留的 copy 記下 URL、terms、version、hash、field boundary、reviewer 與 stop condition。它不屬於可執行 exercise：不能交給這個 starter，也不會讓虛構 fixture 變成 public data。

## Package 地圖

```text
data/       Synthetic record, local source receipt, and fixed case inputs
src/        Contract, input checks, packet builder, and fixed-case evaluation
tests/      Node built-in tests
scripts/    Repeatable local validation and demo commands
docs/       Decision brief、failure cases、static-source receipt template、manual reviewer record 與 rollback record
expected-output.json  Recorded successful local demo
```

## 選用：執行 Promptfoo fixture

[`evals/promptfoo.fixture.yaml`](evals/promptfoo.fixture.yaml) 指向 [`src/promptfoo-fixture-provider.mjs`](src/promptfoo-fixture-provider.mjs) 中的 deterministic local provider。它會使用這個 package 已有的 fixed cases。Promptfoo 刻意不是 package dependency，所以基本的 `npm test`、`npm run fixture:validate` 與 `npm run demo` 路徑仍然不需要 key 或 model。

如果想用 Promptfoo 檢查這組 fixed cases，這個選用 command 才需要 Node.js 22.22 或以上。它會鎖定 Promptfoo `0.123.1`，並將 exported result 寫入已 ignore 的 `results/`：

```powershell
npx --yes promptfoo@0.123.1 eval -c evals/promptfoo.fixture.yaml -o results/promptfoo.fixture.json
```

核心 command 只會檢查已提交的 fixed cases 與 configuration，沒有一個會跑 Promptfoo，不能當成已記錄的 Promptfoo pass。只有真正跑完上面的選用 command，才會有本機 Promptfoo result。

如果本機未 cache，`npx` 可能要從 package registry 下載已鎖定的工具。fixture provider 本身不會讀取 credential、call model 或 API，也不會使用 business data。那個 result 只表示這組本機 fixed cases 可以重跑，不是 live-model result 或 production evidence。

## Future-model boundary

[`src/responses-api-fixture.mjs`](src/responses-api-fixture.mjs) 是一份靜態 `gpt-5-mini` Responses API design note。它有 `store: false`，但沒有 API key、SDK、provider setup、request、response 或 model output，也不會由 package scripts 使用。

## 不會聲稱的事

- 沒有下載、query、store 或 validate 任何真實 KEV 或 CISA feed。
- 沒有使用真實 CVE、vendor、asset、network、customer、contact、incident 或 business data。
- 已提交的 exercise 沒有 model output、已儲存的 Promptfoo result、credential、API request、external system 或 paid service。
- 沒有聲稱 exposure、priority、patch instruction、deadline、security posture、compliance result、production readiness、deployment 或 business outcome。
- 包內的 static-source receipt 是空白 `NOT_ACQUIRED` template，不表示這個 package 曾取得 public record。
- 未經 authorised owner 另行決定 data permissions、source governance、privacy 與 security review、point-in-time availability、evaluation、monitoring、incident path 與 release authority 前，不要用真實 data 取代 fixture。

## License 與 adaptation note

這個 starter 是 internal local exercise package。發布 derivative 或連接 live service 前，請確認 code ownership、source terms、employer obligations 與 external-release authority。
