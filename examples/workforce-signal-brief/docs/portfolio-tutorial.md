# Six-day portfolio tutorial: build a context brief, not a job-market oracle

## Day 1 — Frame one decision

Write `docs/problem-brief.md` with a fictional owner, one decision, a cost of error, non-goals, and stop conditions. A good starting decision is: “Can a human reviewer use this public-statistics receipt as context for a draft?” Do not make the decision “Who should we hire?”

## Day 2 — Make a source receipt

Choose one official public source with documented terms and stable metadata. Record the release URL, dataflow/series identifier, reference period, geography, unit, adjustment, access time, source version, terms check, allowed fields, excluded fields, and revision rule. If you have not acquired it, say so.

## Day 3 — Write the smallest baseline

Build a parser that validates the receipt, metadata, sequence, and allowed fields. Create a no-model context packet and an explicit reject route. The model is optional; the baseline should already show the decision boundary.

## Day 4 — Add the output contract

Write a JSON schema and a short prompt that can only produce a draft or a rejection. Assert exact facts, units, periods, and prohibited recommendations. Put all action permissions in one contract, not in a vague README warning.

## Day 5 — Evaluate one change

Create ordinary, missing-metadata, stale, malformed, private-field, injection, and prohibited-action cases. Use deterministic tests first. Add a Promptfoo fixture configuration if prompt/model wiring is relevant. Freeze the cases, compare one candidate to one baseline, and write the Evidence Delta decision.

## Day 6 — Package delivery evidence

Your README should point to the source receipt, data contract, baseline, tests, eval cases, change decision, monitoring plan, and rollback. Separate technical evidence from delivery evidence. End with non-claims. A reviewer should be able to explain why the project stops as easily as why it proceeds.
