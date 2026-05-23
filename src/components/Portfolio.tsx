import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Wallet, TrendingUp, TrendingDown, DollarSign, Download } from 'lucide-react';
import { useCryptoData } from '../hooks/useCryptoData';
import { formatCurrency } from '../lib/utils';
import { cn } from '../lib/utils';

export function Portfolio() {
  const { data, loading, error } = useCryptoData();
  const [btcAmount, setBtcAmount] = useState<string>('');
  const [entryPrice, setEntryPrice] = useState<string>('');

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <span className="text-sm font-mono tracking-widest text-zinc-500 uppercase animate-pulse">Loading portfolio data...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-rose-400 font-mono text-sm bg-rose-500/10 px-4 py-2 rounded-lg border border-rose-500/20">
          SYSTEM ERROR: UNABLE TO FETCH LIVE DATA
        </div>
      </div>
    );
  }

  const amount = parseFloat(btcAmount) || 0;
  const entry = parseFloat(entryPrice) || 0;
  
  const currentPrice = data.currentPrice;
  const currentValue = amount * currentPrice;
  const investedValue = amount * entry;
  const pnl = currentValue - investedValue;
  const pnlPercentage = investedValue > 0 ? (pnl / investedValue) * 100 : 0;

  const isProfit = pnl >= 0;

  const exportToCSV = () => {
    const csvRows = [
      ['Metric', 'Value'],
      ['Date', new Date().toISOString().split('T')[0]],
      ['BTC Amount', amount.toString()],
      ['Entry Price (USD)', entry.toString()],
      ['Live BTC Price (USD)', currentPrice.toString()],
      ['Total Invested (USD)', investedValue.toString()],
      ['Current Value (USD)', currentValue.toString()],
      ['Total Profit/Loss (USD)', pnl.toString()],
      ['Total Profit/Loss (%)', pnlPercentage.toFixed(2)],
    ];

    const csvString = csvRows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `CryptoVision-Portfolio-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-sans tracking-tight text-zinc-900 dark:text-white flex items-center gap-3">
              <Wallet className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
              Portfolio Simulator
            </h1>
            <p className="text-zinc-500 mt-2 text-sm">Calculate your holding performance based on live BTC market data.</p>
          </div>
          <button 
            onClick={exportToCSV}
            className="bg-cyan-50 dark:bg-cyan-500/10 hover:bg-cyan-100 dark:hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/50 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(34,211,238,0.15)] hover:shadow-[0_0_25px_rgba(34,211,238,0.25)]"
          >
            <Download className="w-4 h-4" />
            EXPORT CSV
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 backdrop-blur-xl shadow-sm dark:shadow-none"
          >
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-6">Holding Details</h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-mono text-zinc-600 dark:text-zinc-400 uppercase tracking-wider block">BTC Amount</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={btcAmount}
                    onChange={(e) => setBtcAmount(e.target.value)}
                    placeholder="e.g. 0.5"
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 font-mono text-sm pointer-events-none">
                    BTC
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-zinc-600 dark:text-zinc-400 uppercase tracking-wider block">Average Entry Price</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <input 
                    type="number" 
                    value={entryPrice}
                    onChange={(e) => setEntryPrice(e.target.value)}
                    placeholder="e.g. 45000"
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-10 pr-4 py-3 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 font-mono text-sm pointer-events-none">
                    USD
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Results Summary */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 backdrop-blur-xl flex flex-col shadow-sm dark:shadow-none"
          >
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-6">Performance Summary</h2>
            
            <div className="flex-1 flex flex-col justify-center space-y-6">
              <div>
                <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider block mb-1">Live BTC Price</span>
                <span className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">{formatCurrency(currentPrice)}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800/50">
                <div>
                  <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider block mb-1">Total Invested</span>
                  <span className="text-lg font-semibold text-zinc-600 dark:text-zinc-300">{formatCurrency(investedValue)}</span>
                </div>
                <div>
                  <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider block mb-1">Current Value</span>
                  <span className="text-lg font-semibold text-zinc-900 dark:text-white">{formatCurrency(currentValue)}</span>
                </div>
              </div>

              <div className={cn(
                "p-4 rounded-xl border mt-auto relative overflow-hidden shadow-inner",
                amount > 0 && entry > 0
                  ? isProfit 
                    ? "bg-green-500/10 border-green-500/30" 
                    : "bg-rose-500/10 border-rose-500/30"
                  : "bg-zinc-100 dark:bg-zinc-800/30 border-zinc-200 dark:border-zinc-700/30"
              )}>
                <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block mb-2">Total Profit / Loss</span>
                <div className="flex items-end gap-3 z-10 relative">
                  <span className={cn(
                    "text-3xl font-bold tracking-tight",
                    amount > 0 && entry > 0
                      ? isProfit ? "text-green-600 dark:text-green-400" : "text-rose-600 dark:text-rose-400"
                      : "text-zinc-400 dark:text-zinc-500"
                  )}>
                    {amount > 0 && entry > 0 ? (isProfit ? '+' : '') : ''}
                    {formatCurrency(pnl)}
                  </span>
                  
                  {amount > 0 && entry > 0 && (
                     <span className={cn(
                       "flex items-center text-sm font-medium pb-1 relative",
                       isProfit ? "text-green-600 dark:text-green-400" : "text-rose-600 dark:text-rose-400"
                     )}>
                       {isProfit ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                       {Math.abs(pnlPercentage).toFixed(2)}%
                     </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
