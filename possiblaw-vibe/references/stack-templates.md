# CLAUDE.md Stack Templates

Pre-built CLAUDE.md templates for common tech stacks. Customize based on project specifics.

---

## Template: Next.js + Supabase

```markdown
# CLAUDE.md

[Project name] - [one-line description]

## Commands

```bash
pnpm dev          # Start dev server (localhost:3000)
pnpm build        # Production build
pnpm lint         # Run ESLint
pnpm typecheck    # TypeScript compiler
```

Run `pnpm lint && pnpm typecheck` after code changes.

## Stack

- Next.js 14 (App Router)
- TypeScript (strict mode)
- Supabase (Postgres + Auth + Storage)
- Tailwind CSS

## Structure

- `app/` - Next.js App Router pages and layouts
- `components/` - Reusable UI components
- `lib/` - Utility functions, Supabase client
- `types/` - TypeScript type definitions

## Database

Supabase handles auth and database. Key patterns:
- Use `createClient()` from `@/lib/supabase/server` for server components
- Use `createClient()` from `@/lib/supabase/client` for client components
- Row Level Security (RLS) is enabled - policies required for data access

## Boundaries

- **Always:** Use TypeScript strict mode, check RLS policies exist
- **Ask first:** Add new database tables, modify auth settings
- **Never:** Expose service_role key client-side — use anon key only
```

---

## Template: Astro Static Site

```markdown
# CLAUDE.md

[Project name] - [one-line description]

## Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Build to dist/
pnpm preview      # Preview production build
```

## Stack

- Astro 4
- Tailwind CSS
- MDX for content (if applicable)

## Structure

- `src/pages/` - File-based routing
- `src/components/` - Astro/React components
- `src/layouts/` - Page layouts
- `src/content/` - Markdown/MDX content
- `public/` - Static assets (copied as-is)

## Key Concepts

- Astro components (`.astro`) render to HTML with zero JS by default
- Use `client:*` directives to hydrate interactive components
- Prefer Astro components over React unless interactivity needed

## Boundaries

- **Always:** Minimize client-side JavaScript
- **Ask first:** Add React/Vue components (increases bundle size)
- **Never:** Use `client:load` unless truly needed — prefer `client:visible`
```

---

## Template: Python FastAPI

```markdown
# CLAUDE.md

[Project name] - [one-line description]

## Commands

```bash
uv sync                    # Install dependencies
uv run fastapi dev         # Start dev server
uv run pytest              # Run tests
uv run ruff check .        # Lint
uv run ruff format .       # Format
```

Run `uv run ruff check . && uv run pytest` after code changes.

## Stack

- Python 3.12+
- FastAPI
- SQLAlchemy (or SQLModel)
- Package manager: uv

## Structure

- `app/` - Application code
  - `main.py` - FastAPI app entry
  - `routers/` - API route modules
  - `models/` - Database models
  - `schemas/` - Pydantic schemas
- `tests/` - Test files
- `alembic/` - Database migrations

## Package Management

- ONLY use uv, NEVER pip
- Add packages: `uv add <package>`
- FORBIDDEN: `uv pip install`, `pip install`

## Boundaries

- **Always:** Use Pydantic for validation, async where possible
- **Ask first:** Add new dependencies, modify database schema
- **Never:** Use bare `except:` — catch specific exceptions
```

---

## Template: Hono + Cloudflare Workers

```markdown
# CLAUDE.md

[Project name] - [one-line description]

## Commands

```bash
pnpm dev          # Start local dev server
pnpm deploy       # Deploy to Cloudflare
pnpm test         # Run tests
```

## Stack

- Hono (TypeScript web framework)
- Cloudflare Workers (serverless runtime)
- D1 or Turso (SQLite database)

## Structure

- `src/` - Application code
  - `index.ts` - Hono app entry
  - `routes/` - Route handlers
  - `middleware/` - Custom middleware
- `wrangler.toml` - Cloudflare configuration

## Key Concepts

- Workers have no filesystem — use KV, D1, or R2 for persistence
- 50ms CPU time limit per request (plenty for most APIs)
- Use `c.env` to access bindings (D1, KV, etc.)

## Boundaries

- **Always:** Keep handlers fast, use edge caching where possible
- **Ask first:** Add new KV namespaces or D1 databases
- **Never:** Block the event loop with heavy computation
```

---

## Template: Go CLI Tool

```markdown
# CLAUDE.md

[Project name] - [one-line description]

## Commands

```bash
go build -o bin/[name]    # Build binary
go test ./...             # Run tests
go run main.go            # Run directly
```

## Stack

- Go 1.22+
- Cobra (CLI framework)
- No external dependencies preferred

## Structure

- `main.go` - Entry point
- `cmd/` - Command definitions
- `internal/` - Internal packages
- `pkg/` - Public packages (if library)

## Key Principles

- Prefer standard library over dependencies
- Error handling: return errors, don't panic
- Use `context.Context` for cancellation

## Boundaries

- **Always:** Handle errors explicitly, use `go fmt`
- **Ask first:** Add external dependencies
- **Never:** Use `panic()` for expected errors
```

---

## Template: Supabase + Mobile (React Native/Flutter)

```markdown
# CLAUDE.md

[Project name] - [one-line description]

## Stack

- [React Native / Flutter]
- Supabase (Backend)
  - Auth (email, OAuth)
  - Database (Postgres)
  - Storage (files)
  - Realtime (subscriptions)

## Supabase Setup

Environment variables needed:
```
SUPABASE_URL=https://[project].supabase.co
SUPABASE_ANON_KEY=[anon-key]
```

## Key Patterns

### Authentication
```typescript
// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: '[email]',
  password: '[password]'
})

// Get current user
const { data: { user } } = await supabase.auth.getUser()
```

### Database Queries
```typescript
// Select with RLS (user only sees their data)
const { data, error } = await supabase
  .from('items')
  .select('*')
  .order('created_at', { ascending: false })
```

## Boundaries

- **Always:** Use RLS policies, handle auth state changes
- **Ask first:** Modify database schema, add storage buckets
- **Never:** Use service_role key in mobile app — anon key only
```

---

## Customization Notes

When generating CLAUDE.md from these templates:

1. **Replace placeholders** - `[Project name]`, `[one-line description]`
2. **Adjust commands** - Match their package manager (npm, pnpm, yarn, bun)
3. **Add project-specific structure** - Based on their features
4. **Customize boundaries** - Based on their constraints and preferences
5. **Add Further Reading** - If they have specific docs to reference

```markdown
## Further Reading

**IMPORTANT:** Read relevant docs below before starting any task.

- `docs/PRD.md` - Product requirements and decisions
- `docs/architecture.md` - System design overview
```
