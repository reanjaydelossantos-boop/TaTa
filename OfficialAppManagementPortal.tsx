import React from 'react';
import { UserPlan, PricingTierConfig } from '../types';
import { Check, Crown, Zap, Shield, Sparkles, Building2, AudioWaveform, Mic, X } from 'lucide-react';

interface PricingModalProps {
  userPlan: UserPlan;
  setUserPlan: (plan: UserPlan) => void;
  onClose: () => void;
  onSelectPartnerTab?: () => void;
  pricingTiers?: PricingTierConfig;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  userPlan,
  setUserPlan,
  onClose,
  onSelectPartnerTab,
  pricingTiers
}) => {
  const proMonthly = pricingTiers?.proMonthlyPrice ?? 299;
  const partnerMonthly = pricingTiers?.partnerMonthlyPrice ?? 2999;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-3xl border border-slate-700 max-w-5xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          id="btn-close-pricing-modal"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider bg-cyan-950/80 border border-cyan-800 px-3 py-1 rounded-full">
            Choose Your TaTa Experience
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3">
            Simple Pricing for Personal, Pro & Local Business Partners
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Free voice assistant for personal tasks. Upgrade to Pro for AI meeting transcripts, or join as a Partner Merchant to get local ads <strong>PLUS full Pro version access</strong>!
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* FREE TIER CARD */}
          <div className={`p-6 rounded-2xl border flex flex-col justify-between transition-all ${
            userPlan === 'free'
              ? 'bg-slate-950 border-cyan-500/80 ring-2 ring-cyan-500/30'
              : 'bg-slate-950/60 border-slate-800'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-cyan-400 flex items-center gap-1.5">
                  <Zap className="w-4 h-4" />
                  Free Voice Assistant
                </span>
                {userPlan === 'free' && (
                  <span className="text-[10px] bg-cyan-950 text-cyan-300 font-bold px-2 py-0.5 rounded border border-cyan-800 uppercase">
                    Current Plan
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-1 my-3">
                <span className="text-3xl font-black text-white">₱0</span>
                <span className="text-xs text-slate-400">/ forever free</span>
              </div>

              <p className="text-xs text-slate-300 mb-4">
                Voice-first personal assistant with daily weather briefings and business-sponsored task discounts.
              </p>

              <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Hands-free Voice-Only Instruction Mode</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Personalized Daily Weather & Air Quality Briefings</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Text-To-Speech (TTS) Voice Confirmations</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Local Business Perks</strong> (Coffee, Auto, Gym Vouchers)</span>
                </li>
              </ul>
            </div>

            <button
              id="btn-select-free-plan"
              onClick={() => {
                setUserPlan('free');
                onClose();
              }}
              disabled={userPlan === 'free'}
              className="w-full py-2.5 rounded-xl text-xs font-bold transition-all bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-50"
            >
              {userPlan === 'free' ? 'Your Active Plan' : 'Switch to Free Tier'}
            </button>
          </div>

          {/* PREMIUM PRO TIER CARD */}
          <div className={`p-6 rounded-2xl border flex flex-col justify-between relative overflow-hidden transition-all ${
            userPlan === 'premium'
              ? 'bg-gradient-to-b from-indigo-950/80 to-purple-950/80 border-purple-500 ring-2 ring-purple-500/40 shadow-xl shadow-purple-500/10'
              : 'bg-slate-950 border-purple-800/80'
          }`}>
            <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-400 to-amber-500 text-slate-950 text-[9px] font-black uppercase px-2.5 py-0.5 rounded-bl-xl">
              RECOMMENDED FOR PROFESSIONALS
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-amber-400" />
                  TaTa Pro Meeting Intelligence
                </span>
              </div>

              <div className="flex items-baseline gap-1 my-3">
                <span className="text-3xl font-black text-white">₱{proMonthly.toLocaleString()}</span>
                <span className="text-xs text-slate-400">/ month</span>
              </div>

              <p className="text-xs text-slate-300 mb-4">
                Unlimited Audio-to-Text meeting recorder, verbatim transcripts, executive summaries, and AI decision helper matrix.
              </p>

              <ul className="space-y-2.5 text-xs text-slate-200 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span><strong>Everything in Free Tier</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Live Meeting Audio Recorder & Audio File Uploads</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Gemini Speech-to-Text Verbatim Transcript with Speakers</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span><strong>AI Decision Helper Matrix</strong> (Pros/Cons & Rationale)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>1-Click Conversion of Meeting Actions to Daily Reminders</span>
                </li>
              </ul>
            </div>

            <button
              id="btn-select-premium-plan"
              onClick={() => {
                setUserPlan('premium');
                onClose();
              }}
              className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                userPlan === 'premium'
                  ? 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white'
              }`}
            >
              {userPlan === 'premium' ? 'Active Pro Subscription' : `Upgrade to Pro Plan (₱${proMonthly.toLocaleString()}/mo)`}
            </button>
          </div>

          {/* PARTNER MERCHANT SPONSOR CARD */}
          <div className="p-6 rounded-2xl border border-amber-500/80 bg-slate-950 flex flex-col justify-between relative overflow-hidden transition-all ring-1 ring-amber-500/30">
            <div className="absolute top-0 right-0 bg-gradient-to-l from-emerald-400 to-emerald-500 text-slate-950 text-[9px] font-black uppercase px-2.5 py-0.5 rounded-bl-xl flex items-center gap-1">
              <Sparkles className="w-3 h-3 fill-slate-950" />
              INCLUDES APP PRO VERSION
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-amber-400 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-amber-400" />
                  Partner Merchant Sponsor
                </span>
              </div>

              <div className="flex items-baseline gap-1 my-3">
                <span className="text-3xl font-black text-amber-400">₱{partnerMonthly.toLocaleString()}</span>
                <span className="text-xs text-slate-400">/ month</span>
              </div>

              <p className="text-xs text-slate-300 mb-4">
                Local business ad sponsorship network PLUS full access to TaTa Pro Meeting Intelligence for your business!
              </p>

              <ul className="space-y-2.5 text-xs text-slate-200 mb-6">
                <li className="flex items-center gap-2 p-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/80">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 font-bold" />
                  <span className="text-emerald-200 font-extrabold">✨ INCLUDES APP PRO VERSION (Meeting Recorder & AI Decision Matrix)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Targeted Task Keyword Sponsor Ads</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Custom Business Partner Access Portal</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Dedicated Promo Voucher Distribution</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Real-time Impression & Redemption Analytics</span>
                </li>
              </ul>
            </div>

            <button
              id="btn-select-partner-plan"
              onClick={() => {
                setUserPlan('premium');
                if (onSelectPartnerTab) {
                  onSelectPartnerTab();
                }
                onClose();
              }}
              className="w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-md bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer"
            >
              Avail Partner Merchant (Includes App Pro Version)
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
