import { CommunityStats as CommunityStatsType } from "../../../types/publicDashboard";
import CommunityStatCard from "./CommunityStatCard";

interface Props {
    stats: CommunityStatsType;
}

export default function CommunityStats({
    stats,
}: Props) {

    const cards = [
        {
            label: "Total Readers",
            value: stats.totalReaders,
        },
        {
            label: "Content Views",
            value: stats.totalViews,
        },
        {
            label: "Published Articles",
            value: stats.publishedContent,
        },
        {
            label: "Categories",
            value: stats.categories,
        },
    ];

    return (
        <div className="community-stats">
            {cards.map((card) => (
                <CommunityStatCard
                    key={card.label}
                    label={card.label}
                    value={card.value}
                />
            ))}
        </div>
    );
}