import { PublicDashboard } from "../../../types/publicDashboard";
import CommunityStats from "./CommunityStats";
import CommunityChart from "./CommunityChart";

import "../../../styles/components/public/CommunitySection.css";

interface Props {
    dashboard: PublicDashboard;
}

export default function CommunitySection({
    dashboard,
}: Props) {
    return (
        <section className="community-section">

            <div className="community-header">
                <h2 className="community-title">
                    Growing Community
                </h2>

                <p className="community-description">
                    A snapshot of community engagement and published content.
                </p>
            </div>

            <CommunityStats
                stats={dashboard.stats}
            />

            <CommunityChart
                data={dashboard.monthlyViews}
            />

            <div className="community-footer">
                <p>
                    <strong>Last Updated:</strong>{" "}
                    {dashboard.lastUpdated}
                </p>

                <p>
                    <strong>Data Source:</strong>{" "}
                    {dashboard.dataSource}
                </p>
            </div>

        </section>
    );
}