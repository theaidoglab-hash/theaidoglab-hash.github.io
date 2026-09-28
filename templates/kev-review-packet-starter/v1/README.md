# KEV Review Packet Starter

[繁中（香港）](README.zh-HK.md) · [繁中（台灣）](README.zh-TW.md) · [简体中文](README.zh-Hans.md)

Status: reader-owned local exercise. Every record in this package is invented. It is a portfolio starter, not a vulnerability-management system, a live catalog integration, or a finding about any organisation.

This package answers one deliberately narrow question:

> Can a fixed, public-field-shaped teaching record become a review packet for a named human reviewer, or must the source be rejected?

The code does not scan an environment, match an asset, calculate exposure, recommend a patch, create a ticket, send a message, or call a model. It either builds a read-only packet or returns `SOURCE_REJECTED`.

## Run locally

Requires Node.js 20 or later. There are no dependencies, credentials, environment variables, installation step, network calls, or model calls.

Unzip the download. In the extracted folder that contains this `README.md` and `package.json`, open a terminal and run:

```powershell
npm test
npm run fixture:validate
npm run demo
```

All three commands use checked-in local files only. A pass says that this small synthetic exercise matches its declared contract. It does not prove live-data quality, model quality, security, remediation readiness, or business impact.

## The decision this starter makes

```text
Synthetic public-field-shaped record + local source receipt
  -> validate fields, dates, source status, and requested operation
  -> EVIDENCE_PACKET_READY or SOURCE_REJECTED
  -> human reviewer decides what happens next
```

The successful packet preserves the source record as evidence. It does not turn `requiredAction` into an instruction for the computer. A value of `Unknown` remains `Unknown`; it never becomes a claim that something did or did not happen.

## What a reviewer can check

| Area | Inspect | What it establishes locally |
| --- | --- | --- |
| Decision boundary | [`src/contracts.mjs`](src/contracts.mjs) | No external actions are permitted and a human review is always required. |
| Input boundary | [`src/validate.mjs`](src/validate.mjs) | Only the fixed public-field-shaped record and a synthetic local source receipt are accepted. |
| Packet construction | [`src/build-review-packet.mjs`](src/build-review-packet.mjs) | A deterministic packet or rejection route; no model is involved. |
| Fixed cases | [`tests/kev-review-packet.test.mjs`](tests/kev-review-packet.test.mjs) | Normal, `Unknown`, malformed date, prohibited field, non-synthetic source, and unsafe operation cases. |
| Optional evaluation shape | [`evals/promptfoo.fixture.yaml`](evals/promptfoo.fixture.yaml) | A local deterministic provider shape that a reader may separately run with Promptfoo; package scripts never invoke Promptfoo. |
| Static-source receipt template | [`docs/reader-owned-static-source-receipt.md`](docs/reader-owned-static-source-receipt.md) | A blank reader-owned record for a permitted static copy; it is not package input and does not say this starter acquired data. |
| Manual decision | [`docs/reviewer-decision.md`](docs/reviewer-decision.md) | Who would own a future use, source, evaluation, and release decision. |
| Stop or rollback | [`docs/rollback-record.md`](docs/rollback-record.md) | When to stop using an assisted path and return to manual review. |

## Suggested portfolio explanation

State the decision before showing the code: “This exercise accepts only a locally invented public-field-shaped record and turns it into a packet for a reviewer. It does not know whether any real organisation is affected, and it cannot take remediation actions.”

Then show a reviewer the record, the source receipt, one accepted case, one rejected case, the action boundary, and the blank decision record. That makes the limits inspectable instead of hiding them behind a polished answer.

## If you later retain a public static copy

The package includes a blank [`reader-owned static-source receipt`](docs/reader-owned-static-source-receipt.md). It starts as `NOT_ACQUIRED` and records the URL, terms, version, hash, field boundary, reviewer, and stop condition for a copy you personally retain later. It is outside the runnable exercise: it cannot be supplied to this starter, and it does not turn the invented fixture into public data.

## Package map

```text
data/       Synthetic record, local source receipt, and fixed case inputs
src/        Contract, input checks, packet builder, and fixed-case evaluation
tests/      Node built-in tests
scripts/    Repeatable local validation and demo commands
docs/       Decision brief, failure cases, a static-source receipt template, manual reviewer record, and rollback record
expected-output.json  Recorded successful local demo
```

## Optional Promptfoo fixture run

[`evals/promptfoo.fixture.yaml`](evals/promptfoo.fixture.yaml) points to a deterministic local provider in [`src/promptfoo-fixture-provider.mjs`](src/promptfoo-fixture-provider.mjs). It uses the fixed cases already in this package. Promptfoo is deliberately not a package dependency, so the core `npm test`, `npm run fixture:validate`, and `npm run demo` path stays key-free and model-free.

If you want to inspect those fixed cases through Promptfoo, this optional command needs Node.js 22.22 or later. It pins Promptfoo to `0.123.1` and writes the exported result under ignored `results/`:

```powershell
npx --yes promptfoo@0.123.1 eval -c evals/promptfoo.fixture.yaml -o results/promptfoo.fixture.json
```

The core commands inspect checked-in fixed cases and configuration, but none of them runs Promptfoo. They are not a recorded Promptfoo pass. Only the optional command above produces a local Promptfoo result.

`npx` may download the pinned tool from the package registry when it is not cached. The fixture provider itself reads no credential, calls no model or API, and uses no business data. Treat that result as a repeatable check of these local cases—not as a live-model result or production evidence.

## Future-model boundary

[`src/responses-api-fixture.mjs`](src/responses-api-fixture.mjs) is a static `gpt-5-mini` Responses API design note. It has `store: false`, but it has no API key, SDK, provider setup, request, response, or model output. It is not used by the package scripts.

## Non-claims

- No real KEV or CISA feed is downloaded, queried, stored, or validated.
- No real CVE, vendor, asset, network, customer, contact, incident, or business data is included.
- The checked-in exercise includes no model output, saved Promptfoo result, credential, API request, external system, or paid service.
- No exposure, priority, patch instruction, deadline, security posture, compliance result, production readiness, deployment, or business outcome is claimed.
- The included static-source receipt is blank and `NOT_ACQUIRED`; it does not mean this package has obtained a public record.
- Do not replace the fixture with real data until an authorised owner has separately decided data permissions, source governance, privacy and security review, point-in-time availability, evaluation, monitoring, an incident path, and release authority.

## License and adaptation note

This starter is an internal local exercise package. Confirm code ownership, source terms, employer obligations, and external-release authority before publishing a derivative or connecting a live service.
