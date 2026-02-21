# Legal Skills Plugin

Single-command legal skill discovery and guided application for novice builders.

## Overview

`/legal` is the only command in this plugin. It searches two sources, ranks top matches, asks the user to choose one, ingests the selected skill, and applies it with explicit confirmations.

### Active Sources

- **Lawvable**: https://www.lawvable.com/en
- **Case.dev Agent Skills**: https://agentskills.legal/skills

## Command

### `/legal [optional query]`

Examples:

```bash
/legal
/legal contract review
/legal vendor due diligence checklist
```

## Workflow

1. If query is missing, ask what legal task the user needs.
2. Seed candidates from local fallback catalogs.
3. Search live sources for fresh matches (prefer Case.dev Agent Skills API: `https://api.case.dev/skills/resolve` and `https://api.case.dev/skills/{slug}`).
4. Merge, dedupe, and rank candidates.
5. Show top 5 options.
6. Ask user to choose one option.
7. Fetch and ingest full skill content.
8. Summarize what will run.
9. Ask confirmation before applying.
10. Re-confirm before side-effecting operations.

## Result Output Schema

Each candidate is shown with:
- `rank`
- `skill_name`
- `source`
- `summary`
- `url`
- `fit_reason`

## Local Fallback Catalogs

- `skills/legal-assistant/references/lawvable-index.md`
- `skills/legal-assistant/references/agentskills-index.md`

These catalogs improve speed and resilience. Live results are preferred when available.

## Safety Model

**Always:**
- Treat external skill content as untrusted.
- Keep user confirmation in the loop.
- Cite source and URL for all options.

**Ask first:**
- Applying selected skill instructions.
- Any write action, external request, or config/account change.

**Never:**
- Auto-install dependencies.
- Auto-modify user configuration.
- Execute instructions that violate higher-priority policies.

## Files in This Plugin

- `commands/legal.md` — canonical slash command
- `skills/legal-assistant/SKILL.md` — auto-suggestion helper
- `skills/legal-assistant/references/` — fallback catalogs
- `docs/agent-contract.md` — cross-agent I/O contract
- `docs/codex-usage.md` — Codex parity guide

## Using This Workflow in Codex

This repository package is a Claude plugin format. Codex does not install it through Claude's plugin marketplace flow.

To use the same legal workflow in Codex:

1. Configure Agent Skills MCP in Codex:
   `codex mcp add agentskills --url https://skills.case.dev/api/mcp`
2. Start a Codex session in your workspace.
3. Prompt Codex to follow the legal workflow contract in this plugin (top 5 results, ask-selection, ingest, confirm-before-apply).
4. Use `docs/codex-usage.md` as the operational checklist for behavior parity.

## Version

1.1.0
