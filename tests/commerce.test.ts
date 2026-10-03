import { test } from "node:test";
import assert from "node:assert/strict";
import Stripe from "stripe";
import { BOOK, checkoutParameters, isSandboxKey, matchesBookOrder } from "../lib/book-commerce";
import { recordBookPayment } from "../lib/stripe-orders";

function order(overrides = {}) {
  return {
    id: "cs_test_fixture", livemode: false, mode: "payment", status: "complete",
    payment_status: "paid", payment_intent: "pi_fixture", currency: "sek",
    amount_subtotal: 15000, amount_total: 18000,
    total_details: { amount_shipping: 3000 },
    metadata: { integration: BOOK.integration },
    collected_information: { shipping_details: { address: { country: "SE" } } },
    ...overrides,
  } as unknown as Stripe.Checkout.Session;
}

function fakeStripe(session: Stripe.Checkout.Session, options: { wrongPrice?: boolean; failOnce?: boolean } = {}) {
  const calls: string[] = [];
  let fail = options.failOnce;
  const client = {
    checkout: { sessions: {
      retrieve: async () => session,
      listLineItems: async () => ({ has_more: false, data: [{ quantity: 1, price: { id: options.wrongPrice ? "price_wrong" : "price_book" } }] }),
      update: async () => { calls.push("session"); return session; },
    } },
    paymentIntents: { update: async () => {
      if (fail) { fail = false; throw new Error("Temporary upstream failure"); }
      calls.push("payment"); return {};
    } },
  } as unknown as Stripe;
  return { client, calls };
}

test("checkout fixes the price, one book and 30 SEK Sweden-only shipping", () => {
  const params = checkoutParameters("price_book", "https://example.test");
  assert.deepEqual(params.line_items, [{ price: "price_book", quantity: 1 }]);
  assert.deepEqual(params.shipping_address_collection?.allowed_countries, ["SE"]);
  assert.deepEqual(params.shipping_options?.[0].shipping_rate_data?.fixed_amount, { amount: 3000, currency: "sek" });
  assert.equal(Object.hasOwn(params, "payment_method_types"), false);
  assert.equal(params.success_url, "https://example.test/bestall/tack?session_id={CHECKOUT_SESSION_ID}");
});

test("sandbox guard refuses production, missing and malformed credentials", () => {
  assert.equal(isSandboxKey(undefined), false);
  assert.equal(isSandboxKey("sk_" + "live_fixture"), false);
  assert.equal(isSandboxKey("sk_" + "test_fixture\n"), false);
  assert.equal(isSandboxKey("rk_" + "test_fixture"), true);
});

test("validation rejects wrong amounts, country, integration and live sessions", () => {
  assert.equal(matchesBookOrder(order()), true);
  for (const changes of [
    { amount_total: 15000 }, { currency: "eur" }, { livemode: true },
    { metadata: {} }, { total_details: { amount_shipping: 0 } },
    { collected_information: { shipping_details: { address: { country: "NO" } } } },
  ]) assert.equal(matchesBookOrder(order(changes)), false);
});

test("unpaid delayed payments never produce verified orders", async () => {
  const { client, calls } = fakeStripe(order({ payment_status: "unpaid" }));
  assert.equal(await recordBookPayment(client, "cs_test_fixture", "price_book"), "unpaid");
  assert.deepEqual(calls, []);
});

test("paid events and redelivery write only convergent payment markers", async () => {
  const { client, calls } = fakeStripe(order());
  for (let i = 0; i < 2; i++) assert.equal(await recordBookPayment(client, "cs_test_fixture", "price_book"), "verified");
  assert.deepEqual(calls, ["payment", "session", "payment", "session"]);
});

test("unrelated sessions are ignored and mismatched line items fail before writing", async () => {
  const unrelated = fakeStripe(order({ metadata: {} }));
  assert.equal(await recordBookPayment(unrelated.client, "cs_test_fixture", "price_book"), "ignored");
  assert.deepEqual(unrelated.calls, []);
  const mismatch = fakeStripe(order(), { wrongPrice: true });
  await assert.rejects(recordBookPayment(mismatch.client, "cs_test_fixture", "price_book"));
  assert.deepEqual(mismatch.calls, []);
});

test("upstream failure is retryable without losing the payment record", async () => {
  const { client, calls } = fakeStripe(order(), { failOnce: true });
  await assert.rejects(recordBookPayment(client, "cs_test_fixture", "price_book"));
  assert.equal(await recordBookPayment(client, "cs_test_fixture", "price_book"), "verified");
  assert.deepEqual(calls, ["payment", "session"]);
});

test("webhook signatures reject modified payloads and stale deliveries", () => {
  const stripe = new Stripe("sk_" + "test_fixture");
  const secret = "fixture-signing-secret";
  const payload = JSON.stringify({ id: "evt_fixture", type: "checkout.session.completed", data: { object: { id: "cs_test_fixture" } } });
  const signature = stripe.webhooks.generateTestHeaderString({ payload, secret });
  assert.equal(stripe.webhooks.constructEvent(payload, signature, secret).id, "evt_fixture");
  assert.throws(() => stripe.webhooks.constructEvent(payload + " ", signature, secret));
  const stale = stripe.webhooks.generateTestHeaderString({ payload, secret, timestamp: 1 });
  assert.throws(() => stripe.webhooks.constructEvent(payload, stale, secret));
});
