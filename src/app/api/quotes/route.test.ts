/**
 * @jest-environment node
 */
import { GET, POST } from "./route";
import { getSessionUser } from "@/lib/auth";
import { createQuote, listQuotes } from "@/services/quote";
import type { SessionUser } from "@/types/user";
import type { QuoteRecord } from "@/types/quote";

jest.mock("@/lib/auth", () => ({
  getSessionUser: jest.fn(),
}));

jest.mock("@/services/quote", () => ({
  createQuote: jest.fn(),
  listQuotes: jest.fn(),
}));

jest.mock("@/lib/logger", () => ({
  createRouteLogger: () => ({
    response: jest.fn(),
    error: jest.fn(),
  }),
}));

const user: SessionUser = {
  id: "user-1",
  email: "user@test.com",
  username: "Test User",
  role: "user",
};

const quoteRecord: QuoteRecord = {
  id: "quote-1",
  userId: "user-1",
  address: "12 Solar St",
  monthlyConsumptionKwh: 350,
  systemSizeKw: 5,
  downPayment: null,
  systemPrice: 6000,
  principal: 6000,
  riskBand: "B",
  offers: [
    { termYears: 5, apr: 8.9, principalUsed: 6000, monthlyPayment: 124 },
  ],
  createdAt: "2026-07-18T00:00:00.000Z",
};

describe("GET /api/quotes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 401 when unauthenticated", async () => {
    (getSessionUser as jest.Mock).mockResolvedValue(null);
    const response = await GET();
    expect(response.status).toBe(401);
  });

  it("returns the viewer's quotes", async () => {
    (getSessionUser as jest.Mock).mockResolvedValue(user);
    (listQuotes as jest.Mock).mockResolvedValue([
      {
        id: "quote-1",
        createdAt: quoteRecord.createdAt,
        systemSizeKw: 5,
        systemPrice: 6000,
        riskBand: "B",
        userId: "user-1",
        userFullName: "Test User",
        userEmail: "user@test.com",
      },
    ]);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(listQuotes).toHaveBeenCalledWith(user);
    expect(body.quotes).toHaveLength(1);
  });
});

describe("POST /api/quotes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 401 when unauthenticated", async () => {
    (getSessionUser as jest.Mock).mockResolvedValue(null);
    const response = await POST(
      new Request("http://localhost/api/quotes", {
        method: "POST",
        body: JSON.stringify({}),
      }),
    );
    expect(response.status).toBe(401);
  });

  it("returns 400 for invalid input", async () => {
    (getSessionUser as jest.Mock).mockResolvedValue(user);
    const response = await POST(
      new Request("http://localhost/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: "" }),
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe("Validation failed");
    expect(createQuote).not.toHaveBeenCalled();
  });

  it("creates a quote and returns 201", async () => {
    (getSessionUser as jest.Mock).mockResolvedValue(user);
    (createQuote as jest.Mock).mockResolvedValue(quoteRecord);

    const response = await POST(
      new Request("http://localhost/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: "12 Solar St",
          monthlyConsumptionKwh: 350,
          systemSizeKw: 5,
        }),
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(createQuote).toHaveBeenCalledWith("user-1", {
      address: "12 Solar St",
      monthlyConsumptionKwh: 350,
      systemSizeKw: 5,
    });
    expect(body.id).toBe("quote-1");
    expect(body.derived.systemPrice).toBe(6000);
  });
});
