# ContractCodex Adapter

Source: `_source/adapters/contractcodex.mjs` (verbatim from retired `possiblaw-legal/retrieval`).

## When to use

Reach for this scaffold when the grill reveals the user wants **contract drafting, clause libraries, or template ingestion** — i.e., they need exemplar clauses, not regulatory filings. Signals:

- "Show me five examples of how SaaS NDAs handle confidentiality carve-outs."
- "Build a clause library for limitation-of-liability variants."
- "Suggest indemnification language with precedent."

Pair this with `sec-edgar-adapter.md` when the user wants both private clause exemplars and public filings (the original pipeline runs both in parallel — see `_source/pipeline.mjs`).

## What it does

Factory `createContractCodexAdapter({ fetcher, enabled, fallbackPath })` returns `{ source: "contractcodex", search(query, controls) }`. Live path:

1. Fetches `https://www.contractcodex.com/site-map`.
2. Extracts candidate URLs by token overlap with the query.
3. Pulls top 8 pages, strips HTML, and emits a snippet up to 1400 chars.

Local fallback parses `skills/legal/references/contractcodex-index.md` for offline / degraded operation. Results dedupe by `url + sha1(snippet)`.

## Output fields

Records are normalized via `normalizeContractCodexEntry` (`_source/normalize.mjs`):

```
{ id, source: "contractcodex", title, summary, snippet, url,
  metadata: { topic, jurisdiction, tags } }
```

`title` comes from the page `<h1>` (or `<title>` fallback). `snippet` is the stripped body, capped. `url` is the original ContractCodex page — keep it for citation.

## Import

```js
import { createContractCodexAdapter } from "./_source/adapters/contractcodex.mjs";

const cc = createContractCodexAdapter({ enabled: true });
const { records, degradedNotes } = await cc.search("limitation of liability cap", {
  timeoutMs: 8000,
  retries: 2,
});
```

## Caveats

- ContractCodex is a third-party site; respect their ToS in any production deployment. The scaffold uses naive HTML scraping — replace with their official API if/when one exists.
- The `enabled` flag and `ENABLE_CONTRACTCODEX` env var let you turn the source off without code changes.
- No jurisdiction filtering is applied beyond what the page text contains. If the user needs jurisdiction-aware retrieval, add post-filtering on `metadata.jurisdiction`.
