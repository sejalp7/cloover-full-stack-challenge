import { render, screen } from "@testing-library/react";
import { QuotesList } from "./QuotesList";
import type { QuoteListItem } from "@/types/quote";

const quotes: QuoteListItem[] = [
  {
    id: "q-1",
    createdAt: "2026-07-18T10:00:00.000Z",
    systemSizeKw: 5,
    systemPrice: 6000,
    riskBand: "A",
    userId: "u-1",
    userFullName: "Test User",
    userEmail: "user@test.com",
  },
];

describe("QuotesList", () => {
  it("renders quote rows with a details link", () => {
    render(
      <QuotesList
        quotes={quotes}
        caption="Your quotes"
        emptyMessage="No quotes yet."
      />,
    );

    expect(screen.getByText("5 kW")).toBeInTheDocument();
    expect(screen.getByText(/€6,000/)).toBeInTheDocument();
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /View details/i }),
    ).toHaveAttribute("href", "/quotes/q-1");
  });

  it("shows the empty message when there are no quotes", () => {
    render(<QuotesList quotes={[]} emptyMessage="No quotes yet." />);
    expect(screen.getByText("No quotes yet.")).toBeInTheDocument();
  });

  it("optionally shows the user column", () => {
    render(<QuotesList quotes={quotes} showUser />);
    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("user@test.com")).toBeInTheDocument();
  });

  it("shows OptimisticLoader while loading", () => {
    render(<QuotesList quotes={[]} isLoading caption="Your quotes" />);
    expect(screen.getByRole("status", { name: "Loading quotes" })).toBeInTheDocument();
    expect(screen.queryByText("No quotes yet.")).not.toBeInTheDocument();
  });
});
