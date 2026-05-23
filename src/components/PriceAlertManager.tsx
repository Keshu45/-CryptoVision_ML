import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, BellRing, Trash2, AlertTriangle, Plus, CheckCircle2, Volume2, VolumeX } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { cn } from '../lib/utils';

export interface Alert {
  id: string;
  targetPrice: number;
  direction: 'up' | 'down'; // up if currentPrice < targetPrice, down if currentPrice > targetPrice
  status: 'active' | 'triggered';
}

interface PriceAlertManagerProps {
  currentPrice: number;
}

export function PriceAlertManager({ currentPrice }: PriceAlertManagerProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [triggeredAlerts, setTriggeredAlerts] = useState<Alert[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const playSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      
      const audioCtx = new AudioContext();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1); // A5

      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.05); 
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5); 

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
      console.warn('Audio playback failed', e);
    }
  };

  // Check alerts when price changes
  useEffect(() => {
    let triggered: Alert[] = [];
    
    const updatedAlerts = alerts.map((alert) => {
      if (alert.status !== 'active') return alert;

      let isTriggered = false;
      if (alert.direction === 'up' && currentPrice >= alert.targetPrice) {
        isTriggered = true;
      } else if (alert.direction === 'down' && currentPrice <= alert.targetPrice) {
        isTriggered = true;
      }

      if (isTriggered) {
        triggered.push(alert);
        return { ...alert, status: 'triggered' as const };
      }
      return alert;
    });

    if (triggered.length > 0) {
      setAlerts(updatedAlerts);
      setTriggeredAlerts((prev) => [...prev, ...triggered]);
      playSound();
    }
  }, [currentPrice, alerts, soundEnabled]);

  // Clean triggered alerts display after sometime
  useEffect(() => {
    if (triggeredAlerts.length > 0) {
      const timer = setTimeout(() => {
        setTriggeredAlerts([]);
      }, 5000); // hide notification after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [triggeredAlerts]);

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const targetPrice = parseFloat(inputValue);
    if (!isNaN(targetPrice) && targetPrice > 0) {
      const newAlert: Alert = {
        id: Math.random().toString(36).substring(7),
        targetPrice,
        direction: currentPrice < targetPrice ? 'up' : 'down',
        status: 'active',
      };
      setAlerts((prev) => [...prev, newAlert]);
      setInputValue('');
    }
  };

  const removeAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const activeAlerts = alerts.filter(a => a.status === 'active');

  return (
    <div className="space-y-4">
      {/* Triggered Alert Notifications */}
      <AnimatePresence>
        {triggeredAlerts.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="rounded-xl border border-cyan-500/50 bg-cyan-500/10 p-4 shadow-[0_0_20px_rgba(34,211,238,0.2)] backdrop-blur-md relative overflow-hidden flex items-center justify-between"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-cyan-400" />
            <div className="absolute top-0 left-0 w-full h-full bg-cyan-400/10 animate-pulse" />
            
            <div className="flex items-center gap-4 relative z-10">
              <div className="p-2 bg-cyan-500/20 rounded-lg text-cyan-400">
                <BellRing className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <h3 className="text-zinc-100 font-medium">Price Alert Triggered!</h3>
                <div className="text-sm text-cyan-400 font-mono mt-1">
                  {triggeredAlerts.map(a => formatCurrency(a.targetPrice)).join(', ')} threshold reached.
                </div>
              </div>
            </div>
            
            <CheckCircle2 className="w-8 h-8 text-cyan-400 opacity-50 relative z-10" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alert Manager Panel */}
      <div className="glass-card p-6 border-zinc-200 dark:border-zinc-800/60">
        <div className="flex items-start justify-between flex-wrap gap-6">
          
          <div className="flex-1 min-w-[280px]">
            <h2 className="text-sm font-semibold mb-2 flex items-center justify-between text-zinc-600 dark:text-zinc-400 uppercase tracking-widest w-full">
              <span className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-zinc-500" />
                Price Alerts
              </span>
              <button 
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="text-zinc-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
                title={soundEnabled ? "Mute alert sounds" : "Enable alert sounds"}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </h2>
            <p className="text-xs text-zinc-500 mb-4">
              Set custom thresholds to receive visual notifications when the price crosses your target.
            </p>
            
            <form onSubmit={handleCreateAlert} className="flex gap-2">
              <div className="relative flex-1 max-w-xs">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-mono">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Target Price (e.g., 75000)"
                  className="w-full bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg py-2 pl-7 pr-3 text-sm text-zinc-900 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 font-mono transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={!inputValue}
                className="bg-cyan-500/10 dark:bg-cyan-500 hover:bg-cyan-500/20 dark:hover:bg-cyan-400 disabled:opacity-50 disabled:bg-zinc-100 dark:disabled:bg-zinc-800 disabled:text-zinc-400 dark:disabled:text-zinc-500 text-cyan-700 dark:text-black px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors border border-cyan-500/30 dark:border-none"
              >
                <Plus className="w-4 h-4" />
                Set
              </button>
            </form>
          </div>

          <div className="flex-1 min-w-[280px]">
            <div className="flex flex-col h-full">
              <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">Active Alerts</h3>
              
              <div className="flex-1 bg-zinc-50/50 dark:bg-zinc-900/30 rounded-lg border border-zinc-200 dark:border-zinc-800/50 p-2 min-h-[96px] max-h-[140px] overflow-y-auto">
                <AnimatePresence>
                  {activeAlerts.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="h-full flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-600 gap-2 py-4"
                    >
                      <Bell className="w-5 h-5 opacity-50" />
                      <span className="text-xs font-medium">No active alerts</span>
                    </motion.div>
                  ) : (
                    <ul className="space-y-1">
                      {activeAlerts.map(alert => (
                        <motion.li
                          key={alert.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="flex justify-between items-center bg-white/40 dark:bg-zinc-800/40 rounded-md px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-700/30 group shadow-sm dark:shadow-none"
                        >
                          <div className="flex items-center gap-2">
                            {alert.direction === 'up' ? (
                              <AlertTriangle className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-500" />
                            ) : (
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-500" />
                            )}
                            <span className="text-zinc-600 dark:text-zinc-300 font-mono">
                              {alert.direction === 'up' ? 'Crosses above' : 'Drops below'}
                            </span>
                            <span className="text-zinc-900 dark:text-zinc-100 font-mono font-bold tracking-wide">
                              {formatCurrency(alert.targetPrice)}
                            </span>
                          </div>
                          <button
                            onClick={() => removeAlert(alert.id)}
                            className="text-zinc-400 dark:text-zinc-600 hover:text-rose-600 dark:hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800"
                            aria-label="Remove alert"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </motion.li>
                      ))}
                    </ul>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
