import {type Middleware} from 'koa';
import Stripe from 'stripe';
import {config, stripeSchema} from '../../config/index.js';

const stripeConfig = stripeSchema.parse(config.stripe);

const stripe = new Stripe(stripeConfig.secretKey);

export const post: Middleware = async (ctx, next) => {
  // Only verify the event if you have an endpoint secret defined.
  // Otherwise use the basic event deserialized with JSON.parse
  // Get the signature sent by Stripe
  const signature = ctx.headers['stripe-signature'];

  if (!signature) {
    throw new Error('Webhook signature missing.');
  }

  if (!ctx.request.rawBody) {
    throw new Error('Request body missing.');
  }

  const event = stripe.webhooks.constructEvent(
    ctx.request.rawBody,
    signature,
    stripeConfig.endpointSecret,
  );

  if (!event) {
    ctx.status = 400;
    return;
  }

  // Handle the event
  // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
  switch (event.type) {
    default: {
      // Unexpected event type
      ctx.log.warn(`Unhandled event type ${event.type}.`);
    }
  }

  // Return a 200 response to acknowledge receipt of the event
  ctx.status = 200;
};
