# EMET Platform

AI Guardian for Humanity -- a DAO-governed resilience platform built with Next.js, Supabase, and multi-provider AI.

## Deploy in 3 Steps

### 1. Set Up Supabase

1. Create a project at [app.supabase.com](https://app.supabase.com)
2. Go to **SQL Editor**, click "New Query"
3. Paste the contents of [`src/lib/db/schema.sql`](src/lib/db/schema.sql) and click **Run**
4. Go to **Settings > API** and copy:
   - **Project URL** (`NEXT_PUBLIC_SUPABASE_URL`)
   - **Anon public key** (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - **Service role key** (`SUPABASE_SERVICE_ROLE_KEY`) -- keep this secret

> The schema enables the `uuid-ossp` and `vector` (pgvector) extensions automatically. See [`src/lib/db/supabase-setup.md`](src/lib/db/supabase-setup.md) for detailed setup instructions.

### 2. Connect to Vercel

1. Import this repo from GitHub at [vercel.com/new](https://vercel.com/new)
2. Add these environment variables in the Vercel project settings:

| Variable | Required | Where to get it |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase dashboard > Settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase dashboard > Settings > API |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase dashboard > Settings > API (secret) |
| `GROQ_API_KEY` | Yes* | [console.groq.com](https://console.groq.com) (free, fastest way to get EMET talking) |
| `GOOGLE_GENERATIVE_AI_API_KEY` | No | [aistudio.google.com](https://aistudio.google.com) |
| `OPENAI_API_KEY` | No | [platform.openai.com](https://platform.openai.com) |
| `ANTHROPIC_API_KEY` | No | [console.anthropic.com](https://console.anthropic.com) |
| `WORLDMONITOR_API_URL` | No | Defaults to `https://worldmonitor.app` |
| `WORLDMONITOR_API_KEY` | No | For authenticated World Monitor access |
| `CRON_SECRET` | No | Protects the `/api/news/ingest` cron endpoint |
| `NEXT_PUBLIC_SOLANA_RPC_URL` | No | Defaults to devnet |
| `NEXT_PUBLIC_SOLANA_NETWORK` | No | Defaults to `devnet` |
| `JWT_SECRET` | No | Any random 32+ character string |

\* At least one AI provider key is required. Groq is recommended -- it's free and the fastest.

### 3. Deploy

Vercel builds and deploys automatically on every push. That's it.

## Local Development

```bash
cp .env.local.example .env.local
# Fill in your credentials in .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## AI Provider Fallback Chain

EMET uses a multi-provider architecture with automatic fallback:

- **Conversation**: Groq (Llama 3.1 70B) > Gemini 2.0 Flash > GPT-4o-mini > Claude 3.5 Sonnet
- **Analysis**: Gemini 2.0 Flash > Claude > GPT-4o-mini > Groq
- **Coding**: Claude 3.5 Sonnet > Gemini > GPT-4o-mini > Groq

Configure as many or as few providers as you want. The system picks the best available model for each task type and falls back automatically if one is unavailable.

## World Monitor Integration

EMET pulls real-time global intelligence from [World Monitor](https://github.com/SuessVilliano/worldmonitor) and feeds it into the `news_alerts` table. A Vercel Cron job runs every 10 minutes, polling 6 data sources:

| Source | World Monitor API | EMET Category |
|---|---|---|
| Social unrest | `/api/unrest/v1/list-unrest-events` | Contextual (water/energy/food/housing/finance/legal) |
| Armed conflict | `/api/conflict/v1/list-acled-events` | `legal` |
| Cyber threats | `/api/cyber/v1/list-cyber-threats` | `legal` |
| Energy prices | `/api/economic/v1/get-energy-prices` | `energy` |
| Internet outages | `/api/infrastructure/v1/list-internet-outages` | `finance` |
| Climate anomalies | `/api/climate/v1/list-climate-anomalies` | `water` / `food` |

Alerts are deduplicated against the last 24 hours. Threat levels map directly from World Monitor severity scores (LOW/MEDIUM/HIGH/CRITICAL).

**Endpoints:**
- `GET /api/news/alerts?category=energy&threat_level=high&limit=50` -- read alerts
- `POST /api/news/ingest` -- trigger ingestion manually (cron runs automatically)

## Database Schema

The schema in `src/lib/db/schema.sql` creates:

- `users` -- wallet-based accounts with roles and reputation
- `products` -- marketplace items (AWG, solar, food, housing)
- `proposals` / `votes` -- DAO governance
- `content` -- publishing pipeline (tweet, meme, blog, video)
- `channels` / `messages` -- community messaging
- `news_alerts` -- threat-level tracking by category
- `legal_documents` -- RAG semantic search with pgvector embeddings
- `uploaded_documents` -- user file uploads
- `audit_log` -- immutable SHA-256 hash-chained log with Solana anchoring
- `kill_switch_votes` -- emergency shutdown mechanism

## Project Structure

```
src/
  app/
    (app)/          # Authenticated routes (dashboard, chat, dao, marketplace, etc.)
    (auth)/         # Auth routes
    api/chat/       # Streaming AI chat endpoint
    api/news/ingest/ # World Monitor ingestion cron
    api/news/alerts/ # News alerts query endpoint
  components/
    core/           # AppShell, Sidebar, TopNav
    chat/           # ChatInterface, EmetAvatar
    dashboard/      # KPICard, NewsHeadlines, ActivityFeed
    dao/            # ProposalCard, VoteBreakdown
    marketplace/    # ProductCard, FilterTabs
    landing/        # Hero, FeatureCards
  lib/
    ai/             # Multi-LLM router, EMET persona
    db/             # Supabase client, schema.sql
    blockchain/     # DAO, kill-switch, audit ledger
    worldmonitor/   # World Monitor API client + mapper
```

## Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **Database**: Supabase (PostgreSQL + pgvector)
- **AI**: Vercel AI SDK with Groq, Google, OpenAI, Anthropic providers
- **Styling**: Tailwind CSS v4
- **State**: Zustand
- **News Intelligence**: [World Monitor](https://github.com/SuessVilliano/worldmonitor) (ACLED, GDELT, EIA, Cloudflare Radar, NASA FIRMS)
- **Deployment**: Vercel
