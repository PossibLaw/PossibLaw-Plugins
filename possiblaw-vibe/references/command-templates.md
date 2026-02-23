# Slash Command Templates

Pre-built command templates for the `.claude/commands/` directory. These commands give users quick access to common workflows without remembering exact steps.

---

## Command: /review

Checks local code against project standards defined in CLAUDE.md. Works with or without git.

```markdown
---
description: Check code against CLAUDE.md boundaries and project standards
allowed-tools: Read, Glob, Grep, Bash
---

# Code Check

Check the project files for issues based on CLAUDE.md boundaries and project conventions. Read the files on disk and compare them against the project's own rules. This does NOT require a git remote, PR, or any specific git setup — just check the local files.

## Steps

1. **Read project standards**
   - Read `CLAUDE.md` for boundaries and conventions
   - Read `docs/architecture.md` for structural expectations

2. **Check structure**
   - Verify files are in the expected directories (per CLAUDE.md Structure section)
   - Flag any files that seem misplaced

3. **Check boundaries**
   - Review code against the "Boundaries" section in CLAUDE.md
   - Flag any violations of "Never" rules
   - Note any "Ask first" situations that may need discussion

4. **Stack-specific checks**

   **Next.js + Supabase:**
   - No `service_role` key in client code
   - RLS policies exist for accessed tables
   - `'use client'` directive used correctly

   **Astro:**
   - Minimal client-side JavaScript
   - `client:visible` preferred over `client:load`
   - No unnecessary framework components

   **Python FastAPI:**
   - Pydantic models for all request/response schemas
   - No bare `except:` clauses
   - No `pip install` in code or scripts (uv only)

   **Hono + CF Workers:**
   - No Node.js-specific APIs (process, fs, etc.)
   - Bindings accessed through `c.env`
   - Handlers stay within CPU time limits

   **Go CLI:**
   - All errors handled explicitly
   - No `panic()` for expected errors
   - `go fmt` compliant

5. **Report findings**

   Organize results as:
   - **Must fix** — Boundary violations, security issues
   - **Should fix** — Convention mismatches, structure issues
   - **Consider** — Suggestions for improvement

   If everything looks good, say so! A clean review is great news.

6. **Git check-in reminder**

   If a `.git` directory exists, check for uncommitted changes. If there are any:
   - Mention how many files have changed since the last commit
   - Suggest: "Now might be a good time to save your progress with a git commit."
   - Keep it light — a nudge, not a lecture

   If no `.git` directory exists, that's fine — skip this step entirely.
```

---

## Command: /test-runner

Runs tests and explains results in plain language.

```markdown
---
description: Run tests and explain results in plain language
allowed-tools: Read, Bash, Glob
---

# Test Runner

Run the project's tests and explain the results clearly.

## Steps

1. **Identify test command**
   - Read `CLAUDE.md` to find the correct test command
   - If no test command is listed, check for common patterns:
     - `pnpm test`, `npm test` (Node.js)
     - `uv run pytest` (Python)
     - `go test ./...` (Go)

2. **Run tests**
   - Execute the test command
   - Capture the full output

3. **Report results**

   **If all tests pass:**
   - Say "All tests passed!" with a brief summary
   - Show the count: "X tests passed in Y seconds"
   - If a `.git` directory exists and there are uncommitted changes, add a gentle nudge: "Tests are green — good time to save your progress with a git commit."

   **If tests fail:**
   - List each failing test by name
   - For each failure, explain:
     - **What was tested** — In plain language, what the test checks
     - **What went wrong** — The actual vs expected result
     - **How to fix it** — Suggest the most likely fix
   - Point to the exact file and line of each failure

   **If tests can't run:**
   - Explain why (missing dependencies, build error, etc.)
   - Suggest how to fix: "Run ./scripts/setup.sh first" or "Install missing package with..."
```

---

## Command: /setup

Checks prerequisites and runs the project setup.

```markdown
---
description: Check prerequisites and set up the development environment
allowed-tools: Read, Bash, Glob
---

# Project Setup

Check that everything is installed and get the project ready for development.

## Steps

1. **Read requirements**
   - Read `CLAUDE.md` for the stack and required tools
   - Read `docs/setup.md` for detailed setup instructions

2. **Check prerequisites**
   - Verify each required tool is installed (node, pnpm, python, uv, go, etc.)
   - For missing tools, explain exactly how to install them:
     - Include the install command
     - Link to the official download page
     - Note any OS-specific instructions

3. **Run setup**
   - If `scripts/setup.sh` exists, run it
   - If not, follow the manual steps from `docs/setup.md`
   - Watch the output for errors

4. **Troubleshoot failures**

   If setup fails:
   - Read the error message carefully
   - Check common causes:
     - Wrong tool version (e.g., Node 16 vs 20)
     - Missing environment variables
     - Network issues during package install
     - Permission errors
   - Suggest a specific fix and offer to retry

5. **Verify success**
   - Confirm the project builds or starts
   - Tell the user what to do next: "Run ./scripts/dev.sh to start developing"
```

---

## Command: /getting-started

Shows the workflow guide for new contributors or when returning to the project.

```markdown
---
description: Show the getting-started workflow guide
allowed-tools: Read
---

# Getting Started

Show the user their project's getting-started guide.

## Steps

1. **Read the guide**
   - Read `docs/getting-started.md`

2. **Present the guide**
   - Show the full contents of the getting-started guide
   - If the file doesn't exist, generate a basic workflow from the project's CLAUDE.md:
     1. How to install dependencies
     2. How to start the dev server
     3. How to run tests
     4. How to check your code (lint)
     5. Where to find the project docs

3. **Offer help**
   - Ask if they'd like help with any of the steps
   - Remind them of other available commands: `/setup`, `/test-runner`, `/review`
```

---

## Customization Notes

When generating commands from these templates:

1. **Stack-specific sections** — Only include the relevant stack checks in `/review`
2. **Test command** — The `/test-runner` command auto-detects, but can be hardcoded if known
3. **Setup steps** — The `/setup` command adapts to whatever `scripts/setup.sh` does
4. **All commands go to** `.claude/commands/` — One `.md` file per command
5. **Frontmatter is required** — Every command needs `description` and `allowed-tools`
