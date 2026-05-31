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

## Future Plans (v2.3)
- Enhance the AI Content Studio algorithms with direct RAG (Retrieval-Augmented Generation) injections using `packages/ai/src/research`.
- Expose the RAG capabilities via an explicit `/ai/generate` Express route.
- Re-implement the web dashboard AI Studio UI (`/ai-studio`) to act as the primary interface for content creation.