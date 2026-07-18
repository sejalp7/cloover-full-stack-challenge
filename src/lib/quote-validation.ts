import { QuoteRecord, QuoteResponse, QuoteRow } from "@/types/quote";

export type QuoteInput = {
  address: string;
  monthlyConsumptionKwh: number;
  systemSizeKw: number;
  downPayment?: number;
};

export type ValidationSuccess = { ok: true; data: QuoteInput };
export type ValidationFailure = { ok: false; errors: string[] };
export type ValidationResult = ValidationSuccess | ValidationFailure;

export function validateQuoteInput(body: unknown): ValidationResult {
  if (!body || typeof body !== "object") {
    return { ok: false, errors: ["Request body must be a JSON object"] };
  }

  const input = body as Record<string, unknown>;
  const errors: string[] = [];

  const address =
    typeof input.address === "string" ? input.address.trim() : "";
  if (!address) {
    errors.push("address is required");
  }

  const monthlyConsumptionKwh = readPositiveNumber(
    input.monthlyConsumptionKwh,
    "monthlyConsumptionKwh",
    errors,
  );
  const systemSizeKw = readPositiveNumber(
    input.systemSizeKw,
    "systemSizeKw",
    errors,
  );

  let downPayment: number | undefined;
  if (input.downPayment !== undefined && input.downPayment !== null) {
    if (typeof input.downPayment !== "number" || Number.isNaN(input.downPayment)) {
      errors.push("downPayment must be a number");
    } else if (input.downPayment < 0) {
      errors.push("downPayment must be >= 0");
    } else {
      downPayment = input.downPayment;
    }
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      address,
      monthlyConsumptionKwh: monthlyConsumptionKwh!,
      systemSizeKw: systemSizeKw!,
      ...(downPayment !== undefined ? { downPayment } : {}),
    },
  };
}

function readPositiveNumber(
  value: unknown,
  field: string,
  errors: string[],
): number | undefined {
  if (typeof value !== "number" || Number.isNaN(value)) {
    errors.push(`${field} must be a number`);
    return undefined;
  }
  if (value <= 0) {
    errors.push(`${field} must be greater than 0`);
    return undefined;
  }
  return value;
}

export function generateQuoteResponse(quote: QuoteRecord): QuoteResponse {
  return {
    id: quote.id,
    inputs: {
      address: quote.address,
      monthlyConsumptionKwh: quote.monthlyConsumptionKwh,
      systemSizeKw: quote.systemSizeKw,
      downPayment: quote.downPayment,
    },
    derived: {
      systemPrice: quote.systemPrice,
      principal: quote.principal,
      riskBand: quote.riskBand,
    },
    offers: quote.offers,
    createdAt: quote.createdAt,
  };
}

export function generateQuoteRow(row: QuoteRow): QuoteRecord {
  return {
    id: row.id,
    userId: row.user_id,
    address: row.address,
    monthlyConsumptionKwh: Number(row.monthly_consumption_kwh),
    systemSizeKw: Number(row.system_size_kw),
    downPayment: row.down_payment === null ? null : Number(row.down_payment),
    systemPrice: Number(row.system_price),
    principal: Number(row.principal),
    riskBand: row.risk_band,
    offers: row.offers,
    createdAt: row.created_at.toISOString(),
  };
}