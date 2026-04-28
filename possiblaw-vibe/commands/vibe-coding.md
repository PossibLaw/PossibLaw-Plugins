---
description: Start a legal-app design grill -- relentless Q&A through document systems, software systems, workflows, data model, and integrations. Use when planning any legal app.
argument-hint: [optional legal app idea]
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, AskUserQuestion, Task
---

# /possiblaw-vibe:vibe-coding

Entry point for the legal-app design grill. Style modeled on Matt Pocock's grill-me skill (https://www.aihero.dev/my-grill-me-skill-has-gone-viral): relentless interrogation, refuses to skip ahead, recommends defaults when obvious.

## What this does

1. Loads the `grill-legal-app` skill (`skills/grill-legal-app/SKILL.md`).
2. Adopts the `vibe` agent persona (`agents/vibe.md`).
3. Reads `references/legal-tech-patterns.md` to lock the legal-tech non-negotiables (privilege, retention, conflict checks, audit, citations, court-deadline transparency, privilege-aware LLMs).
4. Walks the user through five branches: document systems, software systems, workflows, data model, integrations.
5. Refuses to scaffold or write code until all branches resolve.
6. After resolution, hands the answers to `legal-app-architect` and produces the Phase 5 deliverables (PRD, CLAUDE.md, architecture, setup, getting-started, helper scripts, dev-helper agent, slash commands), wiring in retrieval scaffolds from `references/scaffolds/` where applicable.

## Rules

1. Never assume jurisdiction, scope, budget, or stack -- ask, or recommend a default and let the user confirm.
2. Never write files until the user confirms the resolved spec.
3. Never send privileged content to a third-party LLM without surfacing the privilege-waiver trade-off.
4. If `$ARGUMENTS` is provided, treat it as the starting idea and grill from there.

## Outcome

After the five branches resolve and the user confirms scope:

- `docs/PRD.md`
- `CLAUDE.md`
- `docs/architecture.md`
- `docs/setup.md`
- `docs/getting-started.md`
- helper scripts in `scripts/`
- dev-helper agent at `.claude/agents/dev-helper.md`
- slash commands at `.claude/commands/`
- retrieval scaffolds wired in where the design surfaced retrieval needs
