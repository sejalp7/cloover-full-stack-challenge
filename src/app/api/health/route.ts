import { NextResponse } from "next/server";
import { getPgConnectionPool } from "@/lib/db";
import { createRouteLogger } from "@/lib/logger";

export async function GET() {
  const log = createRouteLogger("GET", "/api/health");

  try {
    const pool = getPgConnectionPool();
    await pool.query("SELECT 1");
    log.response(200, { db: true });
    return NextResponse.json({ status: "ok", db: true });
  } catch (error) {
    log.error(error, { db: false });
    log.response(503, { db: false });
    return NextResponse.json({ status: "degraded", db: false }, { status: 503 });
  }
}
