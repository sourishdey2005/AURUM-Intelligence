import React from 'react';
import {
    Radar, RadarChart, PolarGrid,
    PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from 'recharts';

const data = [
    { subject: 'Momentum', A: 120, fullMark: 150 },
    { subject: 'Value', A: 98, fullMark: 150 },
    { subject: 'Quality', A: 86, fullMark: 150 },
    { subject: 'Low Vol', A: 99, fullMark: 150 },
    { subject: 'Size', A: 85, fullMark: 150 },
    { subject: 'Liquidity', A: 65, fullMark: 150 },
];

export const FactorExposureRadar = () => {
    return (
        <div className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                    <Radar
                        name="Portfolio"
                        dataKey="A"
                        stroke="#FFD700"
                        fill="#FFD700"
                        fillOpacity={0.6}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};
