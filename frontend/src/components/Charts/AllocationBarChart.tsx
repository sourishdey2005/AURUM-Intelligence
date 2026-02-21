import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Cell, Legend
} from 'recharts';

interface AllocationBarProps {
    data?: any[];
}

export const AllocationBarChart: React.FC<AllocationBarProps> = ({ data }) => {
    const displayData = data || [
        { name: 'Tech', value: 40, color: '#FFD700' },
        { name: 'Fin', value: 30, color: '#B8860B' },
        { name: 'Health', value: 20, color: '#DAA520' },
        { name: 'Energy', value: 10, color: '#8B6508' },
    ];

    return (
        <div className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={displayData} layout="vertical" margin={{ left: 20, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis
                        type="category"
                        dataKey="name"
                        stroke="#94a3b8"
                        fontSize={10}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                        itemStyle={{ color: '#FFD700' }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {displayData.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.color || '#FFD700'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
