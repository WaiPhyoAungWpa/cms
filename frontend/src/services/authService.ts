import { API_BASE_URL } from "../config/api";

interface LoginResponse {
    token: string;
}

export type SessionStatus = "valid" | "invalid" | "unavailable";

export async function login(
  username: string,
  password: string
): Promise<LoginResponse> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/Auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });
  } catch {
    throw new Error(
      "Unable to connect to the server. Please try again later."
    );
  }

  if (response.status === 401) {
    throw new Error("Invalid username or password.");
  }

  if (response.status === 429) {
    throw new Error(
      "Too many login attempts. Please wait a minute and try again."
    );
  }

  if (!response.ok) {
    throw new Error(
      "Unable to sign in right now. Please try again later."
    );
  }

  return response.json();
}

export async function verifySession(
  token: string
): Promise<SessionStatus> {
  try {
    const response = await fetch(`${API_BASE_URL}/Auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      return "valid";
    }

    if (response.status === 401 || response.status === 403) {
      return "invalid";
    }

    return "unavailable";
  } catch {
    return "unavailable";
  }
}