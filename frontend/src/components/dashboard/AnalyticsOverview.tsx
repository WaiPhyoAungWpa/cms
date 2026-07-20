import type { MonthlyView } from "../../types/dashboard";
import AnalyticsStats from "./AnalyticsStats";
import MonthlyViewsChart from "./MonthlyViewsChart";

import "../../styles/components/dashboard/AnalyticsOverview.css";

interface Props {
    totalReaders: number;
    totalViews: number;
    monthlyViews: MonthlyView[];
    lastUpdated: string;
    dataSource: string;
}

export default function AnalyticsOverview({
    totalReaders,
    totalViews,
    monthlyViews,
    lastUpdated,
    dataSource,
}: Props) {
    return (
        <section className="analytics-overview">

            <h2>Visitor Analytics</h2>

            <AnalyticsStats
                totalReaders={totalReaders}
                totalViews={totalViews}
            />

            <MonthlyViewsChart
                data={monthlyViews}
            />

            <div className="analytics-footer">
                <p>
                    <strong>Last Updated:</strong>{" "}
                    {new Date(lastUpdated).toLocaleString()}
                </p>

                <p>
                    <strong>Data Source:</strong>{" "}
                    {dataSource}
                </p>
            </div>

        </section>
    );
}