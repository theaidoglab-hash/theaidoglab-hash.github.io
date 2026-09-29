# Renewal Triage Reference

> A synthetic, local-only decision-support workflow that demonstrates why a strong generic risk-ranking metric is not enough to approve a limited human-review queue.

[English](README.md) · [Traditional Chinese (Hong Kong)](README.zh-HK.md) · [Traditional Chinese (Taiwan)](README.zh-TW.md) · [Simplified Chinese](README.zh-Hans.md)

## Portfolio scope

This is a standalone public portfolio reference, not a production system. It models an enterprise-style renewal-review workflow with a deliberately small, versioned synthetic dataset. The example shows a candidate that has better average precision than a baseline but produces lower offline synthetic queue utility at a fixed review capacity. The release gate therefore blocks the candidate.

The result is intentional: it demonstrates that predictive ranking, business value, staff capacity, decision rights, and measured outcomes must be evaluated separately.

## Run locally

Requires Node.js 20 or later. There are no third-party runtime dependencies, no environment variables, and no install step.

```powershell
# From this repository's root
npm test
npm run demo
```

The deterministic demo reports the following fixed synthetic outcome:

| Check | Result |
| --- | --- |
| Baseline average precision | `0.8762` |
| Candidate average precision | `1` |
| Baseline queue utility | `33` synthetic units |
| Candidate queue utility | `1` synthetic unit |
| Candidate release gate | `BLOCKED` |
| Monitoring result | `ROLLBACK_REQUIRED` with a human-approved rollback proposal |

The blocked gate is evidence that the safety check works; it is not a deployment failure, a real business result, or a claim about retention impact.

## Documentation

- [Problem brief](docs/brief.md): the fictional decision, time boundary, capacity, baseline/candidate comparison, and stop conditions.
- [Demonstration map](docs/demonstration-map.md): business value, technical implementation, delivery and risk controls, end-to-end workflow, test evidence, and nonclaims.
- [Portfolio tutorial](docs/portfolio-tutorial.md): a step-by-step path from a bounded fictional decision through point-in-time data, baseline comparison, capacity-aware evaluation, and a local release gate.
- [Pilot measurement map](docs/pilot-measurement-map.md): the separate evidence that an authorised team would need before discussing a real pilot.
- [MIT License](LICENSE)
- Localized README files: [Hong Kong Traditional Chinese](README.zh-HK.md), [Taiwan Traditional Chinese](README.zh-TW.md), and [Simplified Chinese](README.zh-Hans.md).

Detailed technical documentation, source code, synthetic data, test strings, and runtime output are English-only. The README translations are the sole multilingual materials.

## Repository layout

```text
data/                  Versioned synthetic snapshot and monitoring evidence
src/                   Ingest, feature, scoring, queue, evaluation, gate, and monitoring modules
test/                  Deterministic Node.js tests
docs/                  English portfolio documentation
demo.mjs               Human-readable local workflow report
.github/workflows/     GitHub Actions validation
```

## Safety and scope boundaries

- All records are hand-authored `SYN-*` synthetic records. No real customers, accounts, contacts, company systems, or credentials are present.
- The workflow runs entirely locally and makes no network requests or external API calls.
- Queue entries are draft-only `human_review_only` items. The action contract permits no automatic outreach, account changes, pricing changes, or renewal decisions.
- The scores are transparent synthetic rankings, not trained or calibrated production models and not recommendations for individual action.
- Offline synthetic utility is only available after the synthetic outcome. It is not revenue, retention, intervention-effect, or causal-impact evidence.
- A passing gate would still require separate data permissions, privacy review, point-in-time availability proof, outcome and intervention design, fairness assessment, human approval, monitoring, rollback planning, and formal release review.

See the [demonstration map](docs/demonstration-map.md) for the complete evidence-to-claim boundary.
