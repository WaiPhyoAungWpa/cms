import { useEffect, useState } from "react";
import { getPublicDashboard } from "../services/publicDashboardService";
import type { PublicDashboardResponse } from "../types/publicDashboard";

export function usePublicDashboard() {
    const [dashboard, setDashboard] =
        useState<PublicDashboardResponse | null>(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadDashboard() {
            try {
                const data = await getPublicDashboard();
                setDashboard(data);
            } catch {
                setError("Failed to load public dashboard.");
            } finally {
                setLoading(false);
            }
        }

        loadDashboard();
    }, []);

    return {
        dashboard,
        loading,
        error,
    };
}