import { useNavigate } from "react-router-dom";
import "../../styles/components/dashboard/DashboardHeader.css";

export default function DashboardHeader() {
  const navigate = useNavigate();

    return (
        <header className="dashboard-header">
            <div className="dashboard-header-text">
            <h1>Dashboard</h1>
            <p>Welcome back. Here is an overview of your CMS.</p>
            </div>

            <div className="dashboard-header-actions">
            <button
                className="dashboard-create-button"
                onClick={() => navigate("/content/create")}
            >
                Create Content
            </button>

            <button
                className="dashboard-manage-button"
                onClick={() => navigate("/content")}
            >
                Manage Content
            </button>
            </div>
        </header>
    );
}