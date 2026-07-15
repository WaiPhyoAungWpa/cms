import { afterEach, describe, expect, it, vi } from "vitest";
import { login } from "./authService";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("login", () => {
  it("shows the invalid-credentials message for a 401 response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response("", {
          status: 401,
        })
      )
    );

    await expect(
      login("wrong-user", "wrong-password")
    ).rejects.toThrow("Invalid username or password.");
  });
  it("shows a rate-limit message for a 429 response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response("", {
          status: 429,
        })
      )
    );

    await expect(
      login("admin", "password")
    ).rejects.toThrow(
      "Too many login attempts. Please wait a minute and try again."
    );
  });

  it("shows a connection message when the request fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Network error"))
    );

    await expect(
      login("admin", "password")
    ).rejects.toThrow(
      "Unable to connect to the server. Please try again later."
    );
  });
});