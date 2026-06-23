import { CreateContentRequest } from "../types/content";

const API_URL = "http://localhost:5160/api/content";

export async function publishContent(
  request: CreateContentRequest,
  token: string
) {
  const response = await fetch(`${API_URL}/publish`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error("Failed to publish content");
  }

  return response.json();
}

export async function saveDraft(
  request: CreateContentRequest,
  token: string
) {
  const response = await fetch(`${API_URL}/draft`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error("Failed to save draft");
  }

  return response.json();
}