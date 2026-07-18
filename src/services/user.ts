import { getPgConnectionPool } from "@/lib/db";
import type { UserRole } from "@/types/user";

export type CreatedUser = {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
};

type UserRow = {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
};

export async function createUser(input: {
  fullName: string;
  email: string;
  passwordHash: string;
}): Promise<CreatedUser> {
  const pool = getPgConnectionPool();
  const result = await pool.query<UserRow>(
    `INSERT INTO users (full_name, email, password_hash, role)
     VALUES ($1, $2, $3, 'user')
     RETURNING id, full_name, email, role`,
    [input.fullName, input.email, input.passwordHash],
  );

  const row = result.rows[0];
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    role: row.role,
  };
}
