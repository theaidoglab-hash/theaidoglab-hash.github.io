# What the local counts mean

The labels here are intentionally narrow. A local count can help a reader inspect a route, but it does not become an operational metric merely because it is a number.

| Local field | How it is produced | What it can show in this exercise | What it cannot show |
| --- | --- | --- | --- |
| Attempts this run | Count of simulated outcomes read in one invocation. | Whether the serial invocation cap was obeyed. | Throughput, latency, provider usage, or capacity in a real service. |
| Pending count | Synthetic items left in the checkpoint. | Which items need a later local invocation or review. | A real backlog, service level, workload, or staffing need. |
| Completed count | Synthetic items with a fixed success outcome. | That this fixture reached the review-only terminal route. | Document quality, reviewer acceptance, accuracy, or business value. |
| Dead-letter count | Invalid, queue-overflow, or retry-exhausted synthetic items. | Which named local failure route occurred. | Real incident frequency, data quality, or provider reliability. |
| Spent synthetic cost units | Sum of fixture costs before each simulated outcome. | That the local pre-attempt cap was checked. | Billing, approved budget, model cost, cost saving, or financial impact. |
| Duplicate suppression count | Number of repeated idempotency keys stopped. | That the state machine did not re-run the same local key. | Exactly-once delivery across a broker, database, or concurrent workers. |
| Retry delay | Fixed exponential delay plus deterministic jitter. | A repeatable retry calculation for a given fixture. | Real retry safety, provider behaviour, or fair scheduling. |

## Reading the demonstration honestly

First use the local fields to answer a small implementation question: did the declared fixture follow the declared route? Then write down what would be needed before any broader claim: authorised source data, a baseline, a reviewer workflow, a denominator, an observation window, an owner, a stop condition, and a decision date.

A successful local run should not be reported as saved time, reduced cost, improved quality, or production reliability.
