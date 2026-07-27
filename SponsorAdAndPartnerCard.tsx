import React from 'react';
import { UserPlan } from '../types';
import { Home, Mic, Sparkles, Building2, AudioWaveform, MapPin, Zap, Crown, CheckCircle2, Calendar, Globe } from 'lucide-react';
import { TaTaLogo } from './TaTaLogo';

interface NavbarProps {
  activeTab: 'assistant' | 'pro' | 'business' | 'official_website';
  setActiveTab: (tab: 'assistant' | 'pro' | 'business' | 'official_website') => void;
  userPlan: UserPlan;
  setUserPlan: (plan: UserPlan) => void;
  userLocation: string;
  setUserLocation: (loc: string) => void;
  onOpenPricing: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userPlan,
  setUserPlan,
  userLocation,
  setUserLocation,
  onOpenPricing
}) => {
  const locations = [
    'San Francisco, CA',
    'New York, NY',
    'London, UK',
    'Tokyo, Japan',
    'Manila, Philippines',
    'Paris, France'
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('assistant')}>
          <div className="relative flex items-center justify-center">
            <TaTaLogo size={42} />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-400"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-cyan-400 via-sky-200 to-white bg-clip-text text-transparent drop-shadow-sm">
                TaTa
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950/90 border border-cyan-800 text-cyan-300 font-semibold shadow-inner whitespace-nowrap shrink-0 inline-flex items-center">
                TalkTask Assistant
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block font-medium">
              Voice Assistant • Daily Tasks & Reminders
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Current Date Display */}
          <div className="hidden md:flex items-center gap-1.5 bg-slate-950/80 px-3 py-1 rounded-lg border border-slate-800 text-xs font-semibold text-cyan-300 shadow-inner">
            <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>

          {/* Location Selector */}
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-950/60 px-2.5 py-1 rounded-lg border border-slate-800 text-xs text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <select
              id="select-user-location"
              value={userLocation}
              onChange={(e) => setUserLocation(e.target.value)}
              className="bg-transparent border-none text-slate-200 text-xs focus:ring-0 focus:outline-none cursor-pointer"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc} className="bg-slate-900 text-slate-200">
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Standalone Website Launcher Button */}
          <button
            id="btn-nav-visit-website"
            onClick={() => setActiveTab('official_website')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-700/80 hover:border-emerald-500 text-emerald-300 text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
            title="Switch to Standalone Official Website"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Official Website</span>
          </button>

          {/* User Plan Toggle Badge */}
          {userPlan === 'premium' ? (
            <button
              id="badge-plan-premium"
              onClick={onOpenPricing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-purple-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold hover:border-amber-400 transition-all shadow-sm"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>Pro Plan</span>
            </button>
          ) : (
            <button
              id="badge-plan-free"
              onClick={onOpenPricing}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-950/90 border border-slate-800 text-slate-300 hover:border-cyan-500 text-xs font-medium transition-all"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden xs:inline">Free Plan</span>
              <span className="text-[10px] bg-amber-400 text-slate-950 font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                UPGRADE
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

