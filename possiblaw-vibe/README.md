# possiblaw-vibe

Legal-app design grill. Walks document systems, software systems, and workflows through relentless interrogation until your spec is real.

## What it is

`possiblaw-vibe` is a Claude Code plugin that interrogates you through the design of a legal app -- document automation, client portal, practice management, compliance, litigation support, conflict-check tools, contract review, e-discovery, anything legal-tech. It refuses to write code until the design tree resolves.

The style is deliberately modeled on Matt Pocock's `grill-me` skill (see ["My grill-me skill has gone viral"](https://www.aihero.dev/my-grill-me-skill-has-gone-viral)). Same discipline:

- Sessions run roughly 45 minutes. Output is shared understanding plus written deliverables.
- Each question is sharp and load-bearing. No filler.
- One branch at a time. Resolve dependencies before moving on.
- For obvious calls, the agent recommends a default so you can just say "yes."
- Refuses to scaffold or write code until the tree is resolved.

We narrowed the scope to legal apps and added targeted branches for legal-specific concerns: attorney-client privilege (ABA Model Rule 1.6), retention, e-discovery readiness, conflict checks, citations, court-deadline transparency, e-signature, trust accounting (IOLTA), privilege-aware LLM integration.

## Who it's for

- Legal professionals (attorneys, paralegals, legal ops) building practice tooling.
- Lawyer-engineers and engineers working with lawyers on legal-tech.
- Anyone who needs a real spec before writing a line of code -- not a vague Notion doc.

## Install

```bash
/plugin marketplace add PossibLaw/PossibLaw-Plugins
/plugin install possiblaw-vibe@possiblaw-plugins
```

## Use

```bash
/possiblaw-vibe:vibe-coding
```

Or with a starting idea:

```bash
/possiblaw-vibe:vibe-coding I want to build a contract review tool for a small commercial-litigation firm
```

## The five branches

The grill walks every legal-app design through these branches in order. It recommends defaults; you confirm or push back.

1. **Document systems.** What documents, who creates and edits, lifecycle, versioning, templating, storage, search, citation handling, privilege markings, retention, e-signature.
2. **Software systems.** Audience, tenancy, auth, authorization, audit, compliance posture (SOC 2, HIPAA, ABA Model Rule 1.6, GDPR), data residency, platform shape, notifications, real-time collab, export.
3. **Workflows.** Matter intake -> conflict check -> engagement -> onboarding -> work -> close-out. Review cycles, approval chains, deadline tracking with computation transparency, time / billing, trust accounting (IOLTA), e-filing, service of process.
4. **Data model.** Core entities (Client, Matter, Document, Event, Task, User), relationships, document metadata, audit log, soft-delete vs hard-delete, litigation hold, privilege model, retention model, search index considerations, multi-tenancy.
5. **Integrations.** E-signature (HelloSign / DocuSign / Adobe / PandaDoc), e-filing (PACER, state EFMs, One Legal), CRM (Clio Grow, Lawmatics), document storage (S3, R2, Box, NetDocuments, iManage), practice management (Clio Manage, MyCase, PracticePanther), accounting (QuickBooks, LawPay, LeanLaw), email (Outlook, Gmail), court calendar (LawToolBox, CourtRules), AI / LLM (Anthropic, OpenAI, Bedrock).

## What it produces

After all five branches resolve and you confirm scope:

- `docs/PRD.md` -- product requirements with the resolved branch answers baked in
- `CLAUDE.md` -- project foundation
- `docs/architecture.md` -- assembled by the `legal-app-architect` agent with privilege, retention, conflict-check, audit, and citation rigor called out
- `docs/setup.md` -- dev environment setup
- `docs/getting-started.md` -- quick-start workflow guide
- helper scripts in `scripts/` (`setup.sh`, `dev.sh`, `test.sh`, `lint.sh`)
- dev-helper agent at `.claude/agents/dev-helper.md`
- slash commands at `.claude/commands/` (`/review`, `/test-runner`, `/setup`, `/getting-started`)
- retrieval scaffolds from `references/scaffolds/` wired in where applicable (e.g., SEC EDGAR adapter for filings retrieval, contract-clause adapters for ContractCodex-style retrieval)

## Why grill style

Vague specs ship vague apps. Legal apps especially fail in the details: a missed retention rule, a privilege flag that doesn't propagate to search, a deadline computation that doesn't show its math. The grill style forces those details to surface before code is written.

Credit where due: this style is modeled on Matt Pocock's `grill-me` skill ([source](https://github.com/mattpocock/skills) / [write-up](https://www.aihero.dev/my-grill-me-skill-has-gone-viral)). The legal-tech specialization is ours.

## Legal-tech patterns enforced

The grill loads `references/legal-tech-patterns.md` before asking the first question. Every branch enforces:

- **Attorney-client privilege (ABA Model Rule 1.6).** Per-document privilege flag, audit trail on every flag change, privilege-log generation, surfacing privilege-waiver trade-offs before any third-party LLM call.
- **Retention.** Per-matter `retention_until` and `retention_reason`, soft delete by default, hard delete admin-only and audited.
- **E-discovery readiness.** Append-only hash-chained audit log, sha256 hashes per document version, BATES via `production` join entity, native + load-file export.
- **Conflict checks.** Triggered on every new client, new matter, new party, related matter, plus annual sweep. Fuzzy matching plus human attorney sign-off. Ethics walls as deny-ACL.
- **Trust accounting / IOLTA.** Pooled trust + per-client-matter sub-ledgers, never commingled, three-way reconciliation, DB-level invariants.
- **Citation rigor.** Structured citation objects, Bluebook render on output, parallel citations preserved, citator status displayed.
- **Court-deadline transparency.** Every deadline rendered with the source rule and the computation -- never just a date.
- **Privilege-aware LLMs.** BAA / DPA before any privileged content; redaction defaults; first-time consent UX with logged acknowledgment; per-matter cost allocation.

Litigation hold beats retention. Retention beats convenience. Privilege beats everything.

## Components

| Component | Purpose |
|-----------|---------|
| `/possiblaw-vibe:vibe-coding` command | Entry into the grill |
| `vibe` agent | The grill agent persona |
| `legal-app-architect` agent | Assembles `docs/architecture.md` after the grill resolves |
| `skills/grill-legal-app/SKILL.md` | The grill's operating manual |
| `skills/grill-legal-app/references/*.md` | Branch question backbones (document systems, software systems, workflows, data model, integrations) |
| `references/legal-tech-patterns.md` | Non-negotiables enforced across every branch |
| `references/stack-options.md` | Stack guide with legal-tech cost ranges |
| `references/stack-templates.md` | CLAUDE.md templates per stack |
| `references/script-templates.md` | Shell script templates by stack |
| `references/agent-templates.md` | Dev-helper agent templates |
| `references/command-templates.md` | Slash command templates |
| `references/scaffolds/` | Retrieval scaffolds (SEC EDGAR, contract clauses, vector search) wired in when the design surfaces retrieval needs |

## License

MIT
