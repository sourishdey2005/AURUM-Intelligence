import React from 'react';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
    {
        name: 'Technology',
        children: [
            { name: 'AAPL', size: 3000, color: '#FFD700' },
            { name: 'MSFT', size: 2800, color: '#DAA520' },
            { name: 'NVDA', size: 2100, color: '#B8860B' },
            { name: 'GOOGL', size: 1800, color: '#8B6508' },
            { name: 'AMZN', size: 1700, color: '#FFD700' },
            { name: 'META', size: 1200, color: '#DAA520' },
            { name: 'AVGO', size: 800, color: '#B8860B' }
        ],
    },
    {
        name: 'Finance',
        children: [
            { name: 'JPM', size: 600, color: '#00FF00' },
            { name: 'BAC', size: 400, color: '#00DD00' },
            { name: 'GS', size: 350, color: '#00BB00' },
            { name: 'MS', size: 300, color: '#009900' },
            { name: 'V', size: 550, color: '#00FF00' },
            { name: 'MA', size: 500, color: '#00DD00' }
        ],
    },
    {
        name: 'Healthcare',
        children: [
            { name: 'LLY', size: 700, color: '#4444FF' },
            { name: 'UNH', size: 650, color: '#3333EE' },
            { name: 'JNJ', size: 500, color: '#2222DD' },
            { name: 'ABBV', size: 450, color: '#1111CC' }
        ],
    },
    {
        name: 'Energy',
        children: [
            { name: 'XOM', size: 500, color: '#FF4444' },
            { name: 'CVX', size: 450, color: '#EE3333' },
            { name: 'SHEL', size: 400, color: '#DD2222' }
        ],
    }
];

const CustomizedContent = (props: any) => {
    const { x, y, width, height, depth, name, payload } = props;

    return (
        <g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                style={{
                    fill: payload?.color || (depth === 0 ? '#1e293b' : '#334155'),
                    stroke: '#000',
                    strokeWidth: 2 / (depth + 1e-10),
                    strokeOpacity: 1 / (depth + 1e-10),
                }}
            />
            {width > 40 && height > 30 && (
                <text
                    x={x + width / 2}
                    y={y + height / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#fff"
                    fontSize={11}
                    fontWeight="black"
                    className="select-none pointer-events-none uppercase"
                >
                    {name}
                </text>
            )}
        </g>
    );
};

export const MarketTreemap: React.FC = () => {
    return (
        <div className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
                <Treemap
                    data={data}
                    dataKey="size"
                    aspectRatio={4 / 3}
                    stroke="#000"
                    fill="#333"
                    content={<CustomizedContent />}
                >
                    <Tooltip
                        contentStyle={{ backgroundColor: '#050505', border: '1px solid #334155', borderRadius: '12px' }}
                        itemStyle={{ color: '#FFD700' }}
                    />
                </Treemap>
            </ResponsiveContainer>
        </div>
    );
};
