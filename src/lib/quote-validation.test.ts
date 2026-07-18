import { generateQuoteResponse, validateQuoteInput } from "./quote-validation";
import type { QuoteRecord } from "@/types/quote";

describe("validateQuoteInput", () => {
  it("accepts a valid payload", () => {
    const result = validateQuoteInput({
      address: " 12 Solar customer ",
      monthlyConsumptionKwh: 350,
      systemSizeKw: 5,
      downPayment: 500,
    });

    expect(result).toEqual({
      ok: true,
      data: {
        address: "12 Solar customer",
        monthlyConsumptionKwh: 350,
        systemSizeKw: 5,
        downPayment: 500,
      },
    });
  });

  it("rejects missing required fields", () => {
    const result = validateQuoteInput({});
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toEqual(
        expect.arrayContaining([
          "address is required",
          "monthlyConsumptionKwh must be a number",
          "systemSizeKw must be a number",
        ]),
      );
    }
  });

  it("rejects non-positive numbers and negative down payment", () => {
    const result = validateQuoteInput({
      address: "Berlin",
      monthlyConsumptionKwh: 0,
      systemSizeKw: -1,
      downPayment: -10,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toEqual(
        expect.arrayContaining([
          "monthlyConsumptionKwh must be greater than 0",
          "systemSizeKw must be greater than 0",
          "downPayment must be >= 0",
        ]),
      );
    }
  });
});

describe("generateQuoteResponse", () => {
  it("maps a quote record into the API response shape", () => {
    const quote: QuoteRecord = {
      id: "q-1",
      userId: "u-1",
      address: "Berlin",
      monthlyConsumptionKwh: 400,
      systemSizeKw: 5,
      downPayment: null,
      systemPrice: 6000,
      principal: 6000,
      riskBand: "A",
      offers: [
        { termYears: 5, apr: 6.9, principalUsed: 6000, monthlyPayment: 118 },
      ],
      createdAt: "2026-07-18T00:00:00.000Z",
    };

    expect(generateQuoteResponse(quote)).toEqual({
      id: "q-1",
      inputs: {
        address: "Berlin",
        monthlyConsumptionKwh: 400,
        systemSizeKw: 5,
        downPayment: null,
      },
      derived: {
        systemPrice: 6000,
        principal: 6000,
        riskBand: "A",
      },
      offers: quote.offers,
      createdAt: "2026-07-18T00:00:00.000Z",
    });
  });
});
