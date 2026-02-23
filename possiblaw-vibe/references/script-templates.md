# Shell Script Templates

Pre-built shell script templates for common tech stacks. All scripts use bash with safety flags, colored output, and beginner-friendly error messages.

---

## Common Utilities Block

Shared bash functions included at the top of every generated script.

```bash
#!/usr/bin/env bash
set -euo pipefail

# --- Colors ---
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

info()  { echo -e "${BLUE}ℹ${NC}  $1"; }
ok()    { echo -e "${GREEN}✓${NC}  $1"; }
warn()  { echo -e "${YELLOW}⚠${NC}  $1"; }
fail()  { echo -e "${RED}✗${NC}  $1"; exit 1; }

# --- Command checker ---
need() {
  command -v "$1" >/dev/null 2>&1 || fail "'$1' is required but not installed. $2"
}

# --- OS detection ---
OS="unknown"
case "$(uname -s)" in
  Darwin*) OS="mac"   ;;
  Linux*)  OS="linux" ;;
  MINGW*|CYGWIN*|MSYS*) OS="windows" ;;
esac
```

---

## Template: Next.js + Supabase

### setup.sh

```bash
#!/usr/bin/env bash
set -euo pipefail

# [Common utilities block goes here]

info "Setting up [Project Name]..."

# --- Prerequisites ---
need "node" "Install from https://nodejs.org"
need "pnpm" "Install with: npm install -g pnpm"
need "git"  "Install from https://git-scm.com"

# --- Install dependencies ---
info "Installing dependencies..."
pnpm install || fail "Could not install dependencies. Check your internet connection."
ok "Dependencies installed"

# --- Git ---
if [ ! -d ".git" ]; then
  info "Initializing git repository..."
  git init
  ok "Git initialized"
else
  ok "Git already initialized"
fi

# --- Environment ---
if [ ! -f ".env.local" ]; then
  info "Creating .env.local from template..."
  cp .env.example .env.local 2>/dev/null || cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EOF
  warn "Edit .env.local with your Supabase credentials before running the app"
else
  ok ".env.local already exists"
fi

# --- Verify build ---
info "Verifying the project builds..."
pnpm build || fail "Build failed. Check the errors above."
ok "Build successful"

echo ""
ok "Setup complete! Run ./scripts/dev.sh to start developing."
```

### dev.sh

```bash
#!/usr/bin/env bash
set -euo pipefail

# [Common utilities block goes here]

info "Starting dev server..."

need "pnpm" "Install with: npm install -g pnpm"

if [ ! -f ".env.local" ]; then
  warn "No .env.local found. Run ./scripts/setup.sh first."
  exit 1
fi

echo ""
info "Your app will be at: http://localhost:3000"
info "Press Ctrl+C to stop"
echo ""

pnpm dev
```

### test.sh

```bash
#!/usr/bin/env bash
set -euo pipefail

# [Common utilities block goes here]

info "Running tests..."

need "pnpm" "Install with: npm install -g pnpm"

if pnpm test 2>&1; then
  echo ""
  ok "All tests passed!"
else
  echo ""
  fail "Some tests failed. Read the output above — the test name tells you what broke."
fi
```

### lint.sh

```bash
#!/usr/bin/env bash
set -euo pipefail

# [Common utilities block goes here]

info "Running linter and type checker..."

need "pnpm" "Install with: npm install -g pnpm"

ERRORS=0

info "Checking ESLint..."
if pnpm lint 2>&1; then
  ok "ESLint passed"
else
  warn "ESLint found issues. Run 'pnpm lint --fix' to auto-fix what it can."
  ERRORS=1
fi

info "Checking TypeScript types..."
if pnpm typecheck 2>&1; then
  ok "TypeScript passed"
else
  warn "TypeScript found type errors. Read the messages above — they tell you exactly which file and line."
  ERRORS=1
fi

echo ""
if [ "$ERRORS" -eq 0 ]; then
  ok "Everything looks good!"
else
  warn "Fix the issues above, then run this script again."
  exit 1
fi
```

---

## Template: Astro Static Site

### setup.sh

```bash
#!/usr/bin/env bash
set -euo pipefail

# [Common utilities block goes here]

info "Setting up [Project Name]..."

need "node" "Install from https://nodejs.org"
need "pnpm" "Install with: npm install -g pnpm"
need "git"  "Install from https://git-scm.com"

info "Installing dependencies..."
pnpm install || fail "Could not install dependencies. Check your internet connection."
ok "Dependencies installed"

if [ ! -d ".git" ]; then
  git init
  ok "Git initialized"
fi

info "Verifying the project builds..."
pnpm build || fail "Build failed. Check the errors above."
ok "Build successful — output is in dist/"

echo ""
ok "Setup complete! Run ./scripts/dev.sh to start developing."
```

### dev.sh

```bash
#!/usr/bin/env bash
set -euo pipefail

# [Common utilities block goes here]

info "Starting Astro dev server..."

need "pnpm" "Install with: npm install -g pnpm"

echo ""
info "Your site will be at: http://localhost:4321"
info "Pages live in src/pages/ — edits show instantly"
info "Press Ctrl+C to stop"
echo ""

pnpm dev
```

### test.sh

```bash
#!/usr/bin/env bash
set -euo pipefail

# [Common utilities block goes here]

info "Building site to check for errors..."

need "pnpm" "Install with: npm install -g pnpm"

if pnpm build 2>&1; then
  echo ""
  ok "Site builds successfully! No broken pages."
else
  echo ""
  fail "Build failed. Check the errors above — usually a broken import or bad frontmatter."
fi
```

### lint.sh

```bash
#!/usr/bin/env bash
set -euo pipefail

# [Common utilities block goes here]

info "Running linter..."

need "pnpm" "Install with: npm install -g pnpm"

if pnpm lint 2>&1; then
  ok "Linter passed — code looks good!"
else
  warn "Linter found issues. Run 'pnpm lint --fix' to auto-fix what it can."
  exit 1
fi
```

---

## Template: Python FastAPI

### setup.sh

```bash
#!/usr/bin/env bash
set -euo pipefail

# [Common utilities block goes here]

info "Setting up [Project Name]..."

need "python3" "Install from https://python.org"
need "uv"      "Install with: curl -LsSf https://astral.sh/uv/install.sh | sh"
need "git"     "Install from https://git-scm.com"

info "Installing dependencies..."
uv sync || fail "Could not install dependencies. Check your internet connection."
ok "Dependencies installed"

if [ ! -d ".git" ]; then
  git init
  ok "Git initialized"
fi

if [ ! -f ".env" ]; then
  info "Creating .env from template..."
  cp .env.example .env 2>/dev/null || cat > .env << 'EOF'
DATABASE_URL=sqlite:///./dev.db
SECRET_KEY=change-me-in-production
EOF
  warn "Edit .env with your settings before running the app"
else
  ok ".env already exists"
fi

info "Running quick test to verify setup..."
uv run python -c "import fastapi; print(f'FastAPI {fastapi.__version__} ready')" || fail "FastAPI import failed."
ok "Setup verified"

echo ""
ok "Setup complete! Run ./scripts/dev.sh to start developing."
```

### dev.sh

```bash
#!/usr/bin/env bash
set -euo pipefail

# [Common utilities block goes here]

info "Starting FastAPI dev server..."

need "uv" "Install with: curl -LsSf https://astral.sh/uv/install.sh | sh"

echo ""
info "Your API will be at: http://localhost:8000"
info "API docs at: http://localhost:8000/docs"
info "Press Ctrl+C to stop"
echo ""

uv run fastapi dev
```

### test.sh

```bash
#!/usr/bin/env bash
set -euo pipefail

# [Common utilities block goes here]

info "Running tests..."

need "uv" "Install with: curl -LsSf https://astral.sh/uv/install.sh | sh"

if uv run pytest -v 2>&1; then
  echo ""
  ok "All tests passed!"
else
  echo ""
  fail "Some tests failed. The test names tell you what broke — look for 'FAILED' lines above."
fi
```

### lint.sh

```bash
#!/usr/bin/env bash
set -euo pipefail

# [Common utilities block goes here]

info "Running linter and formatter..."

need "uv" "Install with: curl -LsSf https://astral.sh/uv/install.sh | sh"

ERRORS=0

info "Checking code style with ruff..."
if uv run ruff check . 2>&1; then
  ok "Ruff check passed"
else
  warn "Ruff found issues. Run 'uv run ruff check . --fix' to auto-fix."
  ERRORS=1
fi

info "Checking formatting..."
if uv run ruff format --check . 2>&1; then
  ok "Formatting looks good"
else
  warn "Some files need formatting. Run 'uv run ruff format .' to fix."
  ERRORS=1
fi

echo ""
if [ "$ERRORS" -eq 0 ]; then
  ok "Everything looks good!"
else
  warn "Fix the issues above, then run this script again."
  exit 1
fi
```

---

## Template: Hono + Cloudflare Workers

### setup.sh

```bash
#!/usr/bin/env bash
set -euo pipefail

# [Common utilities block goes here]

info "Setting up [Project Name]..."

need "node"     "Install from https://nodejs.org"
need "pnpm"     "Install with: npm install -g pnpm"
need "wrangler" "Install with: pnpm add -g wrangler"
need "git"      "Install from https://git-scm.com"

info "Installing dependencies..."
pnpm install || fail "Could not install dependencies. Check your internet connection."
ok "Dependencies installed"

if [ ! -d ".git" ]; then
  git init
  ok "Git initialized"
fi

if [ ! -f ".dev.vars" ]; then
  info "Creating .dev.vars for local secrets..."
  cat > .dev.vars << 'EOF'
# Add local-only secrets here (not committed to git)
# MY_SECRET=value
EOF
  ok ".dev.vars created"
fi

info "Verifying the project builds..."
pnpm build || fail "Build failed. Check the errors above."
ok "Build successful"

echo ""
ok "Setup complete! Run ./scripts/dev.sh to start developing."
```

### dev.sh

```bash
#!/usr/bin/env bash
set -euo pipefail

# [Common utilities block goes here]

info "Starting Hono dev server..."

need "pnpm" "Install with: npm install -g pnpm"

echo ""
info "Your API will be at: http://localhost:8787"
info "This simulates the Cloudflare Workers environment locally"
info "Press Ctrl+C to stop"
echo ""

pnpm dev
```

### test.sh

```bash
#!/usr/bin/env bash
set -euo pipefail

# [Common utilities block goes here]

info "Running tests..."

need "pnpm" "Install with: npm install -g pnpm"

if pnpm test 2>&1; then
  echo ""
  ok "All tests passed!"
else
  echo ""
  fail "Some tests failed. Read the output above — the test name tells you what broke."
fi
```

### lint.sh

```bash
#!/usr/bin/env bash
set -euo pipefail

# [Common utilities block goes here]

info "Running linter and type checker..."

need "pnpm" "Install with: npm install -g pnpm"

ERRORS=0

info "Checking ESLint..."
if pnpm lint 2>&1; then
  ok "ESLint passed"
else
  warn "ESLint found issues. Run 'pnpm lint --fix' to auto-fix what it can."
  ERRORS=1
fi

info "Checking TypeScript types..."
if pnpm typecheck 2>&1; then
  ok "TypeScript passed"
else
  warn "TypeScript found type errors. Read the messages above for file and line info."
  ERRORS=1
fi

echo ""
if [ "$ERRORS" -eq 0 ]; then
  ok "Everything looks good!"
else
  warn "Fix the issues above, then run this script again."
  exit 1
fi
```

---

## Template: Go CLI Tool

### setup.sh

```bash
#!/usr/bin/env bash
set -euo pipefail

# [Common utilities block goes here]

info "Setting up [Project Name]..."

need "go"  "Install from https://go.dev/dl"
need "git" "Install from https://git-scm.com"

info "Downloading Go modules..."
go mod download || fail "Could not download modules. Check your internet connection."
ok "Modules downloaded"

if [ ! -d ".git" ]; then
  git init
  ok "Git initialized"
fi

info "Verifying the project builds..."
go build -o /dev/null . || fail "Build failed. Check the errors above."
ok "Build successful"

echo ""
ok "Setup complete! Run ./scripts/dev.sh to build and run."
```

### dev.sh

```bash
#!/usr/bin/env bash
set -euo pipefail

# [Common utilities block goes here]

info "Building and running..."

need "go" "Install from https://go.dev/dl"

BINARY="bin/$(basename "$(pwd)")"
mkdir -p bin

info "Building → $BINARY"
go build -o "$BINARY" . || fail "Build failed. Check the errors above."
ok "Build successful"

echo ""
info "Running $BINARY..."
echo "---"
"$BINARY" "$@"
```

### test.sh

```bash
#!/usr/bin/env bash
set -euo pipefail

# [Common utilities block goes here]

info "Running tests..."

need "go" "Install from https://go.dev/dl"

if go test -v ./... 2>&1; then
  echo ""
  ok "All tests passed!"
else
  echo ""
  fail "Some tests failed. Look for '--- FAIL' lines above to see what broke."
fi
```

### lint.sh

```bash
#!/usr/bin/env bash
set -euo pipefail

# [Common utilities block goes here]

info "Running formatter and vet..."

need "go" "Install from https://go.dev/dl"

ERRORS=0

info "Checking formatting..."
UNFORMATTED=$(gofmt -l . 2>&1)
if [ -z "$UNFORMATTED" ]; then
  ok "Formatting looks good"
else
  warn "These files need formatting: $UNFORMATTED"
  warn "Run 'gofmt -w .' to fix."
  ERRORS=1
fi

info "Running go vet..."
if go vet ./... 2>&1; then
  ok "go vet passed"
else
  warn "go vet found issues. Read the messages above."
  ERRORS=1
fi

echo ""
if [ "$ERRORS" -eq 0 ]; then
  ok "Everything looks good!"
else
  warn "Fix the issues above, then run this script again."
  exit 1
fi
```

---

## Template: Mobile (React Native)

### setup.sh

```bash
#!/usr/bin/env bash
set -euo pipefail

# [Common utilities block goes here]

info "Setting up [Project Name]..."

need "node" "Install from https://nodejs.org"
need "pnpm" "Install with: npm install -g pnpm"
need "git"  "Install from https://git-scm.com"

if [ "$OS" = "mac" ]; then
  need "watchman" "Install with: brew install watchman"
fi

info "Installing dependencies..."
pnpm install || fail "Could not install dependencies. Check your internet connection."
ok "Dependencies installed"

if [ ! -d ".git" ]; then
  git init
  ok "Git initialized"
fi

if [ ! -f ".env" ]; then
  info "Creating .env from template..."
  cp .env.example .env 2>/dev/null || cat > .env << 'EOF'
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-anon-key
EOF
  warn "Edit .env with your Supabase credentials"
else
  ok ".env already exists"
fi

if [ "$OS" = "mac" ]; then
  info "Installing iOS pods..."
  cd ios && pod install && cd .. || warn "Pod install failed — you may need to install CocoaPods"
fi

echo ""
ok "Setup complete! Run ./scripts/dev.sh to start developing."
```

### dev.sh

```bash
#!/usr/bin/env bash
set -euo pipefail

# [Common utilities block goes here]

info "Starting React Native..."

need "pnpm" "Install with: npm install -g pnpm"

echo ""
info "Starting Metro bundler..."
info "Once ready, press 'i' for iOS simulator or 'a' for Android emulator"
info "Press Ctrl+C to stop"
echo ""

pnpm start
```

### test.sh

```bash
#!/usr/bin/env bash
set -euo pipefail

# [Common utilities block goes here]

info "Running tests..."

need "pnpm" "Install with: npm install -g pnpm"

if pnpm test 2>&1; then
  echo ""
  ok "All tests passed!"
else
  echo ""
  fail "Some tests failed. Read the output above — the test name tells you what broke."
fi
```

### lint.sh

```bash
#!/usr/bin/env bash
set -euo pipefail

# [Common utilities block goes here]

info "Running linter and type checker..."

need "pnpm" "Install with: npm install -g pnpm"

ERRORS=0

info "Checking ESLint..."
if pnpm lint 2>&1; then
  ok "ESLint passed"
else
  warn "ESLint found issues. Run 'pnpm lint --fix' to auto-fix what it can."
  ERRORS=1
fi

info "Checking TypeScript types..."
if pnpm typecheck 2>&1; then
  ok "TypeScript passed"
else
  warn "TypeScript found type errors. Read the messages above for file and line info."
  ERRORS=1
fi

echo ""
if [ "$ERRORS" -eq 0 ]; then
  ok "Everything looks good!"
else
  warn "Fix the issues above, then run this script again."
  exit 1
fi
```

---

## Customization Notes

When generating scripts from these templates:

1. **Replace placeholders** — `[Project Name]` in setup.sh info messages
2. **Adjust package manager** — Match their choice (npm, pnpm, yarn, bun)
3. **Adjust prerequisites** — Add or remove `need` checks based on actual stack
4. **Include the Common Utilities Block** — Copy it into the top of every generated script (replace `# [Common utilities block goes here]`)
5. **Make scripts executable** — Run `chmod +x scripts/*.sh` after writing
6. **Add .env variables** — Match the actual environment variables the project needs
