# Editorial language review — 2026-09-25

Status: internal review note. This is a writing-quality pass, not a claim that every public page has been line-edited or approved for publication.

## Scope of this pass

This pass covers the reader's first contact with the site:

- Start Here
- the AI-use route and its two starter labs
- Interview Lab
- the roadmap and Prompt Play series headers
- the portfolio planner's introduction, choices, and result labels
- the local verification receipt shown beside fixture-only portfolio examples

Long-form lessons keep technical vocabulary where it names an actual mechanism, file, protocol, test, or user-interface control. They need a separate, line-by-line editorial pass; this pass does not pretend otherwise.

After a representative read-through, this pass also revises the openings or central passages of high-traffic zh-HK lessons on interview practice, non-coder and coder workflows, course-to-portfolio work, shared AI terminology, retrieval, evaluation, PolicyPilot, renewal triage, agent operation, batch work, model scores, and authorised pilots, plus roadmap stage 13. Across all locales, the remaining `Core judgement`／`核心判斷`／`核心判断` labels were removed so the opening claim speaks for itself. Those fixes remove recurring framing shells; they are not a claim that the full long-form library has received a complete copy edit.

A rendered-page follow-up also covered the Hong Kong Start Here page, roadmap preview, Interview Lab capability cards, live-interview controls, learning planner, local route rehearsal, and portfolio planner. It corrected machine-translation leftovers such as `我的` and `的`, and changed abstract menu labels into the thing a reader can actually do or leave behind.

## What was wrong

The earlier copy had three recurring problems.

1. It used internal shorthand as an introduction. Strings such as `owner`, `baseline`, `evaluation`, `handoff`, and `nonclaims` appeared as a bundle before a reader knew what they needed to do.
2. It relied too often on polished teaching shells: “not X but Y”, “first X, then Y”, and evenly balanced lists. Those structures can help once, but repeated use makes the copy sound generated rather than written for a person.
3. It called an abstract thing “evidence” when the page could name the actual output: a README note, a fixed case, a change record, a reviewer decision, or a first work brief.

## Editorial decisions

Entry pages now lead with a concrete action or question. For example, a reader sees “who is making the decision?”, “what may this tool read?”, or “how would you check the result?” before they meet formal vocabulary.

In Hong Kong Chinese, this also means using ordinary Cantonese phrasing at the first touchpoint: `我嘅 portfolio 太似 demo`, `由你而家卡住嘅事開始`, and `帶呢條題去 AI 對話模式練一次`. Formal technical terms can appear one screen later, after the reader knows why they need them.

Use the precise English term only when it is needed to work with a real tool or codebase. On an introductory Chinese page:

- `owner` becomes the person who makes the final call.
- `baseline` becomes a comparison approach or manual comparison.
- `evaluation` becomes a check or test method.
- `human handoff` becomes returning the case to a person.
- `fixture` becomes fixed practice data unless the file-level concept matters.
- `evidence` becomes the thing that can actually be shown: a test case, README note, decision record, or completed exercise.
- `nonclaims` becomes what the work does not prove or cannot claim yet.

Terms such as idempotency, RAG, diff, rollback, heap, and cursor remain where the lesson teaches the implementation concept. They are introduced in a sentence that explains the practical consequence instead of appearing in a slogan-like list. For example, the two new implementation questions distinguish a priority queue from the authoritative work record, and a source cursor from a cross-source ordering promise; their analogies preserve the real version-policy decision instead of substituting a decorative metaphor.

The repeated analogy heading once used across the question bank and an older model-score lesson has been retired as well. Each section now earns a heading from its own decision or failure mode—for example, a queue slip is not the case record, three bookmarks are not one global order, and a teacher's tray is not a leaderboard. The voice check rejects the old generic heading in all four languages so a later addition cannot quietly restore the same template.

Terminology also needs factual care, not only a more natural tone. For example, P99 is a latency percentile that exposes a slow tail; a wait-time target, SLO, or SLA is the commitment. The serving lesson now keeps that distinction clear.

Entry actions now name the actual check rather than calling a sample "end-to-end" or a route "complete": inspect inputs, evaluation, review, rollback, and delivery boundaries one by one. The portfolio receipt similarly says what a local fixture package is designed to check, names its fixed commands, and states what it does not establish. It never turns a reader-facing label into a claim that a command has run, a repository is public, or a result is production evidence.

The same rule now applies inside longer lessons: a p99 section says which request timings and trace spans to record; an OCR section says what to store separately and how a proposed field must point back to its evidence; agent lessons ask the reader to assemble a review pack around one fixed scenario. That is more useful than separating a paragraph into matching technical and non-technical noun lists.

## Review rule for future edits

Before merging a new entry-page paragraph, read it aloud and ask:

1. Can a reader tell what they should do next without decoding a term bundle?
2. Does every English term name a thing they will encounter in the task, or is it only signalling expertise?
3. Have we named the actual file, case, decision, or result instead of saying “evidence” as a badge?
4. Is a contrast or sequence doing real explanatory work, rather than filling out a template?
5. Does the boundary describe a real limitation, rather than repeating a generic safety slogan?

The public-voice check now protects the specific term stacks removed from these entry surfaces and rejects the repeated `Core judgement`／`核心判斷`／`核心判断` frame in every locale. It is a regression check only; a passing script is not proof that the prose sounds human.

## Follow-up: wording and reader-task audit

The same day, a second read-through focused on the pages where a reader chooses a next step. It changed the Hong Kong Start Here cards from compressed noun lists into short actions: choose a question, name the decision, choose the allowed input, check the result, and leave the final call with a person. The roadmap opening, the retrieval capability card, the system-design card, and the input-contract card received the same treatment.

The interview map now describes the three practice passes as something a reader does with one answer and one item from their own portfolio. It still names `README`, `trace`, `evaluation case`, and `handoff rule` because those are real things a reader may need to open or create; it does not present them as a badge list.

The portfolio planner received a similar rewrite. Its opening now asks the reader to write down a decision, a way to check it, allowed data, a handoff, and a claim limit in sentences before showing specialist vocabulary. Its new downloadable Renewal Triage starter makes the distinction visible in code too: a raw score, a review queue, and a synthetic offline comparison are three different things. The page calls out both the code/test evidence and the delivery/risk record, and it states that the local package cannot establish real retention impact or production approval.

This remains a maintenance rule rather than a claim of a perfect site-wide copy edit. When a new reader-facing sentence contains five or more English nouns, it should be checked against the actual task: retain only the words the reader must type, inspect, or defend, and rewrite the rest as a decision, action, or consequence.
