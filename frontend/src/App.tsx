import React, { useState, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, Shield, PieChart, TrendingUp, Zap, Info, Bell, User, LayoutDashboard, Cpu, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import './App.css'

import { FactorExposureRadar } from './components/Charts/FactorExposureRadar'
import { RiskSurface3D } from './components/Charts/RiskSurface3D'
import { RegimeHeatmap } from './components/Charts/RegimeHeatmap'
import { MonteCarloChart } from './components/Charts/MonteCarloChart'
import { EfficientFrontier } from './components/Charts/EfficientFrontier'
import { CandlestickChart } from './components/Charts/CandlestickChart'
import { AllocationBarChart } from './components/Charts/AllocationBarChart'
import { AssetPieChart } from './components/Charts/AssetPieChart'
import { CorrelationMatrix } from './components/Charts/CorrelationMatrix'
import { LiquidityGauge } from './components/Charts/LiquidityGauge'
import { RiskFactorBars } from './components/Charts/RiskFactorBars'
import { HeikinAshiChart } from './components/Charts/HeikinAshiChart'
import { AdvancedCandle } from './components/Charts/AdvancedCandle'
import { QuantLabCharts } from './components/Charts/QuantLabCharts'
import { MarketTreemap } from './components/Charts/MarketTreemap'
import { AssetMatrix } from './components/Charts/AssetMatrix'
import { Globe, Beaker, Briefcase } from 'lucide-react'

function App() {
    const [currentView, setCurrentView] = useState<'overview' | 'trading' | 'portfolio' | 'risk' | 'wall' | 'lab' | 'equities'>('overview');
    const [activePlot, setActivePlot] = useState<'frontier' | 'spectrum'>('frontier');
    const [selectedSymbols, setSelectedSymbols] = useState<string[]>(['AAPL', 'NVDA', 'BTC/USD', 'TSLA', 'OIL']);
    const [multiOhlcData, setMultiOhlcData] = useState<Record<string, any[]>>({});
    const [logs, setLogs] = useState<string[]>([
        "AURUM Engine Initialized...",
        "Connecting to High-Frequency Data Stream...",
        "Regime Detector: Current State = BULL_STABLE",
        "Portfolio Weights Re-balanced (Optimization Target: Max Sharpe)"
    ]);

    const [marketStatus, setMarketStatus] = useState("LIVE_TRADING_ACTIVE");
    const [monteCarloData, setMonteCarloData] = useState<any[]>([]);
    const [frontierData, setFrontierData] = useState<any[]>([]);
    const [ohlcData, setOhlcData] = useState<any[]>([]);
    const [allocationData, setAllocationData] = useState<any>(null);
    const [trades, setTrades] = useState<any[]>([]);

    const fetchData = async () => {
        try {
            // Concurrent Multi-Stream Fetching
            const ohlcPromises = selectedSymbols.map(s =>
                fetch(`http://localhost:8000/api/v1/portfolio/market/ohlc?symbol=${encodeURIComponent(s)}`).then(r => r.json())
            );

            const [simRes, frontierRes, ohlcResults, allocRes, tradesRes] = await Promise.all([
                fetch('http://localhost:8000/api/v1/portfolio/simulation'),
                fetch('http://localhost:8000/api/v1/portfolio/frontier'),
                Promise.all(ohlcPromises),
                fetch('http://localhost:8000/api/v1/portfolio/allocation'),
                fetch('http://localhost:8000/api/v1/portfolio/trades/history'),
            ]);

            const simData = await simRes.json();
            const frontierJson = await frontierRes.json();
            const allocJson = await allocRes.json();
            const tradesJson = await tradesRes.json();

            // Hydrate Multi-Asset Data Store
            const newMultiOhlc: Record<string, any[]> = {};
            ohlcResults.forEach(res => {
                newMultiOhlc[res.symbol] = res.data;
            });
            setMultiOhlcData(newMultiOhlc);

            const paths = simData.paths;
            const processedSim = paths[0].map((_: any, t: number) => {
                const valuesAtT = paths.map((path: any) => path[t]);
                valuesAtT.sort((a: number, b: number) => a - b);
                return {
                    time: t,
                    mean: valuesAtT[Math.floor(valuesAtT.length / 2)],
                    upper95: valuesAtT[Math.floor(valuesAtT.length * 0.95)],
                    lower95: valuesAtT[Math.floor(valuesAtT.length * 0.05)],
                    upper50: valuesAtT[Math.floor(valuesAtT.length * 0.75)],
                    lower50: valuesAtT[Math.floor(valuesAtT.length * 0.25)],
                };
            });

            setMonteCarloData(processedSim);
            setFrontierData(frontierJson.points.map((p: any) => ({ ...p, risk: p.risk * 100, return: p.return * 100 })));
            setAllocationData(allocJson);
            setTrades(tradesJson.trades);
        } catch (err) {
            console.error("Failed to fetch backend data:", err);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const newLog = `System: [${new Date().toLocaleTimeString()}] ${[
                "Neural net re-training complete",
                "Processing order TX-95842",
                "Volatility anomaly detected in KRW/JPY",
                "Adjusting liquidity threshold",
                "Backtest scenario 'NuclearWinter' passed",
                "Portfolio variance hit 0.05 threshold",
                "Execution node re-balanced to Tokyo"
            ][Math.floor(Math.random() * 7)]}`;
            setLogs(prev => [...prev.slice(-12), newLog]);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const sidebarItems = [
        { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
        { id: 'trading', icon: Activity, label: 'Live Trading' },
        { id: 'wall', icon: Globe, label: 'Market Wall' },
        { id: 'equities', icon: Briefcase, label: 'Global Equities' },
        { id: 'lab', icon: Beaker, label: 'Analytics Lab' },
        { id: 'portfolio', icon: PieChart, label: 'Portfolio' },
        { id: 'risk', icon: Shield, label: 'Risk Engine' },
    ];

    return (
        <div className="min-h-screen bg-[#070707] text-slate-50 font-sans selection:bg-aurum-gold selection:text-black overflow-x-hidden">
            <div className="fixed left-0 top-0 h-full w-20 bg-black/40 backdrop-blur-2xl border-r border-white/5 flex flex-col items-center py-8 gap-8 z-50">
                <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    onClick={() => setCurrentView('overview')}
                    className="w-12 h-12 bg-aurum-gold rounded-2xl flex items-center justify-center font-black text-black text-xl shadow-[0_0_20px_rgba(255,215,0,0.3)] cursor-pointer mb-4"
                >A</motion.div>

                <div className="flex flex-col gap-6">
                    {sidebarItems.map((item) => (
                        <motion.div
                            key={item.id}
                            whileHover={{ scale: 1.2, x: 5 }}
                            onClick={() => setCurrentView(item.id as any)}
                            className={`p-3 rounded-xl cursor-pointer transition-all relative group ${currentView === item.id ? 'bg-aurum-gold text-black shadow-[0_0_15px_rgba(255,215,0,0.4)]' : 'text-slate-500 hover:text-aurum-gold'}`}
                        >
                            <item.icon className="w-5 h-5" />
                            <div className="absolute left-20 bg-aurum-gold text-black px-3 py-1 rounded text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none uppercase whitespace-nowrap shadow-xl">
                                {item.label}
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-auto flex flex-col gap-6 opacity-40">
                    <Bell className="w-5 h-5 hover:text-aurum-gold cursor-pointer transition-colors" />
                    <User className="w-5 h-5 hover:text-aurum-gold cursor-pointer transition-colors" />
                </div>
            </div>

            <div className="ml-20 p-8 pb-12">
                <header className="flex justify-between items-start mb-8">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <h2 className="text-aurum-gold font-mono text-[10px] uppercase tracking-[0.5em] mb-2 font-bold opacity-60 flex items-center gap-2">
                            <span className="w-2 h-2 bg-aurum-gold rounded-full animate-ping"></span> TERMINAL_NODE :: 0x8F2A :: ACTIVE
                        </h2>
                        <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">
                            AURUM <span className="text-aurum-gold italic">Intelligence</span>
                        </h1>
                    </motion.div>

                    <div className="flex gap-4">
                        <div className="glass-card p-4 px-8 flex flex-col justify-center">
                            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 font-bold">Total AUM Control</div>
                            <div className="text-white text-2xl font-black tabular-nums tracking-tighter">$94,204,500.00</div>
                        </div>
                        <div className="bg-aurum-gold/10 p-4 px-8 rounded-2xl border border-aurum-gold/20 backdrop-blur-xl flex flex-col justify-center">
                            <div className="text-[10px] text-aurum-gold/70 uppercase tracking-widest mb-1 font-bold">Engine Sync Status</div>
                            <div className="text-[#00FF00] text-xs flex items-center gap-2 font-black uppercase tracking-widest">
                                <span className="w-2 h-2 rounded-full bg-[#00FF00] shadow-[0_0_10px_#00FF00]"></span>
                                LATEST_BLOCK_OK
                            </div>
                        </div>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentView}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.4, ease: "circOut" }}
                    >
                        {currentView === 'overview' && (
                            <div className="grid grid-cols-12 gap-6">
                                <div className="col-span-12 grid grid-cols-4 gap-6 mb-2">
                                    {[
                                        { label: 'Realized Alpha', val: '+12.4%', pct: '30D TRAILING', color: 'text-aurum-gold', icon: TrendingUp },
                                        { label: 'Optimal Sharpe', val: '4.18', pct: 'REBALANCED', color: 'text-white', icon: Activity },
                                        { label: 'Vol Target', val: '8.5%', pct: 'STABLE', color: 'text-blue-400', icon: Shield },
                                        { label: 'Neural Accuracy', val: '98.2%', pct: 'TRAINED', color: 'text-[#00FF00]', icon: Cpu },
                                    ].map((stat, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="glass-card p-6 flex flex-col justify-center border-l-4 border-l-aurum-gold relative overflow-hidden group hover:bg-white/[0.03] transition-colors"
                                        >
                                            <stat.icon className="absolute -right-4 -bottom-4 w-24 h-24 opacity-5 group-hover:opacity-10 transition-opacity rotate-12" />
                                            <span className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em] mb-2">{stat.label}</span>
                                            <div className="flex items-baseline gap-2">
                                                <span className={`text-3xl font-black ${stat.color} tracking-tighter`}>{stat.val}</span>
                                                <span className="text-[9px] font-black opacity-40 uppercase tracking-widest">{stat.pct}</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="col-span-12 lg:col-span-8 glass-card p-8 h-[520px] relative group overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-aurum-gold/40 to-transparent"></div>
                                    <div className="absolute top-6 right-8 flex bg-black/40 p-1 rounded-xl border border-white/10 z-10">
                                        <button
                                            onClick={() => setActivePlot('frontier')}
                                            className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all ${activePlot === 'frontier' ? 'bg-aurum-gold text-black shadow-lg' : 'text-slate-500 hover:text-white font-bold'}`}
                                        >Efficient Frontier</button>
                                        <button
                                            onClick={() => setActivePlot('spectrum')}
                                            className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all ${activePlot === 'spectrum' ? 'bg-aurum-gold text-black shadow-lg' : 'text-slate-500 hover:text-white font-bold'}`}
                                        >Factor Spectrum</button>
                                    </div>
                                    <h3 className="text-2xl font-black uppercase tracking-tight mb-8 flex items-center gap-3">
                                        {activePlot === 'frontier' ? 'Capital Allocation Line' : 'Risk Factor Decomposition'}
                                        <span className="text-[10px] bg-white/10 text-slate-500 px-3 py-1 rounded-full font-black tracking-widest">ADV_QUANTS v2.4</span>
                                    </h3>
                                    <div className="h-[400px]">
                                        {activePlot === 'frontier' ? (
                                            <EfficientFrontier data={frontierData} />
                                        ) : (
                                            <div className="grid grid-cols-2 h-full gap-4">
                                                <div className="bg-white/[0.02] rounded-3xl p-4 flex flex-col">
                                                    <span className="text-[10px] font-black text-slate-600 uppercase mb-4 tracking-widest">Weighted Pulse (Heikin-Ashi)</span>
                                                    <div className="flex-1"><HeikinAshiChart data={ohlcData} /></div>
                                                </div>
                                                <div className="bg-white/[0.02] rounded-3xl p-4 flex flex-col">
                                                    <span className="text-[10px] font-black text-slate-600 uppercase mb-4 tracking-widest">Factor Impact Analytics</span>
                                                    <div className="flex-1"><RiskFactorBars /></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="col-span-12 lg:col-span-4 space-y-6">
                                    <div className="glass-card p-8 h-[250px] flex flex-col border-white/5">
                                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-aurum-gold mb-6 flex items-center justify-between">
                                            LIVE_ENGINE_STREAM <Activity className="w-4 h-4 animate-pulse" />
                                        </h3>
                                        <div className="space-y-3 font-mono text-[10px] flex-1 overflow-hidden">
                                            <AnimatePresence mode="popLayout">
                                                {logs.slice(-6).map((log, i) => (
                                                    <motion.div
                                                        key={log + i}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1 - (i * 0.1), x: 0 }}
                                                        className={`flex gap-3 leading-tight ${i === 5 ? 'text-aurum-gold font-bold' : 'text-slate-600'}`}
                                                    >
                                                        <span className="opacity-20 flex-shrink-0">::</span> {log}
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                    <div className="glass-card p-8 h-[250px] relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-aurum-gold/[0.02] group-hover:bg-aurum-gold/[0.04] transition-colors"></div>
                                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 mb-6 flex justify-between items-center">
                                            PORTFOLIO_CONCENTRATION <PieChart className="w-4 h-4" />
                                        </h3>
                                        <div className="h-36 relative z-10"><AssetPieChart data={allocationData?.assets} /></div>
                                    </div>
                                </div>

                                <div className="col-span-12 lg:col-span-4 glass-card p-8 h-[380px] hover:border-aurum-gold/20 transition-colors">
                                    <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6 flex justify-between">
                                        Market Regime <span className="text-aurum-gold text-[10px] font-mono">HMM_V2.1</span>
                                    </h3>
                                    <div className="h-64"><RegimeHeatmap /></div>
                                </div>
                                <div className="col-span-12 lg:col-span-8 glass-card p-8 h-[380px] hover:border-aurum-gold/20 transition-colors">
                                    <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6 flex justify-between">
                                        Fat-Tail Projection <span className="text-aurum-gold text-[10px] font-mono">MONTE_CARLO_10K</span>
                                    </h3>
                                    <div className="h-64"><MonteCarloChart data={monteCarloData} /></div>
                                </div>
                            </div>
                        )}

                        {currentView === 'trading' && (
                            <div className="grid grid-cols-12 gap-6">
                                <div className="col-span-12 lg:col-span-9 space-y-6">
                                    <div className="glass-card p-8 h-[480px] relative overflow-hidden shadow-2xl">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-aurum-gold/10 blur-3xl rounded-full translate-x-16 -translate-y-16"></div>
                                        <div className="flex justify-between items-center mb-8 relative z-10">
                                            <div>
                                                <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
                                                    BTC/USD <span className="text-aurum-gold">Advanced Ticker Trace</span>
                                                    <span className="text-[9px] bg-[#00FF00]/20 text-[#00FF00] px-3 py-1 rounded-full font-black ml-4 animate-pulse border border-[#00FF00]/30 shadow-[0_0_10px_rgba(0,255,0,0.2)]">LIVE_STREEM_01</span>
                                                </h3>
                                                <div className="flex gap-2 mt-2 font-mono text-[10px]">
                                                    <span className="text-slate-500">O: <span className="text-white">64,204.1</span></span>
                                                    <span className="text-slate-500">H: <span className="text-white">65,108.5</span></span>
                                                    <span className="text-slate-500">L: <span className="text-white">63,901.2</span></span>
                                                    <span className="text-slate-500">C: <span className="text-white">64,892.4</span></span>
                                                </div>
                                            </div>
                                            <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                                                {['1M', '15M', '1H', '4H', '1D'].map(t => (
                                                    <button key={t} className={`px-4 py-2 text-[10px] font-black rounded-lg transition-all ${t === '1H' ? 'bg-white/10 text-aurum-gold shadow-lg' : 'text-slate-600 hover:text-white'}`}>{t}</button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="h-[360px]"><CandlestickChart data={ohlcData} /></div>
                                    </div>

                                    <div className="glass-card overflow-hidden border border-white/5 relative">
                                        <div className="p-6 bg-white/[0.02] border-b border-white/5 flex justify-between items-center">
                                            <h3 className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-2">
                                                <Activity className="w-4 h-4 text-aurum-gold" /> RECENT_ORDER_FLOW
                                            </h3>
                                            <button className="text-[10px] font-black uppercase bg-white/5 px-4 py-1.5 rounded-lg hover:bg-white/10 transition-colors">Export .CSV</button>
                                        </div>
                                        <table className="w-full text-left">
                                            <thead className="bg-black/20 text-[9px] uppercase font-black text-slate-500 tracking-[0.2em]">
                                                <tr>
                                                    <th className="p-5 px-8">TRANS_ID</th>
                                                    <th className="p-5">ASSET_IDENT</th>
                                                    <th className="p-5">ORDER_TYPE</th>
                                                    <th className="p-5">UNITS</th>
                                                    <th className="p-5 text-right">PRICE_ENTRY</th>
                                                    <th className="p-5 text-right px-8">EXEC_STATUS</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-[10px] font-mono">
                                                {trades.map((trade, i) => (
                                                    <tr key={i} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group">
                                                        <td className="p-5 px-8 text-slate-600 group-hover:text-aurum-gold transition-colors">#{trade.id}</td>
                                                        <td className="p-5 font-black flex items-center gap-2">
                                                            <div className={`w-1.5 h-1.5 rounded-full ${i % 2 === 0 ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
                                                            {trade.symbol}
                                                        </td>
                                                        <td className={`p-5 font-black ${trade.type === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>
                                                            {trade.type === 'BUY' ? 'L_BUY_X' : 'S_SELL_Y'}
                                                        </td>
                                                        <td className="p-5 text-white font-bold">{trade.amount}</td>
                                                        <td className="p-5 text-right font-black text-white tabular-nums">${trade.price.toLocaleString()}</td>
                                                        <td className="p-5 text-right px-8">
                                                            <div className="flex justify-end gap-1">
                                                                <span className="text-[8px] bg-[#00FF00]/10 border border-[#00FF00]/30 text-[#00FF00] px-2 py-0.5 rounded font-black tracking-tighter">FILLED</span>
                                                                <span className="text-[8px] bg-white/5 px-2 py-0.5 rounded text-white font-bold opacity-30">V1</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="col-span-12 lg:col-span-3 glass-card p-6 min-h-[640px] flex flex-col bg-aurum-gold/[0.02] border-aurum-gold/10 relative overflow-hidden ring-1 ring-aurum-gold/10 shadow-2xl shadow-aurum-gold/10">
                                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-aurum-gold to-transparent animate-pulse"></div>
                                    <h3 className="text-sm font-black uppercase tracking-[0.4em] mb-10 border-b border-white/10 pb-6 text-center text-aurum-gold">
                                        PROTOCOL_EXEC
                                    </h3>
                                    <div className="space-y-8 flex-1">
                                        <div>
                                            <label className="text-[9px] uppercase text-slate-500 font-bold block mb-4 tracking-[0.2em]">Execution Strategy</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                <button className="bg-aurum-gold text-black text-[10px] font-black py-3 rounded-xl shadow-xl hover:scale-105 transition-transform active:scale-95">MARKET_INST</button>
                                                <button className="bg-white/10 text-white text-[10px] font-black py-3 rounded-xl border border-white/10 hover:bg-white/20 transition-colors">LIMIT_ORD</button>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[9px] uppercase text-slate-500 font-bold block mb-4 tracking-[0.2em]">Adaptive Engine</label>
                                            <div className="relative">
                                                <select className="bg-black/40 border border-white/10 w-full p-4 py-4 rounded-2xl text-[10px] font-black outline-none focus:border-aurum-gold transition-all appearance-none tracking-widest text-white cursor-pointer uppercase">
                                                    <option>Engine_01 :: ADAPTIVE_MOMENTUM</option>
                                                    <option>Engine_02 :: MEAN_REVERSION_HFT</option>
                                                    <option>Engine_03 :: TAIL_RISK_GUARD</option>
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-aurum-gold">
                                                    <Zap className="w-3 h-3 fill-current" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-6 bg-black/40 rounded-2xl border border-white/5 space-y-4">
                                            <div className="flex justify-between text-[10px] font-black">
                                                <span className="text-slate-500 tracking-wider">COLLATERAL</span>
                                                <span className="text-white">$1,402,100</span>
                                            </div>
                                            <div className="flex justify-between text-[10px] font-black">
                                                <span className="text-slate-500 tracking-wider">LEVERAGE</span>
                                                <span className="text-aurum-gold">3.5X</span>
                                            </div>
                                            <div className="h-[2px] bg-white/5"></div>
                                            <div className="flex justify-between text-[10px] font-black">
                                                <span className="text-slate-500 tracking-wider">EST_SLIPPAGE</span>
                                                <span className="text-red-500">0.02%</span>
                                            </div>
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center items-center p-8 opacity-10 py-12">
                                            <Cpu className="w-20 h-20 mb-4 animate-spin-slow" />
                                            <p className="text-[9px] uppercase font-black tracking-[0.5em] text-center">Neural Optimization Stream</p>
                                        </div>
                                    </div>
                                    <button className="w-full bg-[#00FF00] hover:bg-[#00DD00] text-black font-black py-5 rounded-2xl shadow-[0_8px_30px_rgba(0,255,0,0.3)] hover:scale-[1.03] active:scale-[0.97] transition-all flex items-center justify-center gap-3 mt-4 group">
                                        <Zap className="w-5 h-5 fill-current group-hover:scale-125 transition-transform" />
                                        <span className="tracking-[0.2em]">ENGAGE_PROTOCOL</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {currentView === 'wall' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                <div className="col-span-full mb-4">
                                    <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white">Market Terminal :: <span className="text-aurum-gold">Multi-Stream Monitoring</span></h3>
                                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.4em] mt-2">10 Concurrent Real-Time Flows :: High-Frequency Var</p>
                                </div>
                                <div className="flex gap-2 bg-black/40 p-2 rounded-2xl border border-white/5 mb-4 col-span-full justify-end">
                                    {['AAPL', 'NVDA', 'BTC/USD', 'TSLA', 'OIL', 'GOLD', 'AMZN', 'MSFT'].map(sym => (
                                        <button
                                            key={sym}
                                            onClick={() => {
                                                if (selectedSymbols.includes(sym)) {
                                                    if (selectedSymbols.length > 1) setSelectedSymbols(selectedSymbols.filter(s => s !== sym));
                                                } else if (selectedSymbols.length < 5) {
                                                    setSelectedSymbols([...selectedSymbols, sym]);
                                                }
                                            }}
                                            className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all border ${selectedSymbols.includes(sym) ? 'bg-aurum-gold text-black border-aurum-gold shadow-[0_0_15px_rgba(255,215,0,0.3)]' : 'bg-white/5 text-slate-500 border-white/10 hover:border-white/20'}`}
                                        >
                                            {sym}
                                        </button>
                                    ))}
                                </div>
                                {selectedSymbols.flatMap((symbol, symIdx) => {
                                    const variantSet = [
                                        ['standard', 'hollow'],
                                        ['heikin', 'mountain'],
                                        ['neon', 'ohlc'],
                                        ['step', 'gradient'],
                                        ['minimal', 'ghost']
                                    ][symIdx % 5];

                                    return variantSet.map((v, i) => (
                                        <motion.div
                                            key={`${symbol}-${v}`}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: (symIdx * 2 + i) * 0.05 }}
                                            className="h-[220px]"
                                        >
                                            <AdvancedCandle
                                                variant={v as any}
                                                symbol={symbol}
                                                data={multiOhlcData[symbol] || []}
                                            />
                                        </motion.div>
                                    ));
                                })}

                                <div className="col-span-full glass-card p-12 mt-4 flex flex-col items-center justify-center border-dashed border-white/10 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-aurum-gold/[0.02] group-hover:bg-aurum-gold/[0.04] transition-colors"></div>
                                    <Zap className="w-12 h-12 text-aurum-gold mb-4 animate-pulse relative z-10" />
                                    <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 relative z-10">Processing {selectedSymbols.length * 2} Neural Data Streams Concurrent :: Cluster_v4.2</span>
                                </div>
                            </div>
                        )}

                        {currentView === 'equities' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-4xl font-black uppercase italic tracking-tighter">Global <span className="text-aurum-gold">Equities</span></h2>
                                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                        <div className="w-2 h-2 rounded-full bg-[#00FF00] animate-ping"></div>
                                        Live_Feed_Active
                                    </div>
                                </div>

                                <div className="grid grid-cols-12 gap-6">
                                    <div className="col-span-12 lg:col-span-8 space-y-6">
                                        <div className="glass-card p-8 h-[600px] relative overflow-hidden group">
                                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-aurum-gold/0 via-aurum-gold/40 to-aurum-gold/0"></div>
                                            <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 flex items-center justify-between">
                                                Sector Distribution Map
                                                <span className="text-[10px] bg-white/10 text-slate-500 px-3 py-1 rounded-full font-black tracking-widest uppercase">Real-Time Vol Weighting</span>
                                            </h3>
                                            <div className="h-[480px]">
                                                <Suspense fallback={<div className="h-full w-full flex items-center justify-center text-aurum-gold font-black animate-pulse text-xs tracking-widest">Initializing Neural Map...</div>}>
                                                    <MarketTreemap />
                                                </Suspense>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-6">
                                            {[
                                                { l: 'Most Active', v: 'NVDA', p: '+4.5%' },
                                                { l: 'Top Gainer', v: 'AMZN', p: '+2.1%' },
                                                { l: 'Top Loser', v: 'TSLA', p: '-1.8%' },
                                            ].map((s, i) => (
                                                <div key={i} className="glass-card p-6 flex flex-col justify-center border-l-2 border-aurum-gold/30">
                                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{s.l}</span>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xl font-black text-white">{s.v}</span>
                                                        <span className={`text-xs font-black ${s.p.startsWith('+') ? 'text-[#00FF00]' : 'text-red-500'}`}>{s.p}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="col-span-12 lg:col-span-4 glass-card p-8 h-[740px] flex flex-col">
                                        <h3 className="text-xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3">
                                            Market Pulse Matrix
                                            <div className="w-2 h-2 bg-[#00FF00] rounded-full animate-ping"></div>
                                        </h3>
                                        <div className="flex-1 min-h-0"><AssetMatrix /></div>
                                        <div className="mt-6 pt-6 border-t border-white/5 flex flex-col items-center">
                                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-4">Neural_Ticker_Feed v5.0</span>
                                            <button className="w-full bg-white/5 hover:bg-white/10 text-white font-black py-4 rounded-xl border border-white/10 transition-all text-xs uppercase tracking-widest">Load Extended Liquidity</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentView === 'lab' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-end mb-4 px-2">
                                    <div>
                                        <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white">Analytics <span className="text-aurum-gold">Lab</span></h3>
                                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.4em] mt-2">Quantitative Research :: Advanced Stochastic Plotting</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="glass-card px-8 py-3 bg-aurum-gold/10 border-aurum-gold/20">
                                            <span className="text-[9px] font-black text-aurum-gold uppercase block mb-1">Compute Load</span>
                                            <span className="text-white font-mono text-sm tracking-widest">4.2 TFLOP/S</span>
                                        </div>
                                    </div>
                                </div>
                                <QuantLabCharts />
                            </div>
                        )}

                        {currentView === 'portfolio' && (
                            <div className="grid grid-cols-12 gap-6">
                                <div className="col-span-12 lg:col-span-4 glass-card p-8 h-[420px] relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <PieChart className="w-16 h-16" />
                                    </div>
                                    <h3 className="text-xl font-black uppercase mb-8 tracking-tighter">Global Asset Mix</h3>
                                    <div className="h-64"><AssetPieChart data={allocationData?.assets} /></div>
                                </div>
                                <div className="col-span-12 lg:col-span-4 glass-card p-8 h-[420px] relative overflow-hidden group">
                                    <h3 className="text-xl font-black uppercase mb-8 tracking-tighter">Asset Correlations</h3>
                                    <div className="h-64"><CorrelationMatrix /></div>
                                </div>
                                <div className="col-span-12 lg:col-span-4 glass-card p-8 h-[420px] relative overflow-hidden group">
                                    <h3 className="text-xl font-black uppercase mb-8 tracking-tighter">Sector Active Exposure</h3>
                                    <div className="h-64"><AllocationBarChart data={allocationData?.sectors} /></div>
                                </div>
                                <div className="col-span-12 grid grid-cols-3 gap-6">
                                    {[
                                        { title: 'Alpha Node Performance', icon: TrendingUp, color: 'text-[#00FF00]' },
                                        { title: 'Attribute Risk Sensitivity', icon: Shield, color: 'text-aurum-gold' },
                                        { title: 'Engine Execution Stats', icon: Cpu, color: 'text-blue-400' },
                                    ].map((box, i) => (
                                        <div key={i} className="glass-card p-8 h-[340px] flex flex-col group">
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8 flex items-center gap-3">
                                                <box.icon className={`w-4 h-4 ${box.color}`} /> {box.title}
                                            </h3>
                                            <div className="space-y-4 flex-1">
                                                {[1, 2, 3, 4, 5].map(idx => (
                                                    <div key={idx} className="flex justify-between items-center border-b border-white/5 pb-3 group-hover:border-aurum-gold/20 transition-colors">
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] font-black text-white uppercase tracking-wider">Node_Core_0{idx}</span>
                                                            <span className="text-[8px] font-mono text-slate-600">STABLE_EXEC</span>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className={`text-xs font-black ${idx % 2 === 0 ? 'text-[#00FF00]' : 'text-aurum-gold'}`}>
                                                                {idx % 2 === 0 ? <ArrowUpRight className="inline w-3 h-3 mr-1" /> : <ArrowDownRight className="inline w-3 h-3 mr-1" />}
                                                                {Math.floor(Math.random() * 5 + 1)}.{Math.floor(Math.random() * 99)}%
                                                            </div>
                                                            <div className="text-[8px] font-mono text-slate-600">{(Math.random() * 0.1).toFixed(4)} ERR</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {currentView === 'risk' && (
                            <div className="grid grid-cols-12 gap-6">
                                <div className="col-span-12 lg:col-span-7 glass-card p-8 h-[540px] relative overflow-hidden group">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500/0 via-red-500/20 to-red-500/0"></div>
                                    <h3 className="text-2xl font-black uppercase tracking-tighter mb-10 flex items-center gap-4">
                                        Multi-Factor Volatility Surface
                                        <span className="text-[10px] bg-red-500/10 text-red-500 px-3 py-1 rounded-full font-black border border-red-500/20">REAL_TIME_RISK</span>
                                    </h3>
                                    <div className="h-[380px]"><RiskSurface3D /></div>
                                </div>
                                <div className="col-span-12 lg:col-span-5 flex flex-col gap-6 h-[540px]">
                                    <div className="glass-card p-8 h-[260px] relative group overflow-hidden">
                                        <h3 className="text-xl font-black uppercase tracking-tighter mb-4">Factor Exposure</h3>
                                        <div className="h-[180px]"><FactorExposureRadar /></div>
                                    </div>
                                    <div className="glass-card p-8 h-[260px] relative group overflow-hidden">
                                        <h3 className="text-xl font-black uppercase tracking-tighter mb-4">Liquidity Depth</h3>
                                        <div className="h-[180px]"><LiquidityGauge /></div>
                                    </div>
                                </div>
                                <div className="col-span-12 glass-card p-16 flex flex-col items-center justify-center bg-red-500/[0.03] border-red-500/20 shadow-2xl relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-red-500/[0.05]"></div>
                                    <motion.div
                                        animate={{ scale: [1, 1.05, 1] }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                        className="relative p-6 rounded-3xl bg-red-500/10 border border-red-500/30 mb-8"
                                    >
                                        <Shield className="w-20 h-20 text-red-500 drop-shadow-[0_0_15px_#FF0000]" />
                                    </motion.div>
                                    <h3 className="text-4xl font-black uppercase mb-4 tracking-tighter text-white">Risk Vault Node: <span className="text-red-500">SECURE</span></h3>
                                    <p className="text-slate-500 font-mono text-sm uppercase tracking-[0.5em] font-black opacity-60">System Overlays :: Tail Risk Mitigation Active :: 4.2% CVaR</p>
                                    <div className="mt-12 grid grid-cols-3 gap-12 w-full max-w-4xl border-t border-white/5 pt-12">
                                        {[
                                            { l: 'Max Drawdown', v: '2.14%', c: 'text-white' },
                                            { l: 'Value-at-Risk', v: '4.85%', c: 'text-red-400' },
                                            { l: 'Stress Resilience', v: '99.9%', c: 'text-[#00FF00]' }
                                        ].map((r, i) => (
                                            <div key={i} className="text-center">
                                                <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">{r.l}</div>
                                                <div className={`text-3xl font-black ${r.c} tracking-tighter`}>{r.v}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            <footer className="fixed bottom-0 left-20 right-0 p-5 px-10 bg-black/90 backdrop-blur-xl border-t border-white/5 flex justify-between items-center z-40">
                <div className="flex gap-10 text-[11px] font-mono text-slate-500 uppercase tracking-widest font-black">
                    <span className="flex items-center gap-2">ALPHA :: <span className="text-aurum-gold">0.122</span></span>
                    <span className="flex items-center gap-2">BETA_S :: <span className="text-aurum-gold">0.854</span></span>
                    <span className="flex items-center gap-2">SHARPE_R :: <span className="text-aurum-gold">3.210</span></span>
                    <span className="flex items-center gap-2">SORTINO_X :: <span className="text-aurum-gold">4.102</span></span>
                </div>
                <div className="text-slate-700 text-[10px] font-mono uppercase tracking-[0.4em] font-black opacity-80">
                    &copy; 0x2024 AURUM_ENGINE_INSTITUTIONAL_CORE :: CONF_RESTRICTED
                </div>
            </footer>

            <style>{`
                .glass-card {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(16px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 24px;
                    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
                }
                .glass-card:hover {
                    background: rgba(255, 255, 255, 0.05);
                    border-color: rgba(255, 215, 0, 0.3);
                }
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 12s linear infinite;
                }
            `}</style>
        </div>
    )
}

export default App
