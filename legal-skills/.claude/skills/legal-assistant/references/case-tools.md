# Case.dev Tools Reference

Complete catalog of legal tools available at https://docs.case.dev

**Status:** ✅ Populated with real data from docs.case.dev (Last updated: 2026-02-19)

## Core Platform Tools

Case.dev provides an integrated legal technology platform with 6 core services:

### Storage & RAG

#### Vault
- **Category:** Document Storage & Retrieval
- **Description:** Zero-trust storage with built-in RAG (Retrieval-Augmented Generation). Upload PDFs to create instantly queryable vector indexes
- **Use Cases:** Document repository, semantic search, knowledge base
- **Inputs:** PDF files
- **Outputs:** Vector-indexed searchable documents
- **Link:** https://docs.case.dev

### AI Gateway

#### LLMs
- **Category:** AI Model Access
- **Description:** Unified access to 195+ models (Claude, GPT-4, Gemini, etc.) with PII redaction and audit logging included
- **Use Cases:** Legal analysis, drafting, research with compliance built-in
- **Features:** Multi-model access, PII protection, audit trails
- **Link:** https://case.dev/models
- **Documentation:** https://docs.case.dev/llms.txt

### Document Processing

#### Vision (OCR)
- **Category:** Optical Character Recognition
- **Description:** Specialized OCR for legal documents handling handwritten notes, stamps, and degraded scans
- **Use Cases:** Digitizing paper records, extracting text from images, processing scanned documents
- **Inputs:** PDF files, images (scanned documents)
- **Outputs:** Searchable text with layout preservation
- **Features:** Legal-specific optimization, handwriting recognition

### Transcription

#### Voice
- **Category:** Audio Processing
- **Description:** Legal-grade audio conversion with speaker identification and timestamping for recorded evidence
- **Use Cases:** Deposition transcription, meeting notes, recorded testimony
- **Inputs:** Audio/video recordings
- **Outputs:** Timestamped transcripts with speaker labels
- **Features:** Speaker identification, timestamp accuracy

### Legal Research

#### Search
- **Category:** Legal Research
- **Description:** Programmatic access for retrieving case law, statutes, and legal citations
- **Use Cases:** Case law research, statutory analysis, citation verification
- **Inputs:** Search queries, jurisdictions, citation strings
- **Outputs:** Relevant cases, statutes, legal authorities

### Infrastructure

#### Orbit Compute
- **Category:** Serverless Computing
- **Description:** Serverless functions supporting Python, containerized deployments, and GPU scaling
- **Use Cases:** Custom legal workflows, automation, AI model deployment
- **Features:** Python support, containers, GPU access

## Quickstart Solutions

Pre-built workflows combining multiple tools:

- **Document Search** - Semantic searching across uploaded documents using Vault + LLMs
- **OCR Integration** - PDF and image text extraction for digitization using Vision
- **Audio Transcription** - Convert recordings to searchable text with speaker labels using Voice
- **LLM Gateway** - Access 195+ models through unified interface with compliance

## Reference Implementations

Common legal workflows:

- **Discovery Pipeline** - Document ingestion with OCR and indexing
- **Deposition Analysis** - Video transcription with speaker ID and testimony extraction
- **Contract Review** - Clause extraction, risk identification, and comparison features

## Getting Started

- **Free Tier:** Up to $30/month credit
- **API Documentation:** https://docs.case.dev/llms.txt
- **Model Browser:** https://case.dev/models
- **Pricing:** https://case.dev/pricing

## Usage Pattern

For each tool, provide:
- **Name** - Tool identifier
- **Category** - Functional category
- **Description** - What the tool does
- **Inputs** - Required parameters
- **Outputs** - What it returns
- **Link** - docs.case.dev documentation URL

## API Integration

Some tools may be API-based:
- Check if user has case.dev API credentials
- Provide setup instructions if needed
- Fall back to manual process if API unavailable

## Maintenance

Update this catalog:
- Weekly: Check docs.case.dev for new tools
- On-demand: When user requests unavailable tool
- Manual: When tool capabilities change

## Notes

- Some tools may require case.dev account or API access
- Check documentation for rate limits and usage restrictions
- Tools may have dependencies on external services
