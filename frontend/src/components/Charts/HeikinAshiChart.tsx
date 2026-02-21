import React, { useMemo } from 'react';
import {
    ComposedChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Cell, Area
} from 'recharts';

interface HeikinAshiChartProps {
    data?: any[];
}

export const HeikinAshiChart: React.FC<HeikinAshiChartProps> = ({ data }) => {
    // Heikin-Ashi formulas:
    // Close = (Open + High + Low + Close) / 4
    // Open = (Previous Open + Previous Close) / 2
    // High = Max(High, Open, Close)
    // Low = Min(Low, Open, Close)

    const haData = useMemo(() => {
        const sourceData = data && data.length > 0 ? data : Array.from({ length: 60 }, (_, i) => ({
            open: 100 + Math.random() * 20,
            close: 100 + Math.random() * 20,
            high: 125,
            low: 95,
            time: i
        }));

        let prevHA = { open: sourceData[0].open, close: sourceData[0].close };

        return sourceData.map((d, i) => {
            if (i === 0) return { ...d, haOpen: d.open, haClose: d.close, haHigh: d.high, haLow: d.low };

            const close = (d.open + d.high + d.low + d.close) / 4;
            const open = (prevHA.open + prevHA.close) / 2;
            const high = Math.max(d.high, open, close);
            const low = Math.min(d.low, open, close);

            prevHA = { open, close };

            return {
                time: d.time,
                open: open,
                close: close,
                high: high,
                low: low,
                color: close >= open ? '#00FF00' : '#FF4444'
            };
        });
    }, [data]);

    return (
        <div className="h-full w-full relative">
            <div className="absolute top-0 right-0 p-2 z-10">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded">Heikin-Ashi Weighted</span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={haData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="1 5" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="time" hide />
                    <YAxis domain={['auto', 'auto']} hide />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#050505', border: '1px solid #334155', borderRadius: '12px' }}
                        labelStyle={{ display: 'none' }}
                    />

                    {/* Background Trend Glow */}
                    <Area
                        type="monotone"
                        dataKey="close"
                        stroke="none"
                        fill="url(#trendFill)"
                        fillOpacity={0.1}
                        isAnimationActive={false}
                    />

                    <defs>
                        <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#FFD700" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#FFD700" stopOpacity={0} />
                        </linearGradient>
                    </defs>

                    {/* HA Wicks */}
                    <Bar dataKey="high" fill="#475569" barSize={1} isAnimationActive={false} />

                    {/* HA Bodies */}
                    <Bar dataKey={(d: any) => [d.open, d.close]} barSize={8}>
                        {haData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.6} />
                        ))}
                    </Bar>
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
};
