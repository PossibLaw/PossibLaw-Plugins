# Codex Usage Guide for `/legal` Workflow

This document mirrors the same workflow contract used by Claude command execution.

## Objective

Use one novice-friendly legal workflow in Codex sessions with identical decision points and safety gates.

## Standard Flow

1. Gather query (`/legal` argument equivalent).
2. If no query, ask user what legal task they need.
3. Search two sources:
   - `https://www.lawvable.com/en`
   - `https://agentskills.legal/skills`
4. Merge with local fallback indexes.
5. Rank and present top 5 candidates.
6. Ask user to choose candidate.
7. Fetch full selected skill content.
8. Structure into:
   - Objective
   - Required inputs
   - Execution steps
   - Expected output
   - Constraints
9. Ask confirmation before applying.
10. Re-confirm before side effects.

## Output Format Requirement

Always present candidates with:
- `rank`
- `skill_name`
- `source`
- `summary`
- `url`
- `fit_reason`

## Parity Rules

- Same source set as Claude workflow.
- Same top-5 limit.
- Same ask-then-apply behavior.
- Same degraded behavior when live lookups fail.
- Same safety constraints on external instructions.

## Implementation Notes

- Preferred integration path is Case.dev Agent Skills REST API:
  - Search: `https://api.case.dev/skills/resolve?q=<url-encoded-query>`
  - Detail: `https://api.case.dev/skills/{slug}`
- If API lookup is unavailable, use domain-scoped web discovery plus markdown fallback (`/skills/{slug}.md`).
