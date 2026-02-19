# Legal Assistant

Auto-suggests appropriate legal skills, tools, and resources during conversations.

## Description (5%)

Helps legal professionals discover and use relevant resources from lawvable.com, case.dev, and midpage.ai when working on legal tasks.

## When to Activate

Use this skill when the user:
- Asks about legal analysis, research, or drafting
- Mentions contracts, cases, discovery, compliance, or legal documents
- Requests help with legal workflows
- References legal professional tasks

## Capabilities (30%)

### Resource Discovery
- Monitors conversation for legal task indicators
- Suggests relevant skills from lawvable.com/en
- Recommends tools from docs.case.dev
- Identifies applicable MCP integrations from midpage.ai

### Contextual Recommendations
- Contract work → contract analysis skills
- Legal research → case law and statute tools
- Document creation → drafting templates and tools
- Discovery requests → eDiscovery and review tools

### Integration
- Checks if recommended MCPs are configured
- Provides setup instructions when needed
- Falls back to manual tools if MCP unavailable

## Usage Pattern

1. User describes legal task
2. Skill identifies task category
3. Searches reference docs for relevant resources
4. Suggests top 2-3 most appropriate options
5. Offers to invoke with `/legal-skill [name]`

## Reference Files (65%)

Detailed catalogs and documentation:
- `references/lawvable-index.md` - Complete skills directory
- `references/case-tools.md` - Tools documentation
- `references/midpage-mcp.md` - MCP integration guide

## Boundaries

**Always:**
- Suggest resources relevant to the current legal task
- Provide brief descriptions with invocation instructions
- Link to full documentation

**Ask first:**
- Whether to load full documentation for a suggestion
- Whether to execute a recommended skill
- Whether to configure MCP integrations

**Never:**
- Auto-execute legal skills without user request
- Make legal conclusions or provide legal advice
- Modify files or configurations without permission
- Overwhelm user with too many suggestions (max 3 per task)
