import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home page", () => {
  it("renders the GreenQuote brand", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { name: "GreenQuote" }),
    ).toBeInTheDocument();
  });
});
