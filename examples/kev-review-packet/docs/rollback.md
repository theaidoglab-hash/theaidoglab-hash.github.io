# Rollback plan

## Trigger conditions

Treat the following as a stop condition for any separately proposed extension:

- a source receipt cannot be verified or its licence, version, or freshness is unclear;
- an input contains private, asset, network, contact, or operational data;
- an evaluation shows a declared regression, a new unsafe route, or an overclaim about `Unknown`;
- a proposed feature introduces scanning, patching, ticketing, messaging, asset matching, or another external action;
- a model or data connection changes the local non-claims without a reviewed replacement design.

## Safe rollback state

The safe state is the current local contract: reject unsupported input with `SOURCE_REJECTED`, preserve no raw input in the trace, and execute no action. Do not attempt a compensating scan, patch, notification, ticket, or contact from this package.

## Rollback procedure for a future separately approved extension

1. Disable the extension's access path through its own approved change-control process.
2. Preserve the relevant release artefacts, configuration version, and evaluated case identifiers for review; do not collect extra private data to explain the failure.
3. Route any decision to the accountable human owner using the organisation's approved process outside this package.
4. Compare the failing case against the last approved evidence packet and evaluation report with `scripts/eval-diff.mjs` or an equivalent reviewed method.
5. Update the change record with the failure mode, scope, decision, and whether the local reference should remain a fixture-only example.
6. Re-enter the release gate only after the owner has approved a corrected, independently evaluated design.

This document is a teaching boundary, not an incident-response procedure for a real organisation.
