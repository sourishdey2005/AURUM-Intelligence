import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';

interface MonteCarloChartProps {
    data?: any[];
}

export const MonteCarloChart: React.FC<MonteCarloChartProps> = ({ data }) => {
    // Generate dummy simulation data if none provided
    const displayData = data || Array.from({ length: 50 }, (_, i) => {
        const point: any = { time: i };
        point.mean = 100 + i * 0.5;
        point.upper95 = point.mean + Math.sqrt(i) * 2;
        point.lower95 = point.mean - Math.sqrt(i) * 2;
        point.upper50 = point.mean + Math.sqrt(i) * 0.8;
        point.lower50 = point.mean - Math.sqrt(i) * 0.8;
        return point;
    });

    return (
        <div className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={displayData}>
                    <defs>
                        <linearGradient id="color95" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#FFD700" stopOpacity={0.1} />
                            <stop offset="95%" stopColor="#FFD700" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis
                        dataKey="time"
                        stroke="#475569"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#475569"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        domain={['auto', 'auto']}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                        itemStyle={{ color: '#FFD700' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="upper95"
                        stroke="none"
                        fill="#FFD700"
                        fillOpacity={0.05}
                    />
                    <Area
                        type="monotone"
                        dataKey="lower95"
                        stroke="none"
                        fill="#FFD700"
                        fillOpacity={0.05}
                    />
                    <Area
                        type="monotone"
                        dataKey="upper50"
                        stroke="none"
                        fill="#FFD700"
                        fillOpacity={0.1}
                    />
                    <Area
                        type="monotone"
                        dataKey="lower50"
                        stroke="none"
                        fill="#FFD700"
                        fillOpacity={0.1}
                    />
                    <Line
                        type="monotone"
                        dataKey="mean"
                        stroke="#FFD700"
                        strokeWidth={2}
                        dot={false}
                        animationDuration={2000}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};
