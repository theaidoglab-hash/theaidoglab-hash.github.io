# Adaptation Worksheet

Use this worksheet before changing any code. Keep it with the project so a reviewer can see the decision before the implementation.

## 1. One bounded decision

- Human owner role: `[role, not a person name]`
- Decision question: `[one operational question]`
- Allowed output: `[for example: a draft queue for human review]`
- Explicitly prohibited actions: `[list actions the tool cannot take]`
- Review capacity: `[positive integer and how it was established]`

## 2. Data and permission boundary

- Is every development record synthetic? `YES | NO`
- If not, who authorised access and for what purpose? `[approval reference]`
- What proves each input existed at the stated decision time? `[evidence]`
- Which fields must never enter the system? `[list]`
- Who decides eligibility before a score is calculated? `[role]`

Do not put personal, customer, employer, or private operational data into this starter just to make it look realistic.

## 3. Queue design

- Raw signal: `[definition and range]`
- Value or priority signal: `[definition and unit]`
- Why is a raw score alone insufficient? `[specific operational reason]`
- Ranking formula: `[write it in plain text]`
- Tie-break rule: `[deterministic rule]`
- What may exclude a record regardless of rank? `[eligibility rule]`

## 4. Evaluation plan

- Offline check: `[what is revealed only after selection?]`
- Decision metric: `[queue-level metric, not only a model metric]`
- Guardrail: `[condition that blocks release]`
- Baseline: `[simple comparator]`
- Candidate: `[one bounded change]`
- What would count as insufficient evidence? `[state it before running]`

## 5. Delivery evidence

- Fixture version: `[version]`
- Expected output location: `[path]`
- Failure cases: `[IDs]`
- Reviewer role and decision date: `[role and date]`
- Rollback target: `[version or commit chosen by the owner]`

## 6. Honest portfolio statement

Write two short sentences after you have actually run the work:

1. `I built and locally checked [specific synthetic workflow and commands].`
2. `I did not use [live data, external account, model request, production system, or business-outcome claim that was not actually evidenced].`

If you later add a model, use it only after this deterministic baseline is working. Keep the same fixture and failure cases, state the exact input/output contract, add a repeatable evaluation, and do not describe a local result as a real operating outcome.
