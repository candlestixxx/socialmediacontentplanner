# Changelog

All notable changes to this project will be documented in this file.

## [v5.2.0] - 2026-07-19

### Added
- **Web Settings UI:** Completed Phase 25 (v5.2.0). Replaced the placeholder `/settings` page in the Next.js frontend with a fully interactive layout utilizing robust ShadCN components for updating Profile, Preferences, and Security details.
- **Testing Framework Finalization:** Deprecated the SQLite database migration idea due to technical blockers (Prisma Enum constraints), certifying the robust MockPrismaClient proxy as the permanent testing architecture.

## [v5.1.0] - 2026-07-18

### Added
- **Multimodal AI Scraper:** Successfully launched Phase 24 (v5.1.0). The web scraping engine inside `packages/ai` now natively intercepts and parses `<img>` tags to extract visual context (source URLs and Alt texts). This metadata is compiled into a structured block and appended to the LangChain token chunker, enabling the core RAG processor to 'see' and describe images during content generation.


## [v5.0.0] - 2026-07-12

### Added
- **Live WebSocket Sync:** Successfully launched Phase 23 (v5.0.0). The Express backend now features a native `ws` WebSocket server simulating real-time job processing from the queue. The `Campaigns` UI in the Next.js client connects to this socket on load and displays a dynamic, pulsing `Live Sync` indicator representing the immediate backend processing state.


## [v4.7.0] - 2026-07-09

### Added
- **Mobile Native Previews:** Implemented the IDEAS.md request for a Mobile Native Preview Renderer. The `PostReview.tsx` screen now features an interactive tab layout that renders high-fidelity styled mockups of Twitter and LinkedIn post cards so users can see exactly how their AI-generated content will look before scheduling.


## [v4.6.0] - 2026-07-08

### Added
- **Analytics Web UI:** Refactored the Next.js Analytics dashboard (`apps/web/src/app/analytics/page.tsx`) to fetch and display dynamic metric data from the Express backend via `apiClient`, replacing the placeholder mock data.


## [v4.5.0] - 2026-07-02

### Added
- **AWS ECS Deployment:** Added AWS ECS orchestration settings to the `docker-compose.yml` file including the API container configuration and x-aws configuration parameters.
- **Langchain Text Chunking:** Refactored the `packages/ai` Web Scraper to utilize LangChain's `RecursiveCharacterTextSplitter` to chunk massive articles efficiently to avoid AI model token limits.


## [v4.4.0] - 2026-07-01

### Added
- **Mobile Screens Styled:** Completed the UI implementation for the mobile application screens including Analytics, Login, Notifications, QuickCreate, and Settings, utilizing standard StyleSheet configurations.

## [v4.3.0] - 2026-06-05

### Added
- **Learning Center:** Created a premium `/learning-center` page with structured, interactive tutorials for AI Studio, Podcast Studio, Video Studio, Brand Kit, and Landing Pages.
- **Contextual Help Overlay:** Integrated a floating, page-aware instructions card in the `Topbar` that displays real-time tips and descriptions based on the active path.
- **Test Suite Sanitation:** Refactored mock database layer to use a singleton proxying mechanism, stabilizing all 35 Jest integration tests and fixing previous validation status code crashes.
- **Root Layout auth binding:** Wrapped the Next.js `RootLayout` in `NextAuthProvider` to enable consistent session states.

## [v4.2.0] - 2026-05-25

### Added
- **AI Command Parser:** Built the `ContentCommandParser` utilizing `zod` schemas (`CommandSchema`) to map unstructured user NLP prompts (e.g. "Write a funny tweet") into strict JSON parameters (topic, tone, platforms, contentType).
- **AI Parser Endpoint:** Exposed the parsing class through a new Express route `POST /ai/parse-command` inside `packages/api`.

## [v4.1.0] - 2026-05-25

### Added
- **Mobile Auth Flows:** Refactored `apps/mobile/src/screens/Welcome.tsx` to handle OAuth routing and Mock Demo logins, mirroring the NextAuth configurations.
- **Native Campaigns UI:** Completely rewrote `apps/mobile/src/screens/Campaigns.tsx` (Calendar) from static text to a dynamic Native View, pulling PostgreSQL campaigns via the `apiClient` with Pull-to-Refresh controls.

## [v4.0.0] - 2026-05-25

### Added
- **Mobile UI Overhaul:** Initiated the v4 UI roadmap. Ripped out the static MVP boilerplate from `apps/mobile` (specifically Dashboard and QuickVideo screens) and rebuilt them using robust Native StyleSheets.
- **Mobile Graceful Degradation:** Rewired all mobile fetch parameters to use the `apiClient` (`EXPO_PUBLIC_API_URL`), adding try/catch states to ensure the app does not crash when the backend is offline.

## [v3.2.0] - 2026-05-25

### Added
- **Database Persistence:** Overhauled the Express `/posts` router to utilize real Prisma queries, allowing the Next.js Campaigns and Quick Create dashboards to save data dynamically.
- **Authentication:** Hardened the NextAuth proxy logic by binding the JWT generation loop directly to the Prisma `User` table.

## [v3.1.0] - 2026-05-25

### Added
- **Analytics Engine:** Completed the v3.1 integration by migrating the Web Dashboard from static placeholders to a live dynamic component. It now queries the `packages/api/src/routes/analytics.ts` Express endpoint which fetches and aggregates real PostgreSQL analytics metrics via Prisma.

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