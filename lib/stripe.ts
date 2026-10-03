import "server-only";
import Stripe from "stripe";
import { isSandboxKey } from "./book-commerce";

export function checkoutConfigured(): boolean {
  return process.env.STRIPE_CHECKOUT_ENABLED === "true" &&
    isSandboxKey(process.env.STRIPE_SECRET_KEY) &&
    Boolean(process.env.STRIPE_BOOK_PRICE_ID && process.env.STRIPE_WEBHOOK_SECRET && process.env.CHECKOUT_BASE_URL);
}

export function stripeClient(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!isSandboxKey(key)) throw new Error("Sandbox Stripe configuration is required.");
  return new Stripe(key!, { maxNetworkRetries: 2, timeout: 15_000 });
}

export function checkoutOrigin(): string {
  const url = new URL(process.env.CHECKOUT_BASE_URL || "");
  const local = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  if ((url.protocol !== "https:" && !(local && url.protocol === "http:")) || url.username || url.password) {
    throw new Error("Invalid checkout origin.");
  }
  return url.origin;
}
