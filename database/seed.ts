import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config({ path: resolve(process.cwd(), ".env") });
dotenv.config({ path: resolve(process.cwd(), ".env.local") });

const databaseUrl =
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@localhost:5433/greenquote";

async function seed() {
  const client = new pg.Client({ connectionString: databaseUrl });
  await client.connect();

  try {
    const schema = readFileSync(
      resolve(process.cwd(), "database/schema.sql"),
      "utf8",
    );
    await client.query(schema);

    const adminHash = await bcrypt.hash("admin123", 10);
    const userHash = await bcrypt.hash("user123", 10);

    const users = await client.query<{ id: string; email: string }>(
      `INSERT INTO users (full_name, email, password_hash, role)
       VALUES
         ('Admin User', 'admin@test.com', $1, 'admin'),
         ('Test User', 'user@test.com', $2, 'user')
       RETURNING id, email`,
      [adminHash, userHash],
    );

    const regularUser = users.rows.find((row) => row.email === "user@test.com");
    if (!regularUser) {
      throw new Error("Failed to insert regular user");
    }

    const offersA = [
      { termYears: 5, apr: 6.9, principalUsed: 5000, monthlyPayment: 98.75 },
      { termYears: 10, apr: 6.9, principalUsed: 5000, monthlyPayment: 57.9 },
      { termYears: 15, apr: 6.9, principalUsed: 5000, monthlyPayment: 44.7 },
    ];

    const offersB = [
      { termYears: 5, apr: 8.9, principalUsed: 8400, monthlyPayment: 174.2 },
      { termYears: 10, apr: 8.9, principalUsed: 8400, monthlyPayment: 105.4 },
      { termYears: 15, apr: 8.9, principalUsed: 8400, monthlyPayment: 84.8 },
    ];

    await client.query(
      `INSERT INTO quotes (
         user_id, address, monthly_consumption_kwh, system_size_kw,
         down_payment, system_price, principal, risk_band, offers
       ) VALUES
         ($1, '12 Solar St, Berlin', 420, 5, 1000, 6000, 5000, 'A', $2::jsonb),
         ($1, '88 Riverview Rd, Munich', 280, 7, 0, 8400, 8400, 'B', $3::jsonb)`,
      [regularUser.id, JSON.stringify(offersA), JSON.stringify(offersB)],
    );

    console.log("Database seeded successfully.");
    console.log("Admin: admin@test.com / admin123");
    console.log("User:  user@test.com / user123");
  } finally {
    await client.end();
  }
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
