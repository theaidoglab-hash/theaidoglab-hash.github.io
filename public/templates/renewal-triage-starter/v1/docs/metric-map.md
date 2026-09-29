# Metric Map

The metric names are deliberately explicit. Each measures a different thing and none is sufficient on its own.

| Name | Formula or source | Used when | What it can tell you | What it cannot tell you |
| --- | --- | --- | --- | --- |
| Raw risk score | `rawRiskSignal` from a synthetic record | Before queue construction | Which synthetic record has the largest risk signal | Whether the record is eligible, valuable to review, or likely to create a business result |
| Business-priority units | `rawRiskSignal × syntheticRenewalValueUnits` | Before queue construction | A simple capacity-aware ordering rule for this fabricated exercise | Revenue, retention, causal uplift, fairness, or a valid real-world decision |
| Offline synthetic queue utility | Sum of `syntheticOfflineReviewValueUnits` for selected records | Only after a draft queue exists | Which of the two fixture queues captured more hidden synthetic label units | The value of a real intervention or whether a real reviewer should act |
| Capacity | A positive integer supplied to the route | Before queue construction | How many records a person can inspect in this local scenario | Staffing needs, service levels, or a real operational constraint |
| Eligibility | `reviewEligible` boolean in the fixture | Before every ranking | Whether a record is allowed into the draft queue | Any judgement about a real person, account, consent, or entitlement |

## The evaluation sequence

1. Validate fixture provenance and fields.
2. Enforce eligibility before ranking.
3. Build a raw-risk draft queue.
4. Build a business-priority draft queue.
5. Compare each queue against the synthetic offline label after selection.
6. Leave the result as a draft for human review.

This sequence prevents a common portfolio mistake: reporting a single score as though it demonstrated a complete operational solution.
