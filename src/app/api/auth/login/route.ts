import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { setSessionUser } from "@/lib/auth";
import { getPgConnectionPool } from "@/lib/db";
import { createRouteLogger } from "@/lib/logger";
import type { UserRole } from "@/types/user";

type UserRow = {
  id: string;
  email: string;
  full_name: string;
  password_hash: string;
  role: UserRole;
};

export async function POST(request: Request) {
  const log = createRouteLogger("POST", "/api/auth/login");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    log.response(400);
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { email, password } = (body ?? {}) as {
    email?: string;
    password?: string;
  };

  if (!email || !password) {
    log.response(400);
    return NextResponse.json(
      { error: "email and password are required" },
      { status: 400 },
    );
  }

  try {
    const pool = getPgConnectionPool();
    const result = await pool.query<UserRow>(
      `SELECT id, email, full_name, password_hash, role
       FROM users WHERE email = $1`,
      [email.toLowerCase().trim()],
    );

    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      log.response(401);
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    await setSessionUser({
      id: user.id,
      email: user.email,
      username: user.full_name,
      role: user.role,
    });

    log.response(200, { userId: user.id });
    return NextResponse.json({
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
    });
  } catch (error) {
    log.error(error);
    log.response(500);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
