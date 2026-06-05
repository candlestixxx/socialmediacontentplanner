# CHANGELOG.md

**Version:** 5.0.0
**Date:** May 25, 2026

**[v5.0.0] - Security Hardening & Handoff Preparation**
- Added defensive SSRF protection to `scrapeUrlText` in `packages/ai/src/research/scraper.ts`.
- Patched critical Auth Bypass vulnerability in `apps/web/src/app/api/auth/[...nextauth]/route.ts` using Node `crypto`.
- Updated `packages/database/prisma/schema.prisma` with `passwordHash` field for Users.
- Hardened `packages/api/src/middleware/auth.ts` to strictly require Bearer tokens.
- Drafted global `VISION.md`, `MEMORY.md`, `DEPLOY.md`, `IDEAS.md`, `ROADMAP.md`, `TODO.md`, and `HANDOFF.md`.

**[v4.4.0] - Integration Testing Framework**
- Implemented `supertest` for end-to-end API validations targeting AI generation and Campaign creation.

**[v4.0.0] - Zod NLP Parser & Redis Queues**
- Migrated core AI module to handle natural language structured generation.
- Added Redis rate limiting middleware.

*(For historical logs, refer to GitHub commits prior to v4.0.0)*
