# Starter contents

| Path | Why it exists |
| --- | --- |
| README.md | Run instructions, scope boundary, and portfolio-reading guide. |
| package.json | Package name, version, Node requirement, and local commands. |
| expected-output.json | Fixed output for the two-run local walkthrough. |
| data/synthetic-batch-fixtures.mjs | Invented work items only. |
| data/request-fixtures.mjs | Allowed and blocked local requests. |
| src/contracts.mjs | Action boundary and blocked-result shape. |
| src/fixture-validation.mjs | Synthetic provenance, work-item, policy, and checkpoint checks. |
| src/retry-policy.mjs | Fixed retry categories and deterministic delay calculation. |
| src/run-local-batch-worker.mjs | Serial intake, checkpoint, idempotency, retry, dead-letter, and budget-stop route. |
| src/responses-api-fixture.mjs | Static future gpt-5-mini request shape; never imported by the worker. |
| tests/ai-batch-worker.test.mjs | Fixed runnable success and failure checks. |
| scripts/demo.mjs | Deterministic first-run and resume walkthrough. |
| docs/decision-brief.md | Fictional decision and allowed output. |
| docs/failure-cases.md | Named failure routes and why they matter. |
| docs/metric-map.md | What local counts can and cannot mean. |
| docs/manual-review-record.md | Blank local review record, not a claimed completed review. |
| docs/rollback-record.md | Local rollback conditions and target. |
| docs/adaptation-worksheet.md | Questions to answer before changing the starter. |
| docs/future-model-seam.md | Preconditions and evaluation cases for a separately approved model experiment. |
