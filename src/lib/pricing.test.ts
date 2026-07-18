import {
  calculateMonthlyPayment,
  calculatePricing,
  determineRiskBand,
} from "./pricing";

describe("determineRiskBand", () => {
  it("returns A for high consumption and small system", () => {
    expect(determineRiskBand(400, 6)).toBe("A");
    expect(determineRiskBand(500, 5)).toBe("A");
  });

  it("returns B for medium-or-higher consumption outside band A", () => {
    expect(determineRiskBand(250, 7)).toBe("B");
    expect(determineRiskBand(400, 7)).toBe("B");
  });

  it("returns C for low consumption", () => {
    expect(determineRiskBand(100, 5)).toBe("C");
  });
});

describe("calculateMonthlyPayment", () => {
  it("returns 0 for non-positive principal", () => {
    expect(calculateMonthlyPayment(0, 6.9, 10)).toBe(0);
    expect(calculateMonthlyPayment(-100, 6.9, 10)).toBe(0);
  });

  it("calculates a positive amortised payment", () => {
    const payment = calculateMonthlyPayment(6000, 6.9, 10);
    expect(payment).toBeGreaterThan(0);
    expect(payment).toBeLessThan(6000);
  });
});

describe("calculatePricing", () => {
  it("prices the system, applies down payment, and builds three offers", () => {
    const result = calculatePricing({
      monthlyConsumptionKwh: 420,
      systemSizeKw: 5,
      downPayment: 1000,
    });

    expect(result.systemPrice).toBe(6000);
    expect(result.principal).toBe(5000);
    expect(result.riskBand).toBe("A");
    expect(result.offers).toHaveLength(3);
    expect(result.offers.map((o) => o.termYears)).toEqual([5, 10, 15]);
    expect(result.offers.every((o) => o.apr === 6.9)).toBe(true);
  });

  it("set principal at zero when down payment exceeds system price", () => {
    const result = calculatePricing({
      monthlyConsumptionKwh: 100,
      systemSizeKw: 1,
      downPayment: 5000,
    });

    expect(result.systemPrice).toBe(1200);
    expect(result.principal).toBe(0);
    expect(result.offers.every((o) => o.monthlyPayment === 0)).toBe(true);
  });
});
