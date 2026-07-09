import "../../styles/components/dashboard/DashboardStatCard.css";

interface Props {
  label: string;
  count: number;
}

export default function DashboardStatCard({
  label,
  count,
}: Props) {
    return (
        <div className="dashboard-stat-card">
            <p className="dashboard-stat-label">{label}</p>
            <strong className="dashboard-stat-count">{count}</strong>
        </div>
    );
}