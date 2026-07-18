import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { setSessionUser } from "@/lib/auth";
import { createUser } from "@/services/user";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { fullName, email, password } = (body ?? {}) as {
    fullName?: string;
    email?: string;
    password?: string;
  };

  const name = typeof fullName === "string" ? fullName.trim() : "";
  const normalizedEmail =
    typeof email === "string" ? email.toLowerCase().trim() : "";
  const errors: string[] = [];

  if (!name) {
    errors.push("fullName is required");
  }
  if (!normalizedEmail) {
    errors.push("email is required");
  } else if (!EMAIL_PATTERN.test(normalizedEmail)) {
    errors.push("email is invalid");
  }
  if (!password) {
    errors.push("password is required");
  } else if (password.length < MIN_PASSWORD_LENGTH) {
    errors.push(`password must be at least ${MIN_PASSWORD_LENGTH} characters`);
  }

  if (errors.length > 0) {
    return NextResponse.json(
      { error: "Validation failed", details: errors },
      { status: 400 },
    );
  }

  try {
    const passwordHash = await bcrypt.hash(password!, 10);
    const user = await createUser({
      fullName: name,
      email: normalizedEmail,
      passwordHash,
    });

    await setSessionUser({
      id: user.id,
      email: user.email,
      username: user.fullName,
      role: user.role,
    });

    return NextResponse.json(
      {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
      { status: 201 },
    );
  } catch (error) {
    if (isUniqueViolation(error)) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 },
      );
    }
    console.error("Registration failed", error);
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 },
    );
  }
}

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "23505"
  );
}
