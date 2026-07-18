import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { createRouteLogger } from "@/lib/logger";

export async function GET() {
  const log = createRouteLogger("GET", "/api/auth/session");
  const user = await getSessionUser();
  if (!user) {
    log.response(401);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  log.response(200, { userId: user.id });
  return NextResponse.json(user);
}
