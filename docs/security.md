# Security Safeguards for ContentCommand AI

## 1. Secrets Management
- All keys must be stored in `.env` files.
- `.env` files are in `.gitignore` and NEVER committed.
- API keys are not shipped in mobile or web frontend bundles.
- Use `.env.example` as a template for required keys.

## 2. API Validation and Rate Limiting
- Input fields MUST be validated before database processing using `Zod` or Prisma built-ins.
- Global rate-limiting middleware should be applied to public API endpoints.
- Scrape bots and excessive requests must be rejected.

## 3. Data Ownership & RBAC
- Users are assigned roles (e.g. `OWNER`, `ADMIN`, `MEMBER`).
- Content objects (Posts, Campaigns) belong strictly to a `Workspace`.
- Access checks ensure Users cannot retrieve objects for a Workspace they do not belong to.

## 4. Payment Compliance
- Never store raw credit card numbers.
- Use tokenized APIs (e.g., Stripe Elements).
- Offload PCI compliance to the payment gateway.
