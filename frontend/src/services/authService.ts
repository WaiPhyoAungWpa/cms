import { API_BASE_URL } from "../config/api";

interface LoginResponse {
    token: string;
}

export async function login(
    username: string,
    password: string
): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/Auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username,
            password,
        }),
    });

    if (!response.ok) {
        throw new Error("Invalid username or password.");
    }

    return response.json();
}