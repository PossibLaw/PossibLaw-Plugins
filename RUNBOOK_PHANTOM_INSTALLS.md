# Runbook: Fix Phantom Installs / Namespace Collisions (PossibLaw Marketplace)

This runbook is for the failure mode where installing/updating plugins causes the number of “Installed” plugins to grow beyond what you actually installed, and plugin details show the wrong content.

## Symptoms

Any of these usually indicates a namespace collision or stale/broken cached versions:

- Installed count inflates (example: `1 -> 3 -> 6 -> 13`) after installing a few plugins.
- Plugin detail pages show the wrong text (example: Legal plugin shows Vibe content).
- Components show errors like: `Plugin possiblaw not found in marketplace`.
- Uninstall in the UI fails with:
  `Failed to uninstall: Plugin "possiblaw@possiblaw-plugins" is not installed in user scope. Use --scope to specify the correct scope.`

## Root Cause (What’s Actually Happening)

Claude Code treats `.../<plugin>/.claude-plugin/plugin.json` `"name"` as the plugin’s identity/namespace.

If multiple different marketplace plugins ship a `plugin.json` with `"name": "possiblaw"`, they collide into the same identity. That produces:

- Mis-labeled/mixed components (commands/agents from different plugins appear under one “plugin”).
- Inflated installed counts (old versions and colliding identities both “register”).
- UI uninstall targeting `possiblaw@possiblaw-plugins` instead of the actual IDs (like `possiblaw-legal@possiblaw-plugins`).

## Quick Fix (Most Reliable)

1. Fully quit and restart Claude Code.

2. Run the audit (from this repo root):

```bash
cd /Users/salvadorcarranza/Plugins
scripts/audit-claude-plugin-cache.sh --marketplace possiblaw-plugins
```

3. If any **ACTIVE** entry shows `NAME_MISMATCH ... name='possiblaw' expected='possiblaw-*'`, force a clean re-download:

```bash
rm -rf "$HOME/.claude/plugins/cache/possiblaw-plugins" \
       "$HOME/.claude/plugins/marketplaces/possiblaw-plugins"

claude plugin marketplace update possiblaw-plugins

claude plugin install -s user possiblaw-vibe@possiblaw-plugins
claude plugin install -s user possiblaw-legal@possiblaw-plugins
claude plugin install -s user possiblaw-guardrails@possiblaw-plugins
claude plugin install -s user possiblaw-build-plugin@possiblaw-plugins
```

4. Restart Claude Code.

5. Verify the fix:

```bash
cd /Users/salvadorcarranza/Plugins
scripts/audit-claude-plugin-cache.sh --marketplace possiblaw-plugins

claude plugin list --json | jq -r '.[] | select(.id|endswith("@possiblaw-plugins")) | "\(.id) scope=\(.scope) version=\(.version)"' | sort
```

Expected audit outcome:

- `NAME_MISMATCH versions: 0`
- `ORPHAN cached versions: 0`
- 4 ACTIVE cached versions (one per plugin)

## Fix “Uninstall Not Installed In User Scope” Errors

That error means the uninstall operation is targeting `scope=user`, but the plugin is installed in another scope (`project` or `local`).

1. Check the actual scope:

```bash
claude plugin list --json | jq -r '.[] | select(.id|endswith("@possiblaw-plugins")) | "\(.id) scope=\(.scope) version=\(.version)"'
```

2. Uninstall from the scope it reports:

```bash
claude plugin uninstall -s project possiblaw-legal@possiblaw-plugins
# or:
claude plugin uninstall -s local possiblaw-legal@possiblaw-plugins
# or:
claude plugin uninstall -s user possiblaw-legal@possiblaw-plugins
```

## If `claude plugin update` Says “Already Latest” But Audit Still Shows `NAME_MISMATCH`

This means the marketplace repository you’re pulling from still contains the broken versions. You must publish a fix to GitHub first.

### Publisher Checklist (Prevents This Regression)

Requirements for each plugin in this marketplace:

- `possiblaw-legal/.claude-plugin/plugin.json` `"name"` must be `possiblaw-legal`
- `possiblaw-vibe/.claude-plugin/plugin.json` `"name"` must be `possiblaw-vibe`
- `possiblaw-guardrails/.claude-plugin/plugin.json` `"name"` must be `possiblaw-guardrails`
- `possiblaw-build-plugin/.claude-plugin/plugin.json` `"name"` must be `possiblaw-build-plugin`

And versions must be bumped when content changes.

Validate locally:

```bash
cd /Users/salvadorcarranza/Plugins
./scripts/validate-marketplace.sh
```

### Publishing Steps (Handles Non-Fast-Forward Pushes)

```bash
cd /Users/salvadorcarranza/Plugins

# Integrate any remote changes first (prevents non-fast-forward push rejects)
git pull --rebase origin main

./scripts/validate-marketplace.sh
git add -A
git commit -m "fix(marketplace): unique plugin ids and versions"
git push origin main
```

Then repeat **Quick Fix** on the client machine so Claude Code re-downloads the corrected marketplace content.

## Data To Attach When Filing an Upstream Issue

```bash
cd /Users/salvadorcarranza/Plugins
claude plugin list --json | jq -r '.[] | "\(.id) scope=\(.scope) version=\(.version) path=\(.installPath)"'
scripts/audit-claude-plugin-cache.sh --marketplace possiblaw-plugins
```

