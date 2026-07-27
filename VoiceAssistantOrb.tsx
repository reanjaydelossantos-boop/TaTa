import React, { useState } from 'react';
import { DailyBriefing } from '../types';
import { Sun, Cloud, CloudRain, Wind, Thermometer, Droplets, ShieldAlert, Volume2, Play, Pause, RefreshCw, Mic, ChevronDown, Calendar } from 'lucide-react';
import { speechController } from '../utils/speech';

interface DailyBriefingCardProps {
  briefing: DailyBriefing | null;
  isLoading: boolean;
  onRefresh: () => void;
  userLocation: string;
  onOpenWeatherModal?: () => void;
  onOpenVoiceModal?: () => void;
  onClickPendingTasks?: () => void;
  pendingCount?: number;
}

export const DailyBriefingCard: React.FC<DailyBriefingCardProps> = ({
  briefing,
  isLoading,
  onRefresh,
  userLocation,
  onOpenWeatherModal,
  onOpenVoiceModal,
  onClickPendingTasks,
  pendingCount = 0
}) => {
  const [isPlayingBriefing, setIsPlayingBriefing] = useState(false);

  const handlePendingClick = () => {
    if (onClickPendingTasks) {
      onClickPendingTasks();
    } else {
      document.getElementById('task-list-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTogglePlayAudioBriefing = () => {
    if (!briefing?.spokenBriefing) return;
    if (isPlayingBriefing) {
      speechController.stopSpeaking();
      setIsPlayingBriefing(false);
    } else {
      setIsPlayingBriefing(true);
      speechController.speak(briefing.spokenBriefing, () => {
        setIsPlayingBriefing(false);
      });
    }
  };

  if (isLoading) {
    return (
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 animate-pulse">
        <div className="h-6 bg-slate-800 rounded w-1/3 mb-4"></div>
        <div className="h-12 bg-slate-800/60 rounded-xl"></div>
      </div>
    );
  }

  if (!briefing) return null;

  const weather = briefing.weather;
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl relative overflow-hidden">
      
      {/* Top Header Row (Main Page Briefing Hero) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-950/90 text-cyan-300 border border-cyan-800 inline-flex items-center gap-1.5 shadow-inner">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>{formattedDate}</span>
            </span>
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
              Daily Weather & Environment Briefing
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
            {briefing.greeting}
          </h3>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-xs text-slate-400">
              Location: <strong className="text-slate-200">{userLocation}</strong>
            </p>
            {/* Pending Tasks Pill Badge */}
            <button
              id="btn-pending-tasks-pill"
              type="button"
              onClick={handlePendingClick}
              title="Click to view task list below"
              className="px-3.5 py-1.5 rounded-full bg-cyan-950/90 border border-cyan-800 hover:border-cyan-500 hover:bg-cyan-900/90 text-cyan-300 hover:text-white flex items-center gap-1.5 text-xs font-semibold shadow-inner shrink-0 whitespace-nowrap cursor-pointer transition-all hover:scale-105 active:scale-95 group"
            >
              <span className="font-extrabold text-cyan-200 group-hover:text-white">{pendingCount}</span>
              <span className="text-[11px] sm:text-xs">Pending {pendingCount === 1 ? 'Task' : 'Tasks'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-cyan-400 group-hover:text-cyan-200 transition-transform group-hover:translate-y-0.5" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Voice Assistant Microphone Button (Enlarged & Prominent for high visibility) */}
          {onOpenVoiceModal && (
            <button
              id="btn-open-voice-hero"
              onClick={onOpenVoiceModal}
              className="flex items-center gap-2.5 px-5 py-3 sm:px-6 sm:py-3.5 rounded-2xl text-sm sm:text-base font-extrabold bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-xl shadow-cyan-500/40 ring-2 ring-cyan-400/40 hover:ring-cyan-300/80 transition-all hover:scale-105 active:scale-95 border border-cyan-300/50 shrink-0"
              title="Tap to speak with TaTa Voice Assistant"
            >
              <Mic className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-pulse shrink-0" />
              <span>Voice Assistant</span>
            </button>
          )}

          {/* Audio Briefing Button */}
          <button
            id="btn-play-audio-briefing"
            onClick={handleTogglePlayAudioBriefing}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-md ${
              isPlayingBriefing
                ? 'bg-rose-600 text-white shadow-rose-600/30 animate-pulse'
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white'
            }`}
          >
            {isPlayingBriefing ? <Pause className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{isPlayingBriefing ? 'Stop Audio' : 'Listen Briefing'}</span>
          </button>

          {/* Small Icon Button Trigger for Weather Metrics Popup */}
          {onOpenWeatherModal && (
            <button
              id="btn-open-weather-metrics-popup"
              onClick={onOpenWeatherModal}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition-all hover:scale-105"
              title="Click to pop up live weather metrics"
            >
              <Sun className="w-4 h-4 text-amber-400" />
              <span>{weather?.tempC ?? '14.5'}°C Metrics</span>
            </button>
          )}

          {/* Refresh Button with Label & Spin */}
          <button
            id="btn-refresh-briefing"
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shrink-0"
            title="Refresh live weather & environment briefing"
          >
            <RefreshCw className={`w-4 h-4 text-cyan-400 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="text-xs font-semibold">Refresh</span>
          </button>
        </div>
      </div>

      {/* Environmental Quick Highlights Strip */}
      {weather && (
        <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80 flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Temperature</span>
              <span className="text-xs font-bold text-slate-100">{weather.tempC}°C ({weather.tempF}°F)</span>
            </div>
          </div>

          <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80 flex items-center gap-2">
            <Cloud className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Condition</span>
              <span className="text-xs font-bold text-slate-100 truncate">{weather.condition}</span>
            </div>
          </div>

          <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80 flex items-center gap-2">
            <Droplets className="w-4 h-4 text-blue-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Humidity</span>
              <span className="text-xs font-bold text-slate-100">{weather.humidity}%</span>
            </div>
          </div>

          <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80 flex items-center gap-2">
            <Wind className="w-4 h-4 text-teal-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Wind Speed</span>
              <span className="text-xs font-bold text-slate-100">{weather.windSpeed}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
