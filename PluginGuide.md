# Claude Code Plugin Development Guide

## Table of Contents
1. [Introduction](#1-introduction)
2. [CLAUDE.md / AGENTS.md](#2-claudemd--agentsmd)
3. [Skills](#3-skills)
4. [Scripts & Commands](#4-scripts--commands)
5. [Hooks](#5-hooks)
6. [MCP Servers & Research Agents](#6-mcp-servers)
7. [Official Plugin System](#7-official-plugin-system)
8. [Comparison: When to Use What](#8-comparison-when-to-use-what)
9. [Real-World Plugin: claude-reflect](#9-real-world-plugin-claude-reflect-self-learning-system)
10. [Enterprise Skills: Microsoft Skills Repository](#10-enterprise-skills-microsoft-skills-repository)
11. [Advanced Agent Patterns (Claude Code 2.1+)](#11-advanced-agent-patterns-claude-code-21)
12. [Universal Agent Patterns (Cross-Platform Research)](#12-universal-agent-patterns-cross-platform-research)
13. [Summary](#13-summary)

---

## 1. Introduction

### What are Claude Code Plugins/Extensions?
Claude Code supports several extensibility mechanisms that allow you to customize its behavior, add new capabilities, and integrate with external tools and workflows.

### Overview of Extensibility Options
- **agents.md** - Project-specific agent instructions and context
- **Skills** - Reusable command patterns invoked with `/skill-name`
- **Scripts** - Automation scripts that interact with Claude Code
- **Hooks** - Shell commands triggered by Claude Code events
- **MCP Servers** - Model Context Protocol servers for tool integration

---

## 2. CLAUDE.md / AGENTS.md

### What These Files Are For

Think of CLAUDE.md as a **repo-specific agreement** with the AI agent:
- Tells the agent how to find its way around
- Pins workflow steps you don't want skipped (tests, linting, approvals)
- Names the safe defaults so the agent doesn't guess

> The best files are **short**, **opinionated**, and **explain the "why"**. They give a safe alternative instead of just saying "never".

### The Self-Improvement Loop

If model weights don't change, improvement must come from the **environment**. AGENTS.md is your agent's persistent memory—treat agent improvement like a runbook + postmortem loop:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  1. SPOT        │ ──▶ │  2. TELL        │ ──▶ │  3. WRITE       │ ──▶ │  4. READ        │
│                 │     │                 │     │                 │     │                 │
│  Notice a       │     │  Tell agent     │     │  Agent writes   │     │  Agent reads    │
│  mismatch       │     │  what's true    │     │  to AGENTS.md   │     │  next session   │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
        ▲                                                                       │
        └───────────────────────────────────────────────────────────────────────┘
```

**Key insight:** Natural language can turn into tool calls. Writing things down precisely means the agent can actually execute them.

The two levers for self-improvement:
1. **Durable repository memory** (AGENTS.md) - corrections that stick
2. **Reusable playbooks** (skills) - patterns that repeat

### Core Principles

1. **First lines are prime real estate** - The opening lines set the tone
2. **Operational, not philosophical** - Step-by-step instructions beat abstract guidance
3. **FORBIDDEN is unambiguous** - No room for interpretation when needed
4. **Safe alternatives** - Every "don't" should have a "do this instead"
5. **Project specificity** - Generic advice belongs elsewhere

### Why Keep CLAUDE.md Minimal (The Math)

**The constraint:** Your context is just an array of tokens—a sliding window that forgets everything when the conversation ends. No hidden memory. No database of past conversations.

**The problem with bloated files:**
- HumanLayer recommends keeping CLAUDE.md **under 60 lines**
- Frontier LLMs reliably follow **150-200 instructions**
- Claude Code's system prompt already uses **~50 of those**
- A 2000-line CLAUDE.md = half your context budget gone before any work begins

```
Context Budget Visualization:
┌──────────────────────────────────────────────────────────┐
│ System Prompt (~15%)  │ CLAUDE.md │   Your Work Space    │
│ [Already Used]        │ [??????]  │   [What Remains]     │
└──────────────────────────────────────────────────────────┘
        ↑                     ↑              ↑
   Can't reduce          Bloat here      Shrinks here
                         kills this
```

**The solution: Progressive Disclosure**
- CLAUDE.md = universal context only (~50 lines)
- Gotchas & details = separate docs loaded on demand
- Specialist agents = domain-specific context when needed

### Don't Write Prose About Lint Rules (Backpressure)

If a tool can enforce it, don't write prose about it.

**❌ Don't do this:**
```markdown
## Code Style
- Use 2-space indentation
- Prefer single quotes
- Always add trailing commas
- Maximum line length: 100 characters
```

**✅ Do this:**
```markdown
Run `pnpm lint:fix && pnpm typecheck` after code changes.
```

One line instead of two hundred. Let ESLint, TypeScript, and Prettier handle enforcement.

**Backpressure** = automated feedback mechanisms that let agents self-correct. Without a linter, you waste time typing "you forgot the import." With backpressure, the agent runs the build, reads the error, and fixes itself.

### The /learn Pattern (Capturing Gotchas)

When Claude struggles with something you've solved before, capture it—but not in CLAUDE.md.

**The pattern:**
1. Notice Claude making a repeat mistake
2. Run a `/learn` command (custom skill)
3. Skill analyzes conversation for reusable insights
4. Saves to appropriate file in `/docs`
5. CLAUDE.md just points to docs

**Directory structure:**
```
docs/
├── nuxt-content-gotchas.md    # 15 hard-won lessons
├── testing-strategy.md        # When to use which test type
└── SYSTEM_KNOWLEDGE_MAP.md    # Architecture overview
```

**CLAUDE.md stays stable:**
```markdown
## Further Reading

**IMPORTANT:** Before starting any task, identify which docs
below are relevant and read them first.

- `docs/nuxt-content-gotchas.md` - Framework pitfalls
- `docs/testing-strategy.md` - Test layers and when to use each
```

The **IMPORTANT** instruction is critical—without it, Claude won't automatically read these docs.

### One Agent Per Domain

Specialist agents load only when needed:

```
.claude/agents/
├── nuxt-content-specialist.md   # Content queries, MDC, search
├── nuxt-ui-specialist.md        # Component styling, theming
├── vue-specialist.md            # Reactivity, composables
└── nuxt-specialist.md           # Routing, config, deployment
```

When debugging a content query → loads nuxt-content-specialist
When styling a component → loads nuxt-ui-specialist

### Code Maps (Fast Navigation)

A **code map** helps the agent find files quickly, cutting down on wasted exploration. Without a map, agents need 5-6 searches to locate tricky spots. With one, they can one-shot it.

```markdown
## Code Map

### Entry Points
- `app/main.ts` - Application bootstrap
- `app/router/index.ts` - Route definitions

### Core Systems
- `app/stores/` - Pinia state management
- `app/composables/` - Shared Vue composables
- `app/api/` - API client and types

### Domain Logic
- `app/features/canvas/` - Canvas rendering engine
  - `nodes/` - Node type definitions
  - `events/` - Event handlers (click, drag, etc.)
  - `render/` - Rendering pipeline
```

**Keep the map alive:** When the agent finds the map is outdated, it should update AGENTS.md. Encode this as an explicit instruction:

```markdown
## Self-Maintenance

If you discover this code map is outdated (files moved, renamed, or new
important files added), update this section before continuing your task.
```

### AGENTS.md vs Skills (Vercel Eval Results)

Vercel's agent evals found:
- **Skills were never invoked in 56% of test cases** (zero improvement over baseline)
- Skills maxed out at **79% pass rate** even with explicit instructions
- Compressed docs in AGENTS.md achieved **100% pass rate**

> "The docs-based setup is more predictable: I know Claude will read what I point it to."

### Example: 50-Line CLAUDE.md

```markdown
# CLAUDE.md

Second Brain is a personal knowledge base using
Zettelkasten-style wiki-links.

## Commands
pnpm dev          # Start dev server
pnpm lint:fix     # Auto-fix linting issues
pnpm typecheck    # Verify type safety

Run `pnpm lint:fix && pnpm typecheck` after code changes.

## Stack
- Nuxt 4, @nuxt/content v3, @nuxt/ui v3

## Structure
- `app/` - Vue application
- `content/` - Markdown files
- `content.config.ts` - Collection schemas

## Further Reading

**IMPORTANT:** Read relevant docs below before starting any task.

- `docs/nuxt-content-gotchas.md`
- `docs/testing-strategy.md`
- `docs/SYSTEM_KNOWLEDGE_MAP.md`
```

**That's it.** Universal context only. Everything else lives in docs, agents, or tooling.

### Bootstrapping AGENTS.md

Use a one-time deep dive prompt to generate your initial AGENTS.md:

```markdown
You are a coding agent. Read through this repository and create an
`AGENTS.md` file at the repo root.

Requirements:
- Include a short codebase map that helps an agent find files quickly.
- Focus on entry points, directory roles, naming conventions,
  configuration wiring, and test locations.
- Add a section called "Local norms" with repo-specific rules you
  infer from the code and tooling.
- Add a section called "Self-correction" with two explicit instructions:
  - If the code map is discovered to be stale, update it.
  - If the user gives a correction about how work should be done in
    this repo, add it to "Local norms" so future sessions inherit it.

Process:
- Use search and targeted file reads, do not read every file.
- Prefer `rg` searches to find entry points and configs.
- Prefer high-signal files: `README`, `pyproject.toml`, `package.json`,
  `Makefile`, `.github/workflows`, and top-level `src` or `app` directories.

Output:
- Write the final `AGENTS.md` contents in Markdown.
- Keep it concise. Optimize for navigation and correctness.
```

The goal is to kickstart the self-improvement loop—after bootstrapping, the agent maintains and improves AGENTS.md through normal work.

### Corrections That Become Durable Norms

The "Local norms" section holds repo-specific corrections—things you find yourself saying out loud:

```markdown
## Local Norms

- Run Python in the pixi context: `pixi run python ...`
  (the agent will try `python -c ...` which fails without global Python)

- Do not modify tests to make them pass.
  (changing tests to pass destroys the point of having tests)

- Always run `pnpm typecheck` before claiming a task is complete.
```

Once written down, the agent stops making you restate them. This is the simplest way to reduce repeated friction.

### The Planning Loop Workflow

Skipping planning severely diminishes output quality—it forces the AI to guess requirements. The recommended workflow is a **four-phase cycle**:

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│  PLAN   │ ──▶ │ EXECUTE │ ──▶ │  TEST   │ ──▶ │ COMMIT  │
│         │     │         │     │         │     │         │
│ Align   │     │ Code to │     │ Validate│     │ Finalize│
│ strategy│     │ plan    │     │ quality │     │ & repeat│
└─────────┘     └─────────┘     └─────────┘     └─────────┘
     ▲                                               │
     └───────────────────────────────────────────────┘
```

**Key insight:** Planning creates clarity, making the AI's task more manageable and code more reliable. Without it, the agent guesses—and guesses compound into errors.

#### Plan Mode Rules (Matt Pocock)
```markdown
## Plan Mode
- Make the plan extremely concise. Sacrifice grammar for the sake of concision.
- At the end of each plan, give me a list of unresolved questions to answer, if any.
```

These simple rules transform plans from verbose documents into **scannable, actionable references** that maintain alignment between developer and AI.

**Where to put this:** Add to `~/.claude/CLAUDE.md` for global effect, or project-level for repo-specific behavior.

### Real-World Patterns (From Production Repos)

#### Pattern 1: Strict Concurrent Execution (ruvnet/agentic-flow)
```markdown
## 🚨 CRITICAL: CONCURRENT EXECUTION & FILE MANAGEMENT

**ABSOLUTE RULES**:
1. ALL operations MUST be concurrent/parallel in a single message
2. **NEVER save working files to the root folder**
3. ALWAYS organize files in appropriate subdirectories

### ⚡ GOLDEN RULE: "1 MESSAGE = ALL RELATED OPERATIONS"
```
**Why it works:** Treats "how to work" as part of correctness. Operational, not philosophical.

#### Pattern 2: Project Legibility (awesome-agentic-patterns)
```markdown
## Architecture

The project has a unique architecture where pattern documentation drives the site:

1. **Pattern Files** (`patterns/*.md`): Source of truth
   - Must include YAML front-matter with: title, status, authors, category, tags
   - Content sections: Problem, Solution, Example (with Mermaid diagrams)

2. **Automated Generation**: The `scripts/build_readme.py` script:
   - Scans all pattern files and extracts metadata
   - Updates README.md between markers
```
**Why it works:** Project shape becomes legible in minutes. Commands tied to reasons.

#### Pattern 3: Guardrails as Product Rules (agentic-coding-starter-kit)
```markdown
### Key Points

- This project uses **OpenRouter** as the AI provider, NOT direct OpenAI
- Default model: `openai/gpt-5-mini` (configurable via `OPENROUTER_MODEL` env var)
- Users get API keys from: https://openrouter.ai/settings/keys
```
**Why it works:** Reads like how a senior engineer would onboard a new teammate.

#### Pattern 4: Coding Patterns with Reasoning (Payload CMS - 40k+ stars)
```markdown
### Coding Patterns and Best Practices

- Prefer single object parameters (improves backwards-compatibility)
- Prefer types over interfaces (except when extending external types)
- Prefer functions over classes (classes only for errors/adapters)
- Prefer pure functions; when mutation unavoidable, return the mutated object
- Prefix booleans with `is`/`has`/`can`/`should` (e.g., `isValid`, `hasData`)
```
**Why it works:** Opinions WITH reasoning. The "why" is as important as the "what".

#### Pattern 5: Tool-Specific Constraints (MCP Python SDK - 21k+ stars, Anthropic)
```markdown
## Core Development Rules

1. Package Management
   - ONLY use uv, NEVER pip
   - Installation: `uv add <package>`
   - Running tools: `uv run <tool>`
   - FORBIDDEN: `uv pip install`, `@latest` syntax

## Exception Handling

- **Always use `logger.exception()` instead of `logger.error()`**
- **Catch specific exceptions:**
  - File ops: `except (OSError, PermissionError):`
  - JSON: `except json.JSONDecodeError:`
  - Network: `except (ConnectionError, TimeoutError):`
- **FORBIDDEN** `except Exception:` - unless in top-level handlers
```
**Why it works:** Tells you WHICH exceptions for WHICH operations. No vagueness.

#### Pattern 6: DO/DON'T with File Paths (Dragonfly DB - 30k+ stars)
```markdown
## Architecture Patterns

**Code Style**: `.clang-format` - snake_case vars, PascalCase functions

**DO**:
- Fiber-aware: `util::fb2::Mutex` → helio/util/fibers/
- Per-shard ops (no global state) → docs/df-share-nothing.md
- Command pattern → src/server/set_family.cc

**DON'T**:
- `std::thread`, `std::mutex` (deadlocks!)
- Global mutable state
- Edit without reading
- Skip tests
```
**Why it works:** Don't just tell what to avoid—show what to do instead with file paths.

#### Pattern 7: Validation Checklist (Dragonfly DB)
```markdown
## Validation Checklist

Before claiming a task is complete, verify:

### Code Quality
- [ ] Code compiles without errors: `cd build-dbg && ninja dragonfly`
- [ ] Code compiles without warnings (CI uses `-Werror`)
- [ ] No new ASAN/UBSAN violations

### Testing
- [ ] All existing unit tests pass: `ctest -V -L DFLY`
- [ ] New feature has corresponding test coverage
```
**Why it works:** Defines "done". Agent can self-verify before claiming completion.

#### Pattern 8: Agent Attribution (FastMCP - 22k+ stars)
```markdown
### Commit Messages and Agent Attribution

- **Agents NOT acting on behalf of @jlowin MUST identify themselves**
  (e.g., "🤖 Generated with Claude Code" in commits/PRs)
- Keep commit messages brief - ideally just headlines
- Focus on what changed, not how or why
```
**Why it works:** Tracks which contributions are agent-generated.

### Emerging Patterns Worth Stealing

#### TODO Priority Systems
```markdown
### TODO Annotations

- `TODO(0)`: Critical - never merge
- `TODO(1)`: High - architectural flaws, major bugs
- `TODO(2)`: Medium - minor bugs, missing features
- `TODO(3)`: Low - polish, tests, documentation
- `TODO(4)`: Questions/investigations needed
- `PERF`: Performance optimization opportunities
```
Agent can prioritize without asking. "Fix all TODO(0) and TODO(1)" is unambiguous.

#### Literate Programming / Decision Point Comments
```python
# Trigger: project has no active sync watcher
# Why: avoid duplicate file system watchers consuming resources
# Outcome: starts new watcher, registers in active_watchers dict
if project_id not in active_watchers:
    start_watcher(project_id)
```
Comments explain **Trigger**, **Why**, and **Outcome** for decision points.

#### Explicit Reasoning Protocol (Q Protocol - Christopher Toth)
```markdown
**BEFORE every action that could fail**, write out:

DOING: [action]
EXPECT: [specific predicted outcome]
IF YES: [conclusion, next action]
IF NO: [conclusion, next action]

**THEN** the tool call.

**AFTER**, immediate comparison:

RESULT: [what actually happened]
MATCHES: [yes/no]
THEREFORE: [conclusion and next action, or STOP if unexpected]
```
Makes agent reasoning visible. Best for critical systems where mistakes are expensive.

### Lessons from 2,500+ Agent Files (GitHub Analysis)

GitHub analyzed **2,500+ agents.md files** across public repos. The finding: most fail because they're too vague. "You are a helpful coding assistant" doesn't work. "You are a test engineer who writes tests for React components, follows these examples, and never modifies source code" does.

#### What the Successful Files Do

1. **Put commands early** - Include flags and options, not just tool names
2. **Code examples over explanations** - One real snippet beats three paragraphs
3. **Set clear boundaries** - Tell AI what it should never touch
4. **Be specific about your stack** - "React 18 with TypeScript, Vite, and Tailwind CSS" not "React project"
5. **Cover six core areas** - This puts you in the top tier

#### The Six Core Areas Checklist

| Area | What to Include |
|------|-----------------|
| **Commands** | Exact commands with flags: `npm test --coverage`, `pytest -v` |
| **Testing** | Test framework, coverage requirements, test file locations |
| **Project Structure** | Directory purposes, where to read vs write |
| **Code Style** | Real code examples showing good/bad patterns |
| **Git Workflow** | Commit conventions, branch strategy, PR requirements |
| **Boundaries** | What to never do, what requires approval |

#### The Three-Tier Boundary System

A pattern that emerged from successful agent files:

```markdown
## Boundaries
- ✅ **Always do:** Write to `src/` and `tests/`, run tests before commits, follow naming conventions
- ⚠️ **Ask first:** Database schema changes, adding dependencies, modifying CI/CD config
- 🚫 **Never do:** Commit secrets or API keys, edit `node_modules/` or `vendor/`
```

**Why this works:**
- **Always do** = safe defaults the agent should follow automatically
- **Ask first** = risky operations requiring human approval
- **Never do** = hard stops that prevent destructive mistakes

This three-tier system is clearer than a flat list of rules.

### Agent Archetypes Worth Building

From the GitHub analysis, six specialist agents appeared most often:

| Agent | Purpose | Key Boundaries |
|-------|---------|----------------|
| **@docs-agent** | Reads code, writes documentation | Write to `docs/`, never touch `src/` |
| **@test-agent** | Writes tests, analyzes results | Write to `tests/`, never remove failing tests |
| **@lint-agent** | Fixes style, formats code | Only fix style, never change logic |
| **@api-agent** | Builds endpoints, routes | Modify routes, ask before schema changes |
| **@security-agent** | Analyzes for vulnerabilities | Report only, never auto-fix security issues |
| **@deploy-agent** | Handles builds, deployments | Only dev environments, require approval |

**Key insight:** Start with one simple task, not a "general helper." Pick something specific like writing function documentation, adding unit tests, or fixing linting errors.

### Pitfalls to Avoid

| Pitfall | Problem | Solution |
|---------|---------|----------|
| Wall of text | Long files get ignored | Keep under one page |
| Negative-only rules | "Never use X" without replacement | Always give safe alternative |
| Missing commands | If not runnable, not useful | Document actual commands |
| No project map | Agent wastes time searching | Include key paths |
| Generic advice | Belongs in global config | Be project-specific |
| Vague persona | "Helpful assistant" fails | "Test engineer who writes React tests" |

### Minimal Template (Steal This)

```markdown
# Project Commands
- <command>: <what it does>

# Style
- <rule> (with a short example)

# Workflow
- Plan before code
- Run <test command>
- Run <lint/typecheck>

# Guardrails
- Don't <risky action>, use <safe alternative>

# Project Map
- <entry file>
- <core module>
- <data store>
```

### Full Templates

#### Template 1: Minimal Universal Starter
```markdown
This file provides guidance to Claude Code when working with this repository.

## Project Overview
[YOUR PROJECT DESCRIPTION HERE]

## Tech Stack
- Language: [e.g., TypeScript, Python, Go]
- Framework: [e.g., Next.js, FastAPI, Gin]
- Database: [e.g., PostgreSQL, SQLite, none]

## Commands
- `[command]` - [what it does]

## Code Style
- [Rule 1, with brief example if helpful]
- [Rule 2]

## DO NOT
- [Risky action] — instead, [safe alternative]

## Project Map
- `[entry file]` - [purpose]
- `[core directory/]` - [purpose]
```

#### Template 2: TypeScript / Next.js
```markdown
## Tech Stack
- Next.js 14+ (App Router)
- TypeScript (strict mode)
- [Database adapter]
- [Styling]

## Commands
- `pnpm dev` - Start development server
- `pnpm build` - Production build
- `pnpm test` - Run tests
- `pnpm lint` - Run ESLint
- `pnpm typecheck` - Run TypeScript compiler

## Code Style
- Functional components only (no class components)
- Prefer named exports over default exports
- Use `import type` for type-only imports
- Prefix booleans with `is`/`has`/`can`/`should`
- Collocate tests with source files (`*.test.ts`)

## Project Structure
- `app/` - Next.js App Router pages and layouts
- `components/` - Reusable UI components
- `lib/` - Utility functions and shared logic
- `types/` - TypeScript type definitions

## DO NOT
- Use `any` type — use `unknown` and narrow
- Use default exports — use named exports
- Modify files in `/generated` — auto-generated
- Commit `.env` files — use `.env.example`
```

#### Template 3: Python
```markdown
## Tech Stack
- Python 3.12+
- [Framework]
- Package manager: uv

## Commands
- `uv sync` - Install dependencies
- `uv run pytest` - Run tests
- `uv run ruff check .` - Lint
- `uv run ruff format .` - Format
- `uv run pyright` - Type check

## Package Management
- ONLY use uv, NEVER pip
- Add packages: `uv add <package>`
- FORBIDDEN: `uv pip install`, `@latest` syntax

## Exception Handling
- Use `logger.exception()` not `logger.error()`
- Catch specific exceptions:
  - File ops: `except (OSError, PermissionError):`
  - JSON: `except json.JSONDecodeError:`
  - Network: `except (ConnectionError, TimeoutError):`
- FORBIDDEN: bare `except Exception:`

## DO NOT
- Use `pip install` — use `uv add`
- Use bare `except:` — catch specific exceptions
- Modify `migrations/` manually — use Alembic
```

#### Template 4: Monorepo
```markdown
## Project Overview
This is a monorepo containing:
- `packages/[name]` - [description]
- `apps/[name]` - [description]

## Tech Stack
- Monorepo tool: [pnpm workspaces / Turborepo / Nx]

## Commands (from repository root)
- `pnpm install` - Install all dependencies
- `pnpm build` - Build all packages
- `pnpm test` - Run all tests
- `pnpm lint` - Lint all packages

## Commit Guidelines (Conventional Commits)
- `feat(scope):` - New features
- `fix(scope):` - Bug fixes
- `chore(scope):` - Maintenance
- Scope matches package name: `packages/ui` → `feat(ui):`

## TODO Annotations
- `TODO(0)`: Critical - never merge
- `TODO(1)`: High - must fix before release
- `TODO(2)`: Medium - should fix soon
- `TODO(3)`: Low - nice to have

## DO NOT
- Run `npm install` — use `pnpm install`
- Modify `package-lock.json` — we use pnpm
- Add dependencies to root unless shared by all
```

### Quick Checklist

If you only do three things:

1. **Document the commands people actually run**
2. **Keep the plan step short and mandatory**
3. **Give safe alternatives instead of just "never"**

### Anthropic's Guidance

From official best practices:
- Keep files concise, then tune based on real errors
- Avoid negative-only instructions—always give the alternative
- First lines are prime real estate

---

## 3. Skills

### Skill Hot-Reload (Claude Code 2.1+)

Claude Code 2.1 introduced **automatic skill hot-reloading**. Any skill under:
- `~/.claude/skills` (global)
- `.claude/skills` (project)

is **watched for changes**. The development loop becomes:

```
Edit SKILL.md → Save → Run /skill-name → New behavior
```

**No restart. No reinstall. No session reset.**

Skills now feel like hot, reloadable code—not static prompts. This transforms iterative skill development from a multi-step process into an immediate feedback loop.

### Why Skills Matter

**The Problem:** MCP servers and long global rules dump all context into the LLM upfront (10-50k tokens), overwhelming it even when most capabilities aren't needed for a given conversation.

**The Solution:** Skills use **progressive disclosure** - the agent discovers capabilities on-demand, using only ~1-5k tokens. This provides **10x context savings**.

> "The simpler the better" - Anthropic's motto. Skills are beautifully simple yet powerful.

### Progressive Disclosure - Three Layers

| Layer | Content | % of Total | Size Guidelines | When Loaded |
|-------|---------|------------|-----------------|-------------|
| **01** | YAML Front Matter (Description) | ~5% | 50-100 words | Always in system prompt |
| **02** | Full SKILL.md | ~30% | 300-500 lines | When agent needs capability |
| **03** | Reference Files | ~65% | Unlimited depth | When skill needs more context |

#### Layer 1: Description (Always Loaded)
- Lives in YAML front matter of SKILL.md
- Only the description goes into the system prompt
- Must be descriptive enough for agent to know when to use it
- Keep between 50-100 words

#### Layer 2: Full SKILL.md (On-Demand)
- Complete instructions for the capability
- Loaded via `load_skill()` tool when agent decides to use it
- Typically 300-500 lines (varies by complexity)
- References Layer 3 documents if needed

#### Layer 3: Reference Files (Deep Context)
- Scripts, docs, templates in `references/` folder
- Loaded via `read_ref()` tool
- Agent loads selectively per task
- Unlimited depth - can have 4th layer if needed (but gets complicated)

### Implementation Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    AI Agent (Any Framework)              │
│         Pydantic AI, LangChain, CrewAI, Agno, etc.      │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Dynamic System Prompt                       │
│    Collects all YAML front matter at startup            │
│    Contains: base instructions + skill descriptions      │
└─────────────────────────┬───────────────────────────────┘
                          │
            ┌─────────────┴─────────────┐
            ▼                           ▼
    ┌───────────────┐           ┌───────────────┐
    │ load_skill()  │           │  read_ref()   │
    │ Reads full    │           │ Reads Layer 3 │
    │ SKILL.md      │           │ references    │
    └───────────────┘           └───────────────┘
```

#### Required Tools (2-3)
1. **`load_skill(skill_name)`** - Returns full SKILL.md content
2. **`read_ref(skill_name, file_path)`** - Returns reference document
3. **`list_references(skill_name)`** (optional) - Lists available reference files

### Skill Directory Structure

```
skills/
├── weather/
│   ├── SKILL.md
│   └── references/
│       └── api_reference.md
├── research/
│   ├── SKILL.md
│   └── references/
├── code-review/
│   ├── SKILL.md
│   └── references/
│       ├── security_checklist.md
│       └── review_scripts.py
├── recipes/
│   ├── SKILL.md
│   └── references/
└── clock/
    └── SKILL.md          # Simple skills may not need references
```

### SKILL.md Template

```markdown
---
name: my_skill
description: >
  Brief description (50-100 words) explaining what this skill does
  and when the agent should use it. Be descriptive enough that the
  agent knows to load this skill for relevant requests.
version: 1.0.0
author: Your Name
---

## Overview
What this capability provides...

## Usage Guidelines
When to use this skill:
- Scenario 1
- Scenario 2

When NOT to use this skill:
- Edge case 1

## Step-by-Step Instructions
1. First, do this...
2. Then, do that...
3. Finally...

## API/Tool Reference
Details about APIs or tools this skill uses...

## Reference Files
For additional context, load these files:
- `references/api_docs.md` - Full API documentation
- `references/templates/` - Template files
```

### Skill-Scoped Hooks (Claude Code 2.1+)

Claude Code 2.1 allows hooks to be defined **directly in skill frontmatter**. This changes what a skill is—a skill becomes **instructions + automation + policy**:

```markdown
---
name: guarded-shell
description: Shell with safety checks

hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "~/.claude/hooks/validate-shell.sh"
---

# Guarded Shell Skill

This skill wraps shell commands with validation...
```

**What this enables:**
- Skills carry their **operational semantics** with them
- Distribute a skill and it brings its own safety checks
- No need to configure global hooks separately

**Example: Read-Only Research Skill**
```markdown
---
name: research-only
description: Research task with no file writes

hooks:
  PreToolUse:
    - matcher: "Write|Edit"
      hooks:
        - type: command
          command: "echo 'BLOCK: This skill is read-only' && exit 1"
---
```

Skills become **portable, governed behavioral units**—not just instruction sets.

### Forked Sub-Agents: `context: fork` (Claude Code 2.1+)

The `context: fork` field fundamentally changes what happens when you invoke a skill:

```markdown
---
name: deep-review
context: fork
agent: Explore
---

Review the codebase architecture and return a summary.
```

**Without `context: fork`:**
- Skill injects instructions into current conversation
- All context is shared
- Executes in main agent's thread

**With `context: fork`:**
- Spawns a **new sub-agent process**
- Sub-agent runs in **isolated context**
- Uses the `agent:` field as its system prompt
- Sub-agent can have its **own hooks**
- Only the **final result** returns to parent

```
Parent Agent                    Forked Sub-Agent
┌─────────────────────┐        ┌─────────────────────┐
│ Invokes /deep-review│ ─────► │ Spawns new process  │
│                     │        │ Uses "Explore" prompt│
│ Continues working   │        │ Does extensive work │
│                     │        │ Has own hooks       │
│ Gets summary only   │ ◄───── │ Returns result only │
└─────────────────────┘        └─────────────────────┘
```

**Key insight:** `context: fork` turns skills into **invokable agent processes** with their own lifecycle, governance, and observability. It's not syntax sugar—it's a process model.

### Inverse Pattern: `skills:` in Sub-Agent Frontmatter

The **dual composition model** allows sub-agents to load skills as domain knowledge:

```markdown
---
name: api-developer
skills:
  - api-conventions
  - error-handling-patterns
---

You are an API development specialist...
```

Here:
- The **sub-agent** defines the system prompt
- **Skills** act as injected domain knowledge

**Two symmetric patterns:**

| Pattern | Who owns system prompt | Role of skills |
|---------|----------------------|----------------|
| `context: fork` on skill | Agent type (from `agent:` field) | Skill is the task |
| `skills:` on sub-agent | Sub-agent itself | Skills are references |

**Note:** Sub-agents must be reloaded via `/agents` (not hot-reloaded like skills).

### Best Practices

#### Writing Good Descriptions
- **Be specific** - Agent must know WHEN to use this skill
- **50-100 words** - Enough detail without bloating system prompt
- **Action-oriented** - Describe what the skill DOES

#### Writing Good SKILL.md
- **300-500 lines** typical (varies by complexity)
- **Include step-by-step** - LLMs follow explicit instructions well
- **Reference Layer 3** - Point to reference files for deep context
- **Examples help** - Show expected inputs/outputs

#### Critical: Prompt the Agent About Skills
LLMs don't inherently understand skills. Your system prompt MUST explain:
1. What skills are
2. How to read skill metadata
3. Step-by-step how to leverage a skill
4. When to load vs. not load

### Building Skills with Claude Desktop

Claude Desktop has a built-in **Skill Creator** skill:
1. Go to File → Settings → Capabilities
2. Scroll to Skills → Example Skills
3. Enable "Skill Creator"
4. Ask Claude: "Help me build a skill for [your use case]"

The Skill Creator will:
- Guide you through the process
- Apply Anthropic's best practices
- Generate SKILL.md and reference files
- Output can be dropped into your skills folder

### Testing Skills: Evals

When you have dozens of skills, manual testing is impractical. Use evals:

```yaml
# Example eval test case
- question: "What's the weather in New York right now?"
  expected_skill: weather

- question: "Review this Python code for security issues"
  expected_skill: code-review
```

Key eval practices:
- Test that correct skill loads for each question type
- Run evals after ANY change to system prompt or skills
- Use fast/cheap models (e.g., Haiku) for eval runs
- Catch issues like: "content creation" not triggering "x-posts" skill

### Observability in Production

Use tools like LogFire (Pydantic team) to:
- Track token usage and costs
- View traces of agent decisions
- Debug user-reported issues
- See all tool calls and parameters

### Framework Compatibility

Skills work with ANY framework:
- Pydantic AI
- LangChain
- CrewAI
- Agno
- No framework at all

The pattern is universal: dynamic system prompt + file-reading tools.

### Real-World Skill Example: /learn

The `/learn` skill captures insights from conversations and saves them to documentation. This implements the progressive disclosure pattern—keeping CLAUDE.md minimal while building a growing knowledge base.

**File:** `.claude/commands/learn.md`

```markdown
---
description: Analyze conversation for learnings and save to docs folder
argument-hint: [optional topic hint]
model: claude-opus-4-5-20251101
allowed-tools: Read, Write, Edit, Glob, Grep, AskUserQuestion
---

# Learn from Conversation

Analyze this conversation for insights worth preserving in the project's documentation.

**If a topic hint was provided via `$ARGUMENTS`, focus on capturing that specific learning.**
**If no hint provided, analyze the full conversation for valuable insights.**

## Phase 1: Deep Analysis

Think deeply about what was learned in this conversation:
- What new patterns or approaches were discovered?
- What gotchas or pitfalls were encountered?
- What architecture decisions were made and why?
- What conventions were established?
- What troubleshooting solutions were found?

Only capture insights that are:
1. **Reusable** - Will help in future similar situations
2. **Non-obvious** - Not already common knowledge
3. **Project-specific** - Relevant to this codebase

If nothing valuable was learned, say so and exit gracefully.

## Phase 2: Categorize & Locate

Read existing docs to find the best home. Look for a `docs/` folder or similar
documentation directory in the project.

If no existing doc fits, propose a new doc file with kebab-case naming.

**Note:** CLAUDE.md stays stable as the entry point. All detailed learnings go
to `/docs` only.

## Phase 3: Draft the Learning

Format the insight to match existing doc style:
- Clear heading describing the topic
- Concise explanation of the insight
- Code examples if applicable
- Context on when this applies

## Phase 4: User Approval (BLOCKING)

Present your proposed changes:
1. What insight you identified
2. Where you'll save it (existing doc + section, or new file)
3. The exact content to add

**Wait for explicit user approval before saving.**

## Phase 5: Save

After approval, save the learning and confirm what was captured.
```

**Key patterns in this skill:**

| Pattern | Implementation |
|---------|----------------|
| YAML frontmatter | `description`, `argument-hint`, `model`, `allowed-tools` |
| Phased workflow | 5 explicit phases with clear purposes |
| User approval gate | Phase 4 blocks until user confirms |
| Tool restrictions | Only Read, Write, Edit, Glob, Grep, AskUserQuestion |
| Graceful exit | "If nothing valuable was learned, say so and exit" |
| Variables | `$ARGUMENTS` for optional topic hint |

**Usage:**
```
/learn                    # Analyze full conversation
/learn stem vs slug       # Focus on specific topic
```

---

## 4. Scripts & Commands

### The .claude Directory Structure

Claude Code projects use a `.claude` directory for customization:

```
.claude/
├── agents/              # Agent configurations
├── commands/            # Slash commands (invoked with /command-name)
│   ├── checkpoint.md
│   ├── continue-feature.md
│   ├── create-spec.md
│   ├── publish-to-github.md
│   └── review-pr.md
├── skills/              # Skills (more complex capabilities)
│   └── frontend-design/
│       ├── SKILL.md
│       └── LICENSE.txt
└── settings.local.json  # Local settings overrides
```

### Slash Commands

Commands are markdown files in `.claude/commands/` invoked with `/command-name`.

#### Real-World Command Examples (from agentic-coding-starter-kit)

| Command | Purpose |
|---------|---------|
| `/create-spec` | Generate feature specifications |
| `/publish-to-github` | Create tracked issues and project boards |
| `/continue-feature` | Implement tasks with automatic commits |
| `/checkpoint` | Create comprehensive commit snapshots |
| `/review-pr` | Review pull requests |

#### Agentic Workflow Pattern

These commands facilitate a complete agentic development cycle:

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ /create-spec │ ──▶ │ /publish-to- │ ──▶ │ /continue-   │ ──▶ │ /checkpoint  │
│              │     │   github     │     │   feature    │     │              │
│ Generate     │     │ Create issue │     │ Implement    │     │ Commit       │
│ spec doc     │     │ & track      │     │ with commits │     │ snapshot     │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
```

### Command File Format

Commands are simple markdown files:

```markdown
# Command Name

Brief description of what this command does.

## Instructions

Step-by-step instructions for the AI to follow when this command is invoked.

## Parameters

- `$ARGUMENTS` - User-provided arguments passed to the command
```

### CLAUDE.md Guardrails for Commands

From the agentic-coding-starter-kit CLAUDE.md:

```markdown
## Critical AI Assistant Rules

1. **Always validate code quality**: Run `npm run lint && npm run typecheck` after changes
2. **Never start dev server**: Don't execute `npm run dev`; ask users for server output
3. **Use OpenRouter exclusively**: Import from `@openrouter/ai-sdk-provider`, not OpenAI
4. **Maintain styling consistency**: Apply standard Tailwind utilities and shadcn/ui tokens
5. **Secure authentication**: Use `@/lib/auth` server-side; implement session checks
6. **Database operations**: Leverage Drizzle ORM; migrate schemas after modifications
7. **File storage abstraction**: Use `@/lib/storage` for uploads
8. **Component patterns**: Prioritize existing shadcn/ui components; maintain TypeScript
```

**Key patterns:**
- Rules are numbered and bolded for clarity
- Each rule explains WHAT to do, not just what to avoid
- Technical specifics included (import paths, commands)
- "Never X; do Y instead" format for prohibitions

### Configuration: settings.local.json

Local settings overrides for development:

```json
{
  "permissions": {
    "allow": ["Bash(npm run lint)", "Bash(npm run typecheck)"],
    "deny": ["Bash(npm run dev)"]
  }
}
```

---

## 5. Hooks

Hooks are shell commands triggered by Claude Code events. They allow you to intercept, validate, or modify Claude's behavior at specific points.

### Hook Scoping Hierarchy (Claude Code 2.1+)

Before 2.1, hooks existed only at **global** and **project** scopes. Claude Code 2.1 introduced **skill** and **sub-agent** scoped hooks:

```
Global hooks (~/.claude/settings.json)
    ↓
Project hooks (.claude/settings.json)
    ↓
Skill hooks (SKILL.md frontmatter)        ← NEW in 2.1
    ↓
Sub-agent hooks (agent frontmatter)       ← NEW in 2.1
```

**This is the real platform shift.** Hooks become **composable and layered**, not just global switches.

| Scope | Location | When Applied |
|-------|----------|--------------|
| **Global** | `~/.claude/settings.json` | All sessions |
| **Project** | `.claude/settings.json` | This project only |
| **Skill** | SKILL.md frontmatter | When skill is active |
| **Sub-agent** | Agent frontmatter | When that sub-agent runs |

### Canonical Hook Configuration (JSON)

Hooks are command-based and configured in JSON:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "say 'Task complete'"
          }
        ]
      }
    ]
  }
}
```

**Key concepts:**
- **Event**: `PreToolUse`, `PostToolUse`, `Stop`, `SessionStart`, `UserPromptSubmit`, `PreCompact`
- **Matcher**: String pattern for tools or skills
- **Command hooks**: External scripts invoked by Claude
- Claude sends structured **JSON on stdin**
- Your script controls behavior via **exit codes** and **stdout**

### Interactive Hook Management: `/hooks`

The `/hooks` command provides interactive hook management:
- Create hooks interactively
- Edit settings.json
- Reload hooks live

### Sub-Agent Hooks: Policy Islands

Sub-agent frontmatter supports hooks directly, creating **policy islands**:

```markdown
---
name: code-reviewer
description: Review code changes with linting

hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/validate-command.sh"
  PostToolUse:
    - matcher: "Edit|Write"
      hooks:
        - type: command
          command: "./scripts/run-linter.sh"
---

You are a code reviewer...
```

These hooks:
- **Only run** while that sub-agent is active
- Support **all lifecycle events**
- Apply **only to that agent**

This makes each sub-agent a **policy island**. You can build agents that are:
- Read-only
- Write-restricted
- Network-blocked
- Tool-whitelisted

**Not by prompt. Not by instruction. By runtime enforcement.**

This is **real sandboxing**.

### Enterprise Governance: `allowManagedHooksOnly`

In managed environments, `allowManagedHooksOnly` can restrict hooks to centrally approved ones:

```json
{
  "allowManagedHooksOnly": true,
  "hooks": {
    "PostToolUse": [...]
  }
}
```

This is an important enterprise governance feature—ensuring agents can only use pre-approved hooks.

### Event Types

| Event | Trigger | Use Cases |
|-------|---------|-----------|
| `bash` | Before Bash tool execution | Block dangerous commands, require confirmation |
| `file` | Before Edit/Write/MultiEdit tools | Protect sensitive files, enforce patterns |
| `stop` | When Claude wants to end session | Require tests run, completion checks |
| `prompt` | On user prompt submission | Input validation, preprocessing |
| `all` | All events | Global rules |

### Creating Hooks with Hookify

The **hookify** plugin provides a simple way to create hooks using markdown files instead of complex JSON.

**Installation:**
```bash
/plugin install hookify@claude-plugin-directory
```

**Quick Start:**
```bash
/hookify Warn me when I use rm -rf commands
```

This creates `.claude/hookify.warn-rm.local.md` - rules take effect immediately, no restart needed.

### Hook File Format

**Simple Rule (Single Pattern):**

`.claude/hookify.dangerous-rm.local.md`:
```markdown
---
name: block-dangerous-rm
enabled: true
event: bash
pattern: rm\s+-rf
action: block
---

⚠️ **Dangerous rm command detected!**

This command could delete important files. Please:
- Verify the path is correct
- Consider using a safer approach
```

**Action field:**
- `warn`: Shows warning but allows operation (default)
- `block`: Prevents operation from executing

### Advanced Rules (Multiple Conditions)

`.claude/hookify.sensitive-files.local.md`:
```markdown
---
name: warn-sensitive-files
enabled: true
event: file
action: warn
conditions:
  - field: file_path
    operator: regex_match
    pattern: \.env$|credentials|secrets
  - field: new_text
    operator: contains
    pattern: KEY
---

🔐 **Sensitive file edit detected!**

Ensure credentials are not hardcoded and file is in .gitignore.
```

**All conditions must match** for the rule to trigger.

### Field Reference

**For bash events:**
- `command`: The bash command string

**For file events:**
- `file_path`: Path to file being edited
- `new_text`: New content being added (Edit, Write)
- `old_text`: Old content being replaced (Edit only)

**For prompt events:**
- `user_prompt`: The user's submitted prompt text

### Operators

| Operator | Description |
|----------|-------------|
| `regex_match` | Pattern must match (most common) |
| `contains` | String must contain pattern |
| `equals` | Exact string match |
| `not_contains` | String must NOT contain pattern |
| `starts_with` | String starts with pattern |
| `ends_with` | String ends with pattern |

### Example Hooks

**Block Destructive Commands:**
```markdown
---
name: block-destructive-ops
enabled: true
event: bash
pattern: rm\s+-rf|dd\s+if=|mkfs|format
action: block
---

🛑 **Destructive operation blocked!**

This command can cause data loss. Please verify the exact path.
```

**Warn About Debug Code:**
```markdown
---
name: warn-debug-code
enabled: true
event: file
pattern: console\.log\(|debugger;|print\(
action: warn
---

🐛 **Debug code detected**

Remember to remove debugging statements before committing.
```

**Require Tests Before Stopping:**
```markdown
---
name: require-tests-run
enabled: true
event: stop
action: block
conditions:
  - field: transcript
    operator: not_contains
    pattern: npm test|pytest|cargo test
---

**Tests not detected!**

Before stopping, please run tests to verify your changes.
```

**Prevent Hardcoded Credentials:**
```markdown
---
name: api-key-in-typescript
enabled: true
event: file
conditions:
  - field: file_path
    operator: regex_match
    pattern: \.tsx?$
  - field: new_text
    operator: regex_match
    pattern: (API_KEY|SECRET|TOKEN)\s*=\s*["']
---

🔐 **Hardcoded credential in TypeScript!**

Use environment variables instead.
```

### Pattern Syntax (Regex)

| Pattern | Matches | Example |
|---------|---------|---------|
| `rm\s+-rf` | rm -rf | `rm -rf /tmp` |
| `console\.log\(` | console.log( | `console.log("test")` |
| `(eval\|exec)\(` | eval( or exec( | `eval("code")` |
| `\.env$` | files ending in .env | `.env`, `.env.local` |
| `chmod\s+777` | chmod 777 | `chmod 777 file.txt` |

**Tips:**
- Use `\s` for whitespace
- Escape special chars: `\.` for literal dot
- Use `|` for OR: `(foo|bar)`
- Use `.*` to match anything

### Management Commands

```bash
/hookify:list       # List all rules
/hookify:configure  # Enable/disable rules interactively
/hookify:help       # Get help
```

### Ralph Loop (Iterative Development Hook)

The **ralph-loop** plugin uses a Stop hook to create self-referential development loops:

```bash
/ralph-loop "Build a REST API for todos" --completion-promise "DONE" --max-iterations 50
```

Claude will:
1. Work on the task
2. Try to exit
3. Stop hook blocks exit and feeds same prompt back
4. Repeat until completion promise found in output

This creates autonomous iteration where Claude improves by reading its own previous work in files.

---

## 6. MCP Servers

### What MCP Is

Model Context Protocol (MCP) servers provide external tool integration—letting Claude Code call APIs, access databases, interact with services, etc.

### The Context Bloat Problem

Anthropic themselves have identified significant issues with MCP in the current spec ([engineering blog](https://www.anthropic.com/engineering/code-execution-with-mcp)):

| Problem | Impact |
|---------|--------|
| **Tool definition overload** | Loading all tools upfront creates hundreds of thousands of tokens before the model even reads your request |
| **Intermediate result redundancy** | Every result must pass through the model, sometimes processing 50,000+ tokens per operation |

**The math:** An MCP server with 20 tools might add 10-50k tokens just in tool definitions—before any actual work happens.

### Research Agents as MCP Alternative

Instead of MCP for documentation/knowledge access, use **custom research agents** that leverage the `llms.txt` standard.

**The pattern:**
1. Most modern documentation sites have `llms.txt` (a sitemap for AI)
2. Agent fetches `llms.txt` first to understand available docs
3. Agent fetches only the specific pages needed
4. Results come back distilled, not raw

**Advantages over MCP:**

| Aspect | MCP | Research Agent |
|--------|-----|----------------|
| Context load | 10-50k tokens upfront | ~100-500 tokens (description only) |
| Customization | Limited to server design | Full control |
| Where it runs | Main context | Separate context window |
| Token savings | Baseline | **98%+ reduction** |

> Claude Code itself uses this exact pattern. When you ask it about its own features, it spawns a `claude-code-guide` agent that fetches from a documentation sitemap—not training data.

### The llms.txt Standard

Many documentation sites now expose an `llms.txt` file at their root:
- `https://content.nuxt.com/llms.txt`
- `https://dexie.org/llms.txt`
- `https://docs.astro.build/llms.txt`

This file serves as an AI-readable sitemap, listing available documentation pages with brief descriptions.

### Agent File Structure

Agent files live in `.claude/agents/` with full YAML frontmatter:

```markdown
---
name: library-specialist
description: >
  Use this agent when the task involves [library] in any way - implementing,
  modifying, querying, reviewing, or improving [library] code.

  Examples:

  <example>
  Context: User asks about improving their implementation.
  user: "What can I improve in this codebase for [library]?"
  assistant: "I'll use the library-specialist agent to review your code."
  <commentary>
  Since the user is asking about [library] improvements, use this agent.
  </commentary>
  </example>
model: opus
color: green
---

# [Library] Specialist Agent

## Primary Domain
**[Library]**: Brief description of what it does.

### Core Expertise Areas
1. Area 1
2. Area 2

## Documentation Sources
- **Primary docs** (`https://example.com/llms.txt`)

## Operational Approach
1. **Fetch documentation index** from llms.txt
2. **Categorize user inquiry** into domain
3. **Fetch targeted documentation pages**
4. **Review project context** (local files)
5. **Provide actionable guidance** with code examples

## Core Guidelines
- Prioritize official documentation over training knowledge
- Maintain concise, actionable responses
- Reference documentation URLs consulted
- Verify API specifics against fetched docs before providing guidance
```

**Key frontmatter fields:**

| Field | Purpose |
|-------|---------|
| `name` | Agent identifier |
| `description` | When Claude should spawn this agent (include `<example>` blocks) |
| `model` | Which model to use (opus, sonnet, haiku) |
| `color` | Terminal color for agent output |

### Full Example: Nuxt Content Specialist

```markdown
---
name: nuxt-content-specialist
description: >
  Use this agent when the task involves @nuxt/content v3 - implementing,
  modifying, querying, reviewing content management code. Includes collections,
  MDC components, content sources, and search.

  <example>
  user: "How do I query content by multiple tags?"
  assistant: "Let me use the nuxt-content-specialist agent."
  <commentary>
  Query capabilities require fetching current documentation.
  </commentary>
  </example>
model: opus
color: green
---

# Nuxt Content Specialist Agent

## Primary Domain
**@nuxt/content v3**: File-based content with Markdown support, MDC syntax,
SQLite-based querying, and full-text search.

### Core Expertise Areas
1. **Collections**: `content.config.ts`, Zod schemas, collection types
2. **MDC Syntax**: Vue components in Markdown, props, slots
3. **Querying**: `queryCollection()`, navigation, search
4. **Rendering**: `<ContentRenderer>`, prose components

## Documentation Sources
- **Primary**: `https://content.nuxt.com/llms.txt`

| Section | URL Path | Purpose |
|---------|----------|---------|
| Collections | `/docs/collections` | Collection definitions |
| Querying | `/docs/querying` | Query composables |
| MDC | `/docs/files/markdown` | Markdown syntax |

## Operational Approach
1. **Fetch documentation index** from `https://content.nuxt.com/llms.txt`
2. **Categorize inquiry** (collections, querying, MDC, search, etc.)
3. **Identify specific URLs** from index
4. **Fetch targeted pages**
5. **Review local context** (`content.config.ts`, content files)
6. **Provide actionable guidance** with TypeScript examples

## Core Guidelines
- Prioritize official docs over training knowledge (v3 ≠ v2)
- Reference documentation URLs consulted
- Verify API specifics against fetched docs
- Note v2→v3 migration considerations when relevant
- Handle "content not found" gracefully

## Project Context
```typescript
// content.config.ts pattern
import { defineCollection, z } from '@nuxt/content'

export const collections = {
  content: defineCollection({
    type: 'page',
    source: '**/*.md'
  })
}
```
```

### Design Principles for Research Agents

1. **Documentation-first**: Always fetch `llms.txt` before answering
2. **Specific expertise**: Focused scope, not general knowledge
3. **Verification**: Cross-reference docs, don't rely on training data
4. **Practical output**: Code following project conventions

### Creating Your Own Research Agent

1. Find if the library has `llms.txt` (most modern docs do)
2. Create agent in `.claude/agents/<name>.md`
3. Add YAML frontmatter with description and examples
4. Define operational approach (fetch llms.txt → categorize → fetch pages)
5. Add project context patterns if applicable

### When to Use MCP vs Research Agents

| Use Case | Recommendation |
|----------|----------------|
| External APIs (GitHub, Slack, etc.) | MCP |
| Database access | MCP |
| Documentation lookup | Research Agent |
| Library guidance | Research Agent |
| Real-time data feeds | MCP |
| Knowledge synthesis | Research Agent |

---

## 7. Official Plugin System

Anthropic maintains an official plugin directory at [github.com/anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official).

### Installation

```bash
# Install from marketplace
/plugin install {plugin-name}@claude-plugin-directory

# Or browse available plugins
/plugin > Discover
```

### Plugin Structure (Official Standard)

```
plugin-name/
├── .claude-plugin/
│   └── plugin.json      # Plugin metadata (required)
├── .mcp.json            # MCP server configuration (optional)
├── commands/            # Slash commands (optional)
├── agents/              # Agent definitions (optional)
├── skills/              # Skill definitions (optional)
└── README.md            # Documentation
```

### plugin.json Format

```json
{
  "name": "example-plugin",
  "description": "What this plugin does",
  "author": {
    "name": "Your Name",
    "email": "you@example.com"
  }
}
```

### Command Frontmatter (Official Format)

```yaml
---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*)
description: Create a git commit
---
```

**Dynamic context injection** with `!` prefix:
```markdown
## Context

- Current git status: !`git status`
- Current branch: !`git branch --show-current`
- Recent commits: !`git log --oneline -10`
```

The `!` prefix executes the command and injects output into the prompt.

### Official Plugins Catalog

**Language Servers (LSP):**
| Plugin | Language |
|--------|----------|
| `typescript-lsp` | TypeScript/JavaScript |
| `pyright-lsp` | Python |
| `gopls-lsp` | Go |
| `rust-analyzer-lsp` | Rust |
| `clangd-lsp` | C/C++ |
| `jdtls-lsp` | Java |
| `kotlin-lsp` | Kotlin |
| `swift-lsp` | Swift |
| `php-lsp` | PHP |
| `lua-lsp` | Lua |
| `csharp-lsp` | C# |

**Development Tools:**
| Plugin | Purpose |
|--------|---------|
| `code-review` | Multi-agent PR review with confidence scoring |
| `feature-dev` | 7-phase feature development workflow |
| `commit-commands` | Git commit, push, PR workflows |
| `pr-review-toolkit` | PR review utilities |
| `code-simplifier` | Code simplification |
| `security-guidance` | Security best practices |

**Meta/Productivity:**
| Plugin | Purpose |
|--------|---------|
| `hookify` | Create hooks via markdown files |
| `ralph-loop` | Iterative self-referential development |
| `claude-md-management` | CLAUDE.md management |
| `plugin-dev` | Plugin development tools |
| `playground` | Experimentation sandbox |

**Output Styles:**
| Plugin | Purpose |
|--------|---------|
| `explanatory-output-style` | Detailed explanations |
| `learning-output-style` | Educational output |

### External Partner Plugins

| Plugin | Integration |
|--------|-------------|
| `github` | GitHub API |
| `gitlab` | GitLab API |
| `slack` | Slack |
| `linear` | Linear issues |
| `asana` | Asana tasks |
| `supabase` | Supabase |
| `firebase` | Firebase |
| `stripe` | Stripe API |
| `playwright` | Browser testing |
| `greptile` | Code search |

### Advanced: Code Review Plugin

The official `/code-review` command demonstrates sophisticated multi-agent orchestration:

**8-Step Workflow:**
1. Haiku agent checks PR eligibility (closed, draft, automated, already reviewed)
2. Haiku agent finds relevant CLAUDE.md files
3. Haiku agent summarizes the change
4. **5 parallel Sonnet agents** independently review:
   - Agent #1: CLAUDE.md compliance
   - Agent #2: Shallow bug scan
   - Agent #3: Historical git context
   - Agent #4: Previous PR comments
   - Agent #5: Code comment compliance
5. Haiku agents score each issue (0-100 confidence)
6. Filter issues below 80% confidence
7. Re-check PR eligibility
8. Post comment via `gh`

**Confidence Scoring:**
| Score | Meaning |
|-------|---------|
| 0 | False positive |
| 25 | Might be real, couldn't verify |
| 50 | Real but nitpick |
| 75 | Very likely real, important |
| 100 | Definitely real, frequent |

### Advanced: Feature Dev Plugin

The `/feature-dev` plugin implements a **7-phase workflow**:

```
Phase 1: Discovery      → Clarify requirements
Phase 2: Exploration    → 2-3 code-explorer agents analyze codebase
Phase 3: Questions      → Fill gaps, resolve ambiguities (BLOCKING)
Phase 4: Architecture   → 2-3 code-architect agents design approaches
Phase 5: Implementation → Build (after approval)
Phase 6: Quality Review → 3 code-reviewer agents (BLOCKING)
Phase 7: Summary        → Document what was built
```

**Specialized Agents:**
- `code-explorer`: Traces execution paths, maps architecture
- `code-architect`: Designs implementation blueprints
- `code-reviewer`: Reviews for bugs, quality, conventions

### Creating Your Own Plugin

1. Create plugin directory structure
2. Add `.claude-plugin/plugin.json` with metadata
3. Add commands in `commands/` (markdown with frontmatter)
4. Add agents in `agents/` (markdown with YAML frontmatter)
5. Add skills in `skills/` (subdirectory with SKILL.md)
6. Optionally add MCP config in `.mcp.json`
7. Submit via [plugin directory submission form](https://clau.de/plugin-directory-submission)

---

## 8. Comparison: When to Use What

### Quick Reference

| Pick this | When | Why |
|-----------|------|-----|
| **CLAUDE.md** | Always-on project rules/context | Auto-loaded on startup; shared via git |
| **Slash command** | Explicit one-shot workflow on demand | Discoverable via `/...`, takes arguments |
| **Subagent** | Research-heavy tasks (lots of reading/searching) | Separate context window; returns distilled result |
| **Skill** | Rich workflow Claude auto-applies when it recognizes task | Packaged capability with supporting files |

### How They Relate

| Mechanism | Main Context | Separate Context | Can Spawn Subagents | Manually Runnable |
|-----------|:------------:|:----------------:|:-------------------:|:-----------------:|
| **CLAUDE.md** | ✅ | ❌ | ❌ | ❌ |
| **Slash command** | ✅ | ❌ | ✅ (via Task) | ✅ `/command` |
| **Skill** | ✅ | ❌ | ✅ (if Task allowed) | ❌ |
| **Subagent** | ❌ | ✅ | ⚠️ Depends on tools | ⚠️ Usually delegated |

### Key Insight: Subagents Keep Context Clean

> Even when the task is "just exploration," subagents are a great default because they let Claude do **lots of reading/searching** without dumping everything into your main thread.

This is especially useful in **plan mode**: Claude Code kicks off an `Explore`-style subagent to scan the repo and return a distilled map of relevant files/patterns, so your main conversation stays focused.

```
Main Context                    Subagent Context
┌─────────────────────┐        ┌─────────────────────┐
│ Your conversation   │        │ Fetch docs          │
│ stays clean         │◄───────│ Read 20 files       │
│                     │ Result │ Search patterns     │
│ Just gets summary   │ only   │ Synthesize findings │
└─────────────────────┘        └─────────────────────┘
```

### Same Problem, Four Solutions (Dexie.js Example)

#### Solution 1: CLAUDE.md (Always-On)
```markdown
## Database
We use Dexie.js for IndexedDB. Before implementing any database code:
1. Fetch the docs index from https://dexie.org/llms.txt
2. Use `liveQuery()` for reactive data binding
```
**Trade-off:** Zero effort, but context drift in long sessions.

#### Solution 2: Slash Command (On-Demand)
```markdown
---
description: Get Dexie.js guidance with current documentation
allowed-tools: Read, Grep, Glob, WebFetch
---

First, fetch the documentation index from https://dexie.org/llms.txt
Then answer: $ARGUMENTS
```
**Trade-off:** Explicit control, but must remember to invoke.

#### Solution 3: Subagent (Isolated Context)
```markdown
---
name: dexie-db-specialist
description: Use when task involves Dexie.js or IndexedDB
model: opus
---

You are an expert Dexie.js specialist...
**Before ANY Dexie question, MUST fetch https://dexie.org/llms.txt**
```
**Trade-off:** Clean context, but results come back as summary only.

#### Solution 4: Skill (Auto-Discovered)
```markdown
---
name: dexie-expert
description: Dexie.js database guidance
allowed-tools: Read, Grep, Glob, WebFetch
---

# Dexie.js Expert
When user needs help with Dexie.js:
1. Fetch https://dexie.org/llms.txt
2. Fetch relevant pages
3. Apply to this repo's patterns
```
**Trade-off:** Auto-applies when matched, but may not fire (56% miss rate per Vercel evals).

### Slash Commands vs Skills: The Key Difference

| Aspect | Slash Commands | Skills |
|--------|----------------|--------|
| **Invocation** | Manual: `/command-name` | Auto-discovered by Claude |
| **File structure** | Single `.md` file | Directory with supporting files |
| **Discovery** | Terminal `/...` autocomplete | Claude decides based on `description` |
| **Best for** | Explicit, repeatable workflows | Rich capabilities with patterns/templates |

### Orchestrating with Slash Commands

Slash commands can **orchestrate** subagents and skills:

```markdown
---
description: Research a problem using multiple sources
allowed-tools: Task, WebSearch, WebFetch, Grep, Glob, Read, Write
---

# Research: $ARGUMENTS

## Step 1: Launch Parallel Research Agents

Use Task tool to spawn these subagents **in parallel**:

1. **Web Documentation Agent** (subagent_type: general-purpose)
   - Search official documentation

2. **Codebase Explorer Agent** (subagent_type: Explore)
   - Search codebase for related patterns

## Step 2: Create Research Document

After all agents complete, create `docs/research/<topic-slug>.md`
```

### Nested CLAUDE.md Files

Claude Code discovers **nested CLAUDE.md files** in subdirectories:

```
project-root/
├── CLAUDE.md              # Always loaded
├── tests/
│   └── CLAUDE.md          # Loaded when reading test files
├── src/
│   └── db/
│       └── CLAUDE.md      # Loaded when accessing db files
```

The nested file only loads when Claude accesses files in that directory—progressive disclosure at the directory level.

### Subagent Smoke Test Skill

Verify subagents work in your setup:

```markdown
---
name: subagent-smoke-test
description: Verify subagent spawning works
---

# Subagent Smoke Test

1. Spin up subagent via **Task** tool (subagent_type: general-purpose)
2. Give it read-only task:
   - Read `package.json`, summarize scripts
   - List top-level folders
3. Return report:
   - `Subagent status: success/failed`
   - 3-6 bullet summary
   - If failed, likely fix
```

---

## 9. Real-World Plugin: claude-reflect (Self-Learning System)

The **claude-reflect** plugin (643+ stars) demonstrates how to build a complete self-learning system that captures corrections during sessions and syncs them to CLAUDE.md. It implements the self-improvement loop pattern from Section 2.

### What It Does

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  You correct    │ ──► │  Hook captures  │ ──► │  /reflect adds  │
│  Claude Code    │     │  to queue       │     │  to CLAUDE.md   │
│  (automatic)    │     │  (automatic)    │     │  (manual review)│
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

**Core insight:** Corrections you make during sessions become durable norms for future sessions—automatically.

### Two-Stage Architecture

| Stage | Trigger | What Happens |
|-------|---------|--------------|
| **Capture** | UserPromptSubmit hook | Regex detects correction patterns, queues to `~/.claude/learnings-queue.json` |
| **Process** | `/reflect` command | AI validates queue, user reviews, writes to CLAUDE.md |

### Hook Configuration

The plugin uses 4 hooks to capture and manage learnings:

**hooks/hooks.json:**
```json
{
  "hooks": {
    "SessionStart": [{
      "matcher": "",
      "hooks": [{
        "type": "command",
        "command": "python3 \"${CLAUDE_PLUGIN_ROOT}/scripts/session_start_reminder.py\""
      }]
    }],
    "UserPromptSubmit": [{
      "matcher": "",
      "hooks": [{
        "type": "command",
        "command": "python3 \"${CLAUDE_PLUGIN_ROOT}/scripts/capture_learning.py\""
      }]
    }],
    "PreCompact": [{
      "matcher": "",
      "hooks": [{
        "type": "command",
        "command": "python3 \"${CLAUDE_PLUGIN_ROOT}/scripts/check_learnings.py\""
      }]
    }],
    "PostToolUse": [{
      "matcher": "Bash",
      "hooks": [{
        "type": "command",
        "command": "python3 \"${CLAUDE_PLUGIN_ROOT}/scripts/post_commit_reminder.py\""
      }]
    }]
  }
}
```

| Hook | Purpose |
|------|---------|
| `SessionStart` | Show pending learnings reminder |
| `UserPromptSubmit` | Detect corrections and queue them |
| `PreCompact` | Backup queue before context compaction |
| `PostToolUse (Bash)` | Remind to /reflect after git commits |

### Hybrid Detection: Regex + Semantic AI

**Stage 1 (Real-time Capture):** Regex patterns for fast detection:

```python
# High-confidence correction patterns
CORRECTION_PATTERNS = [
    (r"^no[,. ]+", "no,", True),           # "no, use X"
    (r"^don't\b|^do not\b", "don't", True), # "don't do Y"
    (r"that's (wrong|incorrect)", "that's-wrong", True),
    (r"^actually[,. ]", "actually", False),
    (r"use .{1,30} not\b", "use-X-not-Y", True),  # "use X not Y"
]

# Explicit marker (highest confidence)
EXPLICIT_PATTERNS = [
    (r"remember:", "remember:", 0.90, 120),  # Decay in 120 days
]
```

**Stage 2 (During /reflect):** Semantic AI validation via `claude -p`:

```python
ANALYSIS_PROMPT = """Analyze this user message. Determine if it contains
a reusable learning that should be remembered for future sessions.

Respond with JSON:
{
  "is_learning": true/false,
  "type": "correction" | "positive" | "explicit" | null,
  "confidence": 0.0-1.0,
  "extracted_learning": "concise actionable statement"
}

Guidelines:
- is_learning=true only if reusable across sessions
- Works for ANY language (semantic, not keyword matching)
- Filter out: questions, greetings, one-time commands
"""
```

**Why hybrid?**
- Regex: Fast, runs on every prompt, English-centric
- Semantic: Accurate, multi-language, filters false positives
- Final confidence = max(regex_confidence, semantic_confidence)

### Queue Item Structure

```json
{
  "type": "auto|explicit|positive|guardrail",
  "message": "no, use gpt-5.1 not gpt-5",
  "timestamp": "2026-02-05T10:30:00Z",
  "project": "/path/to/project",
  "patterns": "use-X-not-Y",
  "confidence": 0.85,
  "sentiment": "correction",
  "decay_days": 90
}
```

### Multi-Target Sync

Approved learnings sync to multiple destinations:

| Target | Path | When Used |
|--------|------|-----------|
| Global CLAUDE.md | `~/.claude/CLAUDE.md` | Model names, general patterns |
| Project CLAUDE.md | `./CLAUDE.md` | Project conventions |
| Subdirectory CLAUDE.md | `./**/CLAUDE.md` | Auto-discovered |
| Skill files | `.claude/commands/*.md` | Corrections during skill execution |
| AGENTS.md | `./AGENTS.md` | Cross-tool compatibility |

### Skill Improvement Routing

When you correct Claude while using a skill, the correction can route back to the skill:

```
User: /deploy
Claude: [deploys without running tests]
User: "no, always run tests before deploying"

→ /reflect detects this relates to /deploy
→ Offers to add learning to .claude/commands/deploy.md
→ Skill file updated with new guardrail
```

Skills become smarter over time through usage—not just CLAUDE.md.

### Skill Discovery (/reflect-skills)

Analyzes session history to find repeating patterns that could become skills:

```bash
/reflect-skills              # Analyze current project (last 14 days)
/reflect-skills --days 30    # Analyze last 30 days
/reflect-skills --all-projects  # Scan all projects
```

**How it works:**
1. Scans session JSONL files at `~/.claude/projects/[PROJECT]/*.jsonl`
2. Uses AI reasoning (not regex) to find semantic patterns
3. Groups similar intents even with different wording:
   ```
   "review my productivity for today"
   "how was my focus this afternoon?"
   "check my ActivityWatch data"
   → All same intent → suggests /daily-review
   ```
4. User approves → generates skill file in `.claude/commands/`

### Plugin File Structure

```
claude-reflect/
├── .claude-plugin/
│   └── plugin.json           # Plugin metadata
├── commands/
│   ├── reflect.md            # Main review command (850+ lines)
│   ├── reflect-skills.md     # Skill discovery
│   ├── skip-reflect.md       # Discard queue
│   └── view-queue.md         # View pending learnings
├── hooks/
│   └── hooks.json            # Hook definitions
├── scripts/
│   ├── lib/
│   │   ├── reflect_utils.py      # Shared utilities
│   │   └── semantic_detector.py  # AI-powered analysis
│   ├── capture_learning.py       # UserPromptSubmit hook
│   ├── check_learnings.py        # PreCompact hook
│   ├── session_start_reminder.py # SessionStart hook
│   └── post_commit_reminder.py   # PostToolUse hook
├── SKILL.md                  # Context for plugin
└── CLAUDE.md                 # Development guidance
```

### Key Commands

| Command | Description |
|---------|-------------|
| `/reflect` | Process queued learnings with human review |
| `/reflect --scan-history` | Scan ALL past sessions |
| `/reflect --dry-run` | Preview changes |
| `/reflect --dedupe` | Find and consolidate similar entries |
| `/reflect-skills` | Discover skill candidates |
| `/skip-reflect` | Discard queue |
| `/view-queue` | View pending without processing |

### The Session Start Reminder

Simple but effective—shows pending learnings when session starts:

```python
def main():
    items = load_queue()
    if not items:
        return 0

    count = len(items)
    print(f"\n{'='*50}")
    print(f"📚 {count} pending learning(s) to review")
    print(f"{'='*50}")

    for i, item in enumerate(items[:5], 1):
        msg = item.get("message", "")[:60]
        confidence = item.get("confidence", 0.5)
        print(f"  {i}. [{confidence:.0%}] {msg}")

    print(f"\n💡 Run /reflect to review and apply")
```

### Key Patterns to Steal

1. **Queue-based workflow**: Capture fast (regex), validate later (AI)
2. **Hybrid detection**: Real-time regex + batch semantic validation
3. **Confidence scoring**: 0.60-0.95 based on pattern strength
4. **Decay mechanism**: Learnings can expire (`decay_days`)
5. **Multi-target sync**: Different learnings go to different files
6. **Skill improvement routing**: Corrections enhance skills, not just CLAUDE.md
7. **Session scanning**: `--scan-history` recovers learnings from before installation
8. **Semantic deduplication**: `--dedupe` consolidates similar entries

### Installation

```bash
claude plugin marketplace add bayramannakov/claude-reflect
claude plugin install claude-reflect@claude-reflect-marketplace
# Restart Claude Code
```

---

## 10. Enterprise Skills: Microsoft Skills Repository

The **microsoft/skills** repository (669+ stars) demonstrates enterprise-scale skill management for Azure SDKs—132 skills across 5 languages with a comprehensive testing framework.

### Overview

```
microsoft/skills/
├── .github/skills/          # 132 skills (flat structure)
│   ├── azure-ai-projects-py/
│   │   ├── SKILL.md
│   │   └── references/
│   ├── azure-cosmos-db-py/
│   └── skill-creator/
├── skills/                  # Symlink categorization
│   ├── python/
│   │   ├── foundry/         # → .github/skills/azure-ai-*-py
│   │   ├── data/            # → .github/skills/azure-cosmos-*-py
│   │   └── messaging/       # → .github/skills/azure-servicebus-py
│   ├── dotnet/
│   ├── typescript/
│   └── java/
├── tests/
│   ├── harness/             # Test framework
│   └── scenarios/           # Per-skill test scenarios
├── Agents.md                # AGENTS.md template
└── .vscode/mcp.json         # Pre-configured MCP servers
```

### AGENTS.md Best Practices (Microsoft Standard)

The repository's `Agents.md` serves as a template with battle-tested patterns:

#### Fresh Documentation First
```markdown
## ⚠️ Fresh Information First

**Azure SDKs and Foundry APIs change constantly. Never work with stale knowledge.**

Before implementing anything:
1. **Search official docs first** — Use microsoft-docs MCP
2. **Verify SDK versions** — `pip show <package>`
3. **Don't trust cached knowledge** — APIs have breaking changes

**If you skip this step, you will produce broken code.**
```

#### Core Principles (From Microsoft)

| Principle | Rule |
|-----------|------|
| **Think Before Coding** | State assumptions explicitly. Surface tradeoffs. Ask if uncertain. |
| **Simplicity First** | No features beyond what was asked. No abstractions for single-use code. |
| **Surgical Changes** | Don't "improve" adjacent code. Match existing style. |
| **Goal-Driven (TDD)** | Transform tasks into verifiable goals with success criteria. |

#### Goal-Driven Execution Pattern

Transform vague tasks into testable goals:

| Instead of... | Transform to... |
|---------------|-----------------|
| "Add validation" | "Write tests for invalid inputs, then make them pass" |
| "Fix the bug" | "Write a test that reproduces it, then make it pass" |
| "Refactor X" | "Ensure tests pass before and after" |

Multi-step tasks get explicit verification:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

### Skill Structure (Microsoft Standard)

```
skill-name/
├── SKILL.md (required)
│   ├── YAML frontmatter (name, description, package)
│   └── Markdown instructions
└── references/ (optional)
    ├── acceptance-criteria.md    # Correct/incorrect patterns
    ├── tools.md                  # Tool integrations
    ├── streaming.md              # Event streaming patterns
    └── async-patterns.md         # Async code patterns
```

### SKILL.md Template (Azure SDK Pattern)

```markdown
---
name: azure-ai-projects-py
description: Build AI applications using the Azure AI Projects Python SDK.
  Use when working with Foundry project clients, creating versioned agents,
  running evaluations. Triggers: "foundry", "project client", "ai projects".
package: azure-ai-projects
---

# Azure AI Projects Python SDK

## Installation

\`\`\`bash
pip install azure-ai-projects azure-identity
\`\`\`

## Environment Variables

\`\`\`bash
AZURE_AI_PROJECT_ENDPOINT="https://<resource>.services.ai.azure.com/api/projects/<project>"
\`\`\`

## Authentication

\`\`\`python
from azure.identity import DefaultAzureCredential
from azure.ai.projects import AIProjectClient

credential = DefaultAzureCredential()
client = AIProjectClient(
    endpoint=os.environ["AZURE_AI_PROJECT_ENDPOINT"],
    credential=credential,
)
\`\`\`

## Client Operations Overview

| Operation | Access | Purpose |
|-----------|--------|---------|
| `client.agents` | `.agents.*` | Agent CRUD, threads, runs |
| `client.connections` | `.connections.*` | Project connections |
| `client.evaluations` | `.evaluations.*` | Run evaluations |

## Reference Files

| File | Contents |
|------|----------|
| [references/tools.md](references/tools.md) | Tool integrations |
| [references/streaming.md](references/streaming.md) | Event streaming |
```

**Section order** (follow consistently):
1. Title
2. Installation
3. Environment Variables
4. Authentication (always `DefaultAzureCredential`)
5. Core Workflow / Operations Overview
6. Feature Tables
7. Reference Links

### Skill Categorization with Symlinks

Skills live in `.github/skills/` but are categorized via symlinks:

```bash
# Pattern: skills/<language>/<category>/<short-name> → ../../../.github/skills/<full-name>

cd skills/python/foundry
ln -s ../../../.github/skills/azure-ai-projects-py projects

cd skills/python/data
ln -s ../../../.github/skills/azure-cosmos-db-py cosmos
```

**Product area categories:**

| Category | Description |
|----------|-------------|
| `foundry` | AI Foundry, agents, projects, inference |
| `data` | Storage, Cosmos DB, Tables |
| `messaging` | Event Hubs, Service Bus |
| `monitoring` | OpenTelemetry, App Insights |
| `identity` | Authentication, credentials |
| `security` | Key Vault |
| `integration` | API Management |

### Testing Framework (scenarios.yaml)

Every skill has acceptance criteria and test scenarios:

**tests/scenarios/azure-ai-projects-py/scenarios.yaml:**
```yaml
config:
  model: gpt-4
  max_tokens: 2000
  temperature: 0.3

scenarios:
  - name: client_creation
    prompt: |
      Create an AIProjectClient with proper authentication.
      Use environment variables for the endpoint.
    expected_patterns:
      - "from azure.ai.projects import AIProjectClient"
      - "DefaultAzureCredential()"
      - "endpoint="
    forbidden_patterns:
      - "from azure.ai.projects.models import AIProjectClient"  # Wrong location
      - "url="  # Wrong parameter name
    tags:
      - basic
      - authentication
    mock_response: |
      import os
      from azure.ai.projects import AIProjectClient
      from azure.identity import DefaultAzureCredential

      client = AIProjectClient(
          endpoint=os.environ["AZURE_AI_PROJECT_ENDPOINT"],
          credential=DefaultAzureCredential(),
      )
```

**Run tests:**
```bash
cd tests && pnpm install

# Check skills discovered
pnpm harness --list

# Run in mock mode (fast, deterministic)
pnpm harness azure-ai-projects-py --mock --verbose

# Run with Ralph Loop (iterative improvement)
pnpm harness azure-ai-projects-py --ralph --mock --max-iterations 5 --threshold 85
```

### Pre-configured MCP Servers

**.vscode/mcp.json** includes ready-to-use servers:

| MCP | Purpose | Type |
|-----|---------|------|
| `microsoft-docs` | Search Microsoft Learn (official docs) | HTTP |
| `context7` | Indexed Foundry docs (updated daily) | stdio |
| `deepwiki` | Ask questions about GitHub repos | HTTP |
| `github` | GitHub API operations | HTTP |
| `playwright` | Browser automation | stdio |
| `memory` | Persistent memory across sessions | stdio |
| `sequentialthinking` | Step-by-step reasoning | stdio |

**Example config:**
```json
{
  "servers": {
    "microsoft-docs": {
      "url": "https://learn.microsoft.com/api/mcp",
      "type": "http"
    },
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"],
      "type": "stdio"
    }
  }
}
```

### Skill Creation Process (Microsoft)

1. **Gather SDK Context** (REQUIRED) — Package name, docs URL, repository
2. **Search official docs** via `microsoft-docs` MCP
3. **Create** in `.github/skills/<skill-name>/SKILL.md`
4. **Categorize** with symlink in `skills/<language>/<category>/`
5. **Create acceptance criteria** in `references/acceptance-criteria.md`
6. **Create test scenarios** in `tests/scenarios/<skill>/scenarios.yaml`
7. **Verify** with `pnpm harness <skill> --mock`
8. **Update README.md** skill catalog

### Acceptance Criteria Format

**references/acceptance-criteria.md:**
```markdown
# Acceptance Criteria: azure-ai-projects-py

**SDK**: `azure-ai-projects`
**Repository**: https://github.com/Azure/azure-sdk-for-python

---

## 1. Correct Import Patterns

### 1.1 Client Imports

#### ✅ CORRECT: Main Client
\`\`\`python
from azure.ai.projects import AIProjectClient
from azure.identity import DefaultAzureCredential
\`\`\`

#### ❌ INCORRECT: Wrong Module Path
\`\`\`python
from azure.ai.projects.models import AIProjectClient  # Wrong - not in models
\`\`\`

## 2. Authentication Patterns

#### ✅ CORRECT: DefaultAzureCredential
\`\`\`python
credential = DefaultAzureCredential()
client = AIProjectClient(endpoint, credential)
\`\`\`

#### ❌ INCORRECT: Hardcoded Credentials
\`\`\`python
client = AIProjectClient(endpoint, api_key="hardcoded")  # Security risk
\`\`\`
```

### Key Patterns from Microsoft

1. **Language suffixes** for skill naming: `-py`, `-dotnet`, `-ts`, `-java`, `-rust`
2. **Package field** in frontmatter for SDK identification
3. **Symlink categorization** keeps skills discoverable by domain
4. **Acceptance criteria** document correct/incorrect patterns explicitly
5. **Test scenarios** with `expected_patterns` and `forbidden_patterns`
6. **Ralph Loop** for iterative skill improvement during testing
7. **MCP-first documentation** — always search official docs before implementing

### Installation

```bash
# Interactive skill selection
npx skills add microsoft/skills

# Or via Context7
npx ctx7 skills install /microsoft/skills azure-ai-projects-py
```

---

## 11. Advanced Agent Patterns (Claude Code 2.1+)

Claude Code 2.1's primitives—skill-scoped hooks, sub-agent hooks, `context: fork`, and hook emission—unlock architectural patterns that were previously impossible.

### Hooks as an Inter-Agent Event Bus

Because hooks can:
- Emit logs
- Emit JSON
- Call external systems
- Write state

Sub-agents can now **emit structured status signals**. This means:

> **Agents can observe other agents.**

Hooks become:
- **Telemetry** - Track what agents are doing
- **Monitoring** - Alert on issues
- **Coordination signals** - Inter-agent messaging

They form an **inter-agent event bus**.

### The Queen Agent / Swarm Pattern

With forked sub-agents and hook emission, you can build a **queen agent supervising a swarm**:

```
┌─────────────────────────────────────────────────────────┐
│                      Queen Agent                         │
│                                                         │
│   Spawns sub-agents    Observes hook stream             │
│         │                     ▲                         │
│         ▼                     │                         │
│   ┌─────────┐  ┌─────────┐  ┌─────────┐                │
│   │ Worker  │  │ Worker  │  │ Worker  │                │
│   │ Agent 1 │  │ Agent 2 │  │ Agent 3 │                │
│   └────┬────┘  └────┬────┘  └────┬────┘                │
│        │            │            │                      │
│        └────────────┴────────────┘                      │
│                     │                                   │
│              Emit via hooks:                            │
│              - progress                                 │
│              - status                                   │
│              - errors                                   │
└─────────────────────────────────────────────────────────┘
```

**Queen Agent Responsibilities:**
- Spawn sub-agents for tasks
- Observe hook stream from workers
- Decide: retry, reassign, terminate, escalate

**Implementation Pattern:**

```markdown
---
name: task-coordinator
description: Coordinates multiple worker agents

hooks:
  PostToolUse:
    - matcher: "Task"
      hooks:
        - type: command
          command: "./scripts/log-agent-spawn.sh"
---

# Task Coordinator

When given a complex task:

1. **Decompose** into independent subtasks
2. **Spawn workers** via Task tool with context: fork skills
3. **Monitor** via hook emissions
4. **Synthesize** results from all workers
5. **Handle failures** by respawning or reassigning

## Worker Skill Template

For each subtask, spawn a skill with:
- Specific, narrow focus
- Its own hooks for progress reporting
- Clear success/failure criteria
```

**Worker Skill with Status Hooks:**

```markdown
---
name: research-worker
context: fork
agent: Explore

hooks:
  PostToolUse:
    - matcher: "WebFetch|Read"
      hooks:
        - type: command
          command: "./scripts/emit-progress.sh"
  Stop:
    - matcher: ""
      hooks:
        - type: command
          command: "./scripts/emit-complete.sh"
---

Research the given topic and return findings.
```

**The emit-progress.sh pattern:**

```bash
#!/bin/bash
# Receives tool info on stdin, emits status
read -r tool_info
timestamp=$(date -u +%Y-%m-%dT%H:%M:%SZ)
echo "{\"worker\": \"$CLAUDE_SKILL_NAME\", \"event\": \"progress\", \"timestamp\": \"$timestamp\"}" >> ~/.claude/swarm-log.jsonl
```

### Claude Code as an Agent OS

Putting it together, Claude Code 2.1 provides:

| Capability | What It Enables |
|------------|-----------------|
| **Skill hot-reload** | Live agent development |
| **Skill-scoped hooks** | Portable governance |
| **Sub-agent hooks** | Policy islands (sandboxing) |
| **`context: fork`** | True parallel agents |
| **Hook emission** | Inter-agent signaling |
| **External commands** | Real-world integration |

This transforms Claude Code from "an AI coding assistant in your terminal" into:

> **An agent operating system.**

With:
- A **runtime** (Claude Code)
- A **module system** (skills)
- A **governance layer** (hooks)
- A **process model** (`context: fork`)
- An **event bus** (hook emission)

All defined with:
- Markdown
- YAML
- JSON
- Shell scripts

**No SDK required.** (Though you can use the Claude Agent SDK if needed.)

Just: **Agents as infrastructure.**

---

## 12. Universal Agent Patterns (Cross-Platform Research)

This section synthesizes findings from an analysis of **2,500+ agents.md files** across GitHub Copilot's ecosystem. While the research focused on Copilot, the patterns are universal and directly applicable to Claude Code.

### The 2,500 Repo Study

Analysis of public repositories revealed a clear divide: **vague agents fail, specific agents succeed**. The pattern is consistent regardless of platform.

**What doesn't work:**
```markdown
You are a helpful coding assistant.
```

**What does work:**
```markdown
You are a test engineer who writes tests for React components,
follows these examples, and never modifies source code.
```

The difference: **persona + constraints + examples**.

### The Six Core Areas

The most successful agent files cover these six areas:

| Area | What to Include | Example |
|------|-----------------|---------|
| **Commands** | Executable commands with flags | `npm test -- --coverage`, `pytest -v` |
| **Testing** | How to run/write tests | `jest --watch`, test file locations |
| **Project Structure** | Where things live | `src/` = code, `docs/` = output |
| **Code Style** | Concrete examples | Show good/bad patterns |
| **Git Workflow** | Commit, branch, PR rules | `feat:` prefixes, branch naming |
| **Boundaries** | What to never touch | secrets, vendor/, production configs |

**Hitting all six areas puts you in the top tier of agent files.**

### Three-Tier Boundary System

More nuanced than simple DO/DON'T—the **Always / Ask First / Never** pattern:

```markdown
## Boundaries

- ✅ **Always:** Write to `src/` and `tests/`, run tests before commits
- ⚠️ **Ask first:** Database schema changes, adding dependencies, modifying CI/CD
- 🚫 **Never:** Commit secrets, edit `node_modules/`, modify production configs
```

| Tier | When to Use | Examples |
|------|-------------|----------|
| **Always** | Safe, expected actions | Run linter, write tests, follow style |
| **Ask First** | Potentially impactful | Schema changes, new dependencies, config changes |
| **Never** | Dangerous or forbidden | Secrets, vendor dirs, production data |

The middle tier ("Ask First") is often missing from agent files but critical for real-world use.

### Agent Archetype Templates

Six proven specialist patterns with specific boundaries:

#### @docs-agent (Technical Writer)

```markdown
---
name: docs-agent
description: Expert technical writer for this project
---

## Role
- Read code from `src/`, write documentation to `docs/`
- Fluent in Markdown, reads TypeScript/Python

## Commands
- Build docs: `npm run docs:build`
- Lint markdown: `npx markdownlint docs/`

## Boundaries
- ✅ Always: Write to `docs/`, run markdownlint
- ⚠️ Ask first: Major rewrites of existing docs
- 🚫 Never: Modify code in `src/`, edit config files
```

#### @test-agent (QA Engineer)

```markdown
---
name: test-agent
description: QA engineer who writes comprehensive tests
---

## Role
- Write unit, integration, and edge case tests
- Analyze test results and suggest fixes

## Commands
- Run tests: `npm test`, `pytest -v`, `cargo test --coverage`
- Watch mode: `npm test -- --watch`

## Boundaries
- ✅ Always: Write to `tests/`, run tests before reporting
- ⚠️ Ask first: Modifying test utilities or fixtures
- 🚫 Never: Remove failing tests, modify source code to make tests pass
```

**Critical boundary:** Never remove a test because it's failing.

#### @lint-agent (Code Formatter)

```markdown
---
name: lint-agent
description: Fixes code style and formatting issues
---

## Role
- Auto-fix style issues
- Enforce naming conventions and import order

## Commands
- Fix: `npm run lint --fix`, `prettier --write .`
- Check: `npm run lint`

## Boundaries
- ✅ Always: Fix formatting, import order, naming conventions
- 🚫 Never: Change code logic, modify behavior
```

**Low-risk agent:** Linters are designed to be safe.

#### @api-agent (Backend Developer)

```markdown
---
name: api-agent
description: Builds and maintains API endpoints
---

## Role
- Create REST endpoints, GraphQL resolvers, error handlers
- Framework: Express / FastAPI / Rails (specify yours)

## Commands
- Dev server: `npm run dev`
- Test endpoint: `curl localhost:3000/api/health`
- API tests: `pytest tests/api/`

## Boundaries
- ✅ Always: Modify routes in `routes/`, add error handlers
- ⚠️ Ask first: Database schema changes, new middleware
- 🚫 Never: Modify auth without review, hardcode secrets
```

#### @dev-deploy-agent (Build Engineer)

```markdown
---
name: dev-deploy-agent
description: Handles local builds and dev deployments
---

## Role
- Run builds, create Docker images
- Deploy to development environments only

## Commands
- Build: `npm run build`
- Docker: `docker build -t app:dev .`
- Deploy: `./scripts/deploy-dev.sh`

## Boundaries
- ✅ Always: Build, run local tests
- ⚠️ Ask first: Any deployment action
- 🚫 Never: Deploy to production, modify CI/CD pipelines
```

### Universal Starter Template

```markdown
---
name: your-agent-name
description: [One sentence describing what this agent does]
---

You are an expert [role] for this project.

## Role
- You specialize in [specific task]
- You understand [domain knowledge]
- Your output: [what you produce]

## Project Knowledge
- **Tech Stack:** [technologies with versions]
- **File Structure:**
  - `src/` – [what's here]
  - `tests/` – [what's here]

## Commands
- **Build:** `npm run build`
- **Test:** `npm test`
- **Lint:** `npm run lint --fix`

## Code Style

**Naming:**
- Functions: camelCase (`getUserData`)
- Classes: PascalCase (`UserService`)
- Constants: UPPER_SNAKE_CASE (`API_KEY`)

**Example:**
\`\`\`typescript
// ✅ Good - descriptive, handles errors
async function fetchUserById(id: string): Promise<User> {
  if (!id) throw new Error('User ID required');
  return await api.get(`/users/${id}`);
}

// ❌ Bad - vague name, no validation
async function get(x) {
  return await api.get('/users/' + x);
}
\`\`\`

## Boundaries
- ✅ **Always:** [safe actions]
- ⚠️ **Ask first:** [potentially impactful actions]
- 🚫 **Never:** [forbidden actions]
```

### Mapping to Claude Code

These universal patterns map directly to Claude Code mechanisms:

| Universal Pattern | Claude Code Implementation |
|-------------------|---------------------------|
| Agent archetypes | Subagents via Task tool or skills |
| Three-tier boundaries | CLAUDE.md with DO/ASK/DON'T sections |
| Commands section | Hooks or CLAUDE.md command lists |
| Code style examples | CLAUDE.md or AGENTS.md examples |
| Persona/role | Skill description or subagent prompt |
| Project structure | CLAUDE.md file map / code map |

### Key Takeaways

1. **Specificity wins** — "React 18 with TypeScript" not "React project"
2. **Code > prose** — One snippet beats three paragraphs
3. **Commands early** — Executable commands in the first section
4. **Three-tier boundaries** — Always / Ask First / Never
5. **Six core areas** — Commands, testing, structure, style, git, boundaries
6. **Start minimal, iterate** — Add detail when the agent makes mistakes

> "The best agent files grow through iteration, not upfront planning."

---

## 13. Summary

### The Extensibility Stack

| Layer | Purpose | Loaded When |
|-------|---------|-------------|
| CLAUDE.md | Universal project context | Always (startup) |
| Nested CLAUDE.md | Directory-specific context | When accessing that directory |
| Slash Commands | Explicit workflows | When you type `/command` |
| Skills | Auto-discovered capabilities | When Claude matches task to description |
| Subagents | Isolated specialists | When delegated via Task tool |
| Hooks | Event-triggered shell commands | On specific Claude Code events |
| MCP Servers | External tool integration | When tools are called |

### Key Principles

1. **Keep CLAUDE.md minimal** (<60 lines) - use progressive disclosure
2. **Let tools enforce rules** - backpressure over prose
3. **Capture gotchas to docs/** - not CLAUDE.md
4. **Use subagents for research** - keeps main context clean
5. **Slash commands for explicit triggers** - skills for auto-discovery
6. **First lines are prime real estate** - put critical rules first
7. **Always give safe alternatives** - not just "never do X"

---

*Guide compiled from community patterns, official documentation, and production examples.*
