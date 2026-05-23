import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Portfolio } from './components/Portfolio';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

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

      <main className="flex-1 relative z-10 flex flex-col h-full bg-white/50 dark:bg-[#050505]/50">
        {activeTab === 'dashboard' ? (
          <Dashboard />
        ) : activeTab === 'portfolio' ? (
          <Portfolio />
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
             <div className="text-center space-y-4">
               <h2 className="text-2xl font-semibold text-zinc-400 capitalize">{activeTab} Module</h2>
               <p className="text-zinc-600 max-w-md mx-auto">This module is part of the extensive CryptoVision architecture architecture. Select Dashboard to see the primary AI projection engine.</p>
             </div>
          </div>
        )}
      </main>
    </div>
  );
}
