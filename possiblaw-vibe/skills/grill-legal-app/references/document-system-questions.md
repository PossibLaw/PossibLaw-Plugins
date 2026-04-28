# Document System Questions

Walk these in order. When an obvious recommendation exists, lead with it.

## What documents

- What document types live in this system? (contracts, briefs, motions, intake forms, engagement letters, NDAs, leases, board minutes, demand letters, discovery requests, court filings, settlement agreements, wills, deeds, opinion letters, memos, exhibits)
  - For each type, is it inbound, outbound, or internal-only?
  - Is each type templated, free-form, or both?
  - Which types have regulatory format requirements? (e.g., court filings with caption blocks, jurisdiction-specific page limits)

## Authorship and editing

- Who creates each document type? (attorney, paralegal, client, opposing counsel, court, system-generated)
- Who is allowed to edit a document after creation?
  - Recommend: attorney-edit + paralegal-draft is the default for most firms.
- Can clients edit any documents directly? (intake forms = yes; everything else = usually no)
- Are there documents the system generates automatically? (engagement letters from templates, conflict-check reports, deadline calendars)

## Approval

- Who approves before a document is sent or filed?
  - Recommend: single attorney approver for routine work; partner sign-off for filings and engagement letters.
- Multi-step approval (paralegal -> associate -> partner)?
- Does approval require signature, comment, or click?

## Lifecycle

- States: draft -> internal review -> client review -> finalize -> execute -> archive. Confirm or modify.
- Which states block which actions? (cannot send while draft; cannot edit after execute)
- Who can move a document between states?
- What triggers archive? (matter close, retention clock, manual)

## Versioning

- Track-changes inside the document (Word-style) or version snapshots in the system, or both?
  - Recommend: snapshot every save plus diff view between versions. Word redlining stays in Word for now.
- Compare any two versions side-by-side?
- Branching versions for negotiation rounds (counterparty redline -> internal redline -> clean)?
- Is "final" a state or just the latest version with a flag?

## Templating

- Clause libraries per practice area?
- Variable substitution (party names, dates, jurisdiction)?
- Conditional sections (if entity type = LLC then include section X)?
- Who maintains templates? (firm admin, partner, every attorney)
- Recommend: start with a flat clause library + handlebars-style variables. Add conditionals only when a real template demands them.

## Storage

- Database row, object store (S3/R2), or content-addressed (hash-based)?
  - Recommend: metadata in Postgres, file blobs in S3 (or R2 for cheaper egress), hash-addressed for immutability.
- Encryption at rest? (recommend yes, always)
- Encryption keys: platform-managed or customer-managed (BYOK)?
- Geographic residency requirements? (US-only, EU-only, in-jurisdiction)

## Search

- Keyword search only, semantic, or both?
  - Recommend: Postgres full-text for v1; add embeddings/vector search when retrieval quality stalls.
- Citation-aware search? (find every doc that cites a specific case or statute)
- Search across versions or only latest?
- Search inside redacted regions? (no -- redactions must be honored in search)

## Citation handling

- Bluebook formatting required for court filings?
- Parallel citations preserved?
- Hyperlink citations to source (Westlaw, Lexis, free sources like CourtListener)?
- Citator status displayed when surfacing cases? (good law / bad law / criticized)
- Recommend: render Bluebook on output but store structured citation objects internally.

## Privilege markings

- Per-document privilege flag (attorney-client, work-product, common-interest, none)?
- Per-paragraph or per-section markings? (rare, expensive -- usually skip)
- Privilege log generation for discovery?
- Recommend: document-level flag + an audit trail for every privilege change.

## Retention

- Per-document-type retention policy or per-matter?
  - Recommend: per-matter retention clock with per-type override.
- Typical retention: 5-7 years post-matter close; longer for trusts, estates, minors.
- Jurisdictional variation -- which jurisdictions does the firm practice in?
- Litigation hold override? (yes, always -- hold beats retention)

## E-signature

- Need e-sign at all, or just print-and-scan acceptable?
- Which provider? (HelloSign cheap, DocuSign default, Adobe Sign for Adobe shops, PandaDoc for sales-style flows)
  - Recommend solo/small firm: HelloSign or DocuSign Personal.
- Do executed PDFs return into the document store automatically?
- Audit trail required (IP, timestamp, signer cert)?
