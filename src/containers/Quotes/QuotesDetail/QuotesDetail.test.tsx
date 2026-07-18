import { render, screen } from "@testing-library/react";
import { QuotesDetail } from "./QuotesDetail";
import type { QuoteResponse } from "@/types/quote";

const quote: QuoteResponse = {
  id: "quote-1",
  inputs: {
    address: "1 Solar St",
    monthlyConsumptionKwh: 400,
    systemSizeKw: 5,
    downPayment: null,
  },
  derived: {
    systemPrice: 6000,
    principal: 6000,
    riskBand: "A",
  },
  offers: [
    { termYears: 5, apr: 6.9, principalUsed: 6000, monthlyPayment: 118.45 },
    { termYears: 10, apr: 6.9, principalUsed: 6000, monthlyPayment: 69.12 },
    { termYears: 15, apr: 6.9, principalUsed: 6000, monthlyPayment: 53.58 },
  ],
  createdAt: "2026-07-18T00:00:00.000Z",
};

describe("QuotesDetail", () => {
  it("renders system price, risk band, and three offer rows", () => {
    render(<QuotesDetail quote={quote} />);

    expect(screen.getByText("System price")).toBeInTheDocument();
    expect(screen.getByText(/€6,000/)).toBeInTheDocument();
    expect(screen.getByText("Risk band")).toBeInTheDocument();
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("5 years")).toBeInTheDocument();
    expect(screen.getByText("10 years")).toBeInTheDocument();
    expect(screen.getByText("15 years")).toBeInTheDocument();
  });
});
