import React, { useState } from 'react';
import { BusinessSponsor } from '../types';
import { Megaphone, Building2, Gift, MapPin, ArrowRight, Sparkles, CheckCircle2, ChevronRight, Copy, Check } from 'lucide-react';

interface SponsorAdAndPartnerCardProps {
  sponsors: BusinessSponsor[];
  onOpenBusinessPortal: () => void;
  onClaimSponsorPerk: (sponsorId: string) => void;
}

export const SponsorAdAndPartnerCard: React.FC<SponsorAdAndPartnerCardProps> = ({
  sponsors,
  onOpenBusinessPortal,
  onClaimSponsorPerk
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const activeSponsors = sponsors.filter(s => s.active);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900 rounded-2xl border border-slate-800/90 p-5 shadow-xl space-y-4">
      
      {/* Top Banner Row: Small Ad Badge & Business Owner Invitation Callout */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        
        {/* Left: Ad Spotlight Label */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20 shrink-0">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                Local Business Spotlight
              </span>
              <span className="text-[10px] text-slate-400">Sponsored Deals</span>
            </div>
            <h4 className="text-sm font-bold text-white mt-0.5">
              Exclusive Merchant Discounts & Perks Nearby
            </h4>
          </div>
        </div>

        {/* Right: Business Owner Partner Invitation */}
        <div className="bg-slate-950/90 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="text-left">
              <p className="text-xs font-bold text-slate-200">Are you a Local Business Owner?</p>
              <p className="text-[10px] text-slate-400">Promote your business with voice task perks</p>
            </div>
          </div>

          <button
            id="btn-partner-with-us-ad-card"
            onClick={onOpenBusinessPortal}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-md transition-all shrink-0 active:scale-95"
          >
            <span>Partner With Us</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Featured Ads Carousel / Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {activeSponsors.slice(0, 3).map((sp) => (
          <div
            key={sp.id}
            className="bg-slate-950/80 rounded-xl p-3.5 border border-slate-800/80 hover:border-amber-500/40 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{sp.logo}</span>
                  <div>
                    <h5 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                      {sp.businessName}
                    </h5>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5 text-amber-400" />
                      {sp.locationName}
                    </span>
                  </div>
                </div>

                {sp.discountPct && (
                  <span className="text-[10px] font-black text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                    {sp.discountPct}
                  </span>
                )}
              </div>

              <p className="text-xs font-semibold text-slate-200 mt-1 line-clamp-1">
                {sp.offerTitle}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                {sp.offerDescription}
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <code className="text-[10px] font-mono font-bold text-amber-300 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                  {sp.promoCode}
                </code>
                <button
                  id={`btn-copy-ad-code-${sp.id}`}
                  onClick={() => handleCopy(sp.promoCode, sp.id)}
                  className="p-1 text-slate-400 hover:text-white"
                  title="Copy code"
                >
                  {copiedId === sp.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>

              <button
                id={`btn-claim-ad-perk-${sp.id}`}
                onClick={() => onClaimSponsorPerk(sp.id)}
                className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                <span>Get Offer</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
