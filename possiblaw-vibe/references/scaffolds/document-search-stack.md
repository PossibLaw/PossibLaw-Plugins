# Document Search Stack (End-to-End Recipe)

This guide is the assembly instructions — how to wire the individual scaffolds into a working legal-document search app. Source reference: `_source/pipeline.mjs` (the existing orchestration) and `_source/index.mjs` (the public surface).

## The shape

```
[query] -> [adapters] -> [normalize] -> [chunk] -> [embed + upsert] -> [vector query] -> [hybrid rank] -> [prompt-ready pack]
```

Every record carries `{ id, source, title, summary, snippet, url, metadata }` end-to-end. The pipeline never drops the citation URL.

## Choosing adapters

| User need | Adapter |
|---|---|
| Public-company filings, EX-10 exhibits, 10-K/10-Q content | `sec-edgar-adapter.md` |
| Drafted clause exemplars, contract templates | `contractcodex-adapter.md` |
| Internal skill / playbook library | `_source/adapters/skills.mjs` (read source for shape) |
| Custom corpus (user's own docs) | Implement `{ source, search(query, controls) → { records, degradedNotes } }` |

The adapter contract is small — anything that returns normalized records can plug into `pipeline.mjs#runUnifiedSearch`.

## Combining sources

`runUnifiedSearch({ query, sourceScope: "all" | "sec" | "contractcodex" | "skills", ... })` runs the selected adapters, chunks each record, embeds everything into the same vector store, then ranks across sources with a per-source prior (see `_source/rank.mjs`). For multi-source queries, keep `sourceScope: "all"` and let the prior do the weighting; for tightly scoped UX (e.g., a "filings only" tab), narrow the scope.

## Resilience built in

`_source/resilience.mjs` provides `fetchWithRetry`, `withTimeout`, `RpsLimiter`, and `CircuitBreaker`. The pipeline injects the breaker into every adapter call, so one bad source doesn't tank the whole query — failed adapters return `degradedNotes` that surface in `pack.degradedNotes` and flip `pack.mode` to `"degraded"`.

## What the scaffold does NOT solve

Do not ship as-is. Production gaps:

- **Authentication & rate-limit credentials.** SEC requires a real `User-Agent`; ContractCodex needs a ToS-compliant access pattern.
- **Persistence.** `InMemoryVectorStore` is exactly that — process-local, lost on restart. Replace with pgvector/Pinecone/Qdrant before any user-facing deploy.
- **Real embeddings.** `HashEmbeddingClient` is a deterministic placeholder. Swap to OpenAI/Voyage/Cohere (see `vector-retrieval.md`).
- **Scaling fan-out.** Pipeline runs adapters serially in a `for` loop. Parallelize with `Promise.allSettled` if latency matters.
- **Caching.** No HTTP cache, no embedding cache. Add an LRU or Redis layer once query volume crosses ~100/day.
- **Auth/PII handling.** Nothing here scrubs uploaded documents. If the user's app accepts user uploads, add redaction upstream.
- **Observability.** No metrics, no traces. Wire OpenTelemetry around `secFetch` and `vectorStore.query` for production.

## Minimum viable wiring

```js
import { runUnifiedSearch } from "./_source/pipeline.mjs";

const pack = await runUnifiedSearch({
  query: "indemnification cap with carve-outs",
  sourceScope: "all",
  maxEvidence: 8,
});

// pack.synthesis           — one-line summary (with "not legal advice" footer)
// pack.evidence            — ranked, citation-bearing records
// pack.promptContextBlock  — drop straight into an LLM system/user prompt
// pack.mode                — "normal" | "degraded"
// pack.degradedNotes       — populated when an adapter failed
```

That `promptContextBlock` is the bridge into any LLM call. It already enforces "use only cited evidence" and includes the citation URLs verbatim — keep that guardrail.
