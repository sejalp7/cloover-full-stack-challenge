import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { createRouteLogger } from "@/lib/logger";
import { validateQuoteInput, generateQuoteResponse } from "@/lib/quote-validation";
import { createQuote, listQuotes } from "@/services/quote";

export async function GET() {
  const log = createRouteLogger("GET", "/api/quotes");
  const user = await getSessionUser();
  if (!user) {
    log.response(401);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const quotes = await listQuotes(user);
    log.response(200, { count: quotes.length });
    return NextResponse.json({ quotes });
  } catch (error) {
    log.error(error);
    log.response(500);
    return NextResponse.json(
      { error: "Failed to list quotes" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const log = createRouteLogger("POST", "/api/quotes");
  const user = await getSessionUser();
  if (!user) {
    log.response(401);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    log.response(400);
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const validation = validateQuoteInput(body);
  if (!validation.ok) {
    log.response(400, { validationErrors: validation.errors.length });
    return NextResponse.json(
      { error: "Validation failed", details: validation.errors },
      { status: 400 },
    );
  }

  try {
    const quote = await createQuote(user.id, validation.data);
    log.response(201, { quoteId: quote.id });
    return NextResponse.json(generateQuoteResponse(quote), { status: 201 });
  } catch (error) {
    log.error(error);
    log.response(500);
    return NextResponse.json(
      { error: "Failed to create quote" },
      { status: 500 },
    );
  }
}
