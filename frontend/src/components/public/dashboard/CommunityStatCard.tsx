interface Props {
    label: string;
    value: number;
}

export default function CommunityStatCard({
    label,
    value,
}: Props) {
    return (
        <article className="community-stat-card">

            <h3 className="community-stat-value">
                {value.toLocaleString()}
            </h3>

            <p className="community-stat-label">
                {label}
            </p>

        </article>
    );
}