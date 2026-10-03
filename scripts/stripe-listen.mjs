import { spawn } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
process.loadEnvFile(".env.local");
if (!/^(sk|rk)_test_/.test(process.env.STRIPE_SECRET_KEY || "")) throw new Error("Sandbox key required.");
const child = spawn("npx", ["--yes", "@stripe/cli", "listen", "--latest", "--events", "checkout.session.completed,checkout.session.async_payment_succeeded,checkout.session.async_payment_failed", "--forward-to", "http://localhost:3001/api/stripe/webhook"], {
  env: { ...process.env, STRIPE_API_KEY: process.env.STRIPE_SECRET_KEY },
  stdio: ["ignore", "pipe", "pipe"],
});
let buffer = "";
let ready = false;
function output(chunk) {
  buffer += chunk.toString();
  const secret = buffer.match(/whsec_[A-Za-z0-9]+/);
  if (secret && !ready) {
    const lines = readFileSync(".env.local", "utf8").split("\n").filter(line => !line.startsWith("STRIPE_WEBHOOK_SECRET="));
    lines.push(`STRIPE_WEBHOOK_SECRET=${secret[0]}`);
    writeFileSync(".env.local", lines.filter(Boolean).join("\n") + "\n", { mode: 0o600 });
    ready = true;
    console.log("Local webhook listener ready. Signing secret saved privately. Start/restart Next.js now.");
  }
  // Forward only delivery status, never credentials or webhook payloads.
  for (const match of chunk.toString().matchAll(/\[(\d{3})\] POST/g)) console.log(`Webhook delivery HTTP ${match[1]}`);
  if (buffer.length > 8192) buffer = buffer.slice(-4096);
}
child.stdout.on("data", output);
child.stderr.on("data", output);
child.on("exit", code => { console.log(`Stripe listener stopped (${code ?? "signal"}).`); process.exitCode = code || 0; });
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => child.kill(signal));
