import React from 'react';
import {
    ScatterChart, Scatter, XAxis, YAxis, ZAxis,
    CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

interface EfficientFrontierProps {
    data?: any[];
}

export const EfficientFrontier: React.FC<EfficientFrontierProps> = ({ data }) => {
    // Dummy data for Efficient Frontier
    const displayData = data || Array.from({ length: 20 }, (_, i) => ({
        risk: 0.05 + (i * 0.01),
        return: 0.02 + Math.sqrt(i * 0.01) * 0.4 + (Math.random() * 0.005),
        isOptimal: i === 10
    }));

    return (
        <div className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis
                        type="number"
                        dataKey="risk"
                        name="Risk (Vol)"
                        unit="%"
                        stroke="#475569"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        type="number"
                        dataKey="return"
                        name="Return"
                        unit="%"
                        stroke="#475569"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                    />
                    <ZAxis type="number" range={[50, 400]} />
                    <Tooltip
                        cursor={{ strokeDasharray: '3 3' }}
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                    />
                    <Scatter name="Portfolios" data={displayData} fill="#475569">
                        {displayData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.isOptimal ? '#FFD700' : '#475569'}
                                stroke={entry.isOptimal ? '#FFD700' : 'none'}
                                strokeWidth={entry.isOptimal ? 2 : 0}
                            />
                        ))}
                    </Scatter>
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    );
};
