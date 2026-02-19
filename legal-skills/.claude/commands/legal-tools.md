# /legal-tools

Browse categorized legal tools and resources available across all repositories.

## Usage

```
/legal-tools
/legal-tools [category]
```

## Description

Displays an organized catalog of legal tools, skills, and integrations from:
- lawvable.com/en (skills directory)
- docs.case.dev (tools)
- midpage.ai (MCP integration)

## Categories

- **Contract Analysis** - Contract review, clause extraction, risk identification
- **Legal Research** - Case law, statutes, precedents
- **Document Drafting** - Templates, forms, document generation
- **Discovery** - eDiscovery, document review, data management
- **Compliance** - Regulatory compliance, policy checking
- **Case Management** - Matter management, deadline tracking
- **MCP Integrations** - Model Context Protocol servers and integrations

## Examples

```
/legal-tools
/legal-tools contract analysis
/legal-tools research
```

## Behavior

Without a category:
1. Shows all available categories
2. Lists top 3-5 tools per category
3. Provides links to full documentation

With a category:
1. Shows all tools in that category
2. Includes detailed descriptions
3. Links to documentation and usage instructions

## Output Format

```
## [Category Name]

### [Tool/Skill Name]
**Source:** [lawvable.com | case.dev | midpage.ai]
**Description:** [Brief description]
**Link:** [URL]
**Invoke with:** `/legal-skill [name]` or instructions
```

## Boundaries

**Always:**
- Organize by category for easy browsing
- Include source attribution
- Provide invocation instructions

**Ask first:**
- Whether to load full documentation for a specific tool
- Whether to demonstrate a tool's usage

**Never:**
- Auto-execute tools without user request
- Modify configuration files
- Install integrations without explicit permission
