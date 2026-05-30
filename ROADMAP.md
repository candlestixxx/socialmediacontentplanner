# ROADMAP

## Current State
Phase 19: Final MVP Assembly completed.
v2.0 Structural Integrations completed:
- Core AI Generation engines (OpenAI, Claude, Gemini SDKs) implemented.
- Core Social Media posting providers (Twitter, LinkedIn, Meta adapters) architected.
- NextAuth Database authentication established.
- Web API routing centralized.

## Future Plans (v2.1)
- Write explicit OAuth 2.0 PKCE connection workflows for the Social Media platforms.
- Wire up Stripe webhook handlers inside `packages/billing`.
- Connect BullMQ for background scheduled posting workers in `packages/jobs`.
- Deploy Postgres & Redis cache layers.