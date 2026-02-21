import React from 'react';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend
} from 'recharts';

interface AssetPieProps {
    data?: any[];
}

export const AssetPieChart: React.FC<AssetPieProps> = ({ data }) => {
    const displayData = data || [
        { name: 'Equities', value: 60 },
        { name: 'Bonds', value: 25 },
        { name: 'Crypto', value: 10 },
        { name: 'Cash', value: 5 },
    ];

    const COLORS = ['#FFD700', '#DAA520', '#B8860B', '#8B6508'];

    return (
        <div className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={displayData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                    >
                        {displayData.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                        itemStyle={{ color: '#FFD700' }}
                    />
                    <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase' }} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};
