import { describe, expect, it } from "vitest";
import { MemoryRouter, useLocation } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NotFoundPage from "./NotFoundPage";

function CurrentPath() {
  const location = useLocation();

  return <p>{location.pathname}</p>;
}

describe("NotFoundPage", () => {
  it("returns to the public home page", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/missing-page"]}>
        <NotFoundPage />
        <CurrentPath />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: "Page not found" })
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Back to Home" })
    );

    expect(screen.getByText("/")).toBeInTheDocument();
  });
});