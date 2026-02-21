import React, { useMemo } from 'react';
import {
    ComposedChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Cell, Line, ReferenceLine, ReferenceArea
} from 'recharts';

interface CandlestickChartProps {
    data?: any[];
}

export const CandlestickChart: React.FC<CandlestickChartProps> = ({ data }) => {
    // Generate a larger set of mock data if none provided
    const displayData = useMemo(() => {
        if (data && data.length > 0) {
            // Add MA to provided data
            return data.map((d, i, arr) => {
                const window = 10;
                const start = Math.max(0, i - window);
                const subset = arr.slice(start, i + 1);
                const ma = subset.reduce((acc, curr) => acc + curr.close, 0) / subset.length;
                return { ...d, ma };
            });
        }

        const count = 100;
        let prevClose = 62000;
        return Array.from({ length: count }, (_, i) => {
            const open = prevClose + (Math.random() * 400 - 200);
            const close = open + (Math.random() * 600 - 300);
            const high = Math.max(open, close) + Math.random() * 150;
            const low = Math.min(open, close) - Math.random() * 150;
            prevClose = close;

            // Basic EMA-like moving average calculation
            return {
                time: i,
                open,
                close,
                high,
                low,
                volume: Math.random() * 1000 + 500,
                ma: open * 0.995 + Math.random() * 500 // Mock MA for visualization
            };
        });
    }, [data]);

    return (
        <div className="h-full w-full relative group">
            {/* Absolute overlay for "Institutional" Feel */}
            <div className="absolute top-2 left-10 z-10 pointer-events-none opacity-40">
                <div className="flex gap-4">
                    <span className="text-[8px] font-black text-white flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-aurum-gold"></span> MA(10): {displayData[displayData.length - 1]?.ma?.toFixed(2)}
                    </span>
                    <span className="text-[8px] font-black text-[#00FF00] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00FF00]"></span> BULL_BIAS_STRENGTH: 0.82
                    </span>
                </div>
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={displayData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="1 4" stroke="#ffffff10" vertical={false} />
                    <XAxis
                        dataKey="time"
                        stroke="#334155"
                        fontSize={8}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: '#475569' }}
                    />
                    <YAxis
                        yAxisId="price"
                        stroke="#334155"
                        fontSize={8}
                        tickLine={false}
                        axisLine={false}
                        domain={['auto', 'auto']}
                        orientation="right"
                        tick={{ fill: '#475569' }}
                    />
                    <YAxis
                        yAxisId="volume"
                        orientation="left"
                        domain={[0, (data: any) => Math.max(...displayData.map(d => d.volume || 0)) * 4]}
                        hide
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(5, 5, 5, 0.9)',
                            border: '1px solid rgba(255, 215, 0, 0.2)',
                            borderRadius: '12px',
                            backdropFilter: 'blur(8px)',
                            fontSize: '10px'
                        }}
                        itemStyle={{ color: '#FFD700', padding: '2px 0' }}
                        cursor={{ stroke: '#ffffff20', strokeWidth: 1 }}
                    />

                    {/* Volume Bars */}
                    <Bar
                        yAxisId="volume"
                        dataKey="volume"
                        isAnimationActive={false}
                    >
                        {displayData.map((entry) => (
                            <Cell
                                key={`cell-vol-${entry.time}`}
                                fill={entry.close >= entry.open ? '#00FF0030' : '#FF444430'}
                            />
                        ))}
                    </Bar>

                    {/* Visualizing Wick as a narrow bar */}
                    <Bar
                        yAxisId="price"
                        dataKey="high"
                        fill="#475569"
                        barSize={1}
                        isAnimationActive={false}
                    />

                    {/* Visualizing Body as a wider bar with custom logic */}
                    <Bar
                        yAxisId="price"
                        dataKey={(d: any) => [d.open, d.close]}
                        barSize={6}
                    >
                        {displayData.map((entry) => (
                            <Cell
                                key={`cell-body-${entry.time}`}
                                fill={entry.close >= entry.open ? '#00FF00' : '#FF4444'}
                                fillOpacity={0.8}
                                stroke={entry.close >= entry.open ? '#00FF00' : '#FF4444'}
                                strokeWidth={1}
                            />
                        ))}
                    </Bar>

                    {/* Bollinger Bands (Shaded Area) */}
                    <ReferenceArea
                        y1={displayData[20]?.ma * 0.95}
                        y2={displayData[20]?.ma * 1.05}
                        fill="#FFD700"
                        fillOpacity={0.05}
                    />

                    {/* Trend Line (MA) */}
                    <Line
                        yAxisId="price"
                        type="monotone"
                        dataKey="ma"
                        stroke="#FFD700"
                        dot={false}
                        strokeWidth={1.5}
                        strokeDasharray="3 3"
                        opacity={0.6}
                    />

                    {/* Support/Resistance "Line Markings" */}
                    <ReferenceLine yAxisId="price" y={displayData[Math.floor(displayData.length * 0.3)]?.high} stroke="#ffffff15" strokeDasharray="5 5" label={{ position: 'right', value: 'RES_LEVEL', fill: '#64748b', fontSize: 7, fontWeight: 900 }} />
                    <ReferenceLine yAxisId="price" y={displayData[Math.floor(displayData.length * 0.7)]?.low} stroke="#ffffff15" strokeDasharray="5 5" label={{ position: 'right', value: 'SUP_LEVEL', fill: '#64748b', fontSize: 7, fontWeight: 900 }} />

                    {/* Vertical Time Marker */}
                    <ReferenceLine yAxisId="price" x={displayData[displayData.length - 10]?.time} stroke="#FFD70030" strokeWidth={1} label={{ position: 'top', value: 'EVENT_HORIZON', fill: '#FFD700', fontSize: 7, opacity: 0.5 }} />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
};
