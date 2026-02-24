#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
plugin_root="${CLAUDE_PLUGIN_ROOT:-"$(cd -- "${script_dir}/.." && pwd)"}"
node_bin="${NODE_BINARY:-node}"

if ! command -v "${node_bin}" >/dev/null 2>&1; then
  echo "ERROR: '${node_bin}' not found. Install Node.js (recommended: 18+) to use possiblaw-legal retrieval runtime." >&2
  exit 127
fi

exec "${node_bin}" "${plugin_root}/retrieval/run-search.mjs" "$@"

