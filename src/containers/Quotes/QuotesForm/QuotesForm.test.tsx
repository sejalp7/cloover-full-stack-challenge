import { fireEvent, render, screen } from "@testing-library/react";
import { QuotesForm } from "./QuotesForm";
import { apiClient } from "@/lib/api";
import type { SessionUser } from "@/types/user";

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
});
