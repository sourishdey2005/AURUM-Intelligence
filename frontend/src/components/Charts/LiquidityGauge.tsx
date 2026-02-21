import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const LiquidityGauge: React.FC<{ value?: number }> = ({ value = 75 }) => {
    const data = [
        { value: value, fill: '#FFD700' },
        { value: 100 - value, fill: 'rgba(255,255,255,0.05)' }
    ];

    return (
        <div className="w-full h-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="100%"
                        startAngle={180}
                        endAngle={0}
                        innerRadius="70%"
                        outerRadius="100%"
                        paddingAngle={0}
                        dataKey="value"
                        stroke="none"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-[60%] text-center">
                <div className="text-3xl font-black text-white">{value}%</div>
                <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Liquidity Score</div>
            </div>
        </div>
    );
};
