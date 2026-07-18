/**
 * @jest-environment node
 */
import { GET } from "./route";
import { getPgConnectionPool } from "@/lib/db";

jest.mock("@/lib/db", () => ({
  getPgConnectionPool: jest.fn(),
}));

jest.mock("@/lib/logger", () => ({
  createRouteLogger: () => ({
    response: jest.fn(),
    error: jest.fn(),
  }),
}));

describe("GET /api/health", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns ok when the database responds", async () => {
    (getPgConnectionPool as jest.Mock).mockReturnValue({
      query: jest.fn().mockResolvedValue({ rows: [{ "?column?": 1 }] }),
    });

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ status: "ok", db: true });
  });

  it("returns degraded when the database is unreachable", async () => {
    (getPgConnectionPool as jest.Mock).mockReturnValue({
      query: jest.fn().mockRejectedValue(new Error("connection refused")),
    });

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(body).toEqual({ status: "degraded", db: false });
  });
});
