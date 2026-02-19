# Legal Skills Plugin

Discovery and access layer for legal professionals to easily find and use skills, tools, and MCP integrations.

## Overview

This plugin provides a unified interface to discover and invoke legal resources from three key repositories:

- **[lawvable.com/en](https://www.lawvable.com/en)** - Legal skills directory
- **[docs.case.dev](https://docs.case.dev)** - Legal tools documentation
- **[Midpage MCP](https://blog.midpage.ai/p/release-midpage-mcp-integration-for)** - MCP integration for legal work

## Installation

### From Plugin Repository

```bash
cd ~/.claude/plugins
git clone https://github.com/yourorg/legal-skills.git
```

### Manual Installation

Copy the `legal-skills/` directory to:
- **Project-level:** `<your-project>/.claude/plugins/legal-skills/`
- **Global:** `~/.claude/plugins/legal-skills/`

## Commands

### /legal-search [query]

Search across all three repositories for relevant skills, tools, and integrations.

```
/legal-search contract review
/legal-search discovery timeline
/legal-search case law research
```

### /legal-tools [category]

Browse categorized legal tools and resources.

```
/legal-tools                    # Show all categories
/legal-tools contract analysis  # Show contract analysis tools
/legal-tools research          # Show research tools
```

**Categories:**
- Contract Analysis
- Legal Research
- Document Drafting
- Discovery
- Compliance
- Case Management
- MCP Integrations

### /legal-skill <name> [args]

Directly invoke a specific skill or tool by name.

```
/legal-skill contract-review
/legal-skill case-law-search "employment discrimination"
/legal-skill discovery-timeline
```

## Legal Assistant Skill

The plugin includes an auto-discovery skill that suggests relevant legal resources during conversations.

**Activates when you:**
- Ask about legal analysis, research, or drafting
- Mention contracts, cases, discovery, or compliance
- Request help with legal workflows

**Provides:**
- Contextual suggestions (max 3 per task)
- Brief descriptions with invocation instructions
- Links to full documentation

## Reference Documentation

The plugin maintains indexes of available resources:

- `references/lawvable-index.md` - Skills from lawvable.com
- `references/case-tools.md` - Tools from case.dev
- `references/midpage-mcp.md` - MCP integration guide

These references are templates that get populated by fetching from the source repositories.

## Maintenance

### Update Resource Indexes

Refresh the catalogs to get latest skills and tools:

```bash
# From within Claude Code
/legal-search --refresh
```

Or manually fetch updates:
```bash
WebFetch("https://www.lawvable.com/en", "Extract complete skills directory")
WebFetch("https://docs.case.dev", "Extract all tools with documentation")
WebFetch("https://blog.midpage.ai/p/release-midpage-mcp-integration-for", "Extract MCP integration details")
```

### Configure Midpage MCP

To enable MCP integration, add to `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "midpage": {
      "command": "npx",
      "args": ["-y", "@midpage/mcp-server"],
      "env": {
        "MIDPAGE_API_KEY": "your-api-key"
      }
    }
  }
}
```

## Usage Examples

### Contract Review Workflow

```
User: I need to review this NDA for potential risks
Claude: [legal-assistant skill activates]
         I can help with that. Relevant resources:

         1. contract-review (lawvable.com) - Comprehensive review
         2. clause-extraction (lawvable.com) - Extract specific clauses
         3. risk-analyzer (case.dev) - Identify risk provisions

         Would you like me to invoke /legal-skill contract-review?
```

### Discovery Research

```
User: /legal-search discovery timeline tools
Claude: Found 3 resources:

        1. discovery-timeline (lawvable.com)
           Create chronological timelines from documents
           Invoke: /legal-skill discovery-timeline

        2. document-chronology (case.dev)
           Generate chronologies with citations
           Link: https://docs.case.dev/chronology

        3. midpage-timeline (MCP)
           Interactive timeline builder
           Status: MCP configured ✓
```

### Direct Invocation

```
User: /legal-skill contract-review
Claude: Loading contract-review skill from lawvable.com...

        This skill performs comprehensive contract review including:
        - Risk identification
        - Clause analysis
        - Redline suggestions

        Please provide the contract text or file path.
```

## Boundaries

**Always:**
- Cite source repository for all suggestions
- Provide links to full documentation
- Confirm skill identity before execution

**Ask first:**
- Whether to execute skills that modify files
- Whether to configure MCP integrations
- Whether to load full documentation

**Never:**
- Auto-execute without user request
- Modify configuration files automatically
- Provide legal advice or conclusions
- Share user data without permission

## Contributing

To add new resources to the catalogs:

1. Fetch from source repository
2. Add to appropriate reference file (lawvable-index.md, case-tools.md, midpage-mcp.md)
3. Follow the template structure
4. Include: name, description, category, link, usage instructions

## License

MIT

## Support

- Plugin issues: [GitHub Issues](https://github.com/yourorg/legal-skills/issues)
- lawvable.com resources: https://www.lawvable.com/en
- case.dev tools: https://docs.case.dev
- Midpage MCP: https://blog.midpage.ai

## Version

1.0.0 - Initial release
