# KEV Review Packet Starter

[English source](README.md) · [繁中（台灣）](README.zh-TW.md) · [简体中文](README.zh-Hans.md)

狀態：由讀者自行持有嘅本機練習。呢個 package 入面每一筆 record 都係虛構；佢係 portfolio starter，唔係 vulnerability-management system、live catalog integration，亦唔係關於任何 organisation 嘅 finding。

呢個 package 只回答一條刻意收窄嘅問題：

> 一筆固定、模仿 public field 形狀嘅 teaching record，可唔可以變成畀指定 human reviewer 嘅 review packet，定係必須拒絕 source？

code 唔會 scan environment、match asset、計算 exposure、建議 patch、create ticket、send message 或 call model。佢只會建立一份 read-only packet，或者回傳 `SOURCE_REJECTED`。

## 喺本機跑

需要 Node.js 20 或以上。呢個 package 冇 dependency、credential、environment variable、安裝步驟、network call 或 model call。

先解壓縮下載檔。然後在解壓後、包含本檔 `README.md` 和 `package.json` 的資料夾開啟終端機，再執行：

```powershell
npm test
npm run fixture:validate
npm run demo
```

三個 command 都只用已提交嘅本機 file。pass 只代表呢個細小嘅 synthetic exercise 符合已寫明嘅 contract，唔證明 live-data quality、model quality、security、remediation readiness 或 business impact。

## 呢個 starter 會作嘅決定

```text
Synthetic public-field-shaped record + local source receipt
  -> validate fields, dates, source status, and requested operation
  -> EVIDENCE_PACKET_READY or SOURCE_REJECTED
  -> human reviewer decides what happens next
```

成功嘅 packet 會保留 source record 做 evidence，但唔會將 `requiredAction` 變成畀 computer 嘅 instruction。值為 `Unknown` 就維持 `Unknown`；佢絕對唔會變成「某件事有／冇發生」嘅 claim。

## Reviewer 可以核對乜

| 範圍 | 可檢查嘅內容 | 喺本機可證明乜 |
| --- | --- | --- |
| Decision boundary | [`src/contracts.mjs`](src/contracts.mjs) | 不容許任何 external action，而且永遠需要 human review。 |
| Input boundary | [`src/validate.mjs`](src/validate.mjs) | 只接受固定嘅 public-field-shaped record 同 synthetic local source receipt。 |
| Packet construction | [`src/build-review-packet.mjs`](src/build-review-packet.mjs) | 一條 deterministic packet 或 rejection route；冇 model 參與。 |
| Fixed cases | [`tests/kev-review-packet.test.mjs`](tests/kev-review-packet.test.mjs) | Normal、`Unknown`、malformed date、prohibited field、non-synthetic source 同 unsafe operation cases。 |
| Optional evaluation shape | [`evals/promptfoo.fixture.yaml`](evals/promptfoo.fixture.yaml) | 一個可由讀者另行以 Promptfoo 跑嘅 local deterministic provider shape；package scripts 唔會 invoke Promptfoo。 |
| Static-source receipt template | [`docs/reader-owned-static-source-receipt.md`](docs/reader-owned-static-source-receipt.md) | 一份畀讀者自己持有嘅空白 static copy 記錄；佢唔係 package input，亦唔代表呢個 starter 取得過資料。 |
| Manual decision | [`docs/reviewer-decision.md`](docs/reviewer-decision.md) | 將來使用、source、evaluation 同 release decision 會由邊個擁有。 |
| Stop or rollback | [`docs/rollback-record.md`](docs/rollback-record.md) | 何時停用 assisted path，退返 manual review。 |

## 建議嘅 portfolio 解說

展示 code 前先講清個決定：「呢個 exercise 只接受一筆本機虛構、模仿 public field 形狀嘅 record，並將佢整理成畀 reviewer 嘅 packet。佢唔知道任何真實 organisation 有冇受影響，亦唔可以採取 remediation action。」

然後畀 reviewer 睇 record、source receipt、一個 accepted case、一個 rejected case、action boundary 同空白 decision record。咁樣 limits 係可以核對，而唔係被一個好睇嘅 answer 蓋過。

## 日後如果你另行保留 public static copy

下載檔附有一份空白 [`reader-owned static-source receipt`](docs/reader-owned-static-source-receipt.md)。佢一開始係 `NOT_ACQUIRED`，畀你日後為自己合法保留嘅 copy 記低 URL、terms、version、hash、field boundary、reviewer 同 stop condition。佢唔屬於可執行 exercise：唔可以交畀呢個 starter，亦唔會令虛構 fixture 變成 public data。

## Package 地圖

```text
data/       Synthetic record, local source receipt, and fixed case inputs
src/        Contract, input checks, packet builder, and fixed-case evaluation
tests/      Node built-in tests
scripts/    Repeatable local validation and demo commands
docs/       Decision brief、failure cases、static-source receipt template、manual reviewer record 同 rollback record
expected-output.json  Recorded successful local demo
```

## 選用：跑 Promptfoo fixture

[`evals/promptfoo.fixture.yaml`](evals/promptfoo.fixture.yaml) 指向 [`src/promptfoo-fixture-provider.mjs`](src/promptfoo-fixture-provider.mjs) 入面嘅 deterministic local provider。佢會用呢個 package 已有嘅 fixed cases。Promptfoo 刻意唔係 package dependency，所以基本嘅 `npm test`、`npm run fixture:validate` 同 `npm run demo` 路徑仍然唔需要 key 或 model。

如果想用 Promptfoo 檢查呢組 fixed cases，呢個選用 command 先需要 Node.js 22.22 或以上。佢會鎖定 Promptfoo `0.123.1`，並將 exported result 寫入已 ignore 嘅 `results/`：

```powershell
npx --yes promptfoo@0.123.1 eval -c evals/promptfoo.fixture.yaml -o results/promptfoo.fixture.json
```

核心 command 只會檢查已提交嘅 fixed cases 同 configuration，冇一個會跑 Promptfoo，唔可以當成有記錄嘅 Promptfoo pass。只有上面嘅選用 command 真正跑完，先會有本機 Promptfoo result。

如果本機未 cache，`npx` 可能要由 package registry 下載已鎖定嘅工具。fixture provider 本身唔會讀 credential、call model 或 API，亦唔會用 business data。嗰個 result 只代表呢組本機 fixed cases 可以重跑，唔係 live-model result 或 production evidence。

## Future-model boundary

[`src/responses-api-fixture.mjs`](src/responses-api-fixture.mjs) 係一份靜態 `gpt-5-mini` Responses API design note。佢有 `store: false`，但冇 API key、SDK、provider setup、request、response 或 model output，亦唔會由 package scripts 使用。

## 不會聲稱嘅事

- 冇下載、query、store 或 validate 任何真實 KEV 或 CISA feed。
- 冇使用真實 CVE、vendor、asset、network、customer、contact、incident 或 business data。
- 已提交嘅 exercise 冇 model output、已儲存嘅 Promptfoo result、credential、API request、external system 或 paid service。
- 冇聲稱 exposure、priority、patch instruction、deadline、security posture、compliance result、production readiness、deployment 或 business outcome。
- 包內嘅 static-source receipt 係空白 `NOT_ACQUIRED` template，唔代表呢個 package 取得過 public record。
- 未經 authorised owner 另外決定 data permissions、source governance、privacy 同 security review、point-in-time availability、evaluation、monitoring、incident path 同 release authority 前，唔好用真實 data 取代 fixture。

## License 同 adaptation note

呢個 starter 係 internal local exercise package。發布 derivative 或連接 live service 前，請確認 code ownership、source terms、employer obligations 同 external-release authority。
