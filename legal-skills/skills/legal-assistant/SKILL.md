# Legal Assistant

Auto-suggests legal skill discovery and routes users to `/legal`.

## Description (5%)

Helps legal professionals find and apply the right skill from Lawvable and Case.dev Agent Skills using one novice-friendly workflow.

## When to Activate

Use this skill when the user:
- Asks for legal workflow help
- Mentions contract review, legal research, drafting, compliance, or discovery
- Needs a reusable legal process but does not know exact skill names

## Capabilities (30%)

### Discovery
- Detects legal-task intent from conversation context
- Suggests invoking `/legal <task>` as the default entrypoint
- Uses two-source discovery model only:
  - Lawvable
  - Case.dev Agent Skills (`agentskills.legal`)

### Guidance
- Encourages top-5 selection instead of overwhelming option lists
- Keeps user in explicit confirmation flow before skill application
- Explains next input needed to run selected skill

## Usage Pattern

1. Detect legal task intent.
2. Suggest `/legal` with a concrete query.
3. Let `/legal` search, rank, and present top 5.
4. User selects a candidate.
5. `/legal` ingests selected skill and asks confirmation before apply.

## Reference Files (65%)

- `references/lawvable-index.md`
- `references/agentskills-index.md`

## Boundaries

**Always:**
- Prefer `/legal` as the single legal command.
- Keep recommendations short and task-specific.
- Provide source attribution.

**Ask first:**
- Applying any selected skill.
- Any operation with side effects.

**Never:**
- Auto-apply skills without confirmation.
- Provide legal advice or legal conclusions.
- Suggest removed legacy legal command surfaces.
