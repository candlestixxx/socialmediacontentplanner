# Changelog

All notable changes to this project will be documented in this file.

## [v2.2.0] - 2026-05-25

### Added
- **Global State Management:** Integrated `zustand` into `apps/web/src/store` and successfully wired a global `<Topbar />` layout component to manage multi-tenant workspace state across the UI.
- **Database Persistence:** Refactored Express APIs (`packages/api/src/routes/campaigns.ts`) to execute real CRUD operations utilizing the `@contentcommand/database` Prisma client instead of in-memory dummy arrays.

## [v2.1.1] - 2026-05-25

### Added
- **Social Connectors:** Fully implemented the OAuth 2.0 API routes (`/auth-url`, `/callback`) generating secure PKCE states and wiring them into the `apps/web` React frontend.

## [v2.1.0] - 2026-05-25

### Added
- **Global Versioning:** Transitioned to `VERSION.md` for a single source of truth regarding the build version.
- **Background Jobs:** Integrated `bullmq` and `ioredis` in `packages/jobs` to handle asynchronous scheduling and posting of social media content.
- **Payments:** Integrated `stripe` Node SDK in `packages/billing` with webhook parsing logic connected to the Express API (`/billing/webhook`).
- **OAuth Security:** Added standard PKCE challenge generation logic for future social media connections.

## [v2.0.0] - 2026-05-25

### Added
- **Core AI Integration:** Migrated the generation layer to utilize official SDKs for `@anthropic-ai/sdk`, `openai`, and `@google/generative-ai`. Implemented graceful fallbacks when environment keys are missing.
- **Authentication:** Integrated `next-auth` and `@next-auth/prisma-adapter` to secure the web client routes.
- **API Architecture:** Centralized frontend fetch logic into `apps/web/src/lib/api.ts` utilizing `NEXT_PUBLIC_API_URL`.
- **Social Connectors:** Built standard provider interfaces for Meta, LinkedIn, and Twitter in `packages/social`.

## [v1.0.0] - 2026-05-25

### Added
- **Initial MVP Release:** Completed the monolithic setup of ContentCommand AI (Phases 1-19).
- **Frontend Hub:** Built the Next.js UI for the Campaign Calendar, Landing Pages, Analytics, Notifications, and AI Studios (Video/Podcast).
- **Backend:** Built out the Prisma Postgres schemas, and Express API routing.