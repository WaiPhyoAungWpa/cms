import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  MemoryRouter,
  Route,
  Routes,
} from "react-router-dom";
import {
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { verifySession } from "../services/authService";
import ProtectedRoute from "./ProtectedRoute";

vi.mock("../services/authService", () => ({
  verifySession: vi.fn(),
}));

const mockedVerifySession = vi.mocked(verifySession);

function renderProtectedRoute() {
  render(
    <MemoryRouter initialEntries={["/admin"]}>
      <Routes>
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <p>Admin page</p>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<p>Login page</p>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("ProtectedRoute", () => {
  beforeEach(() => {
    localStorage.clear();
    mockedVerifySession.mockReset();
  });

  it("redirects to login when there is no token", () => {
    renderProtectedRoute();

    expect(screen.getByText("Login page")).toBeInTheDocument();
  });

  it("redirects to login and removes an invalid token", async () => {
    localStorage.setItem("token", "expired-token");
    mockedVerifySession.mockResolvedValue("invalid");

    renderProtectedRoute();

    await waitFor(() => {
      expect(screen.getByText("Login page")).toBeInTheDocument();
    });

    expect(localStorage.getItem("token")).toBeNull();
  });

  it("shows protected content when the token is valid", async () => {
    localStorage.setItem("token", "valid-token");
    mockedVerifySession.mockResolvedValue("valid");

    renderProtectedRoute();

    expect(await screen.findByText("Admin page")).toBeInTheDocument();
  });
});