import React, { useMemo } from 'react';
import {
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
    BarChart, Bar, ScatterChart, Scatter, ZAxis, Cell,
    RadarChart, PolarGrid, PolarAngleAxis, Radar,
    ComposedChart, Line, PieChart, Pie
} from 'recharts';

// --- Helper for Mock Data ---
const genData = (len: number, min = 0, max = 100) =>
    Array.from({ length: len }, (_, i) => ({
        x: i,
        y: Math.random() * (max - min) + min,
        z: Math.random() * 50,
        a: Math.random() * 10,
        b: Math.random() * 10,
        c: Math.random() * 10
    }));

// 1. Volatility Smile (Parabolic Curve)
export const VolatilitySmile = () => {
    const data = Array.from({ length: 21 }, (_, i) => {
        const strike = 80 + i * 2;
        const iv = 0.2 + Math.pow((strike - 100) / 20, 2) * 0.5;
        return { strike, iv: iv * 100 };
    });
    return (
        <ResponsiveContainer>
            <AreaChart data={data}>
                <Area type="monotone" dataKey="iv" stroke="#FFD700" fill="#FFD700" fillOpacity={0.1} />
                <XAxis dataKey="strike" hide />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip contentStyle={{ background: '#050505', border: '1px solid #C0C0C033' }} />
            </AreaChart>
        </ResponsiveContainer>
    );
};

// 2. Order Book Heatmap
export const OrderBookHeatmap = () => {
    const data = useMemo(() => Array.from({ length: 8 }, (_, i) =>
        Array.from({ length: 8 }, (_, j) => ({
            val: Math.random(),
            color: `rgba(255, 215, 0, ${Math.random() * 0.6})`
        }))
    ).flat(), []);
    return (
        <div className="grid grid-cols-8 gap-1 h-full w-full p-2">
            {data.map((d, i) => (
                <div key={i} style={{ backgroundColor: d.color }} className="rounded-sm aspect-square opacity-60 hover:opacity-100 transition-opacity" />
            ))}
        </div>
    );
};

// 3. Neural Entropy Gauge (Pie-based)
export const EntropyGauge = () => {
    const data = [
        { value: 65, fill: '#FFD700' },
        { value: 35, fill: '#1e293b' }
    ];
    return (
        <ResponsiveContainer>
            <PieChart>
                <Pie data={data} innerRadius="70%" outerRadius="100%" startAngle={180} endAngle={0} dataKey="value" stroke="none">
                    {data.map((entry, index) => <Cell key={index} fill={entry.fill} />)}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    );
};

// 4. Alpha Decay Curve
export const AlphaDecay = () => (
    <ResponsiveContainer>
        <AreaChart data={Array.from({ length: 20 }, (_, i) => ({ x: i, y: Math.exp(-i / 5) * 100 }))}>
            <Area type="step" dataKey="y" stroke="#00FF00" fill="#00FF00" fillOpacity={0.1} />
            <XAxis hide /><YAxis hide />
        </AreaChart>
    </ResponsiveContainer>
);

// 5. Signal-to-Noise (Line + Scatter)
export const SignalNoise = () => (
    <ResponsiveContainer>
        <ComposedChart data={Array.from({ length: 30 }, (_, i) => ({ x: i, signal: 50 + Math.sin(i / 2) * 10, noise: 50 + (Math.random() - 0.5) * 20 }))}>
            <Line type="monotone" dataKey="signal" stroke="#FFD700" dot={false} strokeWidth={2} />
            <Scatter dataKey="noise" fill="#475569" shape="cross" />
            <XAxis hide /><YAxis hide />
        </ComposedChart>
    </ResponsiveContainer>
);

// 6. Kurtosis Scatter
export const KurtosisScatter = () => (
    <ResponsiveContainer>
        <ScatterChart>
            <Scatter data={genData(20)} fill="#FFD700" />
            <XAxis hide /><YAxis hide /><ZAxis range={[20, 200]} dataKey="z" />
        </ScatterChart>
    </ResponsiveContainer>
);

// 7. Regime Transition Histogram
export const TransitionMatrix = () => (
    <ResponsiveContainer>
        <BarChart data={genData(10)}>
            <Bar dataKey="y" fill="#DAA520" radius={[2, 2, 0, 0]} />
            <XAxis hide /><YAxis hide />
        </BarChart>
    </ResponsiveContainer>
);

// 8. Order Flow Imbalance
export const FlowImbalance = () => (
    <ResponsiveContainer>
        <BarChart data={Array.from({ length: 15 }, () => ({ a: Math.random() * 50, b: -Math.random() * 50 }))}>
            <Bar dataKey="a" fill="#00FF00" />
            <Bar dataKey="b" fill="#FF4444" />
            <XAxis hide /><YAxis hide />
        </BarChart>
    </ResponsiveContainer>
);

// 9. Portfolio Greeks (Radar)
export const GreeksRadar = () => (
    <ResponsiveContainer>
        <RadarChart data={[
            { subject: 'Delta', A: 120, B: 110 }, { subject: 'Gamma', A: 98, B: 130 },
            { subject: 'Theta', A: 86, B: 130 }, { subject: 'Vega', A: 99, B: 100 },
            { subject: 'Rho', A: 85, B: 90 },
        ]}>
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 8 }} />
            <Radar name="Portfolio" dataKey="A" stroke="#FFD700" fill="#FFD700" fillOpacity={0.5} />
        </RadarChart>
    </ResponsiveContainer>
);

// 10. Drawdown Waterfall
export const DrawdownWaterfall = () => (
    <ResponsiveContainer>
        <AreaChart data={Array.from({ length: 20 }, (_, i) => ({ x: i, y: 100 - (i > 5 ? (i - 5) * 2 : 0) }))}>
            <Area type="monotone" dataKey="y" stroke="#FF4444" fill="#FF4444" fillOpacity={0.1} />
            <XAxis hide /><YAxis hide />
        </AreaChart>
    </ResponsiveContainer>
);

// Group Component to render 20
export const QuantLabCharts = () => {
    const list = [
        { name: 'Volatility Smile', comp: <VolatilitySmile /> },
        { name: 'Order Book Heatmap', comp: <OrderBookHeatmap /> },
        { name: 'Entropy Gauge', comp: <EntropyGauge /> },
        { name: 'Alpha Decay', comp: <AlphaDecay /> },
        { name: 'Signal VS Noise', comp: <SignalNoise /> },
        { name: 'Kurtosis Clusters', comp: <KurtosisScatter /> },
        { name: 'Regime Transitions', comp: <TransitionMatrix /> },
        { name: 'Flow Imbalance', comp: <FlowImbalance /> },
        { name: 'Greeks Exposure', comp: <GreeksRadar /> },
        { name: 'DD Waterfall', comp: <DrawdownWaterfall /> },
        { name: 'Autocorr Lags', comp: <TransitionMatrix /> }, // Reuse some for brevity
        { name: 'Pareto Frontier', comp: <SignalNoise /> },
        { name: 'Sharpe Map', comp: <KurtosisScatter /> },
        { name: 'Skewness Flux', comp: <VolatilitySmile /> },
        { name: 'Liquidity Cascade', comp: <AlphaDecay /> },
        { name: 'Tensor Weights', comp: <FlowImbalance /> },
        { name: 'Market Sentiment', comp: <EntropyGauge /> },
        { name: 'Latent Space', comp: <KurtosisScatter /> },
        { name: 'Backtest PnL', comp: <SignalNoise /> },
        { name: 'Tail Risk', comp: <VolatilitySmile /> },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {list.map((item, i) => (
                <div key={i} className="glass-card p-4 h-[180px] flex flex-col hover:border-aurum-gold/20 transition-all border border-white/5 bg-black/40">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">{item.name}</span>
                    <div className="flex-1 overflow-hidden">{item.comp}</div>
                </div>
            ))}
        </div>
    );
};
