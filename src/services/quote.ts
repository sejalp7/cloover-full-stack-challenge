import { getPgConnectionPool } from "@/lib/db";
import { calculatePricing } from "@/lib/pricing";
import { generateQuoteRow, type QuoteInput } from "@/lib/quote-validation";
import type {
  QuoteListItem,
  QuoteListRow,
  QuoteRecord,
  QuoteRow,
} from "@/types/quote";
import type { SessionUser } from "@/types/user";

export type ListQuotesFilter = {
  /** Admin only: restrict to one user id */
  userId?: string;
  /** Admin only: case-insensitive match on user name or email */
  q?: string;
};


export async function createQuote(
  userId: string,
  input: QuoteInput,
): Promise<QuoteRecord> {
  const pricing = calculatePricing(input);
  const pool = getPgConnectionPool();

  const result = await pool.query<QuoteRow>(
    `INSERT INTO quotes (
       user_id, address, monthly_consumption_kwh, system_size_kw,
       down_payment, system_price, principal, risk_band, offers
     ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb)
     RETURNING *`,
    [
      userId,
      input.address,
      input.monthlyConsumptionKwh,
      input.systemSizeKw,
      input.downPayment ?? null,
      pricing.systemPrice,
      pricing.principal,
      pricing.riskBand,
      JSON.stringify(pricing.offers),
    ],
  );

  return generateQuoteRow(result.rows[0]);
}

export async function getQuoteById(
  id: string,
  viewer: SessionUser,
): Promise<QuoteRecord | null> {
  const pool = getPgConnectionPool();
  const result = await pool.query<QuoteRow>(
    `SELECT * FROM quotes WHERE id = $1`,
    [id],
  );

  const row = result.rows[0];
  if (!row) {
    return null;
  }

  const quote = generateQuoteRow(row);
  if (viewer.role !== "admin" && quote.userId !== viewer.id) {
    return null;
  }

  return quote;
}

function generateQuoteListItem(row: QuoteListRow): QuoteListItem {
  return {
    id: row.id,
    createdAt: row.created_at.toISOString(),
    systemSizeKw: Number(row.system_size_kw),
    systemPrice: Number(row.system_price),
    riskBand: row.risk_band,
    userId: row.user_id,
    userFullName: row.full_name,
    userEmail: row.email,
  };
}

/**
 * Lists quotes for the viewer. Non-admins always see only their own quotes.
 * Admins may optionally filter by userId and/or name/email search.
 */
export async function listQuotes(
  viewer: SessionUser,
  filter: ListQuotesFilter = {},
): Promise<QuoteListItem[]> {
  const pool = getPgConnectionPool();
  const params: unknown[] = [];
  const conditions: string[] = [];

  if (viewer.role !== "admin") {
    params.push(viewer.id);
    conditions.push(`q.user_id = $${params.length}`);
  } else {
    if (filter.userId) {
      params.push(filter.userId);
      conditions.push(`q.user_id = $${params.length}`);
    }
    if (filter.q?.trim()) {
      params.push(`%${filter.q.trim().toLowerCase()}%`);
      conditions.push(
        `(LOWER(u.full_name) LIKE $${params.length} OR LOWER(u.email) LIKE $${params.length})`,
      );
    }
  }

  const where =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const result = await pool.query<QuoteListRow>(
    `SELECT
       q.id,
       q.user_id,
       q.system_size_kw,
       q.system_price,
       q.risk_band,
       q.created_at,
       u.full_name,
       u.email
     FROM quotes q
     INNER JOIN users u ON u.id = q.user_id
     ${where}
     ORDER BY q.created_at DESC`,
    params,
  );

  return result.rows.map(generateQuoteListItem);
}
