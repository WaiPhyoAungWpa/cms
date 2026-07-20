import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from "recharts";

import type { CategoryDistribution } from "../../types/dashboard";

import "../../styles/components/dashboard/CategoryDistributionChart.css";

interface Props {
    data: CategoryDistribution[];
}

const COLORS = [
    "#2563eb",
    "#10b981",
    "#f59e0b",
];

export default function CategoryDistributionChart({
    data,
}: Props) {
    return (
        <section className="category-distribution">

            <h2>Content by Category</h2>

            <ResponsiveContainer
                width="100%"
                height={280}
            >
                <PieChart>

                    <Pie
                        data={data}
                        dataKey="count"
                        nameKey="category"
                        outerRadius={100}
                        label
                    >
                        {data.map((_, index) => (
                            <Cell
                                key={index}
                                fill={
                                    COLORS[
                                        index % COLORS.length
                                    ]
                                }
                            />
                        ))}
                    </Pie>

                    <Tooltip />

                    <Legend />

                </PieChart>
            </ResponsiveContainer>

        </section>
    );
}