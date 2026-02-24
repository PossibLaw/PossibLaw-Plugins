---
description: Unified legal retrieval for skills guidance, ContractCodex exemplars, and SEC EDGAR exhibits (PossibLaw).
argument-hint: [optional legal task or clause text]
allowed-tools: Read, Glob, Grep, Bash, WebSearch, WebFetch, AskUserQuestion
---

# /possiblaw:legal

Single entrypoint for novice-friendly legal context retrieval.

## Rules

1. Ask the source picker first (even if `$ARGUMENTS` is present): `Skills`, `ContractCodex`, `SEC`, `All`.
2. If no query was provided, ask a source-specific query prompt.
3. Prefer running the local retrieval runtime when available:
   - Use plugin-rooted paths so the command works from any project directory:
     - `bash \"${CLAUDE_PLUGIN_ROOT}/scripts/run-search.sh\" --query \"<query>\" --source <skills|contractcodex|sec|all> --json --pretty`
   - Never pipe the runtime output away (no `| echo ...`). If you need a sentinel, use `||` on failure.
4. If live retrieval fails, continue using local fallback catalogs and clearly mark `mode=degraded`.
5. Never provide legal advice or legal conclusions.

## Output

- If `Skills`: return top 5 skill candidates and ask user to choose one.
- If `ContractCodex`, `SEC`, or `All`: return a prompt-ready evidence pack with citations.

## SEC Workflow

When source is SEC:

1. **Search**: Run EFTS full-text search:
   `bash "${CLAUDE_PLUGIN_ROOT}/scripts/run-search.sh" --query "<query>" --source sec --json --pretty`
   Present results as numbered list: company, form type, date, exhibit type, URL.
   Ask user which document(s) to examine.

2. **Extract provision**: For each document the user picks:
   `bash "${CLAUDE_PLUGIN_ROOT}/scripts/run-search.sh" --mode fetch-extract --url "<url>" --extract "<keyword>" --json --pretty`
   Present the extracted section text.
   If user didn't specify a keyword, ask what provision they want (e.g., "indemnification", "limitation of liability", "change of control").

3. **Fetch full document** (only if user explicitly requests full text):
   `bash "${CLAUDE_PLUGIN_ROOT}/scripts/run-search.sh" --mode fetch --url "<url>" --json --pretty`

Always end with: "This is a factual excerpt from a publicly filed SEC exhibit. This is not legal advice."

## Requirements

- Requires Node.js to run the local retrieval runtime. If Node is unavailable or the runtime cannot be executed, fall back to `Read`-only retrieval from the local catalogs and mark `mode=degraded`.
