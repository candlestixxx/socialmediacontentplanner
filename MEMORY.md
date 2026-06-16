# MEMORY

## Core Architectures & Preferences
- **Database Fallbacks:** When running tests or local environments without a running PostgreSQL database, we use a custom Proxy client that simulates Prisma CRUD operations in-memory. This prevents test suite initialization crashes.
- **Mock DB Singleton:** The custom MockPrismaClient must remain a singleton within the test runner process so that the Express routes and supertest assertions reference the exact same memory tables.
- **Provider Wrapping:** NextAuthProvider must be wrapped at the root layout level (`apps/web/src/app/layout.tsx`) so NextAuth session data propagates properly.
- **AI Fallbacks:** OpenAIProvider supports structured JSON parsing fallbacks and returns standardized zod structures if OpenAI keys are absent.