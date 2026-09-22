# AI.DOG Career Library

Public, trilingual, static-first career resource site. It is intentionally isolated from the private `content-studio/` application and never reads that database at runtime.

## Local development

```powershell
npm ci
npm run validate
npm run typecheck
npm run lint
npm run dev
```

Apply the local D1 migration before testing the waitlist. Production deployment, Cloudflare project creation, domain purchase, analytics activation and live waitlist collection require separate owner approval.

The five cornerstone articles are deliberately marked `review`. Local builds include them so the owner can review the complete experience, while `npm run release:check`, `npm run build:release`, and `npm run deploy` fail closed until every article is explicitly changed to `approved`, `OWNER_PUBLICATION_APPROVED=true` is supplied, and approved production/privacy settings exist.

## Publication contract

Every public article needs shared metadata, `zh-Hant.mdx`, `zh-Hans.mdx`, `en.mdx`, and matching PDF/Markdown downloads. `npm run validate` fails closed on missing translations, downloads, sources, expired review dates or internal markers.

The preview remains `noindex, nofollow`. Change robots and metadata only as part of an approved public-launch review. For Cloudflare Builds, use `npm run build:release`; do not point a production build directly at `npm run build`.
