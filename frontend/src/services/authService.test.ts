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
});