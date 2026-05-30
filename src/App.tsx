import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Portfolio } from './components/Portfolio';
import { BarChart2, Brain, Wallet, Newspaper, Sun, Moon, Activity } from 'lucide-react';
import { useTheme } from './components/ThemeProvider';
import { cn } from './lib/utils';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { theme, setTheme } = useTheme();

  const navLinks = [
    { name: 'Dashboard', icon: BarChart2, id: 'dashboard' },
    { name: 'Predictions', icon: Brain, id: 'predictions' },
    { name: 'Portfolio', icon: Wallet, id: 'portfolio' },
    { name: 'News', icon: Newspaper, id: 'news' },
  ];

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-[#050505] font-sans text-zinc-900 dark:text-zinc-100 overflow-hidden relative transition-colors duration-300">
      {/* Abstract Background Effects */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
         <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/10 dark:bg-cyan-600/10 blur-[120px]" />
         <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 dark:bg-blue-600/10 blur-[120px]" />
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-[0.015] mix-blend-overlay" />
      </div>

      <div className="z-10 hidden md:block">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Mobile Header */}
      <div className="md:hidden absolute top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-cyan-500/20 flex items-center justify-center border border-cyan-500/50 shadow-[0_0_10px_rgba(34,211,238,0.3)] dark:shadow-[0_0_10px_rgba(34,211,238,0.5)]">
            <Activity className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
            CryptoVision
          </span>
        </div>
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors"
        >
          {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
      </div>

      <main className="flex-1 relative z-10 flex flex-col h-full bg-white/50 dark:bg-[#050505]/50 pt-16 md:pt-0">
        {activeTab === 'dashboard' ? (
          <Dashboard />
        ) : activeTab === 'portfolio' ? (
          <Portfolio />
        ) : (
          <div className="flex-1 flex items-center justify-center p-8 pb-24 md:pb-8">
             <div className="text-center space-y-4">
               <h2 className="text-2xl font-semibold text-zinc-400 capitalize">{activeTab} Module</h2>
               <p className="text-zinc-600 max-w-md mx-auto">This module is part of the extensive CryptoVision architecture. Select Dashboard to see the primary AI projection engine.</p>
             </div>
          </div>
        )}
      </main>

      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-xl border-t border-zinc-200 dark:border-zinc-800 pb-safe">
        <div className="flex justify-around items-center p-2">
          {navLinks.map(link => (
             <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={cn(
                  "flex flex-col items-center justify-center w-full py-2 transition-colors duration-200",
                  activeTab === link.id 
                    ? "text-cyan-600 dark:text-cyan-400" 
                    : "text-zinc-400 dark:text-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-300"
                )}
             >
               <link.icon className="w-5 h-5 mb-1" />
               <span className="text-[10px] font-medium">{link.name}</span>
             </button>
          ))}
        </div>
      </div>
    </div>
  );
}
