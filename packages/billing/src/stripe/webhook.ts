import Stripe from 'stripe';

const stripeSecret = process.env.STRIPE_SECRET_KEY || 'sk_test_mock';
export const stripe = new Stripe(stripeSecret, {
  apiVersion: '2024-10-28.acacia',
});

export const handleStripeWebhook = async (rawBody: string | Buffer, signature: string, webhookSecret: string) => {
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err: any) {
    throw new Error(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(`[Stripe] Checkout completed for session: ${session.id}`);
      // TODO: Update database subscription status
      break;
    }
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      console.log(`[Stripe] Subscription updated: ${subscription.id} - Status: ${subscription.status}`);
      // TODO: Update database subscription status
      break;
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      console.log(`[Stripe] Subscription canceled: ${subscription.id}`);
      // TODO: Downgrade user in database
      break;
    }
    default:
      console.log(`[Stripe] Unhandled event type ${event.type}`);
  }

  return { success: true, type: event.type };
};
