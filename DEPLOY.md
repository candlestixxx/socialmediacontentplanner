# DEPLOY.md: Environment & Deployment Instructions

**Prerequisites:**
-   Node.js v18+
-   PostgreSQL v14+
-   Redis Server
-   API Keys (OpenAI, Claude, Gemini, Stripe, NextAuth Secret)

**Local Development Setup:**
1.  **Clone & Install:**
    `git clone <repo_url>`
    `cd contentcommand-ai`
    `npm install`
2.  **Environment Variables:**
    Copy all `.env.example` files to `.env` across the monorepo root and within specific packages (`packages/database`, `apps/web`). Populate `DATABASE_URL` and `REDIS_URL`.
3.  **Database Migration & Seeding:**
    `cd packages/database`
    `npx prisma migrate dev --name init`
    `npx prisma generate`
    `npx prisma db seed`
4.  **Start Services:**
    `npm run dev &` (Run the Next.js frontend and Express API concurrently)

**Production Deployment Target Architecture (Vercel + Render + Supabase):**
-   **Frontend (apps/web):** Deploy to Vercel. Set standard Node environment. Vercel automatically detects Next.js.
-   **Backend (packages/api & packages/jobs):** Deploy Express/Node server to Render or a DigitalOcean droplet. The Job Workers must be constantly running background processes.
-   **Database:** Supabase Postgres or AWS RDS.
-   **Redis:** Upstash or AWS ElastiCache.

**Critical Deployment Notes:**
-   Ensure the `.env` loaded into the production backend has SSRF protections enabled and `NODE_ENV` set to `production`.
-   Run `npx prisma migrate deploy` during the CI/CD pipeline, *not* `migrate dev`.
