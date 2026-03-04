---
name: build-plugin
description: >
  Router skill for Claude Code plugin scaffolding. Use when user asks to create
  or modify Claude Code artifacts such as CLAUDE.md, slash commands, skills,
  hooks, agents, or full plugin packages. This skill triages intent, asks at
  most one clarifying question when needed, and routes to
  /possiblaw-build-plugin:build-plugin for deterministic generation. Do not use
  for general coding, debugging, or runtime issue triage.
allowed-tools: Read
---

# Plugin Builder Skill

Read-only router for Claude Code component generation.

## Use Cases

Use this router when a user asks to:

- Create a slash command or skill.
- Scaffold a new plugin package layout.
- Add hooks or agents following Claude Code conventions.
- Initialize or update `CLAUDE.md` / `AGENTS.md` guidance.

## Non-Goals

Do not use this skill when the task is:

- General app coding or bug fixing.
- Runtime debugging outside plugin scaffolding.
- Direct file mutation without explicit command invocation.

## Routing Workflow

1. Identify whether the request is plugin scaffolding.
2. If artifact type is unclear, ask one question:
   - "What should we scaffold: CLAUDE.md, command, skill, hook, agent, or full plugin?"
3. Route to `/possiblaw-build-plugin:build-plugin`.
4. Do not create or edit files from this auto-activated skill.

## Reference Files

The command workflow owns generation and reads:

- `references/templates.md` - All file templates
- `references/decision-tree.md` - Full questionnaire flow
- `references/examples.md` - Real-world examples
