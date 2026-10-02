import { Router, raw } from 'express';
import { handleStripeWebhook, createCheckoutSession } from '@contentcommand/billing';

const router = Router();

const PLAN_PRICES: Record<string, string> = {
  STARTER: process.env['STRIPE_PRICE_STARTER'] || 'price_starter_monthly',
  PROFESSIONAL: process.env['STRIPE_PRICE_PROFESSIONAL'] || 'price_professional_monthly',
  ENTERPRISE: process.env['STRIPE_PRICE_ENTERPRISE'] || 'price_enterprise_monthly',
};

// POST /billing/checkout — create Stripe Checkout session
router.post('/checkout', async (req, res) => {
  try {
    const { organizationId, plan, successUrl, cancelUrl } = req.body;
    if (!organizationId || !plan) {
      return res.status(400).json({ error: 'organizationId and plan required' });
    }

    const priceId = PLAN_PRICES[plan];
    if (!priceId) {
      return res.status(400).json({ error: 'Unknown plan: ' + plan });
    }

    const url = await createCheckoutSession({
      organizationId,
      plan,
      priceId,
      successUrl: successUrl || (process.env['APP_URL'] || 'http://localhost:3000') + '/billing?success=true',
      cancelUrl: cancelUrl || (process.env['APP_URL'] || 'http://localhost:3000') + '/billing?canceled=true',
    });

    return res.json({ url });
  } catch (err: any) {
    console.error('Checkout error:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

// POST /billing/webhook — Stripe webhook receiver
router.post('/webhook', raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['stripe-signature'] as string;
    const result = await handleStripeWebhook(req.body, signature, process.env['STRIPE_WEBHOOK_SECRET'] || '');
    return res.json(result);
  } catch (err: any) {
    console.error('Webhook error:', err.message);
    return res.status(400).json({ error: err.message });
  }
});

// GET /billing/subscription
router.get('/subscription', async (req, res) => {
  try {
    const { prisma } = await import('@contentcommand/database');
    const orgId = (req as any).organizationId || 'default';
    const org = await prisma.workspace.findUnique({ where: { id: orgId } }).catch(() => null);
    return res.json({
      plan: org?.plan || 'FREE',
      status: org?.subscriptionStatus || 'inactive',
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
export { router as billingRouter };
