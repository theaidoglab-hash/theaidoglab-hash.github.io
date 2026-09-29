# Decision log

## DL-001: Use a fixed public-data fixture instead of live acquisition

- Date: 2026-09-24
- Decision: The reference accepts only `fixture_not_live_acquired` in its source manifest.
- Reason: A portfolio demonstration can show source-receipt, schema, and freshness controls without implying that a test retrieved or validated the changing CISA catalog.
- Consequence: A future live-data design needs its own approved acquisition, retention, verification, evaluation, and release plan.

## DL-002: Keep public catalog evidence separate from asset exposure

- Date: 2026-09-24
- Decision: Any asset claim, private field, network detail, contact detail, or operational input returns `SOURCE_REJECTED`.
- Reason: A public vulnerability record cannot establish whether an organisation owns, exposes, patches, or is affected by a product.
- Consequence: The reference cannot become a scanner, inventory matcher, ticket system, or remediation workflow by configuration.

## DL-003: Preserve source prose as data

- Date: 2026-09-24
- Decision: `shortDescription`, `requiredAction`, and `notes` are copied into a `sourceProse` object only after validation.
- Reason: Catalog prose is provenance-bearing data. It is not executable authority, a prompt instruction, or a local runbook.
- Consequence: A wrapper-note injection is rejected before packet construction. The package does not parse source prose into an action.

## DL-004: Preserve ransomware-use uncertainty

- Date: 2026-09-24
- Decision: The contract accepts `Known` and `Unknown` and preserves each exact value.
- Reason: `Unknown` means the supplied source has not confirmed a ransomware-use classification. It must not be transformed into an assurance of no ransomware use.
- Consequence: The fixed evaluation includes a no-overclaim case and `CHANGE-001` makes its pass condition explicit.

## DL-005: Treat ACSC guidance as context, not deadline conversion

- Date: 2026-09-24
- Decision: The source receipt records ACSC patch guidance only as Australian operational context.
- Reason: A CISA catalog due date is source metadata, not an Australian contractual or service-level deadline.
- Consequence: The packet copies the due date and contains an explicit boundary statement. It does not calculate, recommend, or enforce a deadline.

## DL-006: Make model and Promptfoo layers optional

- Date: 2026-09-24
- Decision: The reference ships a static `gpt-5-mini` request-shape object, a local Promptfoo fixture configuration, and an optional Responses configuration, but does not run any of them in scripts or CI.
- Reason: The core business and safety evidence should be reviewable without a credential, model, network access, cost, or claim about model quality.
- Consequence: A future model experiment requires independent authority, a credential decision, a bounded evaluation set, review of data handling, and a release decision.
