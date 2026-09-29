# MERGE GUIDE — Content Studio (contentplanner + realestateprototype)

> This documents every integration point between the two merged content projects.
> **No feature, idea, or capability is dropped.** Everything below must be wired up.

---

## Architecture Decision

- **Base:** `socialmediacontentplanner` (ContentCommand AI) — 22+ phases, mobile app, billing, RAG, multi-platform OAuth
- **Ported in:** `realestateprototype` (Legacy One Universal Content Platform) — universal business switching, AI persona, Canva links

---

## Integration Points

### 1. Universal Business-Type Switching (KEY UNIQUE FEATURE)
**Source:** `realestateprototype/client-next/src/constants.ts` → `packages/config/business-types/business-types.ts`

The prototype's `businessTypes` configuration object dynamically adjusts UI, content templates, and AI prompts based on selected industry:
- Real Estate (listings, market reports, open houses)
- E-Commerce (products, promotions, sales)
- Restaurant (menus, specials, events)
- General Business (services, announcements)

**Action:** Port this config-driven approach into ContentCommand AI's workspace settings. Allow workspace-level business type selection that:
- Adjusts AI generation prompts
- Changes content templates/categories
- Customizes analytics dashboards
- Adapts the content calendar categories

### 2. AI Persona Customization (brand_voice)
**Source:** `realestateprototype/client-next/src/services/openai/index.ts` → `apps/web/src/lib/ai-persona-prompt.ts`

Users define a persistent `brand_voice` that gets injected into every AI prompt. Can also analyze past successful posts to establish brand tone.

**Action:** Merge into ContentCommand AI's existing Brand Kit system:
- Add "Analyze Past Posts" feature to extract brand voice
- Inject `brand_voice` into all AI generation calls (Content Studio, Video, Podcast)
- Store per-workspace in database

### 3. Canva Integration Deep Links
**Source:** `realestateprototype/client-next/src/components/ReviewModal.tsx` → `apps/web/src/components/draft-review-modal.tsx`

"Design with Canva" deep links in Review Drafts modal and Content Library cards.

**Action:** Add Canva deep-link buttons to ContentCommand AI's post review flow and media library.

### 4. Twitter SDK Real Publishing
**Source:** `realestateprototype/server/src/services/social/` (twitter-api-v2 conditional)

**Action:** Wire `twitter-api-v2` into ContentCommand AI's social publishing workers when credentials are available.

### 5. Drag-to-Select Calendar
**Source:** `realestateprototype/client-next/src/components/Calendar.tsx` → `apps/web/src/components/calendar-reference.tsx`

Click-and-drag bounding box for selecting multiple dates at once.

**Action:** Upgrade ContentCommand AI's Campaign Calendar with drag-to-select.

### 6. AI Draft Review Intercept
**Source:** `realestateprototype/client-next/src/components/ReviewModal.tsx`

Intercepts AI content generation before scheduling. Editable drafts with discard/approve flow.

**Action:** Add draft review step to ContentCommand AI's AI Studio generation flow.

### 7. Content Library Filtering + Sorting
**Source:** `realestateprototype/client-next/src/components/ContentLibrary.tsx` → `apps/web/src/components/content-library-reference.tsx`

Category filters (all, listing, report, social) + chronological sorting toggle.

**Action:** Enhance ContentCommand AI's content list with category filters and sort toggles.

### 8. Mock Background Publishing Worker Pattern
**Source:** `realestateprototype` (setInterval-based scheduling)

**Action:** Reference only — ContentCommand AI's BullMQ implementation is superior. Use prototype's event status tracking (scheduled → published) as UX reference.

---

## Unique Features Checklist

### From ContentCommand AI (contentplanner) — KEEP ALL
- [ ] Multi-Agent Workspace (NL commands → content)
- [ ] RAG web scraping (HTML + image context)
- [ ] AI Command Parser (zod NLP → JSON)
- [ ] Video Studio (Reel/TikTok scripts)
- [ ] Podcast Studio (outlines, guest questions)
- [ ] Brand Kits (voice rules, colors, banned words)
- [ ] Landing Page Builder
- [ ] Stripe Billing + Checkout
- [ ] BullMQ social publishing workers
- [ ] PKCE OAuth (Twitter, LinkedIn, Meta)
- [ ] React Native mobile app
- [ ] Mobile Native Previews
- [ ] Live WebSocket Sync
- [ ] Multimodal AI Scraper (images)
- [ ] Learning Center
- [ ] Contextual Help Overlay
- [ ] Finance & Reports
- [ ] AWS ECS deployment
- [ ] Redis rate limiting
- [ ] MockPrismaClient test infrastructure

### From Legacy One (realestateprototype) — ADD THESE
- [ ] Universal Business-Type Switching (Real Estate, E-Commerce, Restaurant, General)
- [ ] AI Persona Customization (brand_voice from past posts)
- [ ] Canva Integration deep links
- [ ] Twitter SDK real publishing
- [ ] Drag-to-Select Calendar
- [ ] AI Draft Review intercept flow
- [ ] Content Library category filters + sorting
- [ ] Dark Mode with CSS variables
- [ ] OAuth connect/status/disconnect backend pattern
- [ ] JWT Auth pattern (reference)
- [ ] Cross-platform build/start scripts

---

## Future Ideas (from both IDEAS.md)
- Third-party: Canva direct editing + HubSpot/Salesforce lead gen
- Mobile App Port (React Native for on-the-go approval) — already in contentplanner
- Server-Side Rendering for SEO — already in contentplanner (Next.js)
- SQLite transition [BLOCKED by Prisma Enum limitation]
