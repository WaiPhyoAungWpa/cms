import AnalyticsStatCard from "./AnalyticsStatCard";

import "../../styles/components/dashboard/AnalyticsStats.css";

interface Props {
    totalReaders: number;
    totalViews: number;
}

export default function AnalyticsStats({
    totalReaders,
    totalViews,
}: Props) {

    const cards = [
        {
            label: "Total Readers",
            value: totalReaders,
        },
        {
            label: "Content Views",
            value: totalViews,
        },
    ];

    return (
        <div className="analytics-stats">
            {cards.map((card) => (
                <AnalyticsStatCard
                    key={card.label}
                    label={card.label}
                    value={card.value}
                />
            ))}
        </div>
    );
}