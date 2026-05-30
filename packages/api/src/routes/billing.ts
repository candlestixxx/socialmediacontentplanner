import { Router } from 'express';

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
router.post('/checkout', (req, res) => {
  const { planId } = req.body;
  // This would integrate with Stripe Checkout or PayPal in a real implementation.
  // It returns a mock checkout URL.
  res.json({ url: 'https://checkout.stripe.com/mock-url' });
});

export const billingRouter = router;
