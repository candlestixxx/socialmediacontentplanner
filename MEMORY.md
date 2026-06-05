# MEMORY.md: Internal Architecture & Observations

**Architecture Summary:**
-   **Monorepo:** Turborepo-style structure organizing `apps/web` (Next.js), `apps/mobile` (Expo React Native), and `packages/*` (shared logic).
-   **Database:** Prisma ORM connected to PostgreSQL. The schema is massive and deeply relational, tracking Users, Workspaces, Campaigns, Posts, AdSpends, and AIProviderSettings.
-   **API:** Express backend (`packages/api`) handling complex orchestration, protected by Redis rate-limiting and standard Bearer token validation.
-   **AI Engine:** The `packages/ai` module is sophisticated. It supports Gemini, Claude, and OpenAI. It includes a custom NLP Command Parser (`parseCampaignCommand`) that uses Zod to dynamically generate structured JSON arrays of posts based on natural language input.
-   **RAG/Scraping:** Custom `http/https` Node.js scraper implementing strict SSRF protection to prevent internal network scanning.

**Key Codebase Traits & Discoveries:**
-   **Testing Constraints:** Running the global test suite (`npm run test` from the root) causes critical bash session timeouts in the VM sandbox due to the sheer size of the monorepo. **Always run targeted tests within specific packages** (e.g., `cd packages/api && npm run test`).
-   **Authentication:** The system initially relied on a mock `mock_user_id` bypass. This has been remediated. NextAuth uses Prisma adapter, and the API middleware validates standard Bearer tokens. We implemented native Node `crypto` for password hashing to avoid `bcrypt` compilation issues in certain containerized environments.
-   **Diff/Git Issues:** The monorepo structure triggers large diff warnings in automated tools if `node_modules`, `dist`, `.next`, and `coverage` are not meticulously managed. The `.gitignore` is currently robust but requires vigilance.

**Design Preferences:**
-   Stick to TypeScript everywhere.
-   Rely on `Zod` for both API boundary validation and AI structural output enforcement.
