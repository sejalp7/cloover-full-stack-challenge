import { NextResponse } from "next/server";
import { clearSession } from "@/lib/auth";
import { createRouteLogger } from "@/lib/logger";

export async function POST() {
  const log = createRouteLogger("POST", "/api/auth/logout");
  try {
    await clearSession();
    log.response(200);
    return NextResponse.json({ ok: true });
  } catch (error) {
    log.error(error);
    log.response(500);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
