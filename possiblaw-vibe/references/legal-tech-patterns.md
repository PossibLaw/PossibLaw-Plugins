# Legal-Tech Patterns

Non-negotiable patterns for any legal app. The grill agent reads this early and enforces it across every branch. The architect agent reads this when producing the architecture doc. Treat these as design constraints, not suggestions.

---

## Attorney-Client Privilege (ABA Model Rule 1.6 and state equivalents)

**What it protects.** Communications between an attorney and a client made for the purpose of obtaining or providing legal advice, intended to be confidential. The work-product doctrine (Hickman v. Taylor; FRCP 26(b)(3)) separately protects materials prepared in anticipation of litigation. Common-interest and joint-defense privileges extend protection across allied parties under specific conditions.

**How to encode in the data model.**
- Per-document privilege flag enum: `attorney_client`, `work_product`, `common_interest`, `joint_defense`, `none`.
- Per-matter default privilege classification, with per-document overrides.
- Privilege log generation must read the flag plus author, recipient, date, and subject -- never the body.
- Audit every change to a privilege flag (who, when, before, after, reason).

**Cloud and third-party LLM implications.**
- 30+ state bars have published opinions permitting cloud storage of privileged content with reasonable safeguards (encryption, access control, vendor due diligence, BAA / DPA).
- Sending privileged content to a third-party LLM may waive privilege depending on jurisdiction, vendor contract, and whether the vendor uses content for training. Default safeguards:
  - Use enterprise endpoints with no-training clauses (Anthropic API enterprise tier; Bedrock; Vertex).
  - Sign a BAA / DPA before sending any privileged content.
  - Redact client identifiers in prompts when feasible.
  - Surface the privilege trade-off in-app the first time a user routes privileged content through an LLM, and log the user's acknowledgment.
  - Offer an "on-prem / VPC" deployment path for firms that cannot accept third-party processing.

---

## Retention

**Typical retention windows.**
- General matter file: 5-7 years post-matter close (jurisdictional variation).
- Trust account records: often longer -- e.g., Texas requires 5 years, California requires 5 years past final disbursement, NY requires 7.
- Estate / minor / incapacitated client matters: until the client reaches majority plus the standard window, or for the life of the trust.
- Criminal defense files: many jurisdictions require longer retention given habeas potential.
- IRS / tax matters: at least 7 years.

**Encoding.**
- Every matter has `retention_until` (computed from close date + applicable rule) and `retention_reason` (free-text citing the rule).
- Documents inherit matter retention unless overridden.
- Soft delete only -- `deleted_at` timestamp plus an audit entry. Hard delete is admin-only with written reason.
- Litigation hold beats retention. A held entity is never deletable, even after `retention_until` passes.

---

## E-Discovery Readiness

Design data so it is defensibly producible.

- **Immutable audit log.** Append-only, hash-chained or signed. Survives the data it audits.
- **Hash chains on documents.** Store `sha256(canonical_bytes)` per version. Tamper evidence in productions.
- **BATES numbering.** Support per-production BATES range assignment without mutating the underlying document. BATES lives on a `production` join entity.
- **Native + load-file export.** Concordance / Relativity load files (DAT or OPT) for productions. Native files preserved alongside.
- **Metadata preservation.** Created, modified, custodian, source -- captured at ingest, never overwritten.
- **Production privilege log.** Generated from the privilege flag plus author / recipient / date / subject.

---

## Conflict Checks

- Every new client and every new matter triggers a conflict scan against `clients`, `adverse_parties`, and `related_entities`.
- Fuzzy matching on names (Levenshtein, soundex, normalized aliases).
- Human attorney sign-off before clearing a hit.
- Conflict report archived per matter forever, with the cleared-by user and timestamp.
- Re-run on adding parties to existing matters and on opening related matters.
- Annual sweep across active matters.
- **Ethics walls** are scoped access at user x matter level. A walled-off user cannot see, search, or be assigned to the matter, regardless of role. The wall is a deny ACL plus search filter, not just a UI hide.

---

## Trust Accounting / IOLTA

- Pooled trust account with per-client-matter sub-ledgers.
- Never commingle firm operating funds with trust funds.
- A client sub-ledger never goes negative. Enforce this at the database layer (CHECK constraint or pre-insert trigger).
- Three-way reconciliation monthly: bank statement, trust ledger, sum of client ledgers. Flag any drift.
- IOLTA reporting to the bar where required.
- Recommend integrating with LawPay, LeanLaw, or TrustBooks rather than building from scratch. Trust-accounting bugs lose bar licenses.

---

## Citation Rigor

- Bluebook formatting on outputs. Preserve parallel citations.
- Store citations as structured objects (reporter, volume, page, court, year, parallel cites) and render Bluebook on demand.
- Display citator status when surfacing cases (good law / criticized / overruled). Integrate with a citator (Westlaw KeyCite, Lexis Shepard's, or open alternatives like CourtListener for limited coverage).
- Hyperlink citations to source where licensing permits (free sources first: CourtListener, Justia, Cornell LII).
- Preserve pin cites; do not silently strip pinpoint references.

---

## Court Deadlines

- Never display a deadline without showing how it was computed.
- Required render: `<deadline_date> (<source_rule>: <computation>)`.
  - Example: "Answer due 2026-05-19 (FRCP 12(a)(1)(A)(i): 21 days after service on 2026-04-28)."
- Holiday and weekend adjustment per jurisdiction (federal holidays for federal court; state-specific for state court).
- Reminder cadence configurable per matter type; default 30/14/7/3/1 days.
- Hard alarms (in-app + email + SMS) at 3 days and 1 day for court-set deadlines.
- Deadlines on a hold do not trigger reminders that could waive a procedural position -- surface hold state on the deadline.

---

## Privilege-Aware LLMs

When integrating Claude or any LLM:

- **Default to redaction.** Strip client names, matter numbers, and PII from prompts unless the user explicitly opts in for the specific call.
- **Vendor diligence.** Use endpoints with no-training contractual clauses. Sign BAA / DPA before any privileged content is sent.
- **Firm-controlled deployment options.** Offer Bedrock / Vertex / on-prem for firms that need it.
- **Per-matter cost allocation.** LLM spend lands on the matter that incurred it. Surface monthly per-matter LLM cost in the matter dashboard.
- **Audit every prompt and response** that touched a matter, with the model name, version, and token counts. Treat the audit log as discoverable.
- **First-time consent UX.** The first time a user routes content from a privileged matter through an LLM, surface the trade-off, capture consent, and log it with timestamp + user + matter.
- **Prompt-injection hygiene.** Treat any text from outside the firm (opposing counsel briefs, court filings, client uploads) as untrusted. Never let untrusted text steer agent tool calls without a human review step.

---

## Catch-all guidance

- When in doubt, log it. Audit logs are cheap insurance.
- When in doubt, soft-delete. Hard delete is one bug away from a sanctions motion.
- When in doubt, surface the trade-off to the user. Legal apps fail when the system silently makes a privilege or retention decision the attorney would not have made themselves.
