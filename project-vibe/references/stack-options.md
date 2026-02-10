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
