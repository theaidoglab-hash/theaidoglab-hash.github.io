# Portfolio Evidence Handoff Pack

[繁中（香港）](README.zh-HK.md) · [繁中（台灣）](README.zh-TW.md) · [简体中文](README.zh-Hans.md)

Status: reader-owned local template. It is a small handoff scaffold for turning one fixture-first portfolio project into material that a reviewer can inspect. It contains no repository, dependency, credential, network step, automated publication, or claim about a live system.

Use this after a local project has a clear problem statement and before anyone considers sharing a repository. The point is not to make a demo look larger. The point is to separate what was actually observed from what is still unknown.

## What this pack helps a reviewer see

| Evidence | Question it answers |
| --- | --- |
| Project brief | Which human decision is in scope, and what remains out of scope? |
| Source and data receipt | Where did every input come from, and was it permitted for this use? |
| Run receipt | What was actually run locally, on which bounded material, with which result? |
| Claims and non-claims | Which conclusions are supported, and which tempting conclusions are not? |
| Reviewer decision | Who examined the material and what did they decide? |
| Rollback record | What can be reversed or stopped if the candidate is unsafe or misleading? |
| License decision | Is there a documented basis for sharing any code or material? |
| Repository candidate checklist | Is the pack ready for an owner to consider a GitHub candidate? |

The included documents start in an intentionally incomplete state. “Not recorded” and “NOT_RUN” are honest states, not gaps to hide.

## Use it locally

Requires Node.js 20 or later. No packages need to be installed.

1. Keep the pack alongside one local portfolio project.
2. Record only evidence you can inspect yourself. If a fact is unknown, retain the unknown state.
3. Update the receipts after a bounded local run; do not infer a result from code that has not been run.
4. Run the structural check:

       node scripts/validate-portfolio-evidence.mjs

5. Ask an appropriate owner or reviewer to decide whether any future sharing is acceptable.

`ci/local-evidence-check.yml.example` is deliberately inactive. It is a small
example of a read-only structural check a reviewer may adapt only after the
repository candidate, data boundary, and command path have been reviewed. It
is not inside `.github/workflows`, cannot run as supplied, and does not make a
CI, repository, or publication claim.

The check looks for missing required artifacts, unresolved template markers, obvious credential-like material, and repository-host URLs that could be invented. A passing result means only that the handoff structure is ready for owner review. It does not establish a valid run, evaluation quality, source permission, repository safety, approval, publication, deployment, security approval, business impact, or production readiness.

## Evidence boundary

- Treat fixture, synthetic, public, licensed, and owner-provided material as different categories. Record the category; do not collapse them into “data.”
- Do not put secrets, private prompts, internal screenshots, personal data, customer data, employer material, or unapproved source extracts in this pack.
- A local run can be useful evidence. It is not evidence that a real business would get the same outcome.
- A reviewer may request changes, decline sharing, or keep the project private. The checklist has no automatic approval path.
- Do not create, name, link, or publish a public repository until an authorised owner has made that decision.

## Package map

    README.md
    README.zh-HK.md
    README.zh-TW.md
    README.zh-Hans.md
    docs/
      project-brief.md
      source-data-receipt.md
      run-receipt.md
      claims-and-nonclaims.md
      reviewer-decision.md
      rollback-record.md
      LICENSE_DECISION.md
      github-candidate-checklist.md
    ci/
      local-evidence-check.yml.example
    scripts/
      validate-portfolio-evidence.mjs

Keep source code and the English evidence records in English so a reviewer can navigate them consistently. The localized READMEs explain the pack to readers; they are not evidence records.

## A useful five-minute walkthrough

Start with the decision and its boundary, not a model screenshot:

1. Show the one decision in the project brief and the explicit non-goal.
2. Show the source receipt before showing an output.
3. Show one local run receipt, including a failure or blocked state if that is what happened.
4. Read the non-claims aloud before discussing results.
5. End with the reviewer decision and rollback route.

That sequence makes judgment inspectable. It does not turn a local exercise into a production system.

## Before any future sharing

Complete the repository candidate checklist and obtain the relevant owner review. If rights, privacy, source terms, or a claimed outcome are uncertain, retain the project locally and record the uncertainty. This pack is a record of evidence and boundaries, not legal advice or a licence grant.
