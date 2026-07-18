import { render, screen } from "@testing-library/react";
import { OptimisticLoader } from "./OptimisticLoader";

describe("OptimisticLoader", () => {
  it("announces a loading status", () => {
    render(<OptimisticLoader label="Loading quotes" lines={3} />);
    expect(screen.getByRole("status", { name: "Loading quotes" })).toBeInTheDocument();
  });

  it("renders the requested number of skeleton bars", () => {
    const { container } = render(<OptimisticLoader lines={4} />);
    expect(container.querySelectorAll("[class*='bar']")).toHaveLength(4);
  });
});
