export type RiskBand = "A" | "B" | "C";

export type PricingInput = {
  monthlyConsumptionKwh: number;
  systemSizeKw: number;
  downPayment?: number;
};

export type Offer = {
  termYears: number;
  apr: number;
  principalUsed: number;
  monthlyPayment: number;
};

export type PricingResult = {
  systemPrice: number;
  principal: number;
  riskBand: RiskBand;
  offers: Offer[];
};

const APR_BY_BAND: Record<RiskBand, number> = {
  A: 6.9,
  B: 8.9,
  C: 11.9,
};

const TERM_YEARS = [5, 10, 15] as const;
const PRICE_PER_KW = 1200;

export function determineRiskBand(
  monthlyConsumptionKwh: number,
  systemSizeKw: number,
): RiskBand {
  if (monthlyConsumptionKwh >= 400 && systemSizeKw <= 6) {
    return "A";
  }
  if (monthlyConsumptionKwh >= 250) {
    return "B";
  }
  return "C";
}

export function calculateMonthlyPayment(
  principal: number,
  aprPercent: number,
  termYears: number,
): number {
  if (principal <= 0) {
    return 0;
  }

  const monthlyRate = aprPercent / 100 / 12;
  const months = termYears * 12;

  if (monthlyRate === 0) {
    return roundMoney(principal / months);
  }

  const factor = Math.pow(1 + monthlyRate, months);
  const payment = (principal * monthlyRate * factor) / (factor - 1);
  return roundMoney(payment);
}

export function calculatePricing(input: PricingInput): PricingResult {
  const downPayment = input.downPayment ?? 0;
  const systemPrice = roundMoney(input.systemSizeKw * PRICE_PER_KW);
  const principal = roundMoney(Math.max(systemPrice - downPayment, 0));
  const riskBand = determineRiskBand(
    input.monthlyConsumptionKwh,
    input.systemSizeKw,
  );
  const apr = APR_BY_BAND[riskBand];

  const offers: Offer[] = TERM_YEARS.map((termYears) => ({
    termYears,
    apr,
    principalUsed: principal,
    monthlyPayment: calculateMonthlyPayment(principal, apr, termYears),
  }));

  return { systemPrice, principal, riskBand, offers };
}

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}
