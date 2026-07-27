import React from 'react';
import { DailyBriefing } from '../types';
import { Sun, ShieldAlert, Thermometer, Droplets, X, Move } from 'lucide-react';
import { motion } from 'motion/react';

interface WeatherModalProps {
  briefing: DailyBriefing | null;
  userLocation: string;
  onClose: () => void;
}

export const WeatherModal: React.FC<WeatherModalProps> = ({
  briefing,
  userLocation,
  onClose
}) => {
  if (!briefing) return null;

  const weather = briefing.weather;

  const getAqiBadgeColor = (aqi: number) => {
    if (aqi <= 50) return 'bg-emerald-950/80 text-emerald-300 border-emerald-800';
    if (aqi <= 100) return 'bg-yellow-950/80 text-yellow-300 border-yellow-800';
    return 'bg-rose-950/80 text-rose-300 border-rose-800';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <motion.div
        drag
        dragMomentum={false}
        whileDrag={{ cursor: 'grabbing' }}
        className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] overflow-y-auto cursor-grab active:cursor-grabbing p-5 space-y-4"
      >
        {/* Drag Handle Banner */}
        <div className="bg-slate-950/60 -mx-5 -mt-5 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400 select-none mb-2">
          <span className="flex items-center gap-1.5 font-medium text-slate-300">
            <Move className="w-3.5 h-3.5 text-amber-400" />
            Click & drag popup anywhere with your cursor
          </span>
          <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wide">Weather Metrics</span>
        </div>

        {/* Modal Close Button */}
        <button
          id="btn-close-weather-modal"
          onClick={onClose}
          className="absolute top-2 right-3 z-20 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors shadow-lg"
          title="Close Weather Metrics"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title */}
        <div>
          <div className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-amber-400 animate-pulse" />
            <h3 className="text-lg font-bold text-white">Live Environmental & Weather Metrics</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Location: <strong className="text-slate-200">{userLocation}</strong></p>
        </div>

        {/* Weather & Environmental Condition Grid (4 Cards from Picture 3) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          
          {/* Temperature & Condition */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 flex items-center gap-3 shadow-inner">
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
              <Sun className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Temperature</span>
              <div className="text-lg font-bold text-white">
                {weather.tempC}°C <span className="text-xs font-normal text-slate-400">({Math.round((weather.tempC * 9/5) + 32)}°F)</span>
              </div>
              <span className="text-[11px] text-amber-300 font-medium">{weather.condition}</span>
            </div>
          </div>

          {/* Air Quality Index (AQI) */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 flex items-center gap-3 shadow-inner">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Air Quality (AQI)</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-lg font-bold text-white">{weather.aqi}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${getAqiBadgeColor(weather.aqi)}`}>
                  {weather.aqiLevel}
                </span>
              </div>
              <span className="text-[11px] text-slate-400">Clean outdoor air</span>
            </div>
          </div>

          {/* UV Index */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 flex items-center gap-3 shadow-inner">
            <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
              <Thermometer className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">UV Index</span>
              <div className="text-lg font-bold text-white">{weather.uvIndex} / 11</div>
              <span className="text-[11px] text-cyan-300">Moderate UV Exposure</span>
            </div>
          </div>

          {/* Humidity & Wind */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 flex items-center gap-3 shadow-inner">
            <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 shrink-0">
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Humidity & Wind</span>
              <div className="text-sm font-bold text-white">{weather.humidity}% Humidity</div>
              <span className="text-[11px] text-blue-300">{weather.wind}</span>
            </div>
          </div>

        </div>

        {/* Environmental Advice Banner */}
        <div className="p-3 rounded-xl bg-cyan-950/50 border border-cyan-800/60 text-xs text-cyan-200 flex items-start gap-2.5">
          <Sun className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold text-cyan-300">Environment Advice: </strong>
            <span>{weather.advice}</span>
          </div>
        </div>

      </motion.div>
    </div>
  );
};
