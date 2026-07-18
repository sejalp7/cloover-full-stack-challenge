import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { createRouteLogger } from "@/lib/logger";
import { getQuoteById } from "@/services/quote";
import { generateQuoteResponse } from "@/lib/quote-validation";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const log = createRouteLogger("GET", "/api/quotes/:id");
  const user = await getSessionUser();
  if (!user) {
    log.response(401);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  if (!id) {
    log.response(400);
    return NextResponse.json({ error: "Quote id is required" }, { status: 400 });
  }

  try {
    const quote = await getQuoteById(id, user);
    if (!quote) {
      log.response(404, { quoteId: id });
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    log.response(200, { quoteId: id });
    return NextResponse.json(generateQuoteResponse(quote));
  } catch (error) {
    log.error(error, { quoteId: id });
    log.response(500);
    return NextResponse.json(
      { error: "Failed to fetch quote" },
      { status: 500 },
    );
  }
}
