# Owner-review measurement plan

Status: `OWNER_REVIEW_REQUIRED`  
Scope: a proposed post-deployment measurement plan for the public library. This document does not add analytics, set cookies, transmit reader data, or authorise collection.

## Decision this measurement must support

After a limited, approved deployment, decide whether the library helps readers take a useful next step and which route needs improvement before any paid offer is designed.

It must not be used to infer a reader's identity, job search, employer, income, immigration status, or donation. It must not treat an outbound support-link click as a payment.

## Proposed primary measures

No numerical targets are set before an approved launch: there is no representative baseline, traffic source, or consent decision yet. Collect an agreed baseline first, then set targets from observed distributions and the capacity to act on the result.

| Measure | Definition | Decision it informs | Important limit |
| --- | --- | --- | --- |
| Entry-to-next-action rate | Approved anonymous sessions that open Start Here and then reach the destination selected from one of its four route cards, divided by approved anonymous Start Here sessions. | Does the entry page help a newcomer choose a meaningful route? | It cannot show learning, job readiness, or satisfaction. |
| Evidence-action rate | Approved anonymous sessions that open a planner, lab, or worked example and then take one non-sensitive action such as opening a named question, downloading a worksheet, or opening a local example. | Which hands-on surface deserves simplification or further content? | Do not log planner selections, score, free text, or any project details. |
| Return-to-library rate | Approved anonymous sessions that return on a later day within an agreed window, divided by approved anonymous sessions in the same entry cohort. | Is the material useful enough to revisit after the first read? | Requires an owner-approved, privacy-reviewed session method; do not use fingerprinting. |
| Support-link intent rate | Approved anonymous support-page views followed by an outbound Buy Me a Coffee link click. | Is voluntary support copy discoverable and non-confusing? | A click is not a donation, subscription, revenue, or willingness to pay. |

## Minimal event contract

If the owner approves a privacy-preserving measurement provider, collect only the smallest event set needed for the measures above:

| Event | Allowed properties | Explicitly excluded |
| --- | --- | --- |
| `route_viewed` | locale, route family, public content ID, release version | full URL query strings, referrer URL, IP address, user agent, fingerprint, search text |
| `start_path_selected` | one of `interview`, `portfolio`, `ai-use`, `roadmap`; locale; release version | identity, employment details, project idea or free text |
| `evidence_action_taken` | surface family, action family, public content ID, locale; release version | planner inputs, scores, download contents, copied prompts |
| `support_link_opened` | locale, support-page variant, release version | payment result, external account data, payment amount |

Do not fire a waitlist event while collection is disabled. If an owner later approves a waitlist, its consent, email handling, retention, and access/deletion workflow are a separate measurement and privacy decision.

## Guardrails before any implementation

- Choose the provider, storage location, retention period, consent model, access owners, and deletion process before adding a script or server event.
- Keep events off by default until the owner approves the exact vendor, privacy wording, and configuration.
- Do not collect content entered into the planners, a reader's search terms, raw referrers, identifiers, precise location, or any information from Buy Me a Coffee.
- Keep public content IDs and release version only long enough to diagnose a content decision; aggregate or delete raw records on the owner-approved schedule.
- Treat dashboard movement as a prompt for review, not an automated product, price, or content decision.

## First review cadence

After a privacy-approved pilot has enough traffic for a stable directional read, review the four measures together once per fortnight:

1. If route views are high but entry-to-next-action is weak, revise the Start Here route labels or first screen before creating more articles.
2. If a route attracts clicks but evidence actions are weak, inspect the first instruction, action label, and page length; do not conclude the topic lacks demand from one proxy.
3. If one surface has repeat use but another does not, prioritise the return surface for a small content or usability experiment with a pre-written success and stop condition.
4. If support-link intent exists, keep treating it as navigation evidence only unless the owner later has platform-side, privacy-appropriate aggregate reporting and approves its use.

## Owner decisions required

- Is the first deployment a private preview or a public launch, and which readers may be measured?
- Which provider and data jurisdiction are acceptable under the brand's privacy, employment, and legal constraints?
- What is the approved notice/consent model, retention period, access owner, and deletion response process?
- What minimum baseline window and traffic volume are sufficient before setting a target?
- Who reviews the fortnightly result, and what reversible changes are allowed without another owner decision?
