# Release gate

## Status

Not approved for deployment, external use, customer use, vulnerability management, or a live-data connection. This is a local portfolio reference.

## Required evidence before any separate release decision

| Gate | Required evidence | Owner outside this package |
| --- | --- | --- |
| Scope | A named organisation, workflow owner, intended users, decision, exceptions, and human handoff | Product and security owner |
| Data | Approved acquisition route, licence review, update cadence, source integrity checks, retention, and data minimisation | Data and security owner |
| Asset boundary | Authorised asset source, matching policy, privacy review, and explicit ownership of false-positive and false-negative outcomes | Asset and security owner |
| Model boundary | Model choice, prompt versioning, supported and refusal cases, quality measures, cost limits, and data handling review | Engineering and security owner |
| Evaluation | Representative, reviewed test cases; baseline comparison; regression threshold; error taxonomy; and sign-off criteria | Engineering and domain reviewer |
| Operations | Logging policy, monitoring, incident response, rollback, access control, change review, and an external-action contract | Operations and security owner |
| Legal and governance | Jurisdictional, contractual, privacy, security, and compliance review appropriate to the intended setting | Responsible owner and advisers |

## Local check sequence

1. Run `npm test`.
2. Run `npm run fixture:validate`.
3. Run `npm run demo`.
4. Review `CHANGE-001` and run `npm run eval:diff` only as an illustrative report comparison.
5. Confirm that every non-claim in the README and source manifest remains true.
6. Stop unless a responsible human has supplied the missing authority and the separate release evidence above.

Passing local checks means only that the fixed local contract behaved as declared. It is not approval to publish, deploy, use a live data feed, run Promptfoo against a model, or take an external action.
