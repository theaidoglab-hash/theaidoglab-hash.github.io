# Evaluation and adaptation notes

## Local evidence

Run the fixed checks before changing the exercise:

```powershell
npm test
npm run demo
```

| Check | What it verifies | What it cannot establish |
| --- | --- | --- |
| Current supported FAQ | A deterministic cited draft has the expected route and human handoff. | That the answer is useful to a real customer. |
| Missing or expired support | The route stops rather than filling a gap with fluent text. | That a future corpus is complete or current. |
| Instruction override and action request | Retrieval is bypassed and no action is executed. | A safety rate in real traffic. |
| Invalid fixture and template failure | The exercise fails closed to a person. | Reliability of a live service or provider. |

No score in this package is a production evaluation metric. It is a small,
deterministic regression suite for a fictional workflow.

## Adapt it without expanding authority by accident

1. Rewrite the decision brief before changing the code. Name the real business
   decision, the person who owns it, the proposed reviewer, and the manual
   process that remains available.
2. Keep a source receipt. Record what the source is, who may use it, which
   version was eligible, and when it was current. A hash alone does not grant
   data rights.
3. Freeze a measurement plan before observing outcomes. Define the unit,
   numerator, denominator, review window, manual baseline, error categories,
   and owner who resolves ambiguous cases.
4. Add failure cases before a new happy path. At minimum cover missing support,
   stale or unapproved material, unsafe instructions, requested actions, and
   unavailable dependencies.
5. Seek separate data, privacy, security, operational, and release approval
   before connecting a real source, model, or account. Do not treat this
   starter's tests as that approval.

The useful portfolio evidence is the reasoning trail: what decision is being
helped, what must stop, who decides next, and how a future result would be
measured without claiming it already happened.
