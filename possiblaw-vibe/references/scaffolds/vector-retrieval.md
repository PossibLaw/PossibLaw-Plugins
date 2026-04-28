# Vector Retrieval

Source: `_source/vector.mjs` (verbatim from retired `possiblaw-legal/retrieval`).

## When to use

Pick this scaffold when the user's app needs **semantic search** over legal text — "find similar clauses," "retrieve by meaning, not keywords," or any RAG flow over a legal corpus. Combine with `chunking-pipeline.md` (chunk first) and any adapter (`sec-edgar-adapter.md`, `contractcodex-adapter.md`) that produces normalized records.

## What it does

Two exports:

- `HashEmbeddingClient(dims = 256)` — deterministic, dependency-free embedder. Tokenizes text, hashes each token (`sha1 → uint16 mod dims`), counts collisions into a sparse vector, then L2-normalizes. Cheap, no API key, no network.
- `InMemoryVectorStore` — `upsert(records, embedder)` builds vectors over `record.title + summary + snippet`; `query(text, { topK, scope, embedder })` returns `[{ record, semanticScore }]` sorted by cosine similarity, optionally filtered by `record.source`.

Plus `cosineSimilarity(a, b)` as a helper.

## Important: the embedder is a placeholder

`HashEmbeddingClient` is a hash-based bag-of-words trick — fast and deterministic, but **semantically weak**. It catches lexical overlap, not true meaning. For production:

- Swap in OpenAI `text-embedding-3-small`/`-large`, Voyage `voyage-law-2` (legal-tuned), or Cohere `embed-english-v3.0`.
- Replace `InMemoryVectorStore` with a real vector DB (pgvector, Pinecone, Qdrant, Weaviate) once corpus exceeds ~10k chunks.

The `{ embed(text) → number[] }` interface is the only contract the store requires — drop in any client that satisfies it.

## Pattern

```js
import { HashEmbeddingClient, InMemoryVectorStore } from "./_source/vector.mjs";

const embedder = new HashEmbeddingClient(256);
const store = new InMemoryVectorStore();

// records come from an adapter + chunker
store.upsert(chunkedRecords, embedder);

const matches = store.query("indemnification cap with carve-outs", {
  topK: 40,
  scope: "all",       // or "sec" / "contractcodex" / "skills"
  embedder,
});
```

`pipeline.mjs` shows the full embed → store → query → rank flow; `rank.mjs` then blends `0.55 * semantic + 0.30 * keyword + 0.15 * source_prior` for hybrid scoring — keep that pattern when you upgrade the embedder.
