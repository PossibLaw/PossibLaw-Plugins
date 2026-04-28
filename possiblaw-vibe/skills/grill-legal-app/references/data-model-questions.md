# Data Model Questions

Lock the entity diagram. Resolve relationships, metadata, and deletion semantics before the architect agent draws schemas.

## Core entities

- **Client**
  - Individual or entity? (model both; entity has registered agent, jurisdiction of formation, related parties)
  - Related parties (spouse, children, subsidiaries, beneficial owners)?
  - Conflict-relevant aliases and former names?
- **Matter**
  - Matter number format? (per-firm convention -- `YYYY-NNNN`, practice-area prefix, or sequential)
  - Practice area / matter type taxonomy?
  - Jurisdiction (state, federal court, agency)?
  - Status (open, pending engagement, active, on hold, closed, archived)?
  - Lead attorney + matter team?
- **Document**
  - Versioned (snapshot per save) and immutable past versions?
  - Tagged with type, privilege flag, retention policy, status?
  - Linked to matter (required) and client (derived through matter)?
- **Event**
  - Deadlines, hearings, meetings, depositions, filings, mediation sessions.
  - Source rule (e.g., FRCP 12(a)) stored as structured reference?
  - Computed vs entered manually -- always store both the input date and the computation rule.
- **Task**
  - Assignee, due date, status, parent matter, parent document optional?
  - Subtasks?
- **User**
  - Roles: attorney, paralegal, admin, billing, client.
  - Bar admissions per attorney (jurisdiction, bar number, status)?
  - Conflict scope: which matters they're walled off from?

## Relationships

- Matter <-> Client: many-to-many with role on the join (client, co-client, opposing party tracked separately).
  - Recommend: separate `matter_parties` table with a `role` enum.
- Document <-> Matter: many-to-one (every document belongs to exactly one matter; multi-matter docs get cloned with link).
- Document <-> Document: parent/version chain (each version points to its parent and its root).
- User <-> Matter: many-to-many with role (lead, team, billing, walled-off).
- Event <-> Matter: many-to-one.

## Document metadata

- Citation anchors (case citations, statute citations, internal cross-refs) stored as structured objects, not just text?
- Section headers preserved (for navigation, redlining alignment, table-of-contents generation)?
- Redaction layer separate from base document? (recommend yes -- never destroy underlying text; redaction is a render-time overlay with its own audit trail)
- Privilege flag per document (and per redaction region if granular)?
- Retention policy reference (which matter retention policy applies)?
- Bates range when document has been produced in discovery?
- Hash (sha256) of the canonical bytes for tamper detection?

## Audit log entity

- Required fields: who (user_id), when (timestamp UTC), what (entity, entity_id, action), why (free-text reason for sensitive actions), before/after diff (for updates).
- Append-only -- no updates, no deletes.
- Hash-chained or signed? (recommend hash-chain for cheap tamper evidence)
- Retention: at least the longest of any audited entity's retention; typically 7+ years.

## Soft delete vs hard delete

- Soft delete (deleted_at timestamp) on every entity that could fall under a litigation hold.
- Hard delete only by admin, only with a written reason in the audit log, and only for entities not under hold.
- Recommend: never expose hard delete in the UI; admin-only via a logged maintenance flow.

## Litigation hold / freeze

- Hold flag on matter, document, client, and audit-log scope.
- Hold beats retention -- a held entity cannot be deleted even if retention has expired.
- Hold beats edit -- a held document is read-only for everyone except a designated custodian.
- Hold notice tracking (who was notified, when, ack required).
- Hold release requires admin + written reason.

## Privilege model in the schema

- Privilege flag enum: `attorney_client`, `work_product`, `common_interest`, `joint_defense`, `none`.
- Privilege override at the document level (some docs in a privileged matter are not privileged -- e.g., publicly filed pleadings).
- Privilege log generation reads this directly.

## Retention model in the schema

- Per-matter retention policy with `retention_until` (computed from close date + jurisdictional rule).
- `retention_reason` free-text (e.g., "trust account, Texas bar 5-year rule").
- Override for indefinite hold.

## Search index considerations

- Full-text index on document body (Postgres tsvector or external like Elastic/Meilisearch).
- Vector embeddings for semantic search? (only if the design surfaced retrieval needs)
- Honor redactions in the index -- never index redacted text.
- Honor privilege walls -- search must filter by user's matter access before returning hits.

## Identifiers

- Use ULIDs or UUIDs (not sequential ints) on anything externally visible.
- Matter numbers are user-facing display IDs, separate from internal IDs.

## Multi-tenancy in the schema (if multi-tenant)

- `firm_id` on every table.
- Row-level security policies on every table.
- Test isolation by attempting cross-firm reads in the test suite.
