import { useState } from 'react';
import { motion } from 'motion/react';
import { DollarSign, TrendingUp, BarChart2, Brain, Download, Loader2 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';

import { useCryptoData } from '../hooks/useCryptoData';
import { MetricCard } from './MetricCard';
import { PriceChart } from './PriceChart';
import { TechnicalIndicators } from './TechnicalIndicators';
import { PriceAlertManager } from './PriceAlertManager';
import { MarketNews } from './MarketNews';
import { formatCurrency, formatCompactNumber, formatINR } from '../lib/utils';

export function Dashboard() {
  const { data, loading, error } = useCryptoData();
  const [isExporting, setIsExporting] = useState(false);

  const exportToPDF = async () => {
    const element = document.getElementById('dashboard-report');
    if (!element) return;
    
    setIsExporting(true);
    // Add a slight delay to allow the exporting state to render
    await new Promise(r => setTimeout(r, 50));
    try {
      const dataUrl = await toPng(element, {
        backgroundColor: '#050505',
        filter: (node) => {
          if (node instanceof HTMLElement) {
            return !node.classList?.contains('no-print');
          }
          return true;
        },
        pixelRatio: 2
      });
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (element.offsetHeight * pdfWidth) / element.offsetWidth;
      
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`CryptoVision-Report-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF', err);
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 min-h-screen">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="relative"
        >
          <div className="w-24 h-24 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
          <Brain className="absolute inset-0 m-auto h-8 w-8 text-cyan-400 animate-pulse" />
        </motion.div>
        <p className="mt-6 text-zinc-400 font-mono tracking-widest text-sm uppercase">Initializing LSTM AI Model...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center text-rose-400">
        <p>Error loading dashboard data: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8" id="dashboard-report">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-sans tracking-tight text-zinc-900 dark:text-white">Bitcoin Market Intel</h1>
            <p className="text-zinc-500 mt-2 text-sm">Predictive Market Intelligence • BTC/USD</p>
          </div>
          <button 
           onClick={exportToPDF}
           disabled={isExporting}
           className="no-print bg-cyan-50 dark:bg-cyan-500/10 hover:bg-cyan-100 dark:hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/50 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all disabled:opacity-50 whitespace-nowrap shadow-[0_0_15px_rgba(34,211,238,0.15)] hover:shadow-[0_0_25px_rgba(34,211,238,0.25)]"
         >
           {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
           {isExporting ? "GENERATING PDF..." : "EXPORT REPORT"}
         </button>
        </header>

        <div className="no-print">
          <PriceAlertManager currentPrice={data.currentPrice} />
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard 
            title="Bitcoin Price" 
            value={formatCurrency(data.currentPrice)} 
            icon={DollarSign} 
            trend={data.change24h >= 0 ? 'up' : 'down'}
            trendValue={`${Math.abs(data.change24h).toFixed(2)}%`}
            subtitle={
              <span className="flex flex-col gap-1 mt-1">
                <span className="text-zinc-400 font-mono text-[11px] font-medium tracking-wide">
                  {formatINR(data.currentPrice * (data.exchangeRateINR || 83.5))} INR
                </span>
                <span className="text-zinc-600 text-[10px]">
                  1 USD = {formatINR(data.exchangeRateINR || 83.5)}
                </span>
              </span>
            }
            delay={0.1}
          />
          <MetricCard 
            title="24h Volume" 
            value={`$${formatCompactNumber(data.volume24h)}`} 
            icon={BarChart2} 
            delay={0.2}
          />
          <MetricCard 
            title="AI Confidence" 
            value={`${data.aiConfidence}%`} 
            subtitle="Based on model variance"
            icon={Brain} 
            delay={0.3}
          />
          <MetricCard 
            title="Model Signal" 
            value={data.aiSignal} 
            icon={TrendingUp} 
            trend={data.aiSignal.includes('BUY') ? 'up' : data.aiSignal.includes('SELL') ? 'down' : 'neutral'}
            glowing={true}
            delay={0.4}
          />
        </div>

        {/* Neural Network Chart Area */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="glass-card p-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 flex gap-2">
            <span className="flex items-center gap-2 text-xs font-mono text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-200 dark:border-cyan-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-pulse" />
              LIVE PROJECTION
            </span>
          </div>
          <h2 className="text-sm font-semibold mb-6 flex gap-3 text-zinc-600 dark:text-zinc-400 uppercase tracking-widest">
            <TrendingUp className="text-zinc-500" /> Price Action & AI Forecast
          </h2>
          <PriceChart data={data} />
        </motion.div>

        {/* Tech Indicators */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.6, duration: 0.6 }}
        >
          <h2 className="text-sm font-semibold mb-6 text-zinc-600 dark:text-zinc-400 uppercase tracking-widest">Technical Analysis</h2>
          <TechnicalIndicators data={data} />
        </motion.div>

        {/* Market News */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.7, duration: 0.6 }}
        >
          <MarketNews />
        </motion.div>

      </div>
    </div>
  );
}
