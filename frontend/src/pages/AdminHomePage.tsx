import { useEffect, useState } from "react";
import { getDashboardSummary } from "../services/dashboardService";
import { DashboardSummary } from "../types/dashboard";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardStats from "../components/dashboard/DashboardStats";
import RecentContent from "../components/dashboard/RecentContent";
import PageState from "../components/common/PageState";
import "../styles/pages/AdminHomePage.css";

export default function AdminHomePage() {
    const [dashboard, setDashboard] = useState<DashboardSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadDashboard() {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
            throw new Error("Not authenticated.");
            }

            const data = await getDashboardSummary(token);

            setDashboard(data);
        } catch (err) {
            if (err instanceof Error) {
            setError(err.message);
            } else {
            setError("Failed to retrieve dashboard.");
            }
        } finally {
            setLoading(false);
        }
        }

        loadDashboard();
    }, []);

    if (loading) {
        return (
            <PageState
            title="Loading dashboard"
            message="Please wait while the dashboard data is being retrieved."
            />
        );
    }

    if (error) {
        return (
            <PageState
            title="Unable to load dashboard"
            message={error}
            actionLabel="Try Again"
            onAction={() => window.location.reload()}
            />
        );
    }

    if (!dashboard) {
        return (
            <PageState
            title="Dashboard data not available"
            message="The dashboard data could not be found."
            actionLabel="Try Again"
            onAction={() => window.location.reload()}
            />
        );
    }

    return (
        <main className="admin-home-page">
            <DashboardHeader />

            <DashboardStats
            totalCount={dashboard.totalCount}
            publishedCount={dashboard.publishedCount}
            draftCount={dashboard.draftCount}
            softDeletedCount={dashboard.softDeletedCount}
            />

            <RecentContent contents={dashboard.recentContents} />
        </main>
    );
}