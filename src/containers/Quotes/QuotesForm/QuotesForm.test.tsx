import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QuotesForm } from "./QuotesForm";
import { apiClient } from "@/lib/api";
import type { SessionUser } from "@/types/user";
import type { QuoteResponse } from "@/types/quote";

jest.mock("@/lib/api", () => ({
  apiClient: {
    post: jest.fn(),
  },
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));

const user: SessionUser = {
  id: "user-1",
  email: "user@test.com",
  username: "Test User",
  role: "user",
};

const quoteResponse: QuoteResponse = {
  id: "quote-1",
  inputs: {
    address: "12 Solar customer",
    monthlyConsumptionKwh: 350,
    systemSizeKw: 5,
    downPayment: null,
  },
  derived: {
    systemPrice: 6000,
    principal: 6000,
    riskBand: "B",
  },
  offers: [
    { termYears: 5, apr: 8.9, principalUsed: 6000, monthlyPayment: 124 },
    { termYears: 10, apr: 8.9, principalUsed: 6000, monthlyPayment: 75 },
    { termYears: 15, apr: 8.9, principalUsed: 6000, monthlyPayment: 60 },
  ],
  createdAt: "2026-07-18T00:00:00.000Z",
};

describe("QuotesForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("blocks submit when required fields are empty", () => {
    render(<QuotesForm user={user} onSuccess={jest.fn()} />);

    fireEvent.click(
      screen.getByRole("button", { name: "Get pre-qualification" }),
    );

    expect(screen.getByText("Address is required")).toBeInTheDocument();
    expect(screen.getByText("Monthly consumption is required")).toBeInTheDocument();
    expect(screen.getByText("System size is required")).toBeInTheDocument();
    expect(apiClient.post).not.toHaveBeenCalled();
  });

  it("posts a valid quote and calls onSuccess", async () => {
    const onSuccess = jest.fn();
    (apiClient.post as jest.Mock).mockResolvedValue({ data: quoteResponse });

    render(<QuotesForm user={user} onSuccess={onSuccess} />);

    fireEvent.change(screen.getByLabelText("Address"), {
      target: { value: "12 Solar customer" },
    });
    fireEvent.change(screen.getByLabelText("Monthly consumption (kWh)"), {
      target: { value: "350" },
    });
    fireEvent.change(screen.getByLabelText("System size (kW)"), {
      target: { value: "5" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Get pre-qualification" }),
    );

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith("/quotes", {
        address: "12 Solar customer",
        monthlyConsumptionKwh: 350,
        systemSizeKw: 5,
      });
      expect(onSuccess).toHaveBeenCalledWith(quoteResponse);
    });
  });
});
