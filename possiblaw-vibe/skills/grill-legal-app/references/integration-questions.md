# Integration Questions

Pick integrations last -- they follow from documents, software shape, workflows, and data model.

## E-signature

- Provider? (HelloSign, DocuSign, Adobe Sign, PandaDoc)
  - Recommend solo / small firm: HelloSign or DocuSign Personal -- cheap, well-documented APIs.
  - Recommend mid-market firm: DocuSign Business -- bulk send, branding, templates.
  - Recommend Adobe shop: Adobe Sign (lives in Acrobat).
  - Recommend sales-style flows (engagement letters with payment): PandaDoc.
- Volume per month? (drives plan tier)
- Branded sender domain required?
- Audit certificate auto-stored back to the matter?
- Signature placement -- pre-tagged in templates or recipient drag-drop?

## E-filing

- Federal courts via PACER / CM-ECF?
- State courts -- which jurisdictions? Each state has its own EFM (Texas eFile, NY NYSCEF, California Tyler Odyssey, Illinois eFileIL, Florida Portal, etc.).
- Third-party EFM aggregator? (One Legal, File & ServeXpress, FileTime, InfoTrack)
  - Recommend if filing in 3+ states: aggregator is worth the per-filing fee.
- Filing receipt (timestamp, file number, judge assignment) auto-pulled back into the matter?
- E-service tracking (proof of service generated and stored)?

## CRM / intake

- Clio Grow, Lawmatics, HubSpot, or generic (Pipedrive, Salesforce)?
  - Recommend: Clio Grow if already on Clio Manage; Lawmatics for marketing-heavy firms.
- Lead-to-matter conversion automated when intake clears conflict?

## Document storage

- S3, R2, Box, Dropbox, NetDocuments, iManage?
  - Recommend solo / small firm: S3 (cheap, ubiquitous) or R2 (no egress fees) for blobs, with the app DB holding metadata.
  - Recommend mid-market firm: NetDocuments or iManage if existing investment; otherwise S3 with proper folder semantics.
- Encryption at rest (always) -- platform-managed or BYOK?
- Versioning at the storage layer (S3 object versioning) plus app-level versioning -- pick one as source of truth.
  - Recommend: app-level versioning is canonical; storage versioning is a backstop only.

## Practice management

- Clio Manage, MyCase, PracticePanther, Smokeball, CosmoLex?
  - Recommend: Clio Manage is the industry default; MyCase for plaintiff PI; PracticePanther for solos on a budget.
- One-way sync (export to PMS) or two-way?
  - Recommend: one-way out for v1 unless the app fully replaces the PMS.
- Which entities sync? (matters, contacts, documents, time, billing)

## Accounting

- QuickBooks Online, Xero, LawPay, LeanLaw, CosmoLex?
  - Recommend: LawPay for trust + payments; QuickBooks Online for general ledger; LeanLaw if you want trust-aware QBO integration.
- IOLTA reconciliation tool? (LeanLaw, TrustBooks, or PMS-native)

## Email

- Outlook (M365) or Gmail (Workspace)?
- Save-to-matter from email client (Outlook add-in, Gmail extension)?
- Privilege filter on outbound mail (block sending privileged content to unverified domains)?
- Recommend: build the save-to-matter add-in early; users live in email.

## Time tracking

- Native in-app, Toggl, Clio Manage time, or PMS-native?
  - Recommend: PMS-native if integrating with one; otherwise build native.
- Passive time capture (track time spent in documents)?

## Court calendar

- CourtRules, Smokeball deadline assistant, LawToolBox, or jurisdiction-specific rules engines?
  - Recommend: LawToolBox or CourtRules for federal + multi-state firms; in-house rules tables for single-jurisdiction practices.
- Auto-populate deadlines on matter open from the practice-area template?

## AI / LLM

- Anthropic Claude, OpenAI, or both? Self-hosted (open-weights via Ollama, Together, Bedrock)?
  - Recommend: Anthropic Claude as default for legal work (long context, safety posture); avoid sending raw privileged content to consumer-tier endpoints.
- **Privilege concern:** sending privileged content to a third-party LLM may waive privilege depending on jurisdiction and BAA terms. Surface this trade-off explicitly to the user.
  - Mitigations: enterprise tier with a BAA / DPA, no-training contractual clauses, redact client identifiers before send, on-prem / VPC deployment for sensitive matters.
- Per-matter cost allocation? (recommend yes -- LLM bills land on the matter that incurred them)
- Prompt caching for repeated context (Claude prompt caching reduces cost dramatically on long-doc workflows)?

## Translation

- Legal-grade translation (not consumer Google Translate -- privilege risk plus accuracy risk)?
  - Recommend: Lionbridge, RWS, or similar for sworn / certified translations. DeepL Pro for non-binding internal review only.

## Identity / SSO

- Google Workspace, Microsoft 365, Okta, Azure AD, generic SAML/OIDC?
- SCIM provisioning for firms with HR systems?

## Communication

- Slack / Teams for internal? (privilege-aware channels for matter discussion)
- Twilio for SMS deadline alarms?
- Calendly for client meetings?

## Recommended defaults by audience

- **Solo attorney**: HelloSign, Clio Manage, single-tenant SaaS, Google SSO, S3, LawPay, Anthropic Claude with redaction, LawToolBox.
- **Small firm (2-15)**: DocuSign Business, Clio Manage, single-tenant SaaS, Google or M365 SSO, S3 or NetDocuments, LawPay + LeanLaw, Anthropic Claude (enterprise BAA), LawToolBox, One Legal for e-filing.
- **In-house legal**: Adobe Sign (Adobe shop) or DocuSign, no PMS (use corporate ERP), corporate SSO via Okta, corporate doc store (SharePoint, Box, NetDocuments), corporate AI (Anthropic via Bedrock or Vertex).
