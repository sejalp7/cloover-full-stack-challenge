import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getQuoteById } from "@/services/quote";
import { generateQuoteResponse } from "@/lib/quote-validation";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, params: RouteContext) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params.params;
  if (!id) {
    return NextResponse.json({ error: "Quote id is required" }, { status: 400 });
  }

  try {
    const quote = await getQuoteById(id, user);
    if (!quote) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(generateQuoteResponse(quote));
  } catch (error) {
    console.error("Failed to fetch quote", error);
    return NextResponse.json(
      { error: "Failed to fetch quote" },
      { status: 500 },
    );
  }
}
