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

v2.3, v2.4, and v2.5 Integrations completed:
- Implemented live Retrieval-Augmented Generation (RAG) using a lightweight Node.js scraper.
- Built the live AI Content Studio Web UI routing real parameters to the Express backend.
- Re-architected the Video Studio UI and Backend to utilize the active `OpenAIProvider` for dynamic script generation.
- Re-architected the Podcast Studio (`/podcasts/generate`) to utilize the active AI providers, including dynamic host/guest inputs in the Web UI.

v2.6 Structural Integrations completed:
- Enhanced the Express API security by implementing a genuine Redis-backed Rate Limiter in `packages/api/src/middleware/auth.ts`, replacing the v1.0 mock.

v2.7 Structural Integrations completed:
- Built the "Quick Create" content module at `apps/web/src/app/content/new/page.tsx` for immediate posting/drafting.
- Refactored `apps/web/src/app/campaigns/page.tsx` to read dynamic DB data.
- Centralized API fetching logic for the React Native mobile app inside `apps/mobile/src/lib/api.ts` utilizing `EXPO_PUBLIC_API_URL` and native emulator loopbacks.

v3.0 Structural Integrations completed:
- Replaced dummy API billing endpoint with live Stripe Checkout generator.
- Connected BullMQ background worker to live-query the Postgres database and publish posts.

v3.1 Structural Integrations completed:
- Refactored the Dashboard Web UI to render live Postgres metrics (total views, likes, shares, and platform breakouts).
- Wired the Express `/analytics` endpoint to execute live Prisma aggregation queries.

v3.2 Structural Integrations completed:
- Re-architected NextAuth JWT callbacks to actively query the database for User existence upon mock login.
- Overhauled the `/posts` API endpoint to utilize the live Prisma connection, enabling the Web Dashboard to persist campaign drafts to PostgreSQL.


## Future Plans (v3.3)
- Execute remaining Technical Debt from `TODO.md`.
- Hook up the NextAuth Session Provider into the React tree (`apps/web/src/app/layout.tsx`) so protected routes block unauthorized access appropriately.
