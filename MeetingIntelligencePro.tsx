import React, { useState } from 'react';
import { BusinessSponsor, UserPlan } from '../types';
import { 
  Building2, Key, ShieldCheck, CheckCircle2, Edit3, LogOut, Copy, 
  Sparkles, Lock, Plus, RefreshCw, Eye, MousePointer, Gift, DollarSign, 
  Globe, MapPin, Mail, AlertCircle, ArrowRight, UserCheck, ShieldAlert, Crown
} from 'lucide-react';

interface BusinessPartnerPortalProps {
  sponsors: BusinessSponsor[];
  onAddSponsor: (sponsor: BusinessSponsor) => void;
  onUpdateSponsor: (sponsor: BusinessSponsor) => void;
  onToggleSponsorStatus: (id: string) => void;
  setUserPlan?: (plan: UserPlan) => void;
  onLaunchProApp?: () => void;
}

export const BusinessPartnerPortal: React.FC<BusinessPartnerPortalProps> = ({
  sponsors,
  onAddSponsor,
  onUpdateSponsor,
  onToggleSponsorStatus,
  setUserPlan,
  onLaunchProApp
}) => {
  // Partner Access Code State
  const [partnerCodeInput, setPartnerCodeInput] = useState('');
  const [loggedInPartnerCode, setLoggedInPartnerCode] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [copiedCodeNotice, setCopiedCodeNotice] = useState(false);

  // Tab View when not logged in
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');

  // Registration Form State
  const [regBusinessName, setRegBusinessName] = useState('');
  const [regCategory, setRegCategory] = useState('Food & Beverage');
  const [regContactEmail, setRegContactEmail] = useState('');
  const [regOfferTitle, setRegOfferTitle] = useState('');
  const [regOfferDescription, setRegOfferDescription] = useState('');
  const [regPromoCode, setRegPromoCode] = useState('');
  const [regTargetKeywords, setRegTargetKeywords] = useState('');
  const [regDiscountPct, setRegDiscountPct] = useState('20% OFF');
  const [regLocationName, setRegLocationName] = useState('');

  // Edit Business Portal State
  const [isEditingPortal, setIsEditingPortal] = useState(false);
  const [editBusinessName, setEditBusinessName] = useState('');
  const [editCategory, setEditCategory] = useState('Food & Beverage');
  const [editOfferTitle, setEditOfferTitle] = useState('');
  const [editOfferDescription, setEditOfferDescription] = useState('');
  const [editPromoCode, setEditPromoCode] = useState('');
  const [editTargetKeywords, setEditTargetKeywords] = useState('');
  const [editDiscountPct, setEditDiscountPct] = useState('');
  const [editLocationName, setEditLocationName] = useState('');
  const [editContactEmail, setEditContactEmail] = useState('');
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  // Newly Created Registration Modal Notification
  const [createdPartnerInfo, setCreatedPartnerInfo] = useState<{ businessName: string; partnerCode: string } | null>(null);

  // Helper: Find sponsor by code
  const currentPartner = loggedInPartnerCode && loggedInPartnerCode !== 'ADMIN-ALL'
    ? sponsors.find(s => s.partnerCode?.toUpperCase() === loggedInPartnerCode.toUpperCase())
    : null;

  // Handle Partner Code Entry Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const code = partnerCodeInput.trim().toUpperCase();

    if (!code) {
      setLoginError('Please enter your Business Partner Code.');
      return;
    }

    if (code === 'ADMIN-ALL') {
      setLoggedInPartnerCode('ADMIN-ALL');
      setPartnerCodeInput('');
      return;
    }

    const matched = sponsors.find(s => s.partnerCode?.toUpperCase() === code);
    if (matched) {
      setLoggedInPartnerCode(matched.partnerCode || code);
      setPartnerCodeInput('');
      setIsEditingPortal(false);
    } else {
      setLoginError(`Invalid Partner Code "${code}". If you are a new partner, please register for partnership below.`);
    }
  };

  // Quick Login using Sample Partner Code
  const handleQuickCodeLogin = (code: string) => {
    setPartnerCodeInput(code);
    setLoginError(null);
    const matched = sponsors.find(s => s.partnerCode?.toUpperCase() === code.toUpperCase());
    if (matched || code === 'ADMIN-ALL') {
      setLoggedInPartnerCode(code);
      setIsEditingPortal(false);
    }
  };

  // Handle Logout / Switch Partner
  const handleLogoutPartner = () => {
    setLoggedInPartnerCode(null);
    setIsEditingPortal(false);
    setLoginError(null);
  };

  // Handle Registration for Partnership
  const handleRegisterPartnership = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regBusinessName.trim() || !regOfferTitle.trim()) return;

    // Generate unique Partner Code provided by us
    const cleanName = regBusinessName.replace(/[^A-Za-z0-9]/g, '').slice(0, 7).toUpperCase() || 'PARTNER';
    const randomDigits = Math.floor(100 + Math.random() * 900);
    const newPartnerCode = `BP-${cleanName}-${randomDigits}`;

    const keywordsArray = regTargetKeywords
      .split(',')
      .map(k => k.trim().toLowerCase())
      .filter(Boolean);

    const newSponsor: BusinessSponsor = {
      id: `spon-${Date.now()}`,
      partnerCode: newPartnerCode,
      businessName: regBusinessName,
      logo: regCategory.includes('Food') ? '☕' : regCategory.includes('Auto') ? '🚗' : regCategory.includes('Health') ? '🏋️' : '🏢',
      category: regCategory,
      offerTitle: regOfferTitle,
      offerDescription: regOfferDescription || 'Exclusive partner discount for TaTa daily task users.',
      promoCode: regPromoCode || `${cleanName}${randomDigits}`,
      targetKeywords: keywordsArray.length ? keywordsArray : ['special', 'offer', 'local'],
      discountPct: regDiscountPct || '15% OFF',
      rating: 5.0,
      locationName: regLocationName || 'Local Business Location',
      mapUrl: 'https://maps.google.com',
      impressions: 0,
      clicks: 0,
      redemptions: 0,
      costPerRedemption: '₱25.00',
      active: true,
      contactEmail: regContactEmail || 'partner@business.com',
      partnerSince: 'Just now'
    };

    onAddSponsor(newSponsor);

    // Show partner code notification modal & auto log-in
    setCreatedPartnerInfo({
      businessName: newSponsor.businessName,
      partnerCode: newPartnerCode
    });

    setLoggedInPartnerCode(newPartnerCode);

    // Reset registration form
    setRegBusinessName('');
    setRegOfferTitle('');
    setRegOfferDescription('');
    setRegPromoCode('');
    setRegTargetKeywords('');
    setRegContactEmail('');
    setRegLocationName('');
  };

  // Open Edit Modal for Current Logged-in Partner
  const handleStartEditingPortal = () => {
    if (!currentPartner) return;
    setEditBusinessName(currentPartner.businessName);
    setEditCategory(currentPartner.category);
    setEditOfferTitle(currentPartner.offerTitle);
    setEditOfferDescription(currentPartner.offerDescription);
    setEditPromoCode(currentPartner.promoCode);
    setEditTargetKeywords(currentPartner.targetKeywords.join(', '));
    setEditDiscountPct(currentPartner.discountPct || '20% OFF');
    setEditLocationName(currentPartner.locationName);
    setEditContactEmail(currentPartner.contactEmail || '');
    setIsEditingPortal(true);
  };

  // Save Edits to Current Business Partner Portal
  const handleSavePortalEdits = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPartner) return;

    const keywordsArray = editTargetKeywords
      .split(',')
      .map(k => k.trim().toLowerCase())
      .filter(Boolean);

    const updated: BusinessSponsor = {
      ...currentPartner,
      businessName: editBusinessName,
      category: editCategory,
      offerTitle: editOfferTitle,
      offerDescription: editOfferDescription,
      promoCode: editPromoCode,
      targetKeywords: keywordsArray.length ? keywordsArray : currentPartner.targetKeywords,
      discountPct: editDiscountPct,
      locationName: editLocationName,
      contactEmail: editContactEmail
    };

    onUpdateSponsor(updated);
    setIsEditingPortal(false);
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 4000);
  };

  // Copy partner code to clipboard
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeNotice(true);
    setTimeout(() => setCopiedCodeNotice(false), 3000);
  };

  // =========================================================================
  // RENDER VIEW 1: NOT LOGGED IN -> ENTER CODE OR REGISTER FOR PARTNERSHIP
  // =========================================================================
  if (!loggedInPartnerCode) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        
        {/* Partnership Portal Hero */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 rounded-2xl border border-emerald-800/80 p-6 sm:p-8 shadow-2xl relative overflow-hidden text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-700 text-emerald-300 text-xs font-bold mb-3">
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Business Partner Private Portal</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Manage Your Business Ad Portal & Local Perks
          </h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed max-w-2xl">
            Each registered business partner receives an official <span className="text-emerald-300 font-bold underline">Partner Code</span> from us. Enter your code below to access and edit only your dedicated business portal, or register for a new partnership code.
          </p>
        </div>

        {/* Auth Mode Toggle Tabs */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-2 flex items-center justify-center gap-2 max-w-md mx-auto shadow-md">
          <button
            id="tab-partner-login"
            type="button"
            onClick={() => { setAuthTab('login'); setLoginError(null); }}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              authTab === 'login'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Enter Partner Code</span>
          </button>

          <button
            id="tab-partner-register"
            type="button"
            onClick={() => { setAuthTab('register'); setLoginError(null); }}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              authTab === 'register'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Register for Partnership</span>
          </button>
        </div>

        {/* TAB 1: LOGIN WITH PARTNER CODE */}
        {authTab === 'login' && (
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-xl max-w-xl mx-auto space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-white">Enter Your Partner Access Code</h3>
              <p className="text-xs text-slate-400 mt-1">
                Provided by TaTa upon partnership agreement to access your custom business portal.
              </p>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1.5 uppercase tracking-wider">
                  Partner Access Code
                </label>
                <div className="relative">
                  <input
                    id="input-partner-code"
                    type="text"
                    value={partnerCodeInput}
                    onChange={(e) => setPartnerCodeInput(e.target.value)}
                    placeholder="e.g. BP-ARTISAN-101"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-mono font-bold placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 tracking-wider"
                  />
                  <Key className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
                </div>
              </div>

              <button
                id="btn-submit-partner-code"
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95"
              >
                <span>Enter My Business Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Demo Partner Codes Box */}
            <div className="pt-4 border-t border-slate-800/80">
              <span className="text-[11px] text-slate-400 font-bold block mb-2 uppercase tracking-wider text-center">
                Sample Partner Codes Issued by Us (Click to Test):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {sponsors.slice(0, 4).map((sp) => (
                  <button
                    key={sp.id}
                    type="button"
                    onClick={() => handleQuickCodeLogin(sp.partnerCode || '')}
                    className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-700/60 transition-all text-left group flex items-center justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-white group-hover:text-emerald-300 block line-clamp-1">
                        {sp.logo} {sp.businessName}
                      </span>
                      <code className="text-[10px] text-emerald-400 font-mono">
                        {sp.partnerCode}
                      </code>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400" />
                  </button>
                ))}
              </div>

              <div className="mt-3 text-center">
                <button
                  type="button"
                  onClick={() => handleQuickCodeLogin('ADMIN-ALL')}
                  className="text-[11px] text-slate-500 hover:text-cyan-400 font-medium underline"
                >
                  Admin Mode (View All Partner Portals)
                </button>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: REGISTER FOR PARTNERSHIP */}
        {authTab === 'register' && (
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-xl max-w-2xl mx-auto space-y-6">
            <div>
              <h3 className="text-xl font-extrabold text-white">Register for Business Partnership</h3>
              <p className="text-xs text-slate-400 mt-1">
                Fill in your merchant details. Upon registration, you will receive an official Partner Code to log in and edit your business portal.
              </p>
            </div>

            <form onSubmit={handleRegisterPartnership} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1">Business Name *</label>
                  <input
                    id="reg-input-business-name"
                    type="text"
                    required
                    value={regBusinessName}
                    onChange={(e) => setRegBusinessName(e.target.value)}
                    placeholder="e.g. Green Leaf Organic Cafe"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1">Category</label>
                  <select
                    id="reg-select-category"
                    value={regCategory}
                    onChange={(e) => setRegCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                  >
                    <option value="Food & Beverage">Food & Beverage</option>
                    <option value="Automotive">Automotive</option>
                    <option value="Restaurants">Restaurants</option>
                    <option value="Health & Fitness">Health & Fitness</option>
                    <option value="Business & Office">Business & Office</option>
                    <option value="Shopping & Retail">Shopping & Retail</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1">Contact Email</label>
                  <input
                    id="reg-input-contact-email"
                    type="email"
                    value={regContactEmail}
                    onChange={(e) => setRegContactEmail(e.target.value)}
                    placeholder="e.g. owner@greenleafcafe.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1">Discount Badge</label>
                  <input
                    id="reg-input-discount"
                    type="text"
                    value={regDiscountPct}
                    onChange={(e) => setRegDiscountPct(e.target.value)}
                    placeholder="e.g. 20% OFF or $10 OFF"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1">Offer Title *</label>
                <input
                  id="reg-input-offer-title"
                  type="text"
                  required
                  value={regOfferTitle}
                  onChange={(e) => setRegOfferTitle(e.target.value)}
                  placeholder="e.g. 20% Off Organic Coffee & Breakfast Sandwiches"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1">Offer Description</label>
                <textarea
                  id="reg-textarea-desc"
                  rows={2}
                  value={regOfferDescription}
                  onChange={(e) => setRegOfferDescription(e.target.value)}
                  placeholder="e.g. Present active task reminder to barista at checkout..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1">Target Keywords (Comma Separated)</label>
                  <input
                    id="reg-input-keywords"
                    type="text"
                    value={regTargetKeywords}
                    onChange={(e) => setRegTargetKeywords(e.target.value)}
                    placeholder="e.g. coffee, breakfast, latte, organic, snack"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1">Promo Code</label>
                  <input
                    id="reg-input-promocode"
                    type="text"
                    value={regPromoCode}
                    onChange={(e) => setRegPromoCode(e.target.value)}
                    placeholder="e.g. GREEN2026"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1">Store Address / Location</label>
                <input
                  id="reg-input-location"
                  type="text"
                  value={regLocationName}
                  onChange={(e) => setRegLocationName(e.target.value)}
                  placeholder="e.g. 142 Main St, Downtown Branch"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  id="btn-register-partner-submit"
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-6 py-3 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Submit & Generate Partner Code</span>
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    );
  }

  // =========================================================================
  // RENDER VIEW 2: LOGGED IN AS A BUSINESS PARTNER OR ADMIN
  // =========================================================================

  const isAdmin = loggedInPartnerCode === 'ADMIN-ALL';
  const displayedSponsors = isAdmin
    ? sponsors
    : currentPartner
    ? [currentPartner]
    : [];

  // Metrics calculation
  const totalImpressions = displayedSponsors.reduce((acc, s) => acc + s.impressions, 0);
  const totalClicks = displayedSponsors.reduce((acc, s) => acc + s.clicks, 0);
  const totalRedemptions = displayedSponsors.reduce((acc, s) => acc + s.redemptions, 0);

  return (
    <div className="space-y-6">
      
      {/* Newly Created Partner Code Banner Modal */}
      {createdPartnerInfo && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900 to-teal-950 border border-emerald-500 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">Partnership Registered Successfully!</span>
              <p className="text-sm font-bold text-white">
                Welcome, {createdPartnerInfo.businessName}! Here is your official Partner Access Code:
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-emerald-800">
            <code className="text-sm font-mono font-bold text-emerald-300">
              {createdPartnerInfo.partnerCode}
            </code>
            <button
              type="button"
              onClick={() => handleCopyCode(createdPartnerInfo.partnerCode)}
              className="p-1 text-slate-400 hover:text-white"
              title="Copy Partner Code"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setCreatedPartnerInfo(null)}
              className="text-xs text-slate-500 hover:text-white font-bold ml-2"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Partner Header & Access Control Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              {isAdmin ? 'Admin Master View' : 'Isolated Partner Portal'}
            </span>
            {currentPartner && (
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-mono font-bold border border-slate-700">
                Code: {currentPartner.partnerCode}
              </span>
            )}
          </div>

          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <span>{isAdmin ? 'All Business Partner Portals' : currentPartner?.businessName}</span>
            {currentPartner && <span className="text-xl">{currentPartner.logo}</span>}
          </h2>

          <p className="text-xs text-slate-400 mt-0.5">
            {isAdmin 
              ? 'Administrator access: Viewing and managing all partner ad campaigns.' 
              : `Logged in securely with partner code. You can edit only your business portal.`}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {currentPartner && (
            <button
              id="btn-edit-my-portal"
              type="button"
              onClick={handleStartEditingPortal}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit My Business Portal</span>
            </button>
          )}

          <button
            id="btn-logout-partner-code"
            type="button"
            onClick={handleLogoutPartner}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Switch Code / Exit</span>
          </button>
        </div>
      </div>

      {saveSuccessNotice && (
        <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-700 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Your business portal and ad campaign details have been updated successfully!</span>
        </div>
      )}

      {/* Partner Pro Version Perk Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-amber-950/80 border border-amber-500/50 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-amber-400 uppercase tracking-wider">Partner Merchant Privilege</span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full font-bold">
                Pro Version Unlocked
              </span>
            </div>
            <h3 className="text-base font-extrabold text-white mt-0.5">
              Your Partner Merchant Account Includes Full TaTa Pro Meeting Intelligence!
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Enjoy unlimited audio-to-text meeting recording, verbatim speech transcripts with speakers, executive summaries, and AI Decision Matrix — all bundled into your merchant subscription.
            </p>
          </div>
        </div>

        <button
          type="button"
          id="btn-partner-launch-pro-app"
          onClick={() => {
            if (setUserPlan) setUserPlan('premium');
            if (onLaunchProApp) onLaunchProApp();
          }}
          className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shrink-0 shadow-lg shadow-amber-500/20 cursor-pointer transition-all active:scale-95"
        >
          <Crown className="w-4 h-4 text-slate-950" />
          <span>Launch / Avail Pro Version</span>
        </button>
      </div>

      {/* Partner Specific Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Total Impressions</span>
            <Eye className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">
            {totalImpressions.toLocaleString()}
          </div>
          <span className="text-[11px] text-cyan-400 font-medium">Matched in voice reminders</span>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Customer Clicks</span>
            <MousePointer className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">
            {totalClicks.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-400 font-medium">
            {totalImpressions ? ((totalClicks / totalImpressions) * 100).toFixed(1) : 0}% CTR
          </span>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Claimed Redemptions</span>
            <Gift className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">
            {totalRedemptions.toLocaleString()}
          </div>
          <span className="text-[11px] text-amber-400 font-medium">In-store conversions</span>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Est. Merchant Sales</span>
            <DollarSign className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">
            ₱{(totalRedemptions * 250).toLocaleString()}
          </div>
          <span className="text-[11px] text-purple-400 font-medium">Generated local ROI</span>
        </div>

      </div>

      {/* EDIT PORTAL MODAL */}
      {isEditingPortal && currentPartner && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl border border-slate-700 max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Edit Business Portal & Campaign</h3>
                <p className="text-xs text-slate-400">Update your offer, target keywords, discount badge, and store details.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingPortal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSavePortalEdits} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">Business Name</label>
                  <input
                    id="edit-input-business-name"
                    type="text"
                    required
                    value={editBusinessName}
                    onChange={(e) => setEditBusinessName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">Category</label>
                  <select
                    id="edit-select-category"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Food & Beverage">Food & Beverage</option>
                    <option value="Automotive">Automotive</option>
                    <option value="Restaurants">Restaurants</option>
                    <option value="Health & Fitness">Health & Fitness</option>
                    <option value="Business & Office">Business & Office</option>
                    <option value="Shopping & Retail">Shopping & Retail</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">Offer Perk Title</label>
                <input
                  id="edit-input-offer-title"
                  type="text"
                  required
                  value={editOfferTitle}
                  onChange={(e) => setEditOfferTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">Offer Description</label>
                <textarea
                  id="edit-textarea-desc"
                  rows={2}
                  value={editOfferDescription}
                  onChange={(e) => setEditOfferDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">Target Keywords (Comma Separated)</label>
                  <input
                    id="edit-input-keywords"
                    type="text"
                    value={editTargetKeywords}
                    onChange={(e) => setEditTargetKeywords(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">Promo Code</label>
                  <input
                    id="edit-input-promocode"
                    type="text"
                    value={editPromoCode}
                    onChange={(e) => setEditPromoCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">Discount Badge Text</label>
                  <input
                    id="edit-input-discount"
                    type="text"
                    value={editDiscountPct}
                    onChange={(e) => setEditDiscountPct(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">Contact Email</label>
                  <input
                    id="edit-input-email"
                    type="email"
                    value={editContactEmail}
                    onChange={(e) => setEditContactEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">Store Address / Location</label>
                <input
                  id="edit-input-location"
                  type="text"
                  value={editLocationName}
                  onChange={(e) => setEditLocationName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditingPortal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  id="btn-save-portal-edits"
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors"
                >
                  Save Changes
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Isolated Merchant Campaign Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Building2 className="w-5 h-5 text-emerald-400" />
          <span>{isAdmin ? 'Active Partner Ad Campaigns' : 'Your Business Ad Campaign Portal'}</span>
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {displayedSponsors.map((sp) => (
            <div 
              key={sp.id}
              className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4 hover:border-emerald-800/60 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="text-3xl p-2 bg-slate-950 rounded-xl border border-slate-800">{sp.logo}</span>
                  <div>
                    <h4 className="text-lg font-extrabold text-white flex items-center gap-2">
                      <span>{sp.businessName}</span>
                      <span className="text-xs font-normal text-slate-400">({sp.category})</span>
                    </h4>
                    <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{sp.locationName}</span>
                      {sp.contactEmail && (
                        <>
                          <span>•</span>
                          <Mail className="w-3.5 h-3.5 text-slate-500" />
                          <span>{sp.contactEmail}</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-emerald-400 font-bold">
                    Code: {sp.partnerCode}
                  </span>

                  <button
                    id={`toggle-sponsor-active-${sp.id}`}
                    type="button"
                    onClick={() => onToggleSponsorStatus(sp.id)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                      sp.active
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900'
                        : 'bg-slate-800 text-slate-500 border border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {sp.active ? 'Active' : 'Paused'}
                  </button>
                </div>
              </div>

              {/* Offer Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                <div className="md:col-span-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 text-[10px] font-bold">
                      {sp.discountPct || 'PERK'}
                    </span>
                    <span className="text-xs font-bold text-white">{sp.offerTitle}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {sp.offerDescription}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Promo Code & Trigger Keywords
                  </span>
                  <div className="flex items-center gap-2 mb-2">
                    <code className="text-xs bg-slate-900 text-amber-300 px-2 py-1 rounded font-mono font-bold border border-slate-800">
                      {sp.promoCode}
                    </code>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(sp.promoCode)}
                      className="text-[10px] text-slate-400 hover:text-white"
                      title="Copy Promo Code"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {sp.targetKeywords.map((kw, i) => (
                      <span key={i} className="text-[10px] bg-slate-900 text-cyan-300 px-1.5 py-0.5 rounded border border-slate-800">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Campaign Performance Bar */}
              <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-2">
                <div className="flex items-center gap-4">
                  <span>Impressions: <strong className="text-white">{sp.impressions}</strong></span>
                  <span>Clicks: <strong className="text-emerald-400">{sp.clicks}</strong></span>
                  <span>Redemptions: <strong className="text-amber-400">{sp.redemptions}</strong></span>
                </div>

                <button
                  type="button"
                  onClick={handleStartEditingPortal}
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 underline"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Portal Details</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
