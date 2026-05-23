import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: React.ReactNode;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  delay?: number;
  glowing?: boolean;
}

export function MetricCard({ 
  title, value, subtitle, icon: Icon, trend, trendValue, delay = 0, glowing = false
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={cn(
        "relative p-6 transition-all duration-500 overflow-hidden group glass-card",
        glowing ? "neon-glow-cyan" : ""
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {glowing && (
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl group-hover:bg-cyan-500/30 transition-all duration-500" />
      )}

      <div className="relative z-10 flex justify-between items-start mb-4">
        <h3 className="text-zinc-500 text-xs uppercase font-semibold tracking-wider font-sans">{title}</h3>
        <div className={cn(
          "p-2 rounded-lg",
          glowing ? "bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400" : "bg-black/5 dark:bg-white/5 text-zinc-600 dark:text-zinc-300"
        )}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-baseline gap-2 mb-1">
          <span className={cn(
            "text-2xl font-bold font-mono",
            glowing ? "text-cyan-600 dark:text-cyan-400" : "text-zinc-900 dark:text-zinc-100"
          )}>
            {value}
          </span>
          {trendValue && (
            <span className={cn(
              "text-xs font-sans font-medium px-2 py-0.5 rounded border",
              trend === 'up' ? "text-green-600 dark:text-green-400 bg-green-500/10 border-green-500/20" : 
              trend === 'down' ? "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20" : 
              "text-zinc-500 dark:text-zinc-400 bg-zinc-500/10 border-zinc-500/20"
            )}>
              {trend === 'up' ? '+' : ''}{trendValue}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-zinc-500">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );
}
