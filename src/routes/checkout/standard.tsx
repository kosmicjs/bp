import Stripe from 'stripe';
import {type Middleware} from 'koa';
import {config} from '../../config/index.js';

const stripe = new Stripe(config.stripe.secretKey, {});

const YOUR_DOMAIN = 'http://localhost:3000';

export const get: Middleware = async function (ctx) {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: 'price_1NYuYcJJzeeflZ62zQNVGKop',
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${YOUR_DOMAIN}/success`,
    cancel_url: `${YOUR_DOMAIN}/cancel`,
  });

  if (!session.url) {
    throw new Error('No session URL');
  }

  if (!ctx.state.session?.url) {
    throw new Error('No session URL');
  }

  ctx.redirect(ctx.state.session.url);

  ctx.redirect(session.url);
};
