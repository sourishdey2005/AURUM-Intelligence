import React from 'react';

export const CorrelationMatrix: React.FC = () => {
    const assets = ['BTC', 'ETH', 'SOL', 'AAPL', 'TSLA', 'GOLD'];

    return (
        <div className="w-full h-full p-2">
            <div className="grid grid-cols-7 gap-1 h-full">
                <div className="col-span-1"></div>
                {assets.map(a => (
                    <div key={a} className="text-[9px] font-black text-slate-500 uppercase flex items-center justify-center">{a}</div>
                ))}

                {assets.map((a, i) => (
                    <React.Fragment key={a}>
                        <div className="text-[9px] font-black text-slate-500 uppercase flex items-center pr-2">{a}</div>
                        {assets.map((b, j) => {
                            const val = i === j ? 1 : (Math.random() * 0.8 + 0.1).toFixed(2);
                            const parsedVal = Number.parseFloat(val as string);
                            return (
                                <div
                                    key={b}
                                    className="aspect-square rounded-sm flex items-center justify-center text-[8px] font-mono group relative cursor-help"
                                    style={{
                                        backgroundColor: i === j ? '#FFD700' : `rgba(255, 215, 0, ${parsedVal * 0.3})`,
                                        color: i === j ? 'black' : 'white'
                                    }}
                                >
                                    {val}
                                    <div className="absolute -top-8 bg-black text-white px-2 py-1 rounded text-[8px] opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap border border-white/10 uppercase font-black">
                                        Corr({a}, {b}) = {val}
                                    </div>
                                </div>
                            );
                        })}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};
