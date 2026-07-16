import { NextResponse } from "next/server";
import { getPgConnectionPool } from "@/lib/db";

export async function GET() {
  try {
    const pool = getPgConnectionPool();
    await pool.query("SELECT 1");
    return NextResponse.json({ status: "ok", db: true });
  } catch {
    return NextResponse.json({ status: "degraded", db: false }, { status: 503 });
  }
}
