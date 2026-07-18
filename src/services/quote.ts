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
 * Lists quotes for the viewer.
 * Regular users see only their own quotes; admins see all quotes.
 */
export async function listQuotes(
  viewer: SessionUser,
): Promise<QuoteListItem[]> {
  const pool = getPgConnectionPool();
  const params: unknown[] = [];
  let where = "";

  if (viewer.role !== "admin") {
    params.push(viewer.id);
    where = `WHERE q.user_id = $${params.length}`;
  }

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
