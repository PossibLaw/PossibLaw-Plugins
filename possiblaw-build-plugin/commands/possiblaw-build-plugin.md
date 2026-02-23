---
description: Interactive plugin builder for Claude Code. Generates CLAUDE.md, skills, commands, hooks, agents, and plugin scaffolding.
argument-hint: [optional what you want to build, e.g. "create a command for contract triage"]
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, AskUserQuestion
---

# /possiblaw-build-plugin

Questionnaire-driven plugin builder.

## Workflow

1. Check whether `CLAUDE.md` or `AGENTS.md` exists; recommend adding one first if missing.
2. Classify what the user wants to build: command, skill, hook, agent, or full plugin.
3. Ask targeted questions needed for that artifact only.
4. Propose a file plan and get explicit approval before writing anything.
5. Generate minimal, correct scaffolding consistent with the Claude Code plugin structure.

## References

Use the templates under `skills/possiblaw-build-plugin/references/` when generating files.
