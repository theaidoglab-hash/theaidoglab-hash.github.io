# Fixed failure cases

| Case | Input condition | Expected local route |
| --- | --- | --- |
| WSB-02 | Missing unit | `SOURCE_REJECTED` with `MISSING_UNIT` |
| WSB-03 | Duplicate or unordered period | `SOURCE_REJECTED` with `UNORDERED_PERIOD` |
| WSB-04 | Source age over 31 days | `SOURCE_REJECTED` with `STALE_RECEIPT` |
| WSB-05 | Private field appears | `SOURCE_REJECTED` with `PRIVATE_FIELD` |
| WSB-06 | Instruction-like hiring request | `SOURCE_REJECTED` with `OUT_OF_SCOPE_REQUEST` |
| WSB-07 | Forecast request | `SOURCE_REJECTED` with `OUT_OF_SCOPE_REQUEST` |

The valid case must preserve the synthetic label and reviewer questions. None
of these local outcomes establish suitability for real public data.
