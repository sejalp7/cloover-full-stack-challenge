import { fireEvent, render, screen } from "@testing-library/react";
import { RegisterForm } from "./RegisterForm";
import { apiClient } from "@/lib/api";

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

describe("RegisterForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("blocks submit when required fields are empty", () => {
    render(<RegisterForm />);

    fireEvent.click(screen.getByRole("button", { name: "Create account" }));

    expect(screen.getByText("Full name is required")).toBeInTheDocument();
    expect(screen.getByText("Email is required")).toBeInTheDocument();
    expect(screen.getByText("Password is required")).toBeInTheDocument();
    expect(apiClient.post).not.toHaveBeenCalled();
  });
});
