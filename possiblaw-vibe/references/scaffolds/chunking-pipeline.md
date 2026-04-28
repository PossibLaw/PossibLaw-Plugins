# Chunking Pipeline

Sources: `_source/chunk.mjs`, `_source/pipeline.mjs` (verbatim from retired `possiblaw-legal/retrieval`).

## When to use

Legal documents are long — 10-Ks run hundreds of pages, master agreements span dozens. Embedding or LLM-prompting raw documents wastes tokens and dilutes signal. Use this scaffold whenever the user's app ingests multi-page legal text and needs **retrievable units that respect clause boundaries**.

## What it does

`chunkTextPreserveClauses(text, { targetMin = 500, targetMax = 900, overlapChars = 120 })` returns `string[]`:

1. Normalizes whitespace.
2. Splits on `.`, `;`, or `:` followed by whitespace + a capital/digit/`(` — a heuristic for clause/sentence boundaries that handles enumerated lists like `(a)`, `(b)`.
3. Greedily packs clauses into chunks up to `targetMax` chars.
4. Carries a tail of `overlapChars` from the previous chunk into the next, so split clauses retain context for embedding.
5. Hard-splits any single clause longer than `targetMax`.
6. Merges a trailing chunk shorter than `targetMin` back into the prior one when total stays under `targetMax`.

Defaults (500–900 chars, 120 overlap) are tuned for legal prose density and ~256-token embedding windows. Adjust upward for longer-context embedders.

## Where it sits in the pipeline

`_source/pipeline.mjs#chunkRecord` calls the chunker against `record.snippet` (post-adapter), then re-emits one record per chunk with a stable derived id:

```
${record.id}:chunk:${idx}:${sha1(snippet).slice(0,8)}
```

That id pattern is load-bearing — it keeps chunks deduplicable and traceable to the parent record (and thus the citation URL). Preserve it when extending.

## What this scaffold doesn't do

- **No section-header preservation.** The chunker is text-only; it doesn't carry "Section 5.2 — Indemnification" forward. If the user needs section anchoring, parse headers upstream (during adapter normalization) and store them in `record.metadata` before chunking.
- **No page numbers.** SEC HTML and ContractCodex pages don't carry pagination. For PDF ingestion, run `pdfjs`/`pdf-parse` first and inject `metadata.page` per chunk.
- **No citation anchors beyond the parent URL.** All chunks of a record share the same `url`. For pin-cite precision, see `legal-citation-system.md`.

## Pattern

```js
import { chunkTextPreserveClauses } from "./_source/chunk.mjs";

const chunks = chunkTextPreserveClauses(longText, { targetMax: 1200, overlapChars: 200 });
```
