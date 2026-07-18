import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { validateQuoteInput, generateQuoteResponse } from "@/lib/quote-validation";
import { createQuote, listQuotes } from "@/services/quote";

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") ?? undefined;
  const q = searchParams.get("q") ?? undefined;

  if (user.role !== "admin" && (userId || q)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const quotes = await listQuotes(user, {
      ...(userId ? { userId } : {}),
      ...(q ? { q } : {}),
    });
    return NextResponse.json({ quotes });
  } catch (error) {
    console.error("Failed to list quotes", error);
    return NextResponse.json(
      { error: "Failed to list quotes" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const validation = validateQuoteInput(body);
  if (!validation.ok) {
    return NextResponse.json(
      { error: "Validation failed", details: validation.errors },
      { status: 400 },
    );
  }

  try {
    const quote = await createQuote(user.id, validation.data);
    return NextResponse.json(generateQuoteResponse(quote), { status: 201 });
  } catch (error) {
    console.error("Failed to create quote", error);
    return NextResponse.json(
      { error: "Failed to create quote" },
      { status: 500 },
    );
  }
}
