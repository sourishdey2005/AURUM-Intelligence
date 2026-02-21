import React from 'react';

const regimes = ['Bull', 'Bear', 'Stagnant', 'Crash'];
const dates = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

const mockData = [
    [0.8, 0.1, 0.05, 0.05],
    [0.7, 0.2, 0.05, 0.05],
    [0.4, 0.4, 0.1, 0.1],
    [0.2, 0.6, 0.1, 0.1],
    [0.1, 0.8, 0.2, 0.1],
    [0.05, 0.9, 0.05, 0.05],
];

export const RegimeHeatmap = () => {
    return (
        <div className="flex flex-col h-full w-full p-2">
            <div className="flex-1 grid grid-cols-4 gap-1">
                {regimes.map((r) => (
                    <div key={r} className="text-[10px] text-slate-500 text-center font-mono">
                        {r}
                    </div>
                ))}
                {mockData.flat().map((val, idx) => (
                    <div
                        key={idx}
                        className="h-full min-h-[20px] rounded-sm transition-all"
                        style={{
                            backgroundColor: `rgba(255, 215, 0, ${val})`,
                            border: '1px solid rgba(255, 255, 255, 0.05)'
                        }}
                        title={`${val * 100}%`}
                    />
                ))}
            </div>
        </div>
    );
};
