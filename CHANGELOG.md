# Changelog

All notable changes to this project will be documented in this file.


## [v3.0.0] - 2026-05-25

### Added
- **Stripe Checkout:** Refactored `packages/api/src/routes/billing.ts` `POST /checkout` endpoint to use the real `stripe.checkout.sessions.create()` API.
- **Social Job Workers:** Wired `packages/jobs/src/workers/social.ts` to live-query the Prisma database for Post content and publish it via the newly structured `@contentcommand/social` validation adapters.

## [v2.7.0] - 2026-05-25

### Added
- **Mobile Integration:** Empowered the React Native app to make API calls to the backend via a centralized `apps/mobile/src/lib/api.ts` module handling `EXPO_PUBLIC_API_URL` and native localhost/10.0.2.2 emulator loops.
- **Web UI Overhauls:** Built the missing `Quick Create` interface to allow saving posts as drafts, and connected the static Campaigns calendar view directly to the Prisma database backend.

## [v2.6.0] - 2026-05-25

### Added
- **Security:** Integrated `express-rate-limit`, `rate-limit-redis`, and `ioredis` into the Express API (`packages/api`). Replaced the v1.0 mock rate limiter with a production-ready implementation backed by a standalone Redis connection.

## [v2.5.0] - 2026-05-25

### Added
- **Podcast Studio:** Completely re-implemented the Next.js UI (`apps/web/src/app/podcast-studio/page.tsx`) and Express API route (`/podcasts/generate`). Stripped out the mock systems and wired it to dynamically generate outlines, segment topics, and guest questions using the live `OpenAIProvider`.

## [v2.4.0] - 2026-05-25

### Added
- **RAG Engine:** Replaced mock context strings with a live HTML scraper (`packages/ai/src/research/scraper.ts`) that extracts visible text from user-provided URLs to augment AI generation.
- **AI Studios:** Completely re-implemented the Next.js UIs and Express API routes for the core Content Studio (`/ai/generate`) and Video Studio (`/video-projects/generate`), ripping out the mock systems and wiring them to the live official `OpenAIProvider`.

## [v2.2.0] - 2026-05-25

### Added
- **Global State Management:** Integrated `zustand` into `apps/web/src/store` and successfully wired a global `<Topbar />` layout component to manage multi-tenant workspace state across the UI.
- **Database Persistence:** Refactored Express APIs (`packages/api/src/routes/campaigns.ts`) to execute real CRUD operations utilizing the `@contentcommand/database` Prisma client instead of in-memory dummy arrays. Expanded schema to support `@next-auth/prisma-adapter`.
- **Mobile Layout:** Architected the React Native Expo app (`apps/mobile`) utilizing a centralized bottom-tab navigation hierarchy to bind the scaffolded MVP screens together.

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