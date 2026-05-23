import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { 
  BarChart2, 
  Brain, 
  LineChart, 
  Settings, 
  Wallet,
  Activity,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from './ThemeProvider';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { theme, setTheme } = useTheme();

  const links = [
    { name: 'Dashboard', icon: BarChart2, id: 'dashboard' },
    { name: 'Predictions', icon: Brain, id: 'predictions' },
    { name: 'Analytics', icon: LineChart, id: 'analytics' },
    { name: 'Portfolio', icon: Wallet, id: 'portfolio' },
    { name: 'Settings', icon: Settings, id: 'settings' },
  ];

  return (
    <div className="w-64 h-full border-r border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-xl flex flex-col pt-8">
      <div className="flex items-center px-6 mb-12 gap-3">
        <div className="h-8 w-8 rounded-lg bg-cyan-500/20 flex items-center justify-center border border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.5)]">
          <Activity className="h-5 w-5 text-cyan-500 dark:text-cyan-400" />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
          CryptoVision
        </span>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {links.map((link) => (
          <button
            key={link.id}
            onClick={() => setActiveTab(link.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
              activeTab === link.id 
                ? "bg-zinc-100 dark:bg-zinc-800 text-cyan-600 dark:text-cyan-400" 
                : "text-zinc-600 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50"
            )}
          >
            <link.icon className={cn(
              "h-5 w-5",
              activeTab === link.id ? "text-cyan-600 dark:text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.3)] dark:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" : ""
            )} />
            <span className="font-medium tracking-wide">{link.name}</span>
            {activeTab === link.id && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute left-0 w-1 h-8 bg-cyan-500 rounded-r-full shadow-[0_0_8px_rgba(34,211,238,0.4)] dark:shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        ))}
      </nav>
      
      <div className="p-4 mt-auto space-y-4">
        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors"
        >
          <div className="flex items-center gap-3">
            {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            <span className="font-medium tracking-wide">Theme</span>
          </div>
          <span className="text-xs font-mono uppercase px-2 py-1 bg-white dark:bg-zinc-800 rounded-md shadow-sm border border-zinc-200 dark:border-zinc-700">
            {theme}
          </span>
        </button>

        <div className="p-4 rounded-xl relative overflow-hidden bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400">
          <div className="absolute top-0 right-0 p-3 opacity-10 dark:opacity-20">
            <Brain className="h-20 w-20 text-cyan-600 dark:text-cyan-500" />
          </div>
          <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-1 relative z-10">AI Model Active</h4>
          <p className="text-xs text-cyan-600/80 dark:text-cyan-400/80 relative z-10 font-mono">LSTM • TF.Node</p>
          <div className="mt-4 flex items-center gap-2 relative z-10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-xs text-zinc-500">Processing live data</span>
          </div>
        </div>
      </div>
    </div>
  );
}
