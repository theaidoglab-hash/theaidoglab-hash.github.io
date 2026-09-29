# Deployment readiness: local owner handoff

This is a local checklist, not release authority. Do not create a Cloudflare project, provision D1, add a domain, enable a Turnstile site, activate Buy Me a Coffee collection, upload this repository, or run `npm run deploy` until the owner has explicitly approved the exact public release.

## Current state

`LOCAL_REVIEW_ONLY`

| Area | Current evidence | What remains before a public release |
| --- | --- | --- |
| Content | Articles, labs, and reader paths are intentionally `review`. | Owner review and explicit `approved` status for every item included in the release. |
| Release gate | `OWNER_PUBLICATION_APPROVED=true`, approved content statuses, an exact HTTPS non-local/non-placeholder `SITE_ORIGIN`, a non-placeholder `PRIVACY_EMAIL`, and a privacy page without its owner-review marker are required by `npm run release:check`. The checked-in release manifest is also explicitly `LOCAL_REVIEW_ONLY`; a `PUBLIC_RELEASE` is rejected until it has a verified scoped route-and-asset build. | Owner approval plus a real, monitored brand privacy address and a completed privacy/retention operating process. The gate does not deploy, provision, or verify the inbox. |
| Scoped release | The normal build intentionally contains all local-review content, including client-side planner modules and direct static downloads/templates. Runtime hiding would not remove that material from a public artifact. | Build a small, manifest-selected artifact; prove excluded routes, client chunks, RSS/sitemap entries, downloads, templates, and content signatures are absent before any public deployment. |
| Domain and SEO | Root metadata and `robots.ts` currently keep the site `noindex, nofollow` and disallow all crawling. Sitemap and RSS deliberately use `SITE_ORIGIN`; the single RSS route currently emits English article copy. Each locale route server-renders its matching document `lang`. | Decide whether the first deployment is a private/direct-link preview or a searchable launch, and whether the RSS feed stays English-only or gains locale-specific feeds. A searchable launch needs a reviewed change to robots and metadata, the approved canonical domain, and a post-deploy sitemap/RSS check. |
| Waitlist | The local migration chain contains `0002_split_traditional_chinese_locales.sql`, `npm run validate:waitlist` checks it against `LOCALES`, and `npm run validate:turnstile` checks that the Worker runtime public key is handed to the browser rather than frozen into the client bundle. The page renders no email form or Turnstile script while collection is disabled, and the route rejects all inserts unless `WAITLIST_COLLECTION_APPROVED=true`; every local/default configuration keeps that value false. | Provision the approved D1 database only after approval, replace the placeholder database ID, apply migrations only to that approved database, configure a real Turnstile site key and secret, and approve the privacy/retention operating process. |
| Retention | The privacy page describes a planned 12-month inactive-record deletion. | Implement and owner-review the deletion/access/export procedure before live collection. The current code does not schedule deletion. |
| Support | The support card links directly to the fixed Buy Me a Coffee page as an external voluntary-support link. | Keep the support wording accurate, provide a support contact, and ensure the Buy Me a Coffee page has the applicable tax, privacy, and refund information before public release. |
| Analytics and identity | No analytics activation is part of this handoff. Public copy is designed for anonymous branding. An owner-review-only [measurement plan](./owner-review-measurement-plan.md) defines the smallest proposed event set and explicitly excludes planner inputs, reader identity, and payment outcomes. | Choose analytics, consent, contact details, retention, and any public attribution only after privacy and identity review. |

## Local preflight

Run these in the `public-site` directory after all content changes are stable:

```powershell
npm ci
npm run validate:examples
npm run validate:interview-voice
npm run validate:waitlist
npm run validate:turnstile
npm run validate:support
npm run validate:release-gate
npm run validate
npm run typecheck
npm run lint
npm run build
```

`npm run validate:sources` requires outbound network access. Treat a sandbox connectivity failure as inconclusive, then run it only in an approved environment. It checks reachable URLs; it does not prove copyright, licence suitability, factual accuracy, or public-release approval.

For the migration contract, a local-only D1 smoke test may use `wrangler d1 migrations apply <binding> --local`. Never add `--remote` during this review step. Use synthetic addresses only; do not put a real waitlist email into a local test database.

## Release decision checklist

The owner must explicitly confirm all of the following before any remote action:

1. The exact commit, included content IDs, release target, and whether the deployment is preview-only or publicly indexable. Record the owner-approval and source-rights review references in the release manifest; do not substitute a URL, a free-form note, or a placeholder.
2. Approval status for every article, lab, reader path, privacy notice, support wording, and any downloadable material.
3. The canonical domain, brand privacy inbox, legal/tax obligations, data processors, retention/deletion process, and an owner for subject-access or deletion requests.
4. Whether waitlist collection is enabled, the approved D1 database, Turnstile settings, secret-management path, and incident/rollback owner.
5. Whether voluntary support collection is enabled, including Buy Me a Coffee platform review and the required customer/support contact details.
6. Whether indexing is enabled, including the reviewed `robots.txt`, metadata robots value, canonical URLs, sitemap, RSS feed, Open Graph preview, and language alternates.
7. A scoped-artifact check proving that excluded routes, client chunks, downloads, templates, RSS/sitemap entries, and content signatures are absent. Do not rely on a runtime 404 or hidden navigation as proof.
8. A production browser pass on desktop and mobile: homepage, localized routes, a deep article, an interview question, download links, sitemap, RSS, privacy, support, 404 behaviour, and error handling for a disabled waitlist.

## Configuration contract after approval

Keep secrets outside Git. Replace only approved placeholders through the platform's environment/secret mechanism. The angle-bracket values below are documentation placeholders, not deployable settings; the release gate rejects placeholder, local, and invalid values:

```text
SITE_ORIGIN=<approved canonical HTTPS origin>
PRIVACY_EMAIL=<approved monitored brand privacy inbox>
NEXT_PUBLIC_TURNSTILE_SITE_KEY=approved-public-site-key
TURNSTILE_SECRET_KEY=platform-secret
OWNER_PUBLICATION_APPROVED=true
WAITLIST_COLLECTION_APPROVED=true  # only if live collection was separately approved
```

Update `wrangler.jsonc` with the approved D1 identifier only after the database exists. Do not turn a preview placeholder into an inferred production value. The public Turnstile variable name must remain `NEXT_PUBLIC_TURNSTILE_SITE_KEY`; the secret stays private.

## Safe rollback boundary

Before deployment, record the current live version (if any), the exact target commit, the D1 migration list, and who can disable waitlist/support. A content rollback must not silently delete consent records. A data migration rollback needs an owner-reviewed plan; do not improvise destructive D1 commands.
