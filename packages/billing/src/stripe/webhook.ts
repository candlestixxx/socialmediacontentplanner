import Stripe from 'stripe';

const stripeSecret = process.env.STRIPE_SECRET_KEY || 'sk_test_mock';
export const stripe = new Stripe(stripeSecret, {
  apiVersion: '2024-10-28.acacia' as any,
});

export const handleStripeWebhook = async (rawBody: string | Buffer, signature: string, webhookSecret: string) => {
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err: any) {
    throw new Error(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const organizationId = session.metadata?.organizationId || session.client_reference_id;
      const plan = session.metadata?.plan || 'PROFESSIONAL';

      if (organizationId) {
        try {
          const { prisma } = await import('@contentcommand/database');
          await prisma.organization.update({
            where: { id: organizationId },
            data: {
              plan,
              stripeCustomerId: session.customer as string,
              subscriptionStatus: 'active',
            },
          });
          console.log(`[Stripe] Upgraded org ${organizationId} to ${plan}`);
        } catch (e: any) {
          console.error('[Stripe] DB update failed:', e.message);
        }
      }
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      const organizationId = subscription.metadata?.organizationId;

      if (organizationId) {
        try {
          const { prisma } = await import('@contentcommand/database');
          const isActive = subscription.status === 'active' || subscription.status === 'trialing';
          await prisma.organization.update({
            where: { id: organizationId },
            data: {
              plan: isActive ? subscription.metadata?.plan || 'PROFESSIONAL' : 'FREE',
              subscriptionStatus: subscription.status,
            },
          });
        } catch (e: any) {
          console.error('[Stripe] DB update failed:', e.message);
        }
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const organizationId = subscription.metadata?.organizationId;

      if (organizationId) {
        try {
          const { prisma } = await import('@contentcommand/database');
          await prisma.organization.update({
            where: { id: organizationId },
            data: { plan: 'FREE', subscriptionStatus: 'canceled' },
          });
        } catch (e: any) {
          console.error('[Stripe] DB update failed:', e.message);
        }
      }
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      const organizationId = invoice.metadata?.organizationId;
      if (organizationId) {
        try {
          const { prisma } = await import('@contentcommand/database');
          await prisma.organization.update({
            where: { id: organizationId },
            data: { subscriptionStatus: 'past_due' },
          });
        } catch (e: any) { /* non-critical */ }
      }
      break;
    }

    default:
      console.log(`[Stripe] Unhandled event type ${event.type}`);
  }

  return { success: true, type: event.type };
};

/**
 * Creates a Stripe Checkout session for a subscription plan.
 */
export async function createCheckoutSession(params: {
  organizationId: string;
  plan: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<string> {
  const { organizationId, plan, priceId, successUrl, cancelUrl } = params;

  let customerId: string;
  try {
    const { prisma } = await import('@contentcommand/database');
    const org = await prisma.organization.findUnique({ where: { id: organizationId } });
    if (!org) throw new Error('Organization not found');

    customerId = org.stripeCustomerId || '';
    if (!customerId) {
      const customer = await stripe.customers.create({
        metadata: { organizationId },
      });
      customerId = customer.id;
      await prisma.organization.update({
        where: { id: organizationId },
        data: { stripeCustomerId: customerId },
      });
    }
  } catch (e) {
    customerId = '';
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId || undefined,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { organizationId, plan },
    subscription_data: { metadata: { organizationId, plan } },
  });

  return session.url || '';
}
