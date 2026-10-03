import { readFileSync, writeFileSync } from "node:fs";
import Stripe from "stripe";

process.loadEnvFile(".env.local");
const key = process.env.STRIPE_SECRET_KEY;
if (!/^(sk|rk)_test_[A-Za-z0-9]+$/.test(key || "")) throw new Error("A sandbox key in .env.local is required.");
const stripe = new Stripe(key);
const lookup = "vansinnehjarta_printed_150_sek_v1";

function saveEnv(name, value) {
  const file = ".env.local";
  const lines = readFileSync(file, "utf8").split("\n").filter(line => !line.startsWith(`${name}=`));
  lines.push(`${name}=${value}`);
  writeFileSync(file, lines.filter(Boolean).join("\n") + "\n", { mode: 0o600 });
}

try {
  const existing = await stripe.prices.list({ lookup_keys: [lookup], limit: 1 });
  let price = existing.data[0];
  if (!price) {
    const product = await stripe.products.create({
      name: "vansinnehjärta — tryckt bok",
      description: "En tryckt diktsamling av Irma Tegge. Ett exemplar.",
      metadata: { integration: "vansinnehjarta_book_mqzvktpa" },
    }, { idempotencyKey: `${lookup}:product` });
    price = await stripe.prices.create({
      product: product.id, currency: "sek", unit_amount: 15000, lookup_key: lookup,
    }, { idempotencyKey: `${lookup}:price` });
  }
  if (price.livemode || price.currency !== "sek" || price.unit_amount !== 15000 || !price.active || price.type !== "one_time") {
    throw new Error("The existing sandbox price does not match the book.");
  }
  saveEnv("STRIPE_BOOK_PRICE_ID", price.id);
  saveEnv("CHECKOUT_BASE_URL", "http://localhost:3001");
  saveEnv("STRIPE_CHECKOUT_ENABLED", "true");
  console.log("Sandbox book price ready: 150 SEK. Configuration saved without displaying secrets.");
} catch (error) {
  console.error("Sandbox setup failed:", error.code || error.type || "configuration_error");
  process.exitCode = 1;
}
