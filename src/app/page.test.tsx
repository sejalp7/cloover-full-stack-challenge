import { render, screen } from "@testing-library/react";
import Home from "./page";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));

describe("Home page", () => {
  it("renders the GreenQuote brand", () => {
    render(<Home />);
    expect(screen.getByText("GreenQuote")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Sign in" })).toBeInTheDocument();
  });
});
