# ROADMAP

## Current State
Phase 19: Final MVP Assembly completed.
v2.0 Structural Integrations completed:
- Core AI Generation engines (OpenAI, Claude, Gemini SDKs) implemented.
- Core Social Media posting providers (Twitter, LinkedIn, Meta adapters) architected.
- NextAuth Database authentication established.
- Web API routing centralized.

v2.1 Structural Integrations completed:
- Explicit OAuth 2.0 PKCE connection workflows for the Social Media platforms.
- Stripe webhook handlers wired inside `packages/billing` and API endpoints.
- BullMQ for background scheduled posting workers initialized in `packages/jobs`.
- Local Postgres & Redis instances provided via `docker-compose.yml`.

v2.2 Structural Integrations completed:
- Implemented `zustand` in the Next.js `apps/web` client for global state management (Workspaces, active UI context).
- Fleshed out the backend Prisma querying logic across API endpoints to actually persist generated AI content.
- Finalized the React Native mobile navigation layout using Bottom Tabs.

v2.3 and v2.4 Integrations completed:
- Implemented live Retrieval-Augmented Generation (RAG) using a lightweight Node.js scraper.
- Built the live AI Content Studio Web UI routing real parameters to the Express backend.
- Re-architected the Video Studio UI and Backend to utilize the active `OpenAIProvider` for dynamic script generation.

## Future Plans (v2.5)
- Re-architect the Podcast Studio (`/podcasts/generate`) to utilize the active AI providers.
- Upgrade the Web UI for the Podcast Studio to support dynamic host/guest parameter inputs.