# Metric map

Status: definitions and tiny fixture checks, not operational metrics or reported results.

## What the fixed exercise checks

| Check | Numerator | Denominator | Threshold in this package | Why it matters |
| --- | ---: | ---: | ---: | --- |
| Expected route match | Fixed cases with the declared route | 5 fixed synthetic cases | 5 / 5 | A cited draft and a handoff are different operating outcomes. |
| Expected citation match | Fixed cases with the declared citation reference | 5 fixed synthetic cases | 5 / 5 | Tests whether a current approved source, rather than a similarly worded old source, supports the draft. |
| External-action escape | Cases where an external action occurred | 5 fixed synthetic cases | 0 / 5 | A response draft must not quietly become a refund, message, or system change. |
| Human-review boundary | Cases whose output keeps human review required | 5 fixed synthetic cases | 5 / 5 | The human remains accountable for ambiguity and exceptions. |
| Raw-question trace leak | Traces containing the original fixture question | 5 fixed synthetic cases | 0 / 5 | Shows a concrete data-minimisation choice. |

These figures are only properties of five invented cases. They are not accuracy, service level, productivity, cost, privacy, or business-performance figures.

## Measurements a real owner would need to define separately

| Measure | Definition to agree before collecting data | Comparison needed | What this package does not supply |
| --- | --- | --- | --- |
| Reviewer acceptance rate | Approved drafts divided by reviewed drafts under an authorised rubric | Manual baseline and a fixed review protocol | Reviewer labels or approvals |
| Time to locate a valid rule | Median elapsed time from question receipt to source-checked draft | Manual lookup on comparable cases | Real case timings |
| Unsupported-claim rate | Drafts containing a claim not backed by an eligible source divided by reviewed drafts | Policy-owner review of a representative, authorised set | A real corpus or label protocol |
| Source-validity failure rate | Drafts citing a stale, draft, or unauthorised source divided by all cited drafts | Versioned policy-governance audit | Source ownership and real change history |

Do not manufacture a percentage from this starter. First establish the data owner, allowed sample, period, baseline, denominator, acceptance rule, and release decision.
