# Decision brief

**Status: local synthetic teaching artifact.** This brief defines a workflow
boundary; it does not authorise a pilot, release, data connection, or customer
communication.

## The business decision

The fictional operations owner wants a reviewer to receive a source-cited
draft only when a current approved synthetic FAQ supports the question. The
reviewer remains responsible for the final wording and outcome. The package
does not answer whether automation saves time or improves support; it gives a
reviewer an inspectable draft-or-stop decision.

| Item | Definition in this exercise |
| --- | --- |
| Decision owner | Fictional FAQ Operations Owner |
| Input | One invented question plus an optional requested action |
| Permitted output | A cited draft for a human reviewer, or a stop/handoff reason |
| Prohibited output | A sent reply, ticket, refund, account read, record update, or final decision |
| Source rule | Only a current, approved synthetic FAQ can support a draft |
| Failure rule | Missing support, unsafe wording, stale source, invalid fixture, or template failure stops the draft path |

## What is measured here

The package measures only deterministic route behaviour against a checked-in
fixture. The tests make it possible to see whether a code change accidentally
allows an unsupported draft or external action.

It does **not** measure a business result. For a separate, authorised pilot,
the future measurement question could be: what proportion of eligible drafts
that reach human review are both approved by the reviewer and labelled
source-supported, within a pre-agreed review window? The denominator would be
eligible drafts reaching review in that same window, compared with a manual
baseline defined before observation begins.

That definition is included so a portfolio discussion does not jump from a
working local demo to an invented efficiency claim.

## Release and rollback boundary

`npm test` and `npm run demo` can support only `LOCAL_FIXTURE_REFERENCE_OK`:
the package still uses fictional records, no credentials, no network, no model,
and no external action. They cannot approve any real use.

Hold or stop the proposed change if a test fails, a source is unclear, a human
reviewer is absent, an action route appears, or real/private material enters
the package. The rollback is operational: keep the work in the existing manual
process while the issue is reviewed. There is no deployed service, database,
queue, or automatic rollback in this starter.
