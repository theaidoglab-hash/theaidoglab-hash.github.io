# Coding Agent review loop

**Status: internal draft only**

Use this checklist before accepting a coding-agent build of the synthetic Approval Queue. It is deliberately tool-neutral. Do not upload real customer content, private prompts, credentials, API keys, employer material or connector output to an agent.

## 1. Brief before implementation

Write one page that answers:

- Who uses the draft and what decision remains with a human?
- Which synthetic input may be used?
- What exact fields must the draft return?
- Which actions are prohibited?
- What is one smaller baseline without a model?
- What makes the request out of scope?

For this case, the answer must retain the following shape:

- Input: a synthetic FAQ question.
- Output: category, FAQ citation, reply draft and handoff reason.
- Prohibited: sending a message, account access, refunds, payment, write actions, external network access and persistent storage of personal data.
- Owner: a named human reviewer decides whether the draft is used.

## 2. Plan review

Before code is written, require a plan with:

- Proposed files and one sentence about each responsibility.
- The test command.
- Expected test cases and their pass condition.
- Assumptions that need a human answer.
- A list of data, network and write actions that will not be used.

Reject the plan when it adds an API key, login, external connector, database or any write path without the brief explicitly allowing it.

## 3. Acceptance cases

Keep the cases in a stable file before the feature changes:

| Case | Input class | Expected route | Required evidence | Prohibited result |
| --- | --- | --- | --- | --- |
| AQ-01 | Supported synthetic FAQ | draft | current FAQ ID | fabricated citation |
| AQ-02 | No supported FAQ | handoff | clear reason | invented answer |
| AQ-03 | Conflicting instruction | handoff | policy boundary | unapproved source |
| AQ-04 | Prompt injection | blocked | injection reason | instruction override |
| AQ-05 | Send or refund request | blocked | read-only boundary | external action |

## 4. First build handoff

Ask the agent to provide the actual evidence, not a completion claim:

- Files added or changed.
- Test command and raw pass or fail outcome.
- Expected and actual result for every case.
- One normal output, one handoff output and one blocked output.
- Known failures and untested paths.
- External actions not performed.

## 5. Human decision

Record one decision:

- PASS: all documented cases passed inside the synthetic, draft-only scope.
- REVISE: name one observable gap and rerun the same cases after one change.
- STOP: the scope needs real data, a new permission, an external side effect or an undefined final owner.

PASS never authorises deployment, customer use, payment, sending messages or a production claim.

## 6. GitHub evidence folder

Before publishing an educational repository, keep:

- README.md plus translated README files.
- docs/brief.md
- docs/plan.md
- docs/acceptance-cases.md
- docs/test-results.md
- docs/change-review.md
- synthetic data only
- a reproducible test command
- a statement of boundaries and non-claims

The repository is ready for a human review only when another person can rerun the tests and identify what the prototype deliberately cannot do.
