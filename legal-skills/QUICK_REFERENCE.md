# Legal Skills Plugin - Quick Reference

Last Updated: 2026-02-19

## Available Resources Summary

### 📚 Lawvable.com Skills (39 total)

**Featured Skills:**
1. **NDA Review** - Clause-by-clause analysis with redlines
2. **Vendor Due Diligence** - IT/tech vendor risk assessment (GDPR, DORA, NIS2, SOX)
3. **Whistleblower Policy** - EU Directive 2019/1937 compliance

**Categories:** Commercial Law, Compliance, Corporate Governance, Employment Law, IP, Contracts

**Invoke:** `/legal-skill nda-review` or `/legal-search [topic]`

---

### 🔧 Case.dev Tools (6 core platforms)

**Storage & RAG:**
- **Vault** - Zero-trust storage with instant RAG indexing

**AI Gateway:**
- **LLMs** - 195+ models with PII redaction and audit logging

**Document Processing:**
- **Vision OCR** - Legal-specialized OCR for handwritten notes and stamps

**Transcription:**
- **Voice** - Audio transcription with speaker ID and timestamps

**Research:**
- **Search** - Case law, statutes, and citations

**Infrastructure:**
- **Orbit Compute** - Serverless Python, containers, GPU scaling

**Free Tier:** $30/month credit | **Docs:** https://docs.case.dev/llms.txt

---

### 🔍 Midpage MCP Integration

**Requires:**
- Active Midpage subscription
- Claude Pro/Team/Enterprise subscription

**Capabilities:**
- ✓ Complex legal research queries over case law database
- ✓ AI-powered citation verification
- ✓ Memo and brief drafting with verified precedent
- ✓ Legal argument exploration and analysis

**Setup:** https://www.midpage.ai/integrations

---

## Command Cheat Sheet

```bash
# Search all three repositories
/legal-search contract review
/legal-search discovery timeline

# Browse by category
/legal-tools                    # All categories
/legal-tools compliance         # Specific category

# Invoke by name
/legal-skill nda-review
/legal-skill vendor-due-diligence
```

## Auto-Discovery

The **legal-assistant skill** automatically suggests relevant resources when you:
- Ask about legal analysis or research
- Mention contracts, cases, or compliance
- Request help with legal workflows

Maximum 3 suggestions per task to avoid overwhelm.

---

## Integration Status

| Source | Status | Resources | Last Updated |
|--------|--------|-----------|--------------|
| lawvable.com | ✅ Active | 39 skills | 2026-02-19 |
| case.dev | ✅ Active | 6 platforms | 2026-02-19 |
| midpage.ai MCP | ⚙️ Requires setup | Research tools | 2026-02-19 |

---

## Example Workflows

### Contract Review
```
User: I need to review this NDA
Assistant: [suggests nda-review skill from lawvable.com]
User: /legal-skill nda-review
Assistant: [loads skill, performs clause-by-clause analysis]
```

### Legal Research
```
User: Find employment discrimination cases in the 9th Circuit
Assistant: [uses Midpage MCP if configured, or suggests case.dev Search]
```

### Document Processing
```
User: OCR these scanned discovery documents
Assistant: [suggests case.dev Vision OCR]
User: /legal-tools document processing
Assistant: [shows Vision OCR details and usage]
```

---

## Next Steps

1. **Try a command:** `/legal-search compliance` or `/legal-tools`
2. **Configure Midpage MCP** (optional): https://www.midpage.ai/integrations
3. **Sign up for case.dev** (optional): Free $30/month tier available
4. **Browse lawvable skills**: https://www.lawvable.com/en

---

## Support

- Plugin issues: [Report on GitHub]
- lawvable.com: https://www.lawvable.com/en
- case.dev: https://docs.case.dev
- Midpage: https://blog.midpage.ai
