# ContentCommand AI — Unified Content Studio

> **Merged project:** Combines ContentCommand AI (socialmediacontentplanner) + Legacy One Universal Content Platform (realestateprototype)
> All unique features from both projects are preserved. See `MERGE_GUIDE.md` for integration points.

An all-in-one AI-powered social media content planner, publishing platform, campaign manager, analytics dashboard, and mobile app — now with **universal business-type support** for Real Estate, E-Commerce, Restaurants, and General Business.

## Public Beta v6.1: Merged Platform

### Modules Available
- **Core Platform:** Auth, Multi-tenant Workspaces, Universal Business-Type Config
- **AI Studios:** Social Posts, Short Form Videos, Podcasts, AI Persona/Brand Voice
- **Growth:** Landing Page Builder, Brand Kits, Canva Integration
- **Management:** Campaigns & Calendar (drag-to-select), Draft Review, Notifications
- **Publishing:** Multi-platform OAuth (Twitter/X, LinkedIn, Meta, YouTube, TikTok), PKCE
- **Analytics:** Engagement metrics, Finance & Reports, Ad spend tracking
- **Mobile:** React Native app with Native Post Previews
- **Admin:** Stripe Billing, Rate Limiting, RBAC

## Unique From Legacy One (realestateprototype)
- **Universal Business-Type Switching** — dynamic UI/prompts/templates per industry
- **AI Persona Customization** — brand_voice extracted from past successful posts
- **Canva Deep Links** — "Design with Canva" in review flow
- **Drag-to-Select Calendar** — multi-date selection
- **AI Draft Review** — intercept and edit before scheduling

## Development Setup
```bash
npm install
npm run dev
```

## Key Documentation
| File | Purpose |
|---|---|
| `MERGE_GUIDE.md` | Integration points between merged projects |
| `VISION.md` | Product vision |
| `ROADMAP.md` | Development phases |
| `CHANGELOG.md` | Version history |
| `docs/user-manual.md` | End-user guide |
| `docs/compliance.md` | Platform compliance guidelines |
| `docs/security.md` | Security safeguards |
