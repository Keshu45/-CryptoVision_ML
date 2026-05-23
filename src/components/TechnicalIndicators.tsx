import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';
import { MarketData } from '../types';
import { format } from 'date-fns';

interface TechProps {
  data: MarketData;
}

export function TechnicalIndicators({ data }: TechProps) {
  const chartData = data.historicalData.map(d => ({
    time: d.time,
    dateStr: format(new Date(d.time), 'MMM dd'),
    rsi: d.rsi,
  })).slice(-40); // Only show last 40 days for clarity

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="glass-card p-6">
        <h3 className="text-zinc-900 dark:text-zinc-200 font-medium tracking-wide mb-4 flex justify-between items-center">
          <span>Relative Strength Index (RSI)</span>
          <span className="text-xs px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 font-mono">14 Period</span>
        </h3>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
              <XAxis dataKey="dateStr" stroke="#71717a" tick={{ fill: '#71717a', fontSize: 10 }} tickLine={false} axisLine={false} minTickGap={20} />
              <YAxis domain={[0, 100]} stroke="#71717a" tick={{ fill: '#71717a', fontSize: 10 }} tickLine={false} axisLine={false} orientation="right" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px' }}
                formatter={(value: number) => [value.toFixed(2), 'RSI']} 
              />
              <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 3" strokeOpacity={0.5} />
              <ReferenceLine y={30} stroke="#22d3ee" strokeDasharray="3 3" strokeOpacity={0.5} />
              <Line type="monotone" dataKey="rsi" stroke="#22d3ee" dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
