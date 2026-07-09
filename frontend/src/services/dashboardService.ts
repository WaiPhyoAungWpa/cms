import { API_BASE_URL } from "../config/api";
import { DashboardSummary } from "../types/dashboard";

const API_URL = `${API_BASE_URL}/dashboard`;

export async function getDashboardSummary(
  token: string
): Promise<DashboardSummary> {
  const response = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to retrieve dashboard summary.");
  }

  return response.json();
}