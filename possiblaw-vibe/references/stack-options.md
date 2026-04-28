# Tech Stack Options Reference

Comprehensive guide to tech stack choices organized by budget and use case.

---

## Budget Tiers

### Tier 0: Completely Free

**Best for:** Learning, personal projects, MVPs, side projects

| Component | Options | Notes |
|-----------|---------|-------|
| **Frontend Hosting** | Vercel, Netlify, Cloudflare Pages, GitHub Pages | All generous free tiers |
| **Backend** | Cloudflare Workers, Vercel Functions, Deno Deploy | Serverless, pay-per-use |
| **Database** | Turso (SQLite), Supabase (500MB), PlanetScale (1GB), Neon (512MB) | Watch storage limits |
| **Auth** | Supabase Auth, Clerk (10k MAU), Auth.js (self-hosted) | Supabase bundles with DB |
| **File Storage** | Cloudflare R2 (10GB), Supabase Storage (1GB) | R2 has no egress fees |

**Gotchas:**
- Free tiers have cold starts (slow first request)
- Bandwidth limits can surprise you
- Database storage fills up faster than you think
- Some require credit card even for free tier

### Tier 1: $5-25/month

**Best for:** Serious side projects, early startups, small client work

| Component | Options | Typical Cost |
|-----------|---------|--------------|
| **VPS** | Railway, Render, Fly.io, DigitalOcean | $5-15/mo |
| **Managed DB** | Supabase Pro, PlanetScale Scaler, Railway Postgres | $10-25/mo |
| **Full-stack Platform** | Vercel Pro, Netlify Pro | $20/mo |

**What you get:**
- No cold starts
- More storage/bandwidth
- Better support
- Custom domains with SSL

### Tier 2: $50-200/month

**Best for:** Production apps, startups with users, agencies

| Component | Options | Typical Cost |
|-----------|---------|--------------|
| **Dedicated VPS** | DigitalOcean Droplet, Linode, Hetzner | $20-50/mo |
| **Managed Services** | AWS/GCP/Azure starter tiers | $50-100/mo |
| **Database** | Dedicated Postgres, MongoDB Atlas | $25-50/mo |

**What you get:**
- Dedicated resources
- Better performance
- More control
- SLAs and support

### Tier 3: Enterprise ($500+/month)

**Best for:** Scale, compliance requirements, large teams

- Managed Kubernetes
- Enterprise cloud services
- Dedicated support
- Compliance certifications

---

## Stack Recipes

### Recipe: Marketing/Content Site

**Goal:** Fast, SEO-friendly, easy to update

```
Framework: Astro
Hosting: Vercel or Cloudflare Pages
CMS: Markdown files or Sanity (free tier)
Cost: $0
```

**Why Astro:** Ships zero JS by default, fastest possible pages, great for SEO.

### Recipe: Web App with User Accounts

**Goal:** Users can sign up, save data, interact

```
Framework: Next.js 14 (App Router)
Database: Supabase (Postgres + Auth + Storage)
Hosting: Vercel
Cost: $0 (free tier) to $45/mo (light production)
```

**Why this combo:** Supabase handles auth, database, and storage in one. Next.js + Vercel is seamless.

### Recipe: API Backend

**Goal:** JSON API for mobile app or other frontends

```
Framework: Hono (TypeScript) or FastAPI (Python)
Hosting: Cloudflare Workers or Railway
Database: Turso (SQLite) or Supabase
Cost: $0-15/mo
```

**Why Hono:** Tiny, fast, runs anywhere. Cloudflare Workers = globally distributed for free.

### Recipe: AI Application

**Goal:** App that uses LLMs, embeddings, or other AI

```
Framework: Python + FastAPI (or Next.js for full-stack)
AI Provider: OpenAI, Anthropic, or OpenRouter
Vector DB: Pinecone (free tier) or Supabase pgvector
Hosting: Modal, Railway, or Vercel
Cost: $0 base + API usage ($0.01-1.00 per request typical)
```

**Budget warning:** AI API costs can spike. Set hard limits. Consider:
- OpenRouter for cheaper models
- Local models via Ollama for development
- Caching responses where possible

### Recipe: Mobile App Backend

**Goal:** Backend for iOS/Android app

```
Option A (Simple): Supabase
- Auth, database, storage, realtime
- Official mobile SDKs
- Cost: $0-25/mo

Option B (Google ecosystem): Firebase
- Auth, Firestore, Storage, Push notifications
- Great mobile SDKs
- Cost: $0-25/mo (Blaze plan for functions)
```

### Recipe: CLI Tool

**Goal:** Command-line application to distribute

```
Language: Go or Rust
Distribution: GitHub Releases, Homebrew
Cost: $0
```

**Why Go/Rust:** Compiles to single binary. No runtime needed. Users just download and run.

### Recipe: Real-time Collaboration

**Goal:** Multiple users editing same data live (like Figma, Google Docs)

```
Framework: Next.js + Liveblocks or Partykit
Database: Postgres with Supabase Realtime
Hosting: Vercel + Cloudflare Workers
Cost: $0-50/mo (Liveblocks free tier is generous)
```

---

## Service Deep Dives

### Hosting Platforms

| Platform | Best For | Free Tier | Paid From |
|----------|----------|-----------|-----------|
| **Vercel** | Next.js, React | 100GB bandwidth | $20/mo |
| **Netlify** | Static sites, Jamstack | 100GB bandwidth | $19/mo |
| **Cloudflare Pages** | Static + Workers | Unlimited bandwidth | $20/mo |
| **Railway** | Any backend | $5 credit/mo | $5/mo |
| **Render** | Docker, backends | 750 hours/mo | $7/mo |
| **Fly.io** | Global distribution | 3 shared VMs | $2/mo |

### Databases

| Database | Type | Free Tier | Best For |
|----------|------|-----------|----------|
| **Supabase** | Postgres | 500MB, 2GB bandwidth | Full-stack apps |
| **PlanetScale** | MySQL | 1GB storage | Scale-out MySQL |
| **Turso** | SQLite (edge) | 9GB total, 500 DBs | Edge computing |
| **Neon** | Postgres | 512MB, auto-sleep | Serverless Postgres |
| **MongoDB Atlas** | Document | 512MB | Flexible schemas |
| **Upstash** | Redis + Kafka | 10k commands/day | Caching, queues |

### Auth Providers

| Provider | Free Tier | Best For |
|----------|-----------|----------|
| **Supabase Auth** | Unlimited MAU | Already using Supabase |
| **Clerk** | 10,000 MAU | Beautiful UI, easy setup |
| **Auth.js** | Unlimited (self-hosted) | Full control, any provider |
| **Firebase Auth** | Unlimited | Mobile apps, Google ecosystem |
| **Kinde** | 10,500 MAU | Modern, generous free tier |

### Payments

| Provider | Fees | Best For |
|----------|------|----------|
| **Stripe** | 2.9% + $0.30 | Everything (standard) |
| **Lemon Squeezy** | 5% + $0.50 | SaaS, handles taxes |
| **Paddle** | 5% + $0.50 | SaaS, merchant of record |
| **Gumroad** | 10% | Digital products, simple |

---

## Decision Flowchart

```
START
  │
  ├─► Building a website (no backend)?
  │     └─► Astro + Cloudflare Pages ($0)
  │
  ├─► Need user accounts?
  │     ├─► Simple CRUD app → Next.js + Supabase ($0-25)
  │     └─► Complex app → Next.js + Postgres + separate auth ($25-50)
  │
  ├─► Building an API only?
  │     ├─► Light traffic → Cloudflare Workers + Turso ($0)
  │     └─► Heavy traffic → Railway + Postgres ($15-30)
  │
  ├─► Need AI features?
  │     └─► Python + FastAPI + OpenRouter ($0 + API costs)
  │
  ├─► Mobile app backend?
  │     ├─► Simple → Supabase ($0-25)
  │     └─► Google services → Firebase ($0-25)
  │
  └─► CLI tool?
        └─► Go or Rust + GitHub Releases ($0)
```

---

## Red Flags to Watch

1. **"Just use AWS"** - Overkill for most projects, complex billing
2. **Kubernetes for MVP** - You don't need it yet
3. **Microservices early** - Start monolith, split later
4. **Self-hosting everything** - Your time has value
5. **Newest framework** - Stable > shiny for production
6. **Enterprise DB for side project** - SQLite handles more than you think

---

## Legal-tech specific cost ranges

Pin these alongside the general stack tiers when grilling a legal app. Pick on volume, branding, and integration needs -- not on lowest sticker price.

### E-signature

| Provider | Typical cost | Best for |
|----------|--------------|----------|
| **HelloSign (Dropbox Sign)** | ~$15/mo Essentials, ~$25/mo Standard | Solo + small firm baseline |
| **DocuSign** | ~$10/mo Personal, ~$25/mo Standard, ~$40/mo Business | Default for most firms |
| **Adobe Sign / Acrobat Sign** | ~$15-25/user/mo bundled with Acrobat | Adobe shops |
| **PandaDoc** | $35-65/mo | Engagement letters with payment + branding |

### Practice management

| Tool | Cost | Notes |
|------|------|-------|
| **Clio Manage** | $79-129/user/mo | Industry default; deepest integration ecosystem |
| **MyCase** | $59-99/user/mo | Strong for plaintiff PI |
| **PracticePanther** | $59-99/user/mo | Solo / small firm budget pick |
| **Smokeball** | $99-179/user/mo | Microsoft-shop firms; deep Word/Outlook integration |
| **CosmoLex** | $99-119/user/mo | Built-in trust accounting; one-vendor stack |

### E-filing

- State court e-filing: many states free (Texas eFile, NY NYSCEF); some charge per-filing fees.
- Federal PACER: ~$0.10/page retrieval; CM/ECF filing typically free.
- Third-party EFM aggregators (One Legal, File & ServeXpress, FileTime): ~$5-15 per filing.

### Document storage

| Option | Cost | Notes |
|--------|------|-------|
| **S3** | ~$0.023/GB/mo + $0.09/GB egress | Cheapest; build folder semantics yourself |
| **Cloudflare R2** | ~$0.015/GB/mo + $0 egress | Cheapest if you serve documents back to users a lot |
| **Box for Business** | ~$15-35/user/mo | If firm already on Box |
| **NetDocuments** | ~$50+/user/mo | Mid-market firms; legal-aware |
| **iManage** | Enterprise pricing | Large firms; deep Word integration |

### LLM APIs

| Model | Approximate cost (input / output per 1M tokens) | Notes |
|-------|-------------------------------------------------|-------|
| **Claude Sonnet** | ~$3 / ~$15 per 1M tokens | Default for legal long-context work |
| **Claude Opus** | ~$15 / ~$75 per 1M tokens | High-stakes drafting and review |
| **Claude Haiku** | ~$0.80 / ~$4 per 1M tokens | High-volume classification / extraction |
| **GPT-4o** | ~$2.50 / ~$10 per 1M tokens | Comparable to Sonnet on cost |

Allocate LLM cost per matter. Use prompt caching for long-doc workflows (Anthropic prompt caching cuts repeated-context cost ~10x). Confirm BAA / DPA and no-training clauses before sending privileged content.

### Court calendar / deadlines

- **LawToolBox**: ~$30-80/user/mo depending on jurisdictions covered.
- **CourtRules**: ~$50-200/mo for typical small firm.
- **Smokeball deadline assistant**: bundled with Smokeball.
- **DIY rules tables**: free, but engineering and legal-research effort to maintain across jurisdictions.

### Trust accounting / IOLTA

- **LawPay**: ~$20/mo + transaction fees (~2.95% cards / ~$1.95 ACH); IOLTA-aware.
- **LeanLaw**: $40-60/user/mo; pairs well with QuickBooks Online for trust-aware GL.
- **TrustBooks**: ~$49+/mo; standalone trust accounting.
- **CosmoLex / Clio Manage**: native trust accounting bundled.

### CRM / intake

- **Clio Grow**: ~$49-89/user/mo; pairs with Clio Manage.
- **Lawmatics**: ~$129+/mo; marketing automation focus.
- **HubSpot**: free starter; $20+/mo for teams.

### Email and add-ins

- **Outlook / M365 Business**: ~$6-22/user/mo.
- **Google Workspace**: ~$6-18/user/mo.
- **Save-to-matter add-ins**: build in-house or buy via PMS (Clio, Smokeball, MyCase all ship Outlook add-ins).

### Recommended defaults by audience (cost stack)

- **Solo attorney (~$200-350/mo all-in)**: HelloSign + Clio Manage solo + LawPay + Google Workspace + S3 + Anthropic Claude with redaction + LawToolBox.
- **Small firm 5 users (~$1,200-2,000/mo all-in)**: DocuSign Business + Clio Manage + LawPay + LeanLaw + Google or M365 + S3 or NetDocuments + Anthropic Claude (BAA) + LawToolBox + One Legal.
- **In-house legal team**: leverage existing corporate licenses (M365, Adobe, Okta, Bedrock); spend goes to build vs buy of the legal-specific layer.
