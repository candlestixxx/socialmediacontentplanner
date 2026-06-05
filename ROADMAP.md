# ROADMAP.md: Structural Milestones

**Phase 1: Foundation Build (COMPLETED)**
- Monorepo setup with Next.js, Expo, and shared packages.
- Global Types and Database Models defined in Prisma.

**Phase 2: Authentication & Security Hardening (COMPLETED)**
- NextAuth configuration.
- Native Node Crypto implementation for password hashing to prevent dependencies conflicts.
- SSRF checks in RAG architecture.
- JWT Bearer Token validation.

**Phase 3: Core NLP & Content Generation (COMPLETED)**
- OpenAI, Claude, and Gemini bindings.
- NLP Command parser utilizing Zod to map strings directly to database operations.

**Phase 4: Mobile Parity (UPCOMING)**
- **Goal:** Ensure every view in `apps/web/src/app` has a corresponding native screen in `apps/mobile/src/screens`.
- **Status:** Basic navigation is complete, but complex nested structures (like Campaign drag-and-drop) need a React Native equivalent (likely a list-based management screen).

**Phase 5: Real Social Integrations (UPCOMING)**
- Connect Meta Graph API, X API, and LinkedIn API.
- Re-architect `packages/jobs/workers` to execute real API calls using the stored `SocialAccount.accessToken`.

**Phase 6: Finance & Accounting Export (LATER)**
- Map `AdSpend` and `RevenueRecord` queries to downloadable CSVs and QuickBooks integrations.
