# TODO.md: Immediate Granular Fixes & Minor Features

- [ ] **Job Queue Realization:** Connect `packages/jobs/workers` to actual platform APIs (Facebook, Twitter) instead of simply logging "Mock publish successful".
- [ ] **Billing Webhooks:** The `packages/billing` webhook currently stubs out Stripe. Need to connect the real Stripe CLI and map the `invoice.payment_succeeded` event to the `SubscriptionPlan` model.
- [ ] **React Native Rehydration:** Ensure Zustand state in `apps/mobile` correctly rehydrates from `AsyncStorage` upon app restart to prevent login loops.
- [ ] **API Endpoint Coverage:** `packages/api/tests` currently only covers the `/ai/parse-command` and `/campaigns` routes. We need to add tests for `/social`, `/finance`, and `/brand-kits`.
- [ ] **NextAuth JWT Expiry:** Implement logic in `apps/web` to handle silent token refresh when the user's JWT expires.
