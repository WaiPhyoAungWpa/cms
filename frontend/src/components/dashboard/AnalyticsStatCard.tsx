import "../../styles/components/dashboard/AnalyticsStatCard.css";

interface Props {
    label: string;
    value: number;
}

export default function AnalyticsStatCard({
    label,
    value,
}: Props) {
    return (
        <article className="analytics-stat-card">
            <h3 className="analytics-stat-value">
                {value.toLocaleString()}
            </h3>

            <p className="analytics-stat-label">
                {label}
            </p>
        </article>
    );
}