import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;
const url = process.env.STRIPE_WEBHOOK_URL;

if (!key) {
  throw new Error("STRIPE_SECRET_KEY is missing.");
}
if (!url) {
  throw new Error("STRIPE_WEBHOOK_URL is missing.");
}

const stripe = new Stripe(key);

const endpoint = await stripe.webhookEndpoints.create({
  url,
  connect: true,
  enabled_events: [
    "checkout.session.completed",
    "checkout.session.async_payment_succeeded",
    "account.updated",
  ],
});

console.log("Webhook signing secret:");
console.log(endpoint.secret);
