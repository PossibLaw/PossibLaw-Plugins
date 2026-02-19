# Midpage MCP Integration

Reference for Midpage MCP integration from https://blog.midpage.ai/p/release-midpage-mcp-integration-for

**Status:** ✅ Populated with real data from blog.midpage.ai (Last updated: 2026-02-19)

## What is Midpage MCP?

**"Claude and Midpage are now connected, unlocking seamless legal research and drafting workflows right inside Claude desktop or web."**

The Midpage MCP (Model Context Protocol) integration enables Claude to access legal research capabilities directly, providing:
- Comprehensive case law dataset access
- AI-powered citator for verifying legal authority
- Complex search queries over up-to-date legal databases

**Note:** The Midpage MCP is not officially partnered with Anthropic.

## Key Capabilities

The integration allows legal professionals to:

✓ **Conduct legal research** - Run simple and complex legal research queries
✓ **Generate drafts** - Create initial drafts of memos and briefs
✓ **Link facts to law** - Connect factual information from conversations to relevant case law
✓ **Verify citations** - Review and verify citations in legal documents
✓ **Explore arguments** - Investigate legal arguments and counterarguments

## Available MCP Tools

The MCP provides "tools it needs to run complex search queries directly over our comprehensive, up-to-date dataset of case law."

**Specific tool names and parameters:** Visit https://www.midpage.ai/integrations for detailed tool documentation.

### Primary Functions

- **Legal Research Queries** - Search case law with natural language or structured queries
- **Citation Verification** - Validate legal citations and check authority status
- **Case Law Access** - Retrieve full case text and metadata from comprehensive database
- **Argument Analysis** - Explore legal reasoning and precedent relationships

### Setup Instructions

**Prerequisites (REQUIRED):**
1. **Active Midpage subscription** - Required to access the MCP tools
2. **Active Claude subscription** - One of:
   - Claude Pro
   - Claude Team
   - Claude Enterprise

**Installation Steps:**

Visit **https://www.midpage.ai/integrations** for detailed setup procedures for:
- Claude Desktop (native app)
- Claude Browser (web version)

The integration guide at midpage.ai/integrations provides:
- Step-by-step configuration instructions
- MCP server installation commands
- Authentication setup
- Connection verification
- Troubleshooting tips

**Typical Configuration Pattern:**

Add to `~/.claude/settings.json`:
```json
{
  "mcpServers": {
    "midpage": {
      "command": "npx",
      "args": ["-y", "@midpage/mcp-server"],
      "env": {
        "MIDPAGE_API_KEY": "your-api-key-from-midpage"
      }
    }
  }
}
```

**API Key:** Obtain from your Midpage account dashboard

### Usage in Legal Work

**Seamless Research Workflows:**
- Research while drafting - Query case law without leaving Claude
- Memo generation - Create research memos with verified citations
- Brief writing - Draft briefs with relevant precedent automatically linked
- Citation checking - Verify citations in existing documents
- Argument development - Explore legal theories and counterarguments

**Example Workflows:**

1. **Research + Draft:** "Research employment discrimination cases in the 9th Circuit and draft a memo"
2. **Verify:** "Check all citations in this brief for current authority"
3. **Explore:** "Find cases distinguishing Smith v. Jones on the issue of standing"
4. **Analyze:** "What are the strongest counterarguments to this position?"

### Integration with Legal Skills Plugin

How this MCP works with the Legal Skills plugin:
- Auto-detected by `/legal-search`
- Listed in `/legal-tools` catalog
- Invokable via `/legal-skill` if configured
- Suggested by legal-assistant skill when relevant

### Troubleshooting

Common issues:
- MCP server not found → installation steps
- Authentication errors → API key setup
- Tool not available → version compatibility
- Rate limiting → usage limits and workarounds

## Maintenance

Update this reference:
- When Midpage releases MCP updates
- When new MCP tools are added
- When configuration format changes
- On user request if integration fails

## Notes

- MCP integration is optional but enhances capabilities
- Some features may require paid Midpage account
- Check blog.midpage.ai for latest documentation
- Report integration issues to Midpage support
