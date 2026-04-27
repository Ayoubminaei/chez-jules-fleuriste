import "server-only";
import Stripe from "stripe";

export const stripeSecret = process.env.STRIPE_SECRET_KEY;

export function isStripeConfigured() {
  return Boolean(stripeSecret);
}

let _stripe: Stripe | null = null;
export function getStripe(): Stripe | null {
  if (!stripeSecret) return null;
  if (!_stripe) {
    _stripe = new Stripe(stripeSecret, {
      apiVersion: "2026-03-25.dahlia",
      typescript: true,
    });
  }
  return _stripe;
}

export function siteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000"
  );
}
