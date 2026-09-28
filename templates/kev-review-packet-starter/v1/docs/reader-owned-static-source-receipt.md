# Reader-owned static public-source receipt

Status: `TEMPLATE_ONLY` · `NOT_ACQUIRED` · `NOT AN INPUT TO THIS STARTER`

Use this blank record only after an authorised owner has separately obtained a
permitted, fixed public copy. It is a way to show where a future reader-owned
copy came from and what it may be used for. It does not change this starter's
synthetic-only contract: do not place this receipt or a real record in `data/`,
and do not relax the checks in `src/validate.mjs`.

A source URL is a route, not proof that you retrieved a copy. A hash is useful
only when it is calculated from the exact source bytes you retained. Leave a
field as `NOT_RECORDED` rather than guessing.

## 1. Scope before collection

| Field | Record |
| --- | --- |
| Receipt state | `NOT_ACQUIRED` |
| Intended learning decision | `NOT_RECORDED` |
| Data owner / permitted collector role | `NOT_RECORDED` |
| Source-suitability reviewer role | `NOT_RECORDED` |
| Human handoff or escalation owner | `NOT_RECORDED` |
| Retention location and expiry | `NOT_RECORDED` |
| External actions allowed by this receipt | `NONE` |

This receipt is evidence for a future reviewer, not approval to collect,
republish, scan, match assets, patch, open a ticket, or act on a source.

## 2. Source identity

Fill these fields only after checking the source's terms and the copy you
actually retained.

| Field | Record |
| --- | --- |
| Canonical catalogue or landing-page URL | `NOT_RECORDED` |
| Static-copy origin URL | `NOT_RECORDED` |
| Licence or terms URL | `NOT_RECORDED` |
| Terms checked at (UTC) | `NOT_RECORDED` |
| Source checked at (UTC) | `NOT_RECORDED` |
| Source release, catalogue version, or immutable commit | `NOT_RECORDED` |
| Source release time, if supplied | `NOT_RECORDED` |
| Schema URL | `NOT_RECORDED` |
| Schema version, commit, or SHA-256 | `NOT_RECORDED` |
| Parser version | `NOT_RECORDED` |
| Transformation version | `NOT_RECORDED` |

If you choose CISA's Known Exploited Vulnerabilities catalogue as a learning
source, start with its [catalogue page](https://www.cisa.gov/known-exploited-vulnerabilities-catalog),
[official JSON feed](https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json),
[official JSON Schema](https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities_schema.json),
and [licence notice](https://www.cisa.gov/sites/default/files/licenses/kev/license.txt).
Those links are starting points only; this package has not downloaded them.
If a mirror is used for reproducibility, record an immutable commit or release,
not a moving branch name.

## 3. Retained static copy

| Field | Record |
| --- | --- |
| Receipt state after retention | `STATIC_COPY_RETAINED` only after every field below is complete |
| Retrieved at (UTC) | `NOT_RECORDED` |
| Local retention reference | `NOT_RECORDED` |
| Raw-byte SHA-256 | `NOT_RECORDED` |
| Byte size | `NOT_RECORDED` |
| Source-provided record count | `NOT_RECORDED` |
| Selected-record rule | `NOT_RECORDED` |
| Selected record identifier, if any | `NOT_RECORDED` |

Do not copy a hash, count, version, or timestamp from this exercise. Record
the values from the static bytes and source state you personally retained.

## 4. Field boundary

Describe the projection that may enter a learning packet. It should contain
only public fields needed for the stated exercise.

| Field | Record |
| --- | --- |
| Allowed source fields | `NOT_RECORDED` |
| Required source fields | `NOT_RECORDED` |
| Excluded source fields | `NOT_RECORDED` |
| Free-text field policy | `EXCLUDE_BY_DEFAULT` |
| Private, asset, customer, incident, contact, or credential fields | `PROHIBITED` |
| Observed fields in retained copy | `NOT_RECORDED` |
| Missing or unexpected fields | `NOT_RECORDED` |
| Validation result | `NOT_RECORDED` |

Free-text notes are excluded by default. A future use may allow one only when
its purpose, privacy review, and source-field policy are written down; a local
fixture label is not source data.

## 5. Review decision

| Field | Record |
| --- | --- |
| Suitability decision | `HOLD_FOR_REVIEW` |
| Reason and known limitations | `NOT_RECORDED` |
| Reviewer role and review date | `NOT_RECORDED` |
| Stop condition | `NOT_RECORDED` |
| Next permitted step | `HUMAN_REVIEW_ONLY` |

Use the existing [reviewer decision record](reviewer-decision.md) for the
broader ownership, evaluation, and release decision. A completed receipt does
not replace that record.

## What this receipt cannot establish

- That the catalogue is current, complete, or suitable for a real decision.
- That any organisation, asset, account, network, or person is affected.
- That a source's `requiredAction` applies in a particular environment.
- That a human has approved remediation, release, or external action.
- That this starter has acquired, validated, or processed real source data.

A retained copy and matching hash establish only that your local bytes match
this receipt at the stated point in time. Keep the source, the learning
projection, and any real operational decision separate.
