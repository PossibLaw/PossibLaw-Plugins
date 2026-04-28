import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

function resolvePluginRoot() {
  if (process.env.CLAUDE_PLUGIN_ROOT) {
    return resolve(process.env.CLAUDE_PLUGIN_ROOT);
  }

  const retrievalDir = dirname(fileURLToPath(import.meta.url));
  return resolve(retrievalDir, "..");
}

export const pluginRoot = resolvePluginRoot();

export function resolvePluginPath(...segments) {
  return resolve(pluginRoot, ...segments);
}

