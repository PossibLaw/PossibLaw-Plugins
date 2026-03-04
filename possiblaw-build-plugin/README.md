# possiblaw-build-plugin

Interactive plugin builder for Claude Code. Routes plugin-scaffolding requests into a deterministic command workflow that asks targeted questions and generates structured files.

## Installation

```bash
# From local path
/plugin install /path/to/possiblaw-build-plugin

# Optional: copy router skill globally
cp -r skills/build-plugin ~/.claude/skills/
```

## Quick Start (Non-Technical)

1. Install the plugin.
2. Run `/possiblaw-build-plugin:build-plugin`.
3. Describe what you want in plain English (example: "Create a command for contract triage").
4. Answer the guided questions.
5. Approve the draft when it looks right.

Use the slash command directly:

```bash
/possiblaw-build-plugin:build-plugin
/possiblaw-build-plugin:build-plugin create a command for contract triage
```

Or let the `build-plugin` skill auto-activate and route you to the command when you mention creating plugins, skills, commands, hooks, or agents:

```
Create a new slash command for deploying to staging
```

```
Help me build a skill for code review
```

```
I need to set up hooks to block dangerous commands
```

## What It Does

1. **Routes safely** - Auto-activated skill is read-only and routes to command workflow
2. **Checks foundation** - Recommends `CLAUDE.md` first if missing
3. **Classifies intent** - Determines whether you need command, skill, hook, agent, or full plugin
4. **Asks targeted questions** - Gathers only the data needed for selected artifact
5. **Shows file plan + drafts** - Displays exact files and content before writing
6. **Writes on approval** - Creates files only after explicit confirmation

## The Hierarchy

```
CLAUDE.md              ← Foundation (create first)
    ↓
Skills / Commands      ← Capabilities (build on foundation)
    ↓
Hooks                  ← Enforcement (implement guardrails)
    ↓
References / Agents    ← Deep context (specialist knowledge)
```

## Supported Components

| Component | Purpose | Location |
|-----------|---------|----------|
| CLAUDE.md | Project context and rules | `./CLAUDE.md` |
| Slash command | Manual workflow | `.claude/commands/` |
| Skill | Auto-discovered capability | `.claude/skills/` |
| Hook | Runtime enforcement | `.claude/hookify.*.md` |
| Sub-agent | Research specialist | `.claude/agents/` |
| Full plugin | Distributable package | `.claude-plugin/` |

## Reference Files

The command workflow reads templates and examples from:

- `skills/build-plugin/references/templates.md` - File templates
- `skills/build-plugin/references/decision-tree.md` - Questionnaire flow
- `skills/build-plugin/references/examples.md` - Production patterns
- `skills/build-plugin/references/eval-queries.md` - Regression test prompts

## Development & Deployment

```bash
# Phase 1: Test locally (project-level)
# Skill is at skills/build-plugin/SKILL.md
# Command is at commands/build-plugin.md

# Phase 2: Deploy globally (all your projects)
cp -r skills/build-plugin ~/.claude/skills/

# Phase 3: Share as distributable plugin
# Give others the possiblaw-build-plugin/ directory
# They install with: /plugin install /path/to/possiblaw-build-plugin
```

## License

MIT
