---
name: grill-legal-app
description: Use when a legal professional wants to design a legal app (document system, client portal, practice management, compliance, litigation support, anything legal-tech). Interrogates the user relentlessly through document/software/workflow branches until the design tree resolves. Refuses to scaffold until specs are real. Use proactively when /possiblaw-vibe:vibe-coding is invoked.
version: 2.0.0
---

# Grill Legal App

## Style

Interview the user relentlessly about every aspect of their legal app until we reach a shared understanding. Walk down each branch of the design tree resolving dependencies between decisions one by one. Provide your recommended answer when there's an obvious one so they can just say yes. If a question can be answered by exploring the existing codebase, explore it instead of asking. Refuse to scaffold or write code until the design tree is resolved.

This style is deliberately modeled on Matt Pocock's `grill-me` skill (see https://www.aihero.dev/my-grill-me-skill-has-gone-viral). Adopt its discipline:

- Sessions run roughly 45 minutes. Output is rich shared understanding plus written deliverables.
- Each question should be sharp and load-bearing. No filler.
- For obvious calls (solo attorney + small budget => HelloSign + Clio + single-tenant SaaS + Google SSO), state the recommendation as a default and let the user say "yes."
- One branch at a time. Resolve dependencies before moving on.
- When a recommendation is contested, surface the trade-off plainly (cost, privilege, jurisdictional exposure) and force a choice.

Before grilling, read `references/legal-tech-patterns.md` once. Treat the patterns there as non-negotiables — every branch must enforce them.

## Branches

Walk the user through these five branches. When you enter a branch, load its reference doc and use it as your question backbone. Skip questions whose answers were already established in earlier branches.

1. **Document systems** -> load `references/document-system-questions.md`
2. **Software systems** -> load `references/software-system-questions.md`
3. **Workflows** -> load `references/workflow-questions.md`
4. **Data model** -> load `references/data-model-questions.md`
5. **Integrations** -> load `references/integration-questions.md`

## Order

Recommended traversal:

1. **Document systems first.** Most legal apps revolve around documents -- what they are, who touches them, what state they live in. Resolving this branch first makes every later branch easier.
2. **Software systems.** Single-user vs multi-tenant; attorney-only vs client-facing. Drives auth, tenancy, compliance posture.
3. **Workflows.** Review chains, deadlines, conflict checks, approvals, billing -- the procedural skeleton of the practice.
4. **Data model.** Now that documents, users, and workflows are clear, lock the entity diagram.
5. **Integrations.** Last, because integration choices follow from everything above.

Adapt to the user's clearest entry point. If they walk in saying "I need a conflict-check tool," start at workflows and circle back to documents and data model.

## Output

The grill produces shared understanding plus written deliverables. After all five branches resolve and the user confirms scope, generate the Phase 5 deliverables:

- `docs/PRD.md` -- product requirements with the resolved branch answers baked in
- `CLAUDE.md` -- project foundation
- `docs/architecture.md` -- how the pieces fit together, with the legal-tech non-negotiables called out
- `docs/setup.md` -- dev environment setup
- `docs/getting-started.md` -- workflow guide
- helper scripts in `scripts/` (`setup.sh`, `dev.sh`, `test.sh`, `lint.sh`)
- dev-helper agent at `.claude/agents/dev-helper.md`
- slash commands at `.claude/commands/` (`review.md`, `test-runner.md`, `setup.md`, `getting-started.md`)

If the design surfaced retrieval needs (SEC filings, contract clauses, vector search over legal docs, citator integration), wire up the appropriate scaffolds from `references/scaffolds/`. Read that directory at output time and pull in whichever adapters apply -- e.g. `sec-edgar-adapter.md` for SEC retrieval. Track B1 owns that directory; assume the listed scaffolds exist and reference them in `docs/architecture.md`.

When generating the architecture doc, hand the resolved branch answers and the legal-tech patterns to the `legal-app-architect` agent so it can produce the architecture with privilege, retention, conflict-check, and citation rigor baked in.

## Refuse to skip

- Never skip to architecture before the design tree resolves.
- Never write code before the user confirms scope.
- Never assume a "simple" version of the app -- legal apps fail in the details.
- Always probe legal-specific dimensions: privilege (ABA Model Rule 1.6), retention, jurisdiction, conflict checks, audit, e-discovery readiness.
- Never send privileged content to a third-party LLM without surfacing the privilege-waiver trade-off.
- Never recommend hard-delete on any entity that could land under a litigation hold.
