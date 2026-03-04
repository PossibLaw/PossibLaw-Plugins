# Build Plugin Eval Queries

Prompt set for regression testing skill routing and command behavior.

## Goals

- Validate that the `build-plugin` skill routes reliably to `/possiblaw-build-plugin:build-plugin`.
- Validate that non-scaffolding prompts do not trigger the builder router.
- Validate deterministic command behavior once the command is invoked.

## Positive Router Queries

Expected behavior for every prompt in this section:
- Router skill is applicable.
- Assistant routes to `/possiblaw-build-plugin:build-plugin`.
- Router does not write files.

1. "Create a Claude Code slash command for deployment."
2. "Help me scaffold a plugin package with command and skill."
3. "I need a new SKILL.md for release-note generation."
4. "Build a hook that blocks rm -rf."
5. "Set up a sub-agent for legal policy research."
6. "Initialize CLAUDE.md for this repository."
7. "Add a command that summarizes git diffs."
8. "Create a plugin skeleton with plugin.json and README."
9. "I want to package this workflow as a Claude plugin."
10. "Generate command and agent scaffolding for compliance reviews."

## Negative Router Queries

Expected behavior for every prompt in this section:
- Router skill is not required.
- Assistant handles the request normally without build-plugin routing.

1. "Fix failing unit tests in this repo."
2. "Explain this TypeScript type error."
3. "Refactor this React component for readability."
4. "How do I optimize this SQL query?"
5. "Review my PR for bugs."
6. "Write a changelog entry from recent commits."
7. "Set up a Dockerfile for this app."
8. "Debug why npm install fails."
9. "Summarize this markdown document."
10. "Help me design a CI pipeline."

## Command Flow Queries

Run these by invoking `/possiblaw-build-plugin:build-plugin` directly.

1. "create a slash command for security review"
   - Expected: classify as command, ask command-specific questions, produce file plan and drafts, block on approval.
2. "scaffold a full plugin for deployment safety"
   - Expected: classify as full plugin, ask component selection questions, produce multi-file plan, block on approval.
3. "add a hook for dangerous shell commands"
   - Expected: classify as hook, recommend `possiblaw-guardrails` baseline, then offer custom hook scaffold plan.
4. "initialize CLAUDE.md for a Python monorepo"
   - Expected: classify as CLAUDE.md, gather commands/stack/structure/boundaries, produce one-file draft and approval gate.
5. "create a skill and references for contract triage"
   - Expected: classify as skill, ask trigger conditions and boundaries, scaffold `SKILL.md` and `references/`.

## Overwrite Safety Checks

Use these cases to verify overwrite handling:

1. Existing `commands/deploy.md` already present, request new command named `deploy`.
   - Expected: explicit overwrite warning and dedicated overwrite confirmation.
2. Existing `.claude/skills/reviewer/SKILL.md` present, request skill `reviewer`.
   - Expected: explicit overwrite warning and no write until user confirms.

## Approval Gate Check

After drafts are shown, if user response is not explicit approval:
- Expected: no `Write` or `Edit` actions occur.
- Expected: assistant asks for explicit confirmation or requested revisions.
