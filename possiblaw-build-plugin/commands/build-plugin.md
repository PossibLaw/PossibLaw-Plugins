---
description: Deterministic Claude Code plugin scaffolder (PossibLaw).
argument-hint: [artifact or goal, optional]
allowed-tools: Read, Write, Edit, Glob, Grep, AskUserQuestion
---

# /possiblaw-build-plugin:build-plugin

Deterministic questionnaire-driven builder for Claude Code components.

## Parameters

- `$ARGUMENTS` - Optional target artifact or goal. Examples:
  - `create a skill for release notes`
  - `scaffold a full plugin`
  - `add a hook for destructive commands`

## Authoritative References

Before asking implementation questions, load these files in this order:

1. `skills/build-plugin/references/decision-tree.md`
2. `skills/build-plugin/references/templates.md`
3. `skills/build-plugin/references/examples.md` (only when needed)

## Workflow

1. **Load references and classify intent**
   - Read the decision tree and classify the requested artifact type.
   - If artifact type is unclear, ask exactly one clarifying question first.
   - Types: `CLAUDE.md`, `slash command`, `skill`, `hook`, `sub-agent`, `full plugin`.

2. **Check foundation**
   - Check whether `./CLAUDE.md` or `./AGENTS.md` exists using file tools (`Glob`/`Read`).
   - If neither exists and the user is not explicitly building foundation docs, recommend creating `CLAUDE.md` first.

3. **Ask targeted, type-specific questions**
   - Ask only the type-specific questions listed in `decision-tree.md`.
   - Do not ask questions that are not needed for file generation.
   - For hooks, recommend `possiblaw-guardrails` as a baseline before custom hook scaffolding.

4. **Produce file plan before writing**
   - Output a file table with columns: `Path | New/Modify | Purpose`.
   - Explicitly call out any existing files that would be overwritten.
   - If any overwrite is required, ask a dedicated overwrite confirmation.

5. **Generate draft content**
   - Use `templates.md` as the starting point for each artifact.
   - Show complete draft content for each file.
   - Keep scaffolding minimal and valid for Claude Code plugin structure.

6. **Approval gate (blocking)**
   - Ask: "Ready to create these files?"
   - Do not use `Write` or `Edit` until explicit approval is received.

7. **Write phase**
   - Create missing directories first.
   - Write only approved files and apply minimal edits.
   - Confirm created/updated file paths at the end.

## Safety Boundaries

- **Always:** Keep behavior deterministic, template-driven, and scoped to plugin scaffolding.
- **Ask first:** Any overwrite, dependency install, or publish/deploy action.
- **Never:** Mutate unrelated files or write files before explicit approval.
