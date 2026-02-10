# Agent Memory - Session Log

## Overview
This file tracks all links reviewed and updates made during our Claude Code plugin learning sessions.

---

## Session Log

### 2026-02-05 - Session 1
- **Link Reviewed:** https://github.com/coleam00/custom-agent-with-skills
- **Summary:** Pydantic AI framework demonstrating "progressive disclosure" pattern for skill management. Not Claude Code-specific, but shows useful architectural concepts: three-level skill loading (metadata → instructions → resources), SKILL.md format with YAML frontmatter, and directory structure patterns.
- **Added to PluginGuide.md:** Section 3 (Skills) - Added architectural patterns, progressive disclosure table, skill directory structure, SKILL.md format template, and example skill types.
- **Status:** Complete

### 2026-02-05 - Session 2
- **Link Reviewed:** YouTube Video Transcript + Infographic - "Claude Skills aren't just for Claude" (coleam00)
- **Summary:** Deep dive into WHY skills matter (10x context savings vs MCP), exact percentages for progressive disclosure layers (5%/30%/65%), best practices from Anthropic guide (50-100 words for descriptions, 300-500 lines for SKILL.md), implementation architecture (dynamic system prompt + 2-3 tools), critical insight that LLMs need explicit prompting about HOW to use skills, Claude Desktop's built-in Skill Creator, and importance of evals/observability for production.
- **Added to PluginGuide.md:** Major expansion of Section 3 (Skills):
  - "Why Skills Matter" section with token comparison (MCP: 10-50k vs Skills: 1-5k)
  - Updated progressive disclosure table with exact percentages and size guidelines
  - Detailed explanations for all 3 layers
  - ASCII diagram of implementation architecture
  - Required tools section (load_skill, read_ref, list_references)
  - Expanded directory structure example
  - Enhanced SKILL.md template with all sections
  - Best practices for descriptions and SKILL.md writing
  - Critical note about prompting agents to understand skills
  - Claude Desktop Skill Creator instructions
  - Evals section with YAML example
  - Observability/LogFire section
  - Framework compatibility note
- **Status:** Complete

---

### 2026-02-05 - Session 3
- **Link Reviewed:** https://blog.devgenius.io/what-great-claude-md-files-have-in-common-db482172ad2c
- **Summary:** Comprehensive analysis of production CLAUDE.md/AGENTS.md files from major repos (Payload CMS 40k★, Dragonfly DB 30k★, FastMCP 22k★, MCP Python SDK 21k★). Key insights: first lines are prime real estate, operational over philosophical, FORBIDDEN is unambiguous, always provide safe alternatives. Notable patterns: validation checklists, TODO priority systems, agent attribution rules, DO/DON'T with file paths, explicit reasoning protocols (Q Protocol).
- **Added to PluginGuide.md:** Complete rewrite of Section 2 (CLAUDE.md / AGENTS.md):
  - What these files are for
  - Core principles (5 key rules)
  - 9 real-world patterns with examples from production repos
  - Emerging patterns (TODO priorities, literate programming, explicit reasoning)
  - Pitfalls to avoid table
  - Minimal template
  - 4 full templates (Universal, TypeScript/Next.js, Python, Monorepo)
  - Quick checklist
  - Anthropic's official guidance
- **Status:** Complete

### 2026-02-05 - Session 4
- **Link Reviewed:** https://www.aihero.dev/my-agents-md-file-for-building-plans-you-actually-read
- **Summary:** Matt Pocock's original article on AGENTS.md plan mode. Key insight: skipping planning forces AI to guess requirements, which compounds into errors. Introduces the four-phase planning loop (Plan → Execute → Test → Commit) as a repeating cycle. Emphasizes concise plans with explicit unresolved questions transform verbose documents into scannable, actionable references.
- **Added to PluginGuide.md:** New "Planning Loop Workflow" subsection in Section 2:
  - ASCII diagram of 4-phase cycle
  - Key insight about why planning matters
  - Consolidated Matt Pocock's plan mode rules here
  - Note about global vs project-level placement (~/.claude/CLAUDE.md)
  - Renumbered remaining patterns (now 8 instead of 9)
- **Status:** Complete

### 2026-02-05 - Session 5
- **Link Reviewed:** https://github.com/leonvanzyl/agentic-coding-starter-kit/tree/master
- **Summary:** Production Next.js 16 boilerplate demonstrating real-world Claude Code project structure. Key findings:
  - **CLAUDE.md structure**: 8 critical rules (validate code, never start dev server, use OpenRouter not OpenAI, styling consistency, secure auth, database ops, storage abstraction, component patterns)
  - **.claude directory layout**: `agents/`, `commands/`, `skills/frontend-design/`, `settings.local.json`
  - **5 slash commands**: `/checkpoint`, `/continue-feature`, `/create-spec`, `/publish-to-github`, `/review-pr`
  - **Tech stack**: React 19, TypeScript, Vercel AI SDK 5, BetterAuth, Drizzle ORM, shadcn/ui, Tailwind CSS 4, OpenRouter (100+ models)
  - **Agentic workflow**: Commands facilitate spec creation → GitHub issue tracking → feature implementation → checkpoint commits
- **Added to PluginGuide.md:**
  - Section 4 (Scripts) with .claude directory structure
  - Real-world command examples and workflow patterns
  - CLAUDE.md guardrails pattern expanded
- **Status:** Complete

### 2026-02-05 - Session 6
- **Link Reviewed:** "Stop Bloating Your CLAUDE.md: Progressive Disclosure for AI Coding Tools" (aihero.dev - alexanderop)
- **Summary:** Deep dive into WHY minimal CLAUDE.md matters with hard data:
  - Context is just a sliding window of tokens—no hidden memory
  - HumanLayer recommends <60 lines; LLMs follow 150-200 instructions; Claude Code system prompt uses ~50
  - **Backpressure concept**: Let tools (ESLint, TypeScript) enforce rules instead of writing prose
  - **The /learn pattern**: Capture gotchas to docs/ folder, not CLAUDE.md; use IMPORTANT instruction to ensure Claude reads them
  - **One agent per domain**: Specialist agents load only when needed
  - **Vercel eval results**: Skills never invoked 56% of time, maxed 79% pass rate; AGENTS.md with compressed docs = 100% pass rate
  - Real 50-line CLAUDE.md example from Second Brain project
- **Added to PluginGuide.md:** Major expansion of Section 2:
  - "Why Keep CLAUDE.md Minimal (The Math)" with context budget visualization
  - "Don't Write Prose About Lint Rules (Backpressure)" section
  - "The /learn Pattern (Capturing Gotchas)" section
  - "One Agent Per Domain" section
  - "AGENTS.md vs Skills (Vercel Eval Results)" section
  - Complete 50-line CLAUDE.md example
- **Status:** Complete

### 2026-02-05 - Session 7
- **Link Reviewed:** /learn Skill Implementation (alexanderop)
- **Summary:** Complete implementation of the `/learn` skill for capturing conversation insights to documentation. Key features:
  - YAML frontmatter with `description`, `argument-hint`, `model`, `allowed-tools`
  - 5-phase workflow: Deep Analysis → Categorize & Locate → Draft → User Approval (BLOCKING) → Save
  - Criteria for capture: Reusable, Non-obvious, Project-specific
  - Tool restrictions for safety (Read, Write, Edit, Glob, Grep, AskUserQuestion only)
  - Graceful exit if nothing valuable learned
  - `$ARGUMENTS` variable for optional topic hints
- **Added to PluginGuide.md:** New "Real-World Skill Example: /learn" section in Section 3 (Skills):
  - Complete skill file with all 5 phases
  - Key patterns table (frontmatter, phased workflow, approval gate, tool restrictions, graceful exit, variables)
  - Usage examples
- **Status:** Complete

### 2026-02-05 - Session 8
- **Link Reviewed:** "Claude Code Customization: CLAUDE.md, Slash Commands, Skills, and Subagents" (aihero.dev - alexanderop)
- **Summary:** Comprehensive comparison of all 4 extensibility mechanisms, solving the same problem (Dexie.js docs) 4 different ways. Key insights:
  - **Subagents keep main context clean** - especially useful in plan mode with Explore-style agents
  - **Slash commands vs Skills**: Commands are `/...` invokable, Skills are auto-discovered (but may not fire - 56% miss rate per Vercel)
  - **Nested CLAUDE.md**: Directory-specific context loaded only when accessing that directory
  - **Orchestration pattern**: Slash commands can spawn parallel subagents via Task tool
  - **Comparison matrices**: "When to use what" and "How they relate" tables
  - Claude Code's own system uses subagent for docs lookup (claude-code-guide)
- **Added to PluginGuide.md:** Complete rewrite of Section 7 + new Section 8:
  - Quick reference table (when to use each mechanism)
  - "How They Relate" matrix (context, subagent spawning, manual invocation)
  - "Subagents Keep Context Clean" insight with ASCII diagram
  - Same problem 4 solutions (Dexie.js) with trade-offs
  - Slash Commands vs Skills comparison table
  - Orchestration with slash commands example
  - Nested CLAUDE.md explanation
  - Subagent smoke test skill
  - Summary section with extensibility stack table and key principles
- **Status:** Complete

### 2026-02-05 - Session 9
- **Link Reviewed:** "Why You Don't Need the Nuxt MCP When You Use Claude Code" (aihero.dev - alexanderop)
- **Summary:** Deep dive into MCP context bloat problem (from Anthropic's own engineering blog) and custom research agents as alternative. Key insights:
  - MCP tool definition overload: 100k+ tokens before model reads request
  - MCP intermediate result redundancy: 50k+ tokens per operation
  - `llms.txt` standard: AI-readable sitemap for documentation sites
  - Research agents = 98%+ token reduction vs MCP
  - Claude Code uses this pattern (`claude-code-guide` agent)
  - Full agent file structure: YAML frontmatter (`name`, `description`, `model`, `color`), `<example>` blocks in description
  - Operational approach: fetch llms.txt → categorize → fetch targeted pages
- **Added to PluginGuide.md:** Complete rewrite of Section 6 (MCP Servers):
  - What MCP is
  - The Context Bloat Problem (with Anthropic engineering blog reference)
  - Research Agents as MCP Alternative comparison table
  - The llms.txt standard
  - Full agent file structure with YAML frontmatter fields
  - Complete Nuxt Content Specialist example
  - Design principles for research agents
  - Step-by-step guide to create research agents
  - When to use MCP vs Research Agents decision table
- **Status:** Complete

### 2026-02-05 - Session 10
- **Link Reviewed:** "How to Build Self-Improving Coding Agents: Part 1 of 3" (Eric J. Ma - ericmjl.github.io)
- **Summary:** Philosophical foundation for self-improving agents. Key insight: if model weights don't change, improvement must come from environment. Two levers: durable repository memory (AGENTS.md) and reusable playbooks (skills). Introduces:
  - **Self-improvement loop**: Spot mismatch → Tell agent → Agent writes to AGENTS.md → Agent reads next time
  - **Runbook + postmortem mental model**: Treat agent improvement like ops
  - **Code maps**: Structured navigation reduces exploration from 5-6 searches to one-shot (40s → 2s)
  - **"Keep the map alive"**: On-demand updates make the loop feel alive (vs scheduled refresh)
  - **Bootstrapping prompt**: Full prompt with high-signal file targets (README, pyproject.toml, package.json, Makefile, .github/workflows)
  - **"Local norms" section**: Where corrections become durable (e.g., "Run Python in pixi context", "Don't modify tests to pass")
  - Natural language → tool calls insight: precise writing means executable instructions
- **Added to PluginGuide.md:** Four new subsections in Section 2:
  - "The Self-Improvement Loop" with ASCII diagram and two levers
  - "Code Maps (Fast Navigation)" with example structure and self-maintenance instruction
  - "Bootstrapping AGENTS.md" with full generation prompt (process, high-signal files, output format)
  - "Corrections That Become Durable Norms" with concrete examples
- **Status:** Complete
- **Note:** Part 1 of 3 - Part 2 covers skills as reusable playbooks + skill-installer skill

### 2026-02-05 - Session 11
- **Link Reviewed:** https://github.com/anthropics/claude-plugins-official
- **Summary:** Official Anthropic plugin directory - the canonical source for Claude Code plugins. Key discoveries:
  - **Plugin structure**: `.claude-plugin/plugin.json` (required), `.mcp.json`, `commands/`, `agents/`, `skills/`
  - **Installation**: `/plugin install {name}@claude-plugin-directory` or `/plugin > Discover`
  - **Official plugins**: 11 LSP servers, development tools (code-review, feature-dev, commit-commands), meta tools (hookify, ralph-loop, plugin-dev)
  - **External plugins**: GitHub, GitLab, Slack, Linear, Asana, Supabase, Firebase, Stripe, Playwright
  - **Hookify**: Complete hooks system via markdown files - event types (bash, file, stop, prompt), pattern matching, actions (warn/block), conditions
  - **Code Review plugin**: 8-step multi-agent workflow with 5 parallel Sonnet agents, confidence scoring (0-100), false positive filtering (≥80 threshold)
  - **Feature Dev plugin**: 7-phase workflow (Discovery → Exploration → Questions → Architecture → Implementation → Review → Summary) with specialized agents (code-explorer, code-architect, code-reviewer)
  - **Ralph Loop**: Stop hook for iterative self-referential development loops
  - **Dynamic context injection**: `!` prefix in commands executes and injects output
- **Added to PluginGuide.md:**
  - **Section 5 (Hooks)**: Complete rewrite with hookify patterns, event types, field references, operators, example hooks
  - **New Section 7 (Official Plugin System)**: Installation, plugin structure, plugin.json format, official plugins catalog, external plugins, code-review workflow, feature-dev workflow
  - Updated Table of Contents (now 9 sections)
- **Status:** Complete

### 2026-02-05 - Session 12
- **Link Reviewed:** https://github.com/BayramAnnakov/claude-reflect
- **Summary:** Production self-learning plugin (643+ stars) that captures corrections during sessions and syncs them to CLAUDE.md. Demonstrates complete implementation of the self-improvement loop pattern. Key features:
  - **Two-stage architecture**: Automatic capture (UserPromptSubmit hook) + manual review (/reflect command)
  - **Hybrid detection**: Fast regex patterns (real-time) + semantic AI validation (during review via `claude -p`)
  - **Queue-based workflow**: Learnings stored in `~/.claude/learnings-queue.json` with confidence scores (0.60-0.95)
  - **4 hooks**: SessionStart (reminder), UserPromptSubmit (capture), PreCompact (backup), PostToolUse/Bash (post-commit reminder)
  - **Multi-target sync**: Global CLAUDE.md, project CLAUDE.md, AGENTS.md, skill files
  - **Skill improvement routing**: Corrections during skill execution update the skill file itself
  - **Skill discovery** (`/reflect-skills`): AI-powered pattern detection from session history to generate new skills
  - **Semantic deduplication** (`--dedupe`): Consolidates similar entries
  - **Historical scan** (`--scan-history`): Recovers learnings from before installation
  - Uses `${CLAUDE_PLUGIN_ROOT}` variable in hooks.json for portable paths
- **Added to PluginGuide.md:** New Section 9 (Real-World Plugin: claude-reflect):
  - Two-stage architecture diagram
  - Complete hooks.json example with all 4 hook types
  - Hybrid detection patterns (regex + semantic AI)
  - Queue item structure
  - Multi-target sync table
  - Skill improvement routing explanation
  - Skill discovery workflow
  - Full plugin file structure
  - Key commands table
  - Session start reminder code
  - "Key patterns to steal" section
  - Updated Table of Contents (now 10 sections)
- **Status:** Complete

### 2026-02-05 - Session 13
- **Link Reviewed:** https://github.com/microsoft/skills
- **Summary:** Microsoft's official skills repository (669+ stars) for Azure SDKs and AI Foundry—132 skills across 5 languages (Python, .NET, TypeScript, Java, Rust). Enterprise-scale skill management with comprehensive testing framework. Key insights:
  - **AGENTS.md template** with 4 core principles: Think Before Coding, Simplicity First, Surgical Changes, Goal-Driven Execution (TDD)
  - **Fresh documentation first** pattern: Always search `microsoft-docs` MCP before implementing
  - **Goal-Driven Execution**: Transform vague tasks into verifiable goals with explicit verification steps
  - **Skill structure**: SKILL.md + references/ directory (acceptance-criteria.md, tools.md, streaming.md, etc.)
  - **Symlink categorization**: Skills live in `.github/skills/` but are categorized via symlinks in `skills/<language>/<category>/`
  - **Product area categories**: foundry, data, messaging, monitoring, identity, security, integration
  - **Language suffixes**: `-py`, `-dotnet`, `-ts`, `-java`, `-rust` for skill naming
  - **Package field** in YAML frontmatter identifies SDK
  - **Testing framework**: `tests/scenarios/<skill>/scenarios.yaml` with `expected_patterns`, `forbidden_patterns`, `mock_response`, `tags`
  - **Acceptance criteria format**: Explicit ✅ CORRECT / ❌ INCORRECT code patterns
  - **Test harness**: `pnpm harness <skill> --mock --verbose` and Ralph Loop for iterative improvement
  - **Pre-configured MCP servers**: microsoft-docs, context7, deepwiki, github, playwright, memory, sequentialthinking
  - **Skill section order**: Title → Installation → Environment Variables → Authentication → Core Workflow → Feature Tables → Reference Links
  - **Installation**: `npx skills add microsoft/skills` (interactive) or `npx ctx7 skills install`
- **Added to PluginGuide.md:** New Section 10 (Enterprise Skills: Microsoft Skills Repository):
  - Full directory structure visualization
  - AGENTS.md best practices (Fresh docs first, Core principles table, Goal-driven execution)
  - Skill structure with references/ directory
  - SKILL.md template following Azure SDK pattern
  - Symlink categorization with product area categories
  - Testing framework with scenarios.yaml format
  - Pre-configured MCP servers table
  - Skill creation process (8 steps)
  - Acceptance criteria format example
  - Key patterns summary
  - Updated Table of Contents (now 11 sections)
- **Status:** Complete

### 2026-02-05 - Session 14
- **Link Reviewed:** "Build Agent Skills Faster with Claude Code 2.1 Release" (Rick Hightower)
- **Summary:** Deep dive into Claude Code 2.1's architectural shift from "AI assistant" to "agent operating system." Key new features:
  - **Skill hot-reload**: Edit → Save → Run (no restart)
  - **Hook scoping hierarchy**: Global → Project → Skill → Sub-agent (NEW)
  - **Skill-scoped hooks**: Hooks in SKILL.md frontmatter (skills = instructions + automation + policy)
  - **Sub-agent hooks**: Create "policy islands" for sandboxing (read-only, write-restricted, etc.)
  - **`context: fork`**: Spawns true sub-agent process with isolated context, returns summary only
  - **Inverse pattern**: `skills:` field in sub-agent frontmatter loads skills as domain knowledge
  - **Hooks as inter-agent event bus**: Sub-agents emit structured status via hooks
  - **Queen Agent / Swarm Pattern**: Emergent architecture for supervised multi-agent coordination
  - **`/hooks` command**: Interactive hook management (create, edit, reload)
  - **`allowManagedHooksOnly`**: Enterprise governance to restrict hooks to approved ones
- **Added to PluginGuide.md:**
  - **Section 3 (Skills)**: Skill Hot-Reload, Skill-Scoped Hooks, `context: fork`, inverse `skills:` pattern
  - **Section 5 (Hooks)**: Hook Scoping Hierarchy, Sub-Agent Hooks (Policy Islands), `/hooks` command, `allowManagedHooksOnly`
  - **New Section 11 (Advanced Agent Patterns)**: Hooks as Event Bus, Queen Agent / Swarm Pattern, Claude Code as Agent OS
  - Updated Table of Contents (now 12 sections)
- **Status:** Complete
- **Note:** Article emphasizes these are real documented features; swarm architecture is emergent (enabled by platform, not prescribed)

### 2026-02-05 - Session 15
- **Link Reviewed:** GitHub Copilot Custom Agents Blog Post (agents.md analysis)
- **Summary:** Analysis of 2,500+ agents.md files from GitHub Copilot ecosystem. While Copilot-specific, patterns are universal. Key findings:
  - **Six core areas** for effective agent files: commands, testing, project structure, code style, git workflow, boundaries
  - **Three-tier boundary system** (Always / Ask First / Never) — more nuanced than binary DO/DON'T
  - **Specificity wins**: "React 18 with TypeScript" not "React project"
  - **Code > prose**: One snippet beats three paragraphs
  - **Commands early**: Put executable commands in first section
  - **Agent archetypes**: @docs-agent, @test-agent, @lint-agent, @api-agent, @dev-deploy-agent
  - **Critical test-agent boundary**: Never remove a failing test
  - **Iteration mindset**: "Best agent files grow through iteration, not upfront planning"
- **Added to PluginGuide.md:** New Section 12 (Universal Agent Patterns):
  - The 2,500 repo study context
  - Six core areas table
  - Three-tier boundary system with table
  - Five agent archetype templates with specific boundaries
  - Universal starter template
  - Mapping to Claude Code mechanisms table
  - Key takeaways
  - Updated Table of Contents (now 13 sections)
- **Status:** Complete
- **Note:** Cross-platform research validates existing patterns (operational > philosophical, specificity, examples) while adding new frameworks (six areas, three-tier boundaries)

---

*Ready for next link...*
