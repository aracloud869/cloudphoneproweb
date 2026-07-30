import React from 'react';
import { TabType } from '../types';
import { 
  Home, 
  Gamepad2, 
  Code2, 
  Wrench, 
  Server, 
  KeyRound, 
  Smartphone, 
  HelpCircle, 
  ShieldCheck,
  Sparkles,
  Flame,
  StickyNote
} from 'lucide-react';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isAdmin: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, isAdmin }) => {
  const tabs: { id: TabType; label: string; icon: React.ReactNode; isBadge?: string }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'hack_roblox', label: 'Hack Roblox', icon: <Gamepad2 className="w-4 h-4" />, isBadge: 'HOT' },
    { id: 'scripts', label: 'Scripts', icon: <Code2 className="w-4 h-4" /> },
    { id: 'setup_cloud', label: 'Setup Cloud', icon: <Wrench className="w-4 h-4" /> },
    { id: 'server_cloud_pro', label: 'Server Cloud Pro', icon: <Server className="w-4 h-4" /> },
    { id: 'get_key', label: 'Get Key', icon: <KeyRound className="w-4 h-4" />, isBadge: 'KEY' },
    { id: 'cloud_phone_pro', label: 'Cloud Phone Pro', icon: <Smartphone className="w-4 h-4" />, isBadge: 'PRO' },
    { id: 'guides', label: 'Hướng Dẫn', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'notes', label: 'Ghi Chú', icon: <StickyNote className="w-4 h-4" />, isBadge: 'NEW' },
  ];

  if (isAdmin) {
    tabs.push({ id: 'admin', label: 'Admin Panel', icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />, isBadge: 'ADMIN' });
  }

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-cyan-500/20 shadow-lg shadow-cyan-950/40">
      {/* Top Gaming Accent Bar */}
      <div className="h-1 w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 animate-pulse" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 p-[2px] shadow-lg shadow-cyan-500/30 group-hover:shadow-cyan-400/50 transition-all duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <Sparkles className="absolute -top-1 -right-1 w-3.5 h-3.5 text-yellow-400 animate-spin" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-300 to-pink-400">
                  CLOUD PHONE
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono font-bold tracking-widest">
                  PRO
                </span>
              </div>
              <p className="text-[10px] text-cyan-400/70 font-mono flex items-center gap-1">
                <Flame className="w-2.5 h-2.5 text-pink-500 animate-bounce" /> Gaming Cloud Hub v3.5
              </p>
            </div>
          </div>

          {/* Quick status pill */}
          <div className="hidden lg:flex items-center gap-3 font-mono text-xs text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-800">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-emerald-400 font-semibold">SERVER ONLINE</span>
            </div>
            <span className="text-slate-700">|</span>
            <span className="text-cyan-400">Ping: 12ms</span>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2 scrollbar-none border-t border-slate-900">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-xs sm:text-sm whitespace-nowrap transition-all duration-200 select-none ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 text-cyan-300 border border-cyan-500/50 shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                <span className={isActive ? 'text-cyan-400 scale-110' : 'text-slate-500'}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>

                {tab.isBadge && (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full font-mono ${
                      tab.isBadge === 'HOT'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                        : tab.isBadge === 'PRO'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                        : tab.isBadge === 'KEY'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    {tab.isBadge}
                  </span>
                )}

                {isActive && (
                  <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
