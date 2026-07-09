import DashboardStatCard from "./DashboardStatCard";
import "../../styles/components/dashboard/DashboardStats.css";

interface Props {
  totalCount: number;
  publishedCount: number;
  draftCount: number;
  softDeletedCount: number;
}

export default function DashboardStats({
  totalCount,
  publishedCount,
  draftCount,
  softDeletedCount,
}: Props) {
    return (
        <section className="dashboard-stats">
            <h2>Content Overview</h2>

            <div className="dashboard-stats-grid">
            <DashboardStatCard label="Total Content" count={totalCount} />
            <DashboardStatCard label="Published" count={publishedCount} />
            <DashboardStatCard label="Drafts" count={draftCount} />
            <DashboardStatCard label="Soft-Deleted" count={softDeletedCount} />
            </div>
        </section>
    );
}