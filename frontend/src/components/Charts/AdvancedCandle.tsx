import React, { useMemo } from 'react';
import {
    ComposedChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Cell, Area, Line, Scatter
} from 'recharts';

interface AdvancedCandleProps {
    data?: any[];
    variant: 'standard' | 'hollow' | 'heikin' | 'mountain' | 'neon' | 'ohlc' | 'step' | 'gradient' | 'minimal' | 'ghost';
    symbol: string;
}

export const AdvancedCandle: React.FC<AdvancedCandleProps> = ({ data, variant, symbol }) => {
    const displayData = useMemo(() => {
        const sourceData = data && data.length > 0 ? data.slice(-40) : Array.from({ length: 40 }, (_, i) => {
            const open = 50000 + Math.random() * 2000;
            const close = open + (Math.random() * 1000 - 500);
            return {
                time: i,
                open,
                close,
                high: Math.max(open, close) + Math.random() * 300,
                low: Math.min(open, close) - Math.random() * 300,
            };
        });

        if (variant === 'heikin') {
            let prevHA = { open: sourceData[0].open, close: sourceData[0].close };
            return sourceData.map((d, i) => {
                const close = (d.open + d.high + d.low + d.close) / 4;
                const open = (prevHA.open + prevHA.close) / 2;
                prevHA = { open, close };
                return { ...d, open, close, haHigh: Math.max(d.high, open, close), haLow: Math.min(d.low, open, close) };
            });
        }
        return sourceData;
    }, [data, variant]);

    const isBull = (d: any) => d.close >= d.open;

    return (
        <div className="w-full h-full p-2 bg-black/20 rounded-2xl border border-white/5 flex flex-col group hover:border-aurum-gold/20 transition-all">
            <div className="flex justify-between items-center px-2 mb-1">
                <span className="text-[10px] font-black text-aurum-gold uppercase tracking-[0.2em]">{symbol}</span>
                <span className="text-[8px] font-mono text-slate-500">{variant.toUpperCase()}</span>
            </div>

            <div className="flex-1 min-h-[120px]">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={displayData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                        <XAxis dataKey="time" hide />
                        <YAxis hide domain={['auto', 'auto']} />

                        {variant === 'mountain' && (
                            <Area type="monotone" dataKey="close" stroke="#FFD700" fill="#FFD700" fillOpacity={0.05} dot={false} isAnimationActive={false} />
                        )}

                        {variant === 'neon' && (
                            <Line type="monotone" dataKey="close" stroke="#FFD700" strokeWidth={2} dot={false} isAnimationActive={false} style={{ filter: 'drop-shadow(0 0 5px #FFD700)' }} />
                        )}

                        {/* Wicks */}
                        {variant !== 'ohlc' && variant !== 'minimal' && (
                            <Bar dataKey="high" fill="#475569" barSize={1} isAnimationActive={false} />
                        )}

                        {/* Bodies */}
                        <Bar
                            dataKey={(d: any) => [d.open, d.close]}
                            barSize={variant === 'minimal' ? 2 : 6}
                            isAnimationActive={false}
                        >
                            {displayData.map((entry, index) => {
                                let fill = isBull(entry) ? '#00FF00' : '#FF4444';
                                let opacity = 0.8;
                                let stroke = 'none';

                                if (variant === 'hollow' && isBull(entry)) {
                                    fill = 'transparent';
                                    stroke = '#00FF00';
                                }
                                if (variant === 'ghost') opacity = index / displayData.length;
                                if (variant === 'gradient') opacity = entry.time % 2 === 0 ? 0.3 : 0.8;

                                return (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={fill}
                                        fillOpacity={opacity}
                                        stroke={stroke}
                                        strokeWidth={1}
                                    />
                                );
                            })}
                        </Bar>

                        {variant === 'ohlc' && (
                            <Scatter dataKey="open" fill="#475569" shape="circle" />
                        )}

                        {variant === 'step' && (
                            <Line type="stepAfter" dataKey="close" stroke="#FFD70040" strokeWidth={1} dot={false} />
                        )}
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
