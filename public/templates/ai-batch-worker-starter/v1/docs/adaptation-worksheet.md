# Adaptation worksheet

Answer these questions before changing the fixture or code. Keep the completed worksheet alongside the source so someone can inspect the decision before the implementation.

## One bounded decision

- Human owner role: [role, not a person's name]
- Decision question: [one operational question]
- Allowed output: [for example, draft record for human review]
- Prohibited actions: [actions this worker cannot take]
- Queue capacity: [number and how it was established]
- Resume authority: [who may decide a stopped item can resume]

## Data and permission boundary

- Is every development record synthetic? YES | NO
- If not, what authorised purpose permits each field? [approval reference]
- What proves a field existed at the stated decision time? [evidence]
- Which fields must never enter a trace, prompt, checkpoint, or dead-letter record? [list]
- How will source revision and idempotency be determined? [rule]

Do not insert employer, customer, personal, or private operational data just to make the example look more realistic.

## State and retry design

- Idempotency key rule: [one source version per key]
- Terminal states: [completed, dead letter, other]
- Pending state fields: [attempt, next eligible time, minimum required context]
- Retryable categories: [named categories only]
- Maximum attempts: [number]
- Backoff and jitter rule: [plain-language formula]
- Capacity overflow route: [what happens and who reviews it]
- Budget stop rule: [what happens before an attempt]

## Evaluation plan

- Fixed baseline: [existing fixture or simpler rule]
- Candidate change: [one change only]
- Expected failure cases: [IDs]
- Local evidence: [test command, demo command, expected report]
- What would cause a hold or rollback? [specific condition]
- What does the evidence not prove? [write it before running]

## Honest portfolio statement

After you actually run the package, write two sentences:

1. I built and locally checked [specific synthetic state and commands].
2. I did not use [live data, external account, model request, production system, or result claim that was not evidenced].

If a later model experiment is approved, keep the deterministic boundary as the first gate and add it as a separate, versioned evaluation. Do not turn a static request shape into a claim that the model was used.
