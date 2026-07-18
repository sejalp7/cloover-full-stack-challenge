/**
 * @jest-environment node
 */
import { GET } from "./route";
import { getSessionUser } from "@/lib/auth";
import { getQuoteById } from "@/services/quote";
import type { SessionUser } from "@/types/user";
import type { QuoteRecord } from "@/types/quote";

jest.mock("@/lib/auth", () => ({
  getSessionUser: jest.fn(),
}));

jest.mock("@/services/quote", () => ({
  getQuoteById: jest.fn(),
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

const quote: QuoteRecord = {
  id: "quote-1",
  userId: "user-1",
  address: "12 Solar St",
  monthlyConsumptionKwh: 350,
  systemSizeKw: 5,
  downPayment: null,
  systemPrice: 6000,
  principal: 6000,
  riskBand: "B",
  offers: [],
  createdAt: "2026-07-18T00:00:00.000Z",
};

describe("GET /api/quotes/:id", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 401 when unauthenticated", async () => {
    (getSessionUser as jest.Mock).mockResolvedValue(null);
    const response = await GET(new Request("http://localhost/api/quotes/quote-1"), {
      params: Promise.resolve({ id: "quote-1" }),
    });
    expect(response.status).toBe(401);
  });

  it("returns 404 when the quote is missing", async () => {
    (getSessionUser as jest.Mock).mockResolvedValue(user);
    (getQuoteById as jest.Mock).mockResolvedValue(null);

    const response = await GET(new Request("http://localhost/api/quotes/quote-1"), {
      params: Promise.resolve({ id: "quote-1" }),
    });
    expect(response.status).toBe(404);
  });

  it("returns the quote for an authorized viewer", async () => {
    (getSessionUser as jest.Mock).mockResolvedValue(user);
    (getQuoteById as jest.Mock).mockResolvedValue(quote);

    const response = await GET(new Request("http://localhost/api/quotes/quote-1"), {
      params: Promise.resolve({ id: "quote-1" }),
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(getQuoteById).toHaveBeenCalledWith("quote-1", user);
    expect(body.id).toBe("quote-1");
    expect(body.derived.riskBand).toBe("B");
  });
});
