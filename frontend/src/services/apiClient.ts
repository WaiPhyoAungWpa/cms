import { API_BASE_URL } from "../config/api";
import type { PublicDashboardResponse } from "../types/publicDashboard";

export async function getPublicDashboard(): Promise<PublicDashboardResponse> {
    const response = await fetch(`${API_BASE_URL}/public/dashboard`);

    if (!response.ok) {
        throw new Error("Failed to retrieve public dashboard.");
    }

    return response.json();
}