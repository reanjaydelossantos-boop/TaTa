import React from 'react';
import { Home, AudioWaveform, Building2, Globe } from 'lucide-react';

interface BottomNavbarProps {
  activeTab: 'assistant' | 'pro' | 'business' | 'official_website';
  setActiveTab: (tab: 'assistant' | 'pro' | 'business' | 'official_website') => void;
}

export const BottomNavbar: React.FC<BottomNavbarProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const navItems = [
    {
      id: 'assistant' as const,
      label: 'Home / Briefing',
      shortLabel: 'Home',
      icon: Home,
      color: 'cyan',
      activeClass: 'text-cyan-400 bg-cyan-950/60 border border-cyan-500/30',
      activeText: 'text-cyan-400 font-extrabold',
    },
    {
      id: 'pro' as const,
      label: 'Pro Audio & Photo',
      shortLabel: 'Pro Audio',
      icon: AudioWaveform,
      color: 'purple',
      activeClass: 'text-purple-400 bg-purple-950/60 border border-purple-500/30',
      activeText: 'text-purple-400 font-extrabold',
    },
    {
      id: 'business' as const,
      label: 'Partner Perks',
      shortLabel: 'Partner Perks',
      icon: Building2,
      color: 'amber',
      activeClass: 'text-amber-400 bg-amber-950/60 border border-amber-500/30',
      activeText: 'text-amber-400 font-extrabold',
    },
    {
      id: 'official_website' as const,
      label: 'Official Web & Admin',
      shortLabel: 'Official Web',
      icon: Globe,
      color: 'emerald',
      activeClass: 'text-emerald-400 bg-emerald-950/60 border border-emerald-500/30',
      activeText: 'text-emerald-400 font-extrabold',
    },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 w-full max-w-full z-[999] bg-slate-950/95 backdrop-blur-2xl border-t border-slate-800/80 shadow-[0_-10px_30px_rgba(0,0,0,0.9)] pt-2 pb-1.5 px-3 flex flex-col items-center justify-center pointer-events-auto select-none touch-none no-scrollbar">
      {/* Navigation Buttons Row */}
      <div className="w-full max-w-lg mx-auto flex items-center justify-around gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              id={`bottom-nav-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1.5 px-2 rounded-2xl transition-all cursor-pointer active:scale-95 ${
                isActive
                  ? `${item.activeClass} shadow-inner`
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? item.activeText : 'text-slate-400'}`} />
                {isActive && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] mt-1 tracking-tight whitespace-nowrap ${
                  isActive ? item.activeText : 'text-slate-400 font-medium'
                }`}
              >
                {item.shortLabel}
              </span>
            </button>
          );
        })}
      </div>

      {/* iOS Mobile Home Indicator Bar (picture 2 style) */}
      <div className="w-32 h-1 bg-white/80 rounded-full mx-auto mt-1.5 mb-0.5 shrink-0 opacity-90"></div>
    </nav>
  );
};
