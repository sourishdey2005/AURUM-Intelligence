import React, { useMemo } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const symbols = [
    { s: 'AAPL', n: 'Apple Inc.', p: '182.41', c: '+1.2%' },
    { s: 'MSFT', n: 'Microsoft Corp.', p: '402.12', c: '+0.8%' },
    { s: 'GOOGL', n: 'Alphabet Inc.', p: '142.10', c: '-0.3%' },
    { s: 'AMZN', n: 'Amazon.com Inc.', p: '175.22', c: '+2.1%' },
    { s: 'NVDA', n: 'NVIDIA Corp.', p: '822.45', c: '+4.5%' },
    { s: 'TSLA', n: 'Tesla, Inc.', p: '193.57', c: '-1.8%' },
    { s: 'META', n: 'Meta Platforms', p: '484.03', c: '+0.5%' },
    { s: 'AVGO', n: 'Broadcom Inc.', p: '1245.10', c: '+1.4%' },
    { s: 'BRK.B', n: 'Berkshire Hathaway', p: '408.20', c: '+0.2%' },
    { s: 'LLY', n: 'Eli Lilly & Co.', p: '762.14', c: '+0.9%' },
    { s: 'JPM', n: 'JPMorgan Chase', p: '192.11', c: '+0.4%' },
    { s: 'UNH', n: 'UnitedHealth Group', p: '492.45', c: '-0.7%' },
    { s: 'V', n: 'Visa Inc.', p: '282.10', c: '+0.3%' },
    { s: 'XOM', n: 'Exxon Mobil Corp.', p: '112.50', c: '-0.2%' },
    { s: 'MA', n: 'Mastercard Inc.', p: '462.80', c: '+0.6%' },
    { s: 'HD', n: 'Home Depot Inc.', p: '362.15', c: '+0.1%' },
    { s: 'PG', n: 'Procter & Gamble', p: '162.30', c: '-0.1%' },
    { s: 'JNJ', n: 'Johnson & Johnson', p: '158.40', c: '-0.4%' },
    { s: 'ASML', n: 'ASML Holding', p: '942.10', c: '+1.8%' },
    { s: 'COST', n: 'Costco Wholesale', p: '722.15', c: '+0.7%' },
];

const Sparkline = ({ color }: { color: string }) => {
    const data = useMemo(() => Array.from({ length: 10 }, (_, i) => ({ y: Math.random() * 50 + 50 })), []);
    return (
        <ResponsiveContainer width={60} height={20}>
            <LineChart data={data}>
                <Line type="monotone" dataKey="y" stroke={color} strokeWidth={1.5} dot={false} isAnimationActive={false} />
            </LineChart>
        </ResponsiveContainer>
    );
};

export const AssetMatrix: React.FC = () => {
    return (
        <div className="w-full h-full overflow-y-auto custom-scrollbar pr-2">
            <div className="grid grid-cols-1 gap-1">
                {symbols.map((item, i) => {
                    const isUp = item.c.startsWith('+');
                    const color = isUp ? '#00FF00' : '#FF4444';
                    return (
                        <div key={item.s} className="flex items-center justify-between p-3 bg-white/[0.02] hover:bg-white/[0.05] rounded-xl border border-white/[0.03] transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center font-black text-[10px] text-aurum-gold border border-white/5">
                                    {item.s[0]}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-black text-white">{item.s}</span>
                                    <span className="text-[10px] text-slate-500 font-bold truncate w-24">{item.n}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <Sparkline color={color} />
                                <div className="text-right w-20">
                                    <div className="text-xs font-black text-white tabular-nums">${item.p}</div>
                                    <div className={`text-[10px] font-black flex items-center justify-end gap-1 ${isUp ? 'text-[#00FF00]' : 'text-red-500'}`}>
                                        {isUp ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                                        {item.c}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
