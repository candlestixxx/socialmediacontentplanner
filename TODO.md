# TODO

## High Priority
- Replace `test@example.com` NextAuth mock logic in `apps/web/src/app/api/auth/[...nextauth]/route.ts` with a fully configured JWT or Database session adapter payload reading from real UI login.
- Connect `packages/jobs/src/workers/social.ts` to execute the publish commands from `packages/social/src/providers/*` when a scheduled job pops off the Redis queue.

## Medium Priority
- Connect the frontend Dashboard to the `GET /analytics` module.
- Swap out the Prisma `default_ws` placeholder queries in `packages/api/src/routes` to use the `req.user.workspaceId` once the Auth middleware JWT validation is finalized.
- Connect the mock checkout button in `apps/web/src/app/settings/billing` to generate a real Stripe Checkout Session via `stripe.checkout.sessions.create()`.

## Low Priority
- Update `apps/mobile` UI layouts and styling with proper Tailwind or native StyleSheet bindings.
- Enhance the AI RAG web scraper to handle Javascript-rendered HTML (consider a lightweight playwright layer if required in the future, though node `https` is currently used).