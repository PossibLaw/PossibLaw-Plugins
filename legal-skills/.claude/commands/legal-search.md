# /legal-search

Search across legal skills, tools, and MCP integrations from multiple repositories.

## Usage

```
/legal-search [query]
```

## Description

Searches three key legal resource repositories:
- **lawvable.com/en** - Legal skills directory
- **docs.case.dev** - Legal tools documentation
- **midpage.ai MCP** - Midpage MCP integration

Returns relevant matches with links and descriptions to help you find the right resource for your legal work.

## Examples

```
/legal-search contract review
/legal-search discovery
/legal-search case law research
```

## Behavior

1. Takes your search query
2. Searches across all three repositories (using WebFetch or WebSearch)
3. Returns categorized results with:
   - Resource name
   - Source (lawvable/case.dev/midpage)
   - Description
   - Direct link
   - Usage instructions if available

## Boundaries

**Always:**
- Search all three repositories unless user specifies otherwise
- Provide clickable links to resources
- Cite the source repository for each result

**Ask first:**
- Whether to fetch full documentation for a specific result
- Whether to install/configure MCP integrations

**Never:**
- Execute or install resources without user confirmation
- Modify user's Claude Code configuration automatically
- Share search queries with third parties beyond the listed repositories
