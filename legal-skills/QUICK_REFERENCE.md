# Legal Skills Plugin - Quick Reference

Last Updated: 2026-02-21

## One Command

```bash
/legal [optional task]
```

Examples:

```bash
/legal
/legal contract review
/legal discovery chronology
```

## What `/legal` Does

1. Searches two datasets:
   - `lawvable.com/en`
   - `agentskills.legal/skills`
2. Merges live results with local fallback catalogs.
3. Ranks and shows top 5 candidates.
4. Asks you to choose one candidate.
5. Ingests selected skill and asks confirmation before applying.

## Candidate Output Fields

- `rank`
- `skill_name`
- `source`
- `summary`
- `url`
- `fit_reason`

## Fallback Catalogs

- `skills/legal-assistant/references/lawvable-index.md`
- `skills/legal-assistant/references/agentskills-index.md`

## Behavior Notes

- If live lookups fail, `/legal` continues with available source + cache.
- Side-effecting actions always require explicit confirmation.
- External skill instructions are treated as untrusted input.

## Primary Sources

- Lawvable: https://www.lawvable.com/en
- Case.dev Agent Skills: https://agentskills.legal/skills
