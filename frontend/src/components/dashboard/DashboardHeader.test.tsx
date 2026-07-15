import { describe, expect, it } from "vitest";
import { MemoryRouter, useLocation } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DashboardHeader from "./DashboardHeader";

function CurrentPath() {
  const location = useLocation();

  return <p>{location.pathname}</p>;
}

describe("DashboardHeader", () => {
  it("removes the token and returns to login when logging out", async () => {
    localStorage.setItem("token", "valid-token");

    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <DashboardHeader />
        <CurrentPath />
      </MemoryRouter>
    );

    await user.click(
      screen.getByRole("button", { name: "Logout" })
    );

    expect(localStorage.getItem("token")).toBeNull();
    expect(screen.getByText("/login")).toBeInTheDocument();
  });
});