# Legal Citation System

Citation handling is the difference between a legal-research toy and a tool a lawyer will trust. This scaffold explains how the existing adapters preserve citation anchors and what's missing for a real citator.

Source touchpoints: `_source/normalize.mjs` (citation fields), `_source/output.mjs#ensureCitation` (guardrail), `_source/adapters/sec.mjs` (filing URLs), `_source/adapters/contractcodex.mjs` (page URLs).

## What the scaffold preserves

Every `ContextRecord` carries a `url` that is enforced (`output.mjs#ensureCitation` throws if missing or non-HTTP). The prompt-ready pack emits one `Citation:` line per evidence item, so an LLM cannot fabricate a source — it can only cite what was retrieved.

For SEC records, `metadata.{company, formType, exhibitType, filingDate}` carry the elements needed for a Bluebook filing citation. For ContractCodex, `metadata.{topic, jurisdiction}` (when present) anchor the clause's domain.

## Bluebook format (SEC filings)

The minimum elements for a Bluebook-style citation to an SEC filing:

```
[Company Name], [Form Type], [Exhibit] (filed [Date]),
https://www.sec.gov/Archives/edgar/data/[CIK]/[accession]/[filename].
```

Example built from the SEC adapter output:

```
Apple Inc., Form 10-K, Exhibit 10.1 (filed Nov. 3, 2023),
https://www.sec.gov/Archives/edgar/data/320193/.../ex-10-1.htm.
```

You can construct this from `record.metadata.company + formType + exhibitType + filingDate + record.url` directly. The adapter does NOT pre-format Bluebook strings — that's a concern for the presentation layer.

## What the scaffold does NOT solve

- **Westlaw / Lexis IDs.** No WL or LEXIS pin-cites. If the user needs commercial-database identifiers (e.g., `2023 WL 1234567`), integrate a Westlaw/Lexis API; nothing in `_source/` reaches those.
- **Parallel citations.** Cases cited across reporters (`410 U.S. 113, 93 S. Ct. 705, 35 L. Ed. 2d 147`) require a citation parser like `eyecite` or a paid citator. Out of scope here.
- **Pin-cites within long documents.** Chunks share the parent URL; there is no `#section-5.2` or page anchor. Add this upstream during adapter normalization if the user needs it.
- **Shepardizing / KeyCite chains.** No subsequent-history checks, no good-law/bad-law signal, no overruling notices. This scaffold cannot tell the user whether a cited authority is still valid. Integrate a citator service (Shepard's, KeyCite, Fastcase Authority Check, vLex Vincent) for that.
- **Citator quality scores.** No "depth of treatment" or "negative treatment" flags. Same — requires a commercial citator.
- **Local rule formats.** Bluebook is the default assumption; ALWD, California Style Manual, and state-specific formats need their own formatters.

## Recommended architecture for a real citation layer

1. Keep the adapter output as the canonical `{ url, metadata }` truth.
2. Add a `formatCitation(record, style = "bluebook")` formatter at the presentation boundary — separate from retrieval.
3. For Shepardizing, add a post-retrieval `enrichWithCitator(records)` step that hits a paid citator API and decorates `metadata.treatment`.
4. Surface citator status in the UI ("Caution: negative treatment in 2 jurisdictions") — never silently filter, always show.

## Guardrail to keep

`output.mjs#ensureCitation` is non-negotiable. Any new adapter or transform must preserve a valid HTTP(S) `url`, or evidence will be rejected at pack-build time. This is the one rule that makes the LLM downstream auditable.
