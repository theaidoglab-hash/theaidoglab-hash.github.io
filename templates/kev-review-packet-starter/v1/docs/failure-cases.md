# Fixed failure cases

The test suite records six small local cases. They are not a representative security evaluation.

| Case | Expected result | Why it stops or continues |
| --- | --- | --- |
| Complete synthetic record | `EVIDENCE_PACKET_READY` | The record uses only allowed fields and the receipt says it is synthetic and not acquired. |
| `Unknown` value | `EVIDENCE_PACKET_READY` | `Unknown` is evidence to preserve, not a gap for the code to fill. |
| Malformed due date | `SOURCE_REJECTED` | A reviewer cannot rely on an ambiguous date. |
| Private field added | `SOURCE_REJECTED` | The package is not allowed to carry asset or internal information. |
| Non-synthetic receipt | `SOURCE_REJECTED` | Live or unverified data needs separate authority and controls. |
| Patch-ticket operation | `SOURCE_REJECTED` | The local exercise has no action authority. |

When adapting the package, add a case before changing a rule. Record who owns the new source, what evidence is acceptable, and how an unsafe output will stop.
