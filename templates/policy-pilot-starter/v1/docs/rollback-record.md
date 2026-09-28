# Rollback record

Status: future operating template. Nothing here is a deployed rollback mechanism.

## Local exercise boundary

If a change makes the fixture non-synthetic, adds a credential, introduces a network request, or gives the code external authority, stop using the package as a public-safe starter. Remove the unsafe material from the local exercise branch or return to the last known safe fixture-only version after a human review.

## Future service questions

Before any real release, an owner would need to record:

1. the version of the source corpus and code;
2. the evaluation result and the reviewer who accepted it;
3. the signal that triggers a rollback or pause;
4. the person allowed to disable the assisted path; and
5. the manual policy-review route that remains available while the path is paused.

For a policy-answer assistant, the conservative rollback is to disable the assisted draft and return to manual policy lookup. That is a future design decision, not a capability of this package.
