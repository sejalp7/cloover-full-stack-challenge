/**
 * @jest-environment node
 */
import { calculatePricing } from "@/lib/pricing";
import { validateQuoteInput } from "@/lib/quote-validation";

/**
 * Lightweight integration-style check: validated API input shapes
 * feed the pricing model the same way POST /api/quotes does.
 */
describe("quote create pipeline", () => {
  it("validates input then prices offers for a typical request", () => {
    const validation = validateQuoteInput({
      address: "12 Solar customer, Giessen, Germany",
      monthlyConsumptionKwh: 420,
      systemSizeKw: 5,
      downPayment: 1000,
    });

    expect(validation.ok).toBe(true);
    if (!validation.ok) {
      return;
    }

    const pricing = calculatePricing(validation.data);

    expect(pricing.systemPrice).toBe(6000);
    expect(pricing.principal).toBe(5000);
    expect(pricing.riskBand).toBe("A");
    expect(pricing.offers).toHaveLength(3);
    expect(pricing.offers[0]?.monthlyPayment).toBeGreaterThan(0);
  });
});
