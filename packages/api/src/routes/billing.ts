import { Router } from 'express';
import express from 'express';
import { handleStripeWebhook } from '@contentcommand/billing';

const router = Router();

// Mock store for payment methods and subscriptions
let currentSubscription = {
  id: 'sub_123',
  planName: 'Pro Creator',
  status: 'active',
  billingCycle: 'monthly',
  amount: 29.99,
  nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
};

const mockPaymentMethods = [
  { id: 'pm_1', provider: 'STRIPE', last4: '4242', isDefault: true },
  { id: 'pm_2', provider: 'PAYPAL', email: 'user@example.com', isDefault: false }
];

// GET /billing/subscription
router.get('/subscription', (req, res) => {
  res.json(currentSubscription);
});

// GET /billing/payment-methods
router.get('/payment-methods', (req, res) => {
  res.json(mockPaymentMethods);
});

// POST /billing/payment-methods
router.post('/payment-methods', (req, res) => {
  const { provider, last4, email } = req.body;
  const newMethod = {
    id: `pm_${Date.now()}`,
    provider,
    last4,
    email,
    isDefault: mockPaymentMethods.length === 0,
  };
  mockPaymentMethods.push(newMethod);
  res.status(201).json(newMethod);
});

// DELETE /billing/payment-methods/:id
router.delete('/payment-methods/:id', (req, res) => {
  const index = mockPaymentMethods.findIndex(p => p.id === req.params.id);
  if (index !== -1) {
    mockPaymentMethods.splice(index, 1);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Payment method not found' });
  }
});


// POST /billing/checkout
router.post('/checkout', async (req, res) => {
  const { planId, successUrl, cancelUrl } = req.body;

  if (!process.env.STRIPE_SECRET_KEY) {
    console.warn('[Billing] No Stripe key found. Returning mock URL.');
    return res.json({ url: 'https://checkout.stripe.com/mock-url' });
  }

  try {
    const { stripe } = require('@contentcommand/billing');

    // Map plan IDs to real Stripe Price IDs (ideally from DB)
    const priceIdMap: Record<string, string> = {
      'pro-creator': 'price_mock_pro_123',
      'agency': 'price_mock_agency_456'
    };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceIdMap[planId] || 'price_mock_default',
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl || 'http://localhost:3000/settings/billing?success=true',
      cancel_url: cancelUrl || 'http://localhost:3000/settings/billing?canceled=true',
    });

    res.json({ url: session.url });
  } catch (error: any) {
    console.error('[Stripe Checkout Error]', error);
    res.status(500).json({ error: error.message });
  }
});
// POST /billing/webhook
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test';

  if (!sig) return res.status(400).send('Missing Stripe signature');

  try {
    const result = await handleStripeWebhook(req.body, sig as string, webhookSecret);
    res.json(result);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

export const billingRouter = router;
