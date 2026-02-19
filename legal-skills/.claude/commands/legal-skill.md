# /legal-skill

Directly invoke a specific legal skill or tool by name.

## Usage

```
/legal-skill <name> [arguments]
```

## Description

When you know the exact name of a legal skill or tool, use this command to invoke it directly without searching or browsing.

## Examples

```
/legal-skill contract-review
/legal-skill case-law-search "employment discrimination"
/legal-skill discovery-timeline
```

## Behavior

1. Looks up the skill/tool name across all repositories
2. If found in lawvable.com:
   - Fetches the skill documentation
   - Loads it into context
   - Executes according to skill instructions
3. If found in case.dev:
   - Fetches tool documentation
   - Explains usage
   - Executes if automated, or provides manual instructions
4. If found in midpage.ai MCP:
   - Checks if MCP is configured
   - Provides integration instructions if needed
   - Invokes MCP tool if available
5. If not found:
   - Suggests similar skill names
   - Offers to search with `/legal-search`

## Resolution Priority

1. Exact name match (case-insensitive)
2. Partial match with confidence
3. Fuzzy match with confirmation
4. Not found - suggest alternatives

## Boundaries

**Always:**
- Look up skill documentation before executing
- Confirm skill identity if multiple matches found
- Show source and description before execution

**Ask first:**
- Whether to execute skills that modify files or make external requests
- Whether to configure MCP integrations
- Whether to use a fuzzy match if exact name not found

**Never:**
- Execute destructive operations without confirmation
- Install or configure integrations automatically
- Share user data with external services without permission
- Guess at skill behavior - always load documentation first
