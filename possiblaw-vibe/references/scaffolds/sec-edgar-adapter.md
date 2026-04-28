# SEC EDGAR Adapter

Source: `_source/adapters/sec.mjs` (verbatim from retired `possiblaw-legal/retrieval`).

## When to use

Choose this scaffold when the grill session reveals the user's app needs **public-company filings** — 10-K, 10-Q, 8-K, S-1, proxy statements, or material contract exhibits (EX-10). Typical signals:

- "Pull all material contracts from Apple's last 10-K."
- "Search EX-10 exhibits across SaaS companies for indemnification language."
- "Cite the latest 8-K from $TICKER."

If the user wants private contracts, internal memos, or non-SEC filings, this is the wrong adapter. See `contractcodex-adapter.md` or build a custom source.

## What it does

Factory `createSecAdapter({ fetcher, userAgent, rps, fallbackPath })` returns `{ source: "sec", search(query, controls), secFetch, fetchDocumentText }`. Two retrieval paths, in order:

1. **EFTS full-text search** (`https://efts.sec.gov/LATEST/search-index`) — topic-based, filters to `EX-10*` file types.
2. **Ticker fallback**: hits `company_tickers.json`, picks top matches by token overlap, walks `/submissions/CIK*.json`, opens each filing's `index.json`, and pulls `ex-10*` exhibits.
3. **Local fallback catalog**: parses a markdown index at `skills/legal/references/sec-exhibits-index.md` so the adapter still returns results when the network fails.

Output records are normalized via `normalizeSecEntry` (see `_source/normalize.mjs`) with fields: `id, source: "sec", title, summary, snippet, url, metadata.{company, formType, exhibitType, filingDate, topic, tags}`.

## Rate limits & headers

SEC requires a declared `User-Agent`. Default is `"PossibLawLegalSkills/1.3.2 (contact: support@possiblaw.com)"` — **change this for any redistributed app**. Adapter ships with `RpsLimiter` defaulting to 5 rps (SEC's published cap is 10 rps; staying under is polite). Configure via `SEC_USER_AGENT` and `SEC_RPS` env vars (see `_source/config.mjs`).

## Import

```js
import { createSecAdapter } from "./_source/adapters/sec.mjs";

const sec = createSecAdapter({ userAgent: "MyApp/1.0 (you@example.com)" });
const { records, degradedNotes } = await sec.search("indemnification cap", { timeoutMs: 8000 });
```

## Citation note

Filing URLs returned point to `sec.gov/Archives/edgar/data/...`. These resolve to canonical filing locations and are Bluebook-citable as primary public records. See `legal-citation-system.md` for citation construction.
