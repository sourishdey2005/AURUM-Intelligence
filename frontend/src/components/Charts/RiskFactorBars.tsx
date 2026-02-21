import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Cell, ReferenceLine, ErrorBar
} from 'recharts';

interface RiskFactorBarsProps {
    data?: any[];
}

export const RiskFactorBars: React.FC<RiskFactorBarsProps> = ({ data }) => {
    const displayData = data || [
        { factor: 'Momentum', impact: 45, confidence: 5, color: '#FFD700' },
        { factor: 'Value', impact: -20, confidence: 8, color: '#FF4444' },
        { factor: 'Size', impact: 30, confidence: 4, color: '#DAA520' },
        { factor: 'Volatility', impact: -55, confidence: 12, color: '#FF1111' },
        { factor: 'Liquidity', impact: 15, confidence: 3, color: '#B8860B' },
        { factor: 'Quality', impact: 60, confidence: 6, color: '#00FF00' },
    ];

    // Prepare data for ErrorBar
    const errorData = displayData.map(d => ({
        ...d,
        error: [d.confidence, d.confidence],
        // ErrorBar expects values as absolute differences or range
    }));

    return (
        <div className="h-full w-full p-4">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={errorData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis
                        dataKey="factor"
                        stroke="#475569"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        fontFamily="monospace"
                    />
                    <YAxis
                        stroke="#475569"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) => `${v}%`}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#050505', border: '1px solid #334155', borderRadius: '12px' }}
                        itemStyle={{ color: '#FFD700' }}
                    />
                    <ReferenceLine y={0} stroke="#475569" strokeWidth={1} />
                    <Bar dataKey="impact" radius={[4, 4, 0, 0]} barSize={40}>
                        {errorData.map((entry) => (
                            <Cell key={`cell-${entry.factor}`} fill={entry.impact >= 0 ? entry.color : '#FF4444'} fillOpacity={0.8} />
                        ))}
                        <ErrorBar dataKey="error" width={4} strokeWidth={1} stroke="#ffffff40" />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
