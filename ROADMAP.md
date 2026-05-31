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

## Future Plans (v2.3)
- Refactor the React Native mobile app (`apps/mobile`) to construct a robust Bottom Tab + Native Stack navigation hierarchy routing to the scaffolded screens.
- Enhance the AI Content Studio algorithms with direct RAG injections using `packages/ai/src/research`.