import { checkoutConfigured, checkoutOrigin, stripeClient } from "@/lib/stripe";
import { checkoutParameters } from "@/lib/book-commerce";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!checkoutConfigured()) return Response.json({ error: "Beställning är inte tillgänglig just nu." }, { status: 503 });
  try {
    const origin = checkoutOrigin();
    if (request.headers.get("origin") !== origin) return new Response(null, { status: 403 });
    if (!request.headers.get("content-type")?.startsWith("application/json")) return new Response(null, { status: 415 });
    const raw = await request.text();
    if (raw.length > 1024) return new Response(null, { status: 413 });
    const body: unknown = JSON.parse(raw);
    const requestId = body && typeof body === "object" && "requestId" in body ? body.requestId : null;
    if (typeof requestId !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(requestId)) {
      return Response.json({ error: "Försök igen från beställningssidan." }, { status: 400 });
    }
    // Only an idempotency token comes from the browser. Prices and quantity do not.
    const session = await stripeClient().checkout.sessions.create(
      checkoutParameters(process.env.STRIPE_BOOK_PRICE_ID!, origin),
      { idempotencyKey: `book:${requestId}` },
    );
    if (session.livemode || !session.url) throw new Error("Invalid sandbox checkout.");
    return Response.json({ url: session.url }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof SyntaxError) return new Response(null, { status: 400 });
    // Never expose SDK errors, request details, credentials, or customer information.
    console.error("Sandbox checkout could not be created.");
    return Response.json({ error: "Kassan kunde inte öppnas. Försök igen om en stund." }, { status: 502 });
  }
}
