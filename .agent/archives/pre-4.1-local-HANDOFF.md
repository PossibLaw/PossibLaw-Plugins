# Handoff: Role Architecture Split Between Plugins and Agent Starter Pack

**Date:** 2026-04-09
**Repo:** `${HOME}/Plugins`
**Status:** READY FOR IMPLEMENTATION
**Branch:** `main`

## Summary

This session did not implement product code. It prepared the execution split for the next coding agent.

The key decision is:

- `${HOME}/PossibLaw-Agent-Starter-Pack` becomes the canonical home for host-agnostic workflow contracts and role-based coding agents.
- `${HOME}/Plugins` becomes narrower: reusable runtimes, Claude marketplace distribution, and thin plugin wrappers.

## Why This Split

The Starter Pack already contains the correct foundation for cross-agent behavior:
- project contracts (`AGENTS.md`, `CLAUDE.md`)
- typed pipeline (`PLAN -> TEST -> REVIEW -> HANDOFF`)
- eval discipline
- optional gstack-inspired runtime integration

The Plugins repo is still primarily a Claude plugin marketplace repo and should not be the source of truth for host-agnostic roles.

## What Changes In `PossibLaw-Agent-Starter-Pack`

This is the primary implementation target.

### Required
1. Add a canonical role registry.
2. Normalize selected Gary Tan-inspired roles into contract-driven role specs.
3. Update Codex and Claude wrappers to reference shared role definitions.
4. Replace weak/placeholder agent files.
5. Ensure role outputs map into the existing artifact pipeline:
   - planning roles -> `.agent/PLAN.md`
   - QA roles -> `.agent/TEST.md`
   - review/security roles -> `.agent/REVIEW.md`
   - doc/release roles -> `.agent/HANDOFF.md`

### Priority roles
- `product-strategist`
- `engineering-planner`
- `reviewer`
- `security-reviewer`
- `qa-validator`
- `docs-releaser`

## What Changes In `Plugins`

This is secondary cleanup after the starter-pack role model is established.

### Required
1. Update root README to clarify repo ownership:
   - Starter Pack = contracts + host-agnostic roles
   - Plugins = runtimes + Claude marketplace distribution
2. Audit each plugin package against that split.
3. Rewrite or remove docs that imply this repo is the main cross-agent system.
4. Fix doc drift while touching files.

### Package-specific guidance
- `possiblaw-legal`
  - Keep as a reusable runtime-backed package.
  - It is the clearest example of code that belongs here.
- `possiblaw-guardrails`
  - Decide whether it remains Claude-hook distribution only, or gets split into portable safety rules + Claude adapter.
- `possiblaw-build-plugin`
  - Reposition toward scaffolding host-aware artifacts, not just Claude plugin artifacts.
- `possiblaw-vibe`
  - Decide whether its planning methodology moves to Starter Pack while this repo keeps only a thin Claude wrapper.

## Files Updated In This Session

- `.agent/PLAN.md`
- `.agent/HANDOFF.md`
- `.claude/history.md`
- `HANDOFF.md`

## Recommended Next Sequence

1. Open `${HOME}/PossibLaw-Agent-Starter-Pack`
2. Implement the canonical role registry and host wrapper updates there first.
3. Return to `${HOME}/Plugins`
4. Update README/package docs and narrow plugin responsibilities to match the new split.

## References Reviewed

### In Plugins repo
- `README.md`
- `possiblaw-build-plugin/README.md`
- `possiblaw-build-plugin/commands/build-plugin.md`
- `possiblaw-vibe/README.md`
- `possiblaw-vibe/commands/vibe-coding.md`
- `possiblaw-guardrails/README.md`
- `possiblaw-guardrails/hooks/hooks.json`
- `possiblaw-legal/README.md`
- `possiblaw-legal/docs/codex-usage.md`
- `possiblaw-legal/retrieval/run-search.mjs`

### In Starter Pack repo
- `README.md`
- `packs/project/AGENTS.md`
- `packs/project/CLAUDE.md`
- `packs/project/docs/workflows/contracts.md`
- `packs/project/docs/workflows/evals.md`
- `packs/project/docs/workflows/wiki.md`
- `packs/global/codex/.codex/AGENTS.md`
- selected Claude agent files under `packs/global/claude/.claude/agents/`

## Notes For Next Agent

- Do not start by copying all of gstack.
- Preserve the Starter Pack contract pipeline; add roles on top of it.
- Normalize role definitions to structured outputs, not persona-only prompts.
- Treat the Plugins repo as runtime/distribution infrastructure, not the canonical role architecture.

## Current Workspace State

- Working tree includes local continuity file updates from this session.
- Existing untracked local file still present:
  - `RUNBOOK_PHANTOM_INSTALLS.md`
