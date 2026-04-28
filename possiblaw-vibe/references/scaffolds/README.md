# Legal Retrieval Scaffolds

When your grill session reveals the user needs legal document retrieval — SEC filings, contract clauses, vector search over a legal corpus, or citation-aware RAG — choose the right scaffold here. Each scaffold has a markdown explainer plus verbatim source code in `_source/`. Copy what you need into the user's project.

The verbatim `_source/` is a working starting template extracted from the retired `possiblaw-legal` plugin. Treat it as a reference implementation: it runs, but production deployments need real embeddings, persistent storage, auth, and a real citator (see each scaffold's "what this doesn't solve" section).

## Scaffolds

| Scaffold | When to use | Source |
|---|---|---|
| [sec-edgar-adapter.md](./sec-edgar-adapter.md) | User needs public-company filings (10-K, 10-Q, 8-K, S-1, EX-10 exhibits) | `_source/adapters/sec.mjs` |
| [contractcodex-adapter.md](./contractcodex-adapter.md) | User needs contract drafting, clause libraries, or template ingestion | `_source/adapters/contractcodex.mjs` |
| [vector-retrieval.md](./vector-retrieval.md) | User needs semantic search ("find similar clauses") or RAG over legal text | `_source/vector.mjs` |
| [chunking-pipeline.md](./chunking-pipeline.md) | User ingests long legal docs and needs retrievable, clause-aware units | `_source/chunk.mjs`, `_source/pipeline.mjs` |
| [document-search-stack.md](./document-search-stack.md) | End-to-end recipe — assemble adapters + chunker + vector store into one app | `_source/pipeline.mjs`, `_source/index.mjs` |
| [legal-citation-system.md](./legal-citation-system.md) | Citation anchors, Bluebook formatting, citator gaps to plan around | `_source/normalize.mjs`, `_source/output.mjs` |

## Reading order

If the user's app is greenfield: read `document-search-stack.md` first for the big picture, then drill into the specific adapter scaffolds.

If the user already has a corpus and wants to add semantic search: start with `chunking-pipeline.md` and `vector-retrieval.md`.

If citations are the user's primary concern: read `legal-citation-system.md` first — the scaffold preserves URLs but does not Shepardize.

## Source layout

```
_source/
  adapters/
    sec.mjs            — SEC EDGAR (EX-10 focused)
    contractcodex.mjs  — ContractCodex clause exemplars
    skills.mjs         — Skills/playbook source (referenced; not separately scaffolded)
  chunk.mjs            — clause-preserving chunker
  config.mjs           — env-var config loader
  html.mjs             — HTML stripper
  index.mjs            — public exports
  normalize.mjs        — record schema enforcement
  output.mjs           — prompt-ready pack with citation guardrail
  paths.mjs            — plugin-relative path resolution
  pipeline.mjs         — runUnifiedSearch orchestrator
  rank.mjs             — hybrid scoring (semantic + keyword + source prior)
  resilience.mjs       — retries, timeouts, RPS limiter, circuit breaker
  run-search.mjs       — CLI entrypoint
  runtime.mjs          — runtime helpers
  types.mjs            — source enums + record schema
  vector.mjs           — hash embedder + in-memory store
  README.md            — original module README
```

Do not modify `_source/` files in this scaffolds directory — they are a working starting template. Copy them into the user's project and modify there.
