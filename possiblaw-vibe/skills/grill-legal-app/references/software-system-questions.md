# Software System Questions

Walk these to lock the system shape: who uses it, where it lives, how it authenticates, what it must comply with.

## Audience

- Single attorney, multi-attorney firm, in-house legal team, or client-facing portal?
  - Recommend solo: single-tenant SaaS, attorney-only, optional read-only client share.
  - Recommend small firm (2-15 attorneys): single-tenant SaaS or multi-tenant SaaS with per-firm isolation.
  - Recommend in-house: SSO with corporate IdP, integrate with existing collab tools.
- Will clients ever log in directly, or only receive shared links?
- Will opposing counsel ever touch the system? (almost always no -- they get exports)

## Tenancy

- Single-tenant SaaS (one deploy per firm), multi-tenant SaaS (shared deploy with row-level isolation), on-prem, or hybrid?
  - Recommend solo/small firm: single-tenant SaaS unless cost forces multi-tenant.
  - Recommend regulated/large firm: on-prem or single-tenant in a dedicated VPC.
- If multi-tenant: row-level security in Postgres (Supabase RLS, Postgres policies) or schema-per-tenant?
  - Recommend: row-level security with `firm_id` foreign key on every table.

## Auth

- SSO via Google Workspace, Microsoft 365, Okta, or generic SAML?
  - Recommend solo: Google or Microsoft SSO.
  - Recommend firm: SAML/OIDC with the firm's IdP.
- Password fallback for non-SSO users?
- Magic links acceptable? (good for client portals, weak for attorney accounts)
- MFA required? (recommend yes, always, for any account that touches privileged content)
- Session length? (8 hours active for attorneys, shorter for client portals)

## Authorization

- Role-based (attorney, paralegal, admin, client), matter-based (only assigned users see a matter), or attribute-based (ABAC)?
  - Recommend: role + matter assignment combined. ABAC only when ethics walls demand it.
- Ethics-wall enforcement? (some users blocked from specific matters even though their role would normally grant access)
- Per-document ACL overrides on sensitive matters?
- Client portal users: scoped to one matter, one client, never see others.

## Audit

- Audit log required for every read, write, or only writes?
  - Recommend: writes always; reads on privileged or matter-tagged documents.
- Append-only / hash-chained audit log? (recommend yes for e-discovery defensibility)
- Retention of audit log itself? (often longer than the data it audits -- 7+ years)
- Who can read the audit log? (admins only; never editable)

## Compliance posture

- SOC 2 Type II required? (table stakes for selling to mid-market firms)
- HIPAA? (only if handling PHI -- personal injury, medical malpractice, ERISA)
- GDPR / UK GDPR? (any EU clients or data subjects)
- CCPA / state privacy laws?
- ABA Model Rule 1.6 confidentiality is always in scope.
- State bar opinions on cloud storage -- 30+ states have published opinions; most permit cloud with reasonable safeguards.
- Cyber insurance requirements? (often dictates encryption, MFA, incident response plan)

## Data residency

- US-only, EU-only, in-country (e.g., Canadian firms with PIPEDA)?
- Vendor backups -- where do they live?
- Sub-processors -- who do you allow? (Anthropic, OpenAI, AWS regions, etc.)

## Platform shape

- Web-first, desktop-first, or mobile-first?
  - Recommend: web-first PWA. Native mobile only when mobile-only workflows justify it.
- Offline support needed? (rare; trial-prep mode and field intake are the legitimate cases)
- Native desktop app? (only if integrating deeply with Word -- consider Word add-in instead)

## Notifications

- Email, SMS, in-app, or all three?
  - Recommend: email for everything, in-app for active sessions, SMS only for deadline alarms.
- Privilege risk: never put privileged content in an email subject or SMS body.
- Digest vs realtime? (digest for status, realtime for deadlines and approvals)

## Real-time collaboration

- Multiple users editing the same document simultaneously?
  - Recommend: skip live co-editing in v1. Use check-out / check-in or comment threads instead. Live co-editing on legal docs is hard and rarely needed.
- Comment threads on documents? (yes, with privilege flag per thread)
- Presence indicators?

## Export

- PDF, DOCX, raw HTML, or all three?
  - Recommend: PDF + DOCX always. HTML for the few power users.
- Native + load-file export for e-discovery production? (only if litigation support is in scope)
- Print-quality PDF with bates numbering?
- Bulk export of an entire matter on close-out? (yes, always -- clients have a right to their file)
