import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import type { TrafficSource } from "../../types/dashboard";

import "../../styles/components/dashboard/TrafficSourcesChart.css";

interface Props {
    data: TrafficSource[];
}

export default function TrafficSourcesChart({
    data,
}: Props) {
    return (
        <section className="traffic-sources">

            <h2>Traffic Sources</h2>

            <div className="traffic-sources-chart">
                <ResponsiveContainer
                    width="100%"
                    height={280}
                >
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{
                            top: 12,
                            right: 24,
                            left: 24,
                            bottom: 12,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis type="number" />

                        <YAxis
                            type="category"
                            dataKey="source"
                            width={100}
                        />

                        <Tooltip />

                        <Bar
                            dataKey="sessions"
                            fill="#2563eb"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </section>
    );
}