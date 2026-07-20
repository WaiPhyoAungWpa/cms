import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import type { MonthlyView } from "../../types/dashboard";

import "../../styles/components/dashboard/MonthlyViewsChart.css";

interface Props {
    data: MonthlyView[];
}

export default function MonthlyViewsChart({
    data,
}: Props) {
    return (
        <div className="monthly-views-chart">

            <h3 className="monthly-views-title">
                Monthly Content Views
            </h3>

            <ResponsiveContainer
                width="100%"
                height={360}
            >
                <LineChart
                    data={data}
                    margin={{
                        top: 12,
                        right: 24,
                        left: 12,
                        bottom: 12,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="month" />

                    <YAxis
                        tickFormatter={(value) => `${value / 1000}k`}
                    />

                    <Tooltip
                        formatter={(value) => [
                            Number(value).toLocaleString(),
                            "Views",
                        ]}
                    />

                    <Line
                        type="natural"
                        dataKey="views"
                        stroke="#2563eb"
                        strokeWidth={3}
                        dot={false}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>

        </div>
    );
}