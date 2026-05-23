import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Area, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  ReferenceDot,
  Label
} from 'recharts';
import { format } from 'date-fns';
import { Eye, EyeOff } from 'lucide-react';
import { MarketData } from '../types';
import { formatCurrency } from '../lib/utils';
import { cn } from '../lib/utils';

interface PriceChartProps {
  data: MarketData;
}

export function PriceChart({ data }: PriceChartProps) {
  const [showPrediction, setShowPrediction] = useState(true);

  const histData = data.historicalData;
  const maxPoint = histData.length > 0 ? histData.reduce((prev, current) => (prev.price > current.price) ? prev : current) : null;
  const minPoint = histData.length > 0 ? histData.reduce((prev, current) => (prev.price < current.price) ? prev : current) : null;
  
  const maxDateStr = maxPoint ? format(new Date(maxPoint.time), 'MMM dd') : '';
  const minDateStr = minPoint ? format(new Date(minPoint.time), 'MMM dd') : '';

  // Combine historical and predicted arrays into a single continuous timeline
  const chartData = [
    ...data.historicalData.map(d => ({
      time: d.time,
      dateStr: format(new Date(d.time), 'MMM dd'),
      price: d.price,
      predictedPrice: null,
      sma: d.sma,
      upperBB: d.upperBB,
      lowerBB: d.lowerBB
    })),
    // Drop the purely duplicated overlap point if it exactly matches, Recharts bridges null gaps if connectNulls wasn't true
    // but building explicit overlap ensures a connected line visually.
    ...(showPrediction ? data.predictedData.map(d => ({
      time: d.time,
      dateStr: format(new Date(d.time), 'MMM dd'),
      price: null,
      predictedPrice: d.predictedPrice,
      sma: null,
      upperBB: null,
      lowerBB: null
    })) : [])
  ];

  const minPrice = Math.min(
    ...data.historicalData.map(d => d.price),
    ...(showPrediction ? data.predictedData.map(d => d.predictedPrice) : [])
  ) * 0.95;

  const maxPrice = Math.max(
    ...data.historicalData.map(d => d.price),
    ...(showPrediction ? data.predictedData.map(d => d.predictedPrice) : [])
  ) * 1.05;

  return (
    <div className="flex flex-col w-full h-[450px]">
      <div className="flex justify-end mb-4 no-print">
        <button
          onClick={() => setShowPrediction(!showPrediction)}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all",
            showPrediction 
              ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20"
              : "bg-zinc-800/50 text-zinc-400 border border-zinc-700/50 hover:bg-zinc-800 hover:text-zinc-300"
          )}
        >
          {showPrediction ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          {showPrediction ? "HIDE AI FORECAST" : "SHOW AI FORECAST"}
        </button>
      </div>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#71717a" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#71717a" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorPrediction" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
            <XAxis 
              dataKey="dateStr" 
              stroke="#71717a" 
              tick={{ fill: '#71717a', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              minTickGap={30}
            />
            <YAxis 
              domain={[minPrice, maxPrice]} 
              stroke="#71717a"
              tick={{ fill: '#71717a', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
              orientation="right"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#09090b', 
                border: '1px solid #27272a',
                borderRadius: '8px',
                color: '#f4f4f5'
              }}
              labelStyle={{ color: '#a1a1aa' }}
              formatter={(value: number, name: string) => [
                formatCurrency(value), 
                name === 'price' ? 'Historical' : name === 'predictedPrice' ? 'Predicted (AI)' : name.toUpperCase()
              ]}
            />
            
            {/* Bollinger Bands */}
            <Line type="monotone" dataKey="upperBB" stroke="#ffffff10" dot={false} strokeWidth={1} />
            <Line type="monotone" dataKey="lowerBB" stroke="#ffffff10" dot={false} strokeWidth={1} />
            
            {/* 20 Day SMA */}
            <Line type="monotone" dataKey="sma" stroke="#f59e0b" dot={false} strokeWidth={2} opacity={0.4} activeDot={false} />
            
            {/* Main Price Area */}
            <Area type="monotone" dataKey="price" stroke="#71717a" fillOpacity={1} fill="url(#colorPrice)" strokeWidth={3} />
            
            {/* AI Prediction Area */}
            {showPrediction && (
              <Area type="monotone" dataKey="predictedPrice" stroke="#22d3ee" strokeDasharray="5 5" fillOpacity={1} fill="url(#colorPrediction)" strokeWidth={3} />
            )}

            {/* Extreme Point Annotations */}
            {maxPoint && (
              <ReferenceDot x={maxDateStr} y={maxPoint.price} r={4} fill="#4ade80" stroke="#050505" strokeWidth={2}>
                <Label value="LOCAL HIGH" position="top" fill="#4ade80" fontSize={10} fontWeight="bold" offset={10} />
              </ReferenceDot>
            )}
            {minPoint && (
              <ReferenceDot x={minDateStr} y={minPoint.price} r={4} fill="#ef4444" stroke="#050505" strokeWidth={2}>
                <Label value="LOCAL LOW" position="bottom" fill="#ef4444" fontSize={10} fontWeight="bold" offset={10} />
              </ReferenceDot>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
