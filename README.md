# AI.DOG Learning & Portfolio Library

Public, localized, static-first AI learning and portfolio resource site with neutral written Traditional Chinese, Simplified Chinese and English editions. It is for people learning AI and building work another person can inspect; the language editions are not audience or geographic restrictions. It is intentionally isolated from the private `content-studio/` application and never reads that database at runtime.

## Local development

```powershell
npm ci
npm run validate
npm run typecheck
npm run lint
npm run dev
```

Apply the local D1 migration before testing the waitlist. The local configuration keeps `WAITLIST_COLLECTION_APPROVED=false`, so the API rejects all inserts unless an owner-approved environment explicitly sets it to `true`. Production deployment, Cloudflare project creation, domain purchase, analytics activation and live waitlist collection require separate owner approval.

The articles and learning labs are deliberately marked `review`. Local builds include them so the owner can review the complete experience, while `npm run release:check`, `npm run build:release`, and `npm run deploy` fail closed until every article, lab and reader path is explicitly changed to `approved`, `OWNER_PUBLICATION_APPROVED=true` is supplied, `SITE_ORIGIN` is an exact non-local HTTPS origin, `PRIVACY_EMAIL` is a non-placeholder brand inbox, and the privacy page no longer carries its owner-review marker. These checks only prepare a local release decision; they do not deploy or prove that an inbox, retention process, or external platform is ready.

## Publication contract

Every public route serves `zh-Hant`, `zh-Hans`, or `en`. Existing regional Traditional-Chinese source files remain internal migration input; runtime content normalizes them to the neutral `zh-Hant` edition. `npm run validate` fails closed on missing translations, downloads, sources, expired review dates or internal markers.

The preview remains `noindex, nofollow`. An approved `npm run build:release` switches indexing through the same explicit owner-publication gate; do not point a production build directly at `npm run build`.

See [the local deployment-readiness handoff](docs/deployment-readiness.md) before requesting any preview or production release.
