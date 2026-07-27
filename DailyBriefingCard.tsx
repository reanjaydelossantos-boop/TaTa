/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { VoiceAssistantOrb } from './components/VoiceAssistantOrb';
import { DailyBriefingCard } from './components/DailyBriefingCard';
import { WeatherModal } from './components/WeatherModal';
import { ReminderList } from './components/ReminderList';
import { BusinessPartnerPortal } from './components/BusinessPartnerPortal';
import { MeetingIntelligencePro } from './components/MeetingIntelligencePro';
import { PricingModal } from './components/PricingModal';
import { SponsorAdAndPartnerCard } from './components/SponsorAdAndPartnerCard';
import { SponsorRecommendationModal } from './components/SponsorRecommendationModal';
import { BottomNavbar } from './components/BottomNavbar';

import { OfficialAppManagementPortal } from './components/OfficialAppManagementPortal';

import { 
  UserPlan, ReminderItem, BusinessSponsor, DailyBriefing, VoiceAssistantState, 
  CategoryType, MeetingAnalysis, OwnerDecision, PaymentGatewayConfig, PricingTierConfig, 
  PartnershipApplication, BusinessInquiryForm, AppSystemMetrics, AppFeatureToggles 
} from './types';
import { 
  DEFAULT_REMINDERS, DEFAULT_SPONSORS, SAMPLE_MEETING_ANALYSIS,
  DEFAULT_PAYMENT_CONFIG, DEFAULT_PRICING_TIERS, DEFAULT_PARTNERSHIP_APPLICATIONS,
  DEFAULT_BUSINESS_INQUIRIES, DEFAULT_SYSTEM_METRICS, DEFAULT_FEATURE_TOGGLES 
} from './data/mockData';
import { speechController } from './utils/speech';
import { X, Mic, Move, Sun } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'assistant' | 'pro' | 'business' | 'official_website'>('assistant');
  const [userPlan, setUserPlan] = useState<UserPlan>('free');
  const [userLocation, setUserLocation] = useState<string>('San Francisco, CA');
  const [showPricingModal, setShowPricingModal] = useState<boolean>(false);
  const [showVoiceModal, setShowVoiceModal] = useState<boolean>(false);
  const [showWeatherModal, setShowWeatherModal] = useState<boolean>(false);
  const [matchedSponsorPopup, setMatchedSponsorPopup] = useState<{ sponsor: BusinessSponsor; taskTitle: string } | null>(null);

  // Management & Payment Setup State
  const [paymentConfig, setPaymentConfig] = useState<PaymentGatewayConfig>(() => {
    const saved = localStorage.getItem('tata_payment_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_PAYMENT_CONFIG, ...parsed, currency: parsed.currency || 'PHP' };
      } catch (e) {
        return DEFAULT_PAYMENT_CONFIG;
      }
    }
    return DEFAULT_PAYMENT_CONFIG;
  });

  const [pricingTiers, setPricingTiers] = useState<PricingTierConfig>(() => {
    const saved = localStorage.getItem('tata_pricing_tiers');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.proMonthlyPrice === 599 || parsed.proMonthlyPrice === 19) {
          parsed.proMonthlyPrice = 299;
        }
        return { ...DEFAULT_PRICING_TIERS, ...parsed };
      } catch (e) {
        return DEFAULT_PRICING_TIERS;
      }
    }
    return DEFAULT_PRICING_TIERS;
  });

  const [applications, setApplications] = useState<PartnershipApplication[]>(() => {
    const saved = localStorage.getItem('tata_partnership_apps');
    return saved ? JSON.parse(saved) : DEFAULT_PARTNERSHIP_APPLICATIONS;
  });

  const [inquiries, setInquiries] = useState<BusinessInquiryForm[]>(() => {
    const saved = localStorage.getItem('tata_business_inquiries');
    return saved ? JSON.parse(saved) : DEFAULT_BUSINESS_INQUIRIES;
  });

  const [metrics, setMetrics] = useState<AppSystemMetrics>(DEFAULT_SYSTEM_METRICS);

  const [featureToggles, setFeatureToggles] = useState<AppFeatureToggles>(() => {
    const saved = localStorage.getItem('tata_feature_toggles');
    return saved ? JSON.parse(saved) : DEFAULT_FEATURE_TOGGLES;
  });

  // Reminders & Sponsors State
  const [reminders, setReminders] = useState<ReminderItem[]>(() => {
    const saved = localStorage.getItem('aura_reminders');
    return saved ? JSON.parse(saved) : DEFAULT_REMINDERS;
  });

  const [sponsors, setSponsors] = useState<BusinessSponsor[]>(() => {
    const saved = localStorage.getItem('aura_sponsors');
    return saved ? JSON.parse(saved) : DEFAULT_SPONSORS;
  });


  // Pro Audio Sessions State
  const [proAudioSessions, setProAudioSessions] = useState<MeetingAnalysis[]>(() => {
    const saved = localStorage.getItem('tata_pro_audio_sessions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved pro audio sessions:', e);
      }
    }
    return [SAMPLE_MEETING_ANALYSIS];
  });

  const [activeProAudioSessionId, setActiveProAudioSessionId] = useState<string | null>(() => {
    return proAudioSessions[0]?.id || 'sample-meeting-1';
  });

  // Daily Briefing State
  const [dailyBriefing, setDailyBriefing] = useState<DailyBriefing | null>(null);
  const [isBriefingLoading, setIsBriefingLoading] = useState<boolean>(false);

  // Voice State
  const [voiceState, setVoiceState] = useState<VoiceAssistantState>({
    isListening: false,
    isProcessing: false,
    isSpeaking: false,
    lastTranscript: '',
    spokenReply: ''
  });

  // Save state to LocalStorage
  useEffect(() => {
    localStorage.setItem('aura_reminders', JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem('aura_sponsors', JSON.stringify(sponsors));
  }, [sponsors]);

  useEffect(() => {
    localStorage.setItem('tata_pro_audio_sessions', JSON.stringify(proAudioSessions));
  }, [proAudioSessions]);

  useEffect(() => {
    localStorage.setItem('tata_payment_config', JSON.stringify(paymentConfig));
  }, [paymentConfig]);

  useEffect(() => {
    localStorage.setItem('tata_pricing_tiers', JSON.stringify(pricingTiers));
  }, [pricingTiers]);

  useEffect(() => {
    localStorage.setItem('tata_partnership_apps', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('tata_business_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  useEffect(() => {
    localStorage.setItem('tata_feature_toggles', JSON.stringify(featureToggles));
  }, [featureToggles]);

  const handleAddApplication = (app: PartnershipApplication) => {
    setApplications(prev => [app, ...prev]);
  };

  const handleUpdateApplicationStatus = (id: string, status: PartnershipApplication['status'], notes?: string) => {
    setApplications(prev =>
      prev.map(a => a.id === id ? { ...a, status, notes: notes || a.notes } : a)
    );
  };

  const handleAddInquiry = (inquiry: BusinessInquiryForm) => {
    setInquiries(prev => [inquiry, ...prev]);
  };

  const handleUpdateInquiryStatus = (id: string, status: BusinessInquiryForm['status']) => {
    setInquiries(prev =>
      prev.map(i => i.id === id ? { ...i, status } : i)
    );
  };

  const handleToggleFeature = (featureKey: keyof AppFeatureToggles) => {
    setFeatureToggles(prev => ({
      ...prev,
      [featureKey]: !prev[featureKey]
    }));
  };


  const handleSaveNewProAudioSession = (session: MeetingAnalysis) => {
    setProAudioSessions(prev => [session, ...prev]);
    if (session.id) {
      setActiveProAudioSessionId(session.id);
    }
  };

  const handleReplaceProAudioSession = (oldId: string, newSession: MeetingAnalysis) => {
    setProAudioSessions(prev =>
      prev.map(s => s.id === oldId ? { ...newSession, id: oldId } : s)
    );
    setActiveProAudioSessionId(oldId);
  };

  const handleUpdateOwnerDecision = (sessionId: string, decision: OwnerDecision) => {
    setProAudioSessions(prev =>
      prev.map(s => s.id === sessionId ? { ...s, ownerDecision: decision } : s)
    );
  };

  const handleDeleteProAudioSession = (id: string) => {
    setProAudioSessions(prev => {
      const remaining = prev.filter(s => s.id !== id);
      if (activeProAudioSessionId === id) {
        setActiveProAudioSessionId(remaining[0]?.id || null);
      }
      return remaining;
    });
  };

  // Process voice transcript automatically into Pro Audio Session
  const processAndSaveVoiceToProAudio = async (transcript: string) => {
    try {
      const response = await fetch('/api/process-audio-meeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          textContent: transcript,
          meetingTitle: `Voice Memo: "${transcript.length > 35 ? transcript.slice(0, 35) + '...' : transcript}"`
        })
      });
      const data = await response.json();
      const newSession: MeetingAnalysis = {
        ...data,
        id: `pro-voice-${Date.now()}`,
        createdAt: new Date().toISOString(),
        source: 'voice_assistant',
        ownerDecision: {
          status: 'pending'
        }
      };
      handleSaveNewProAudioSession(newSession);
    } catch (err) {
      console.warn('Could not auto-process voice to pro audio:', err);
    }
  };

  // Fetch Daily Briefing on location or initial load
  useEffect(() => {
    fetchBriefing();
  }, [userLocation]);

  const fetchBriefing = async () => {
    setIsBriefingLoading(true);
    try {
      const response = await fetch('/api/daily-briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userLocation,
          tasks: reminders.map(r => r.title)
        })
      });
      const data = await response.json();
      if (response.ok) {
        setDailyBriefing(data);
      }
    } catch (e) {
      console.error('Failed to fetch daily briefing:', e);
    } finally {
      setIsBriefingLoading(false);
    }
  };

  // Helper to match sponsor based on text keywords
  const findMatchingSponsor = (text: string, keywordsArr: string[] = []): BusinessSponsor | undefined => {
    const searchSpace = (text + ' ' + keywordsArr.join(' ')).toLowerCase();
    
    // Find active sponsor whose targetKeywords match any word in searchSpace
    return sponsors.find(sp => {
      if (!sp.active) return false;
      return sp.targetKeywords.some(kw => searchSpace.includes(kw.toLowerCase()));
    });
  };

  // Voice Command Submission Handler
  const handleVoiceCommandSubmitted = async (transcript: string) => {
    setVoiceState(prev => ({ ...prev, isProcessing: true }));

    try {
      const response = await fetch('/api/parse-voice-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript,
          currentReminders: reminders.map(r => ({ title: r.title, time: r.time }))
        })
      });

      const data = await response.json();

      let replyText = data.spokenResponse || `I received: "${transcript}".`;

      if (data.type === 'ADD_REMINDER' && data.actionData) {
        const title = data.actionData.title || transcript;
        const matchedSp = findMatchingSponsor(title, data.actionData.keywords || []);

        const newRem: ReminderItem = {
          id: `rem-${Date.now()}`,
          title,
          time: data.actionData.time || 'Today at 4:00 PM',
          category: (data.actionData.category as CategoryType) || 'Personal',
          priority: 'Medium',
          completed: false,
          createdAt: new Date().toISOString(),
          keywords: data.actionData.keywords || [],
          matchedSponsor: matchedSp
        };

        if (matchedSp) {
          // Increment impression count for sponsor
          setSponsors(prev => prev.map(s => s.id === matchedSp.id ? { ...s, impressions: s.impressions + 1 } : s));
          replyText += ` I matched a ${matchedSp.discountPct || 'special'} perk from ${matchedSp.businessName}! Check the offer pop-up.`;
          // Pop up sponsor store offer on screen immediately
          setMatchedSponsorPopup({ sponsor: matchedSp, taskTitle: title });
        }

        setReminders(prev => [newRem, ...prev]);
      }

      // Automatically save recorded voice input to Pro Audio page and summarize immediately
      processAndSaveVoiceToProAudio(transcript);

      setVoiceState(prev => ({
        ...prev,
        isProcessing: false,
        spokenReply: replyText,
        isSpeaking: true
      }));

      // Speak response aloud
      speechController.speak(replyText, () => {
        setVoiceState(prev => ({ ...prev, isSpeaking: false }));
      });

    } catch (err: any) {
      console.error('Error processing voice command:', err);
      const errReply = 'Sorry, I encountered an issue processing that voice command. Please try again.';
      setVoiceState(prev => ({
        ...prev,
        isProcessing: false,
        spokenReply: errReply
      }));
    }
  };

  // Toggle Reminder Completed
  const handleToggleComplete = (id: string) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
  };

  // Delete Reminder
  const handleDeleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  // Add Reminder Manually
  const handleAddReminder = (title: string, category: CategoryType, time: string) => {
    const matchedSp = findMatchingSponsor(title);

    const newRem: ReminderItem = {
      id: `rem-${Date.now()}`,
      title,
      time,
      category,
      priority: 'Medium',
      completed: false,
      createdAt: new Date().toISOString(),
      keywords: [],
      matchedSponsor: matchedSp
    };

    if (matchedSp) {
      setSponsors(prev => prev.map(s => s.id === matchedSp.id ? { ...s, impressions: s.impressions + 1 } : s));
      setMatchedSponsorPopup({ sponsor: matchedSp, taskTitle: title });
    }

    setReminders(prev => [newRem, ...prev]);
  };

  // Claim Sponsor Perk
  const handleClaimSponsorPerk = (sponsorId: string) => {
    setSponsors(prev => prev.map(s => s.id === sponsorId ? {
      ...s,
      clicks: s.clicks + 1,
      redemptions: s.redemptions + 1
    } : s));
  };

  // Scroll smoothly to Task List section
  const handleScrollToTasks = () => {
    if (activeTab !== 'assistant') {
      setActiveTab('assistant');
      setTimeout(() => {
        document.getElementById('task-list-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById('task-list-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Add New Business Sponsor
  const handleAddSponsor = (newSponsor: BusinessSponsor) => {
    setSponsors(prev => [newSponsor, ...prev]);
  };

  // Update Business Sponsor Details
  const handleUpdateSponsor = (updatedSponsor: BusinessSponsor) => {
    setSponsors(prev => prev.map(s => s.id === updatedSponsor.id ? updatedSponsor : s));
  };

  // Toggle Sponsor Active
  const handleToggleSponsorStatus = (id: string) => {
    setSponsors(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  // Push Action Items from Meeting Analysis to Daily Reminders
  const handlePushActionItemsToReminders = (tasks: { title: string; category: CategoryType; time: string }[]) => {
    const newItems: ReminderItem[] = tasks.map((t, idx) => {
      const matchedSp = findMatchingSponsor(t.title);
      if (matchedSp) {
        setSponsors(prev => prev.map(s => s.id === matchedSp.id ? { ...s, impressions: s.impressions + 1 } : s));
      }
      return {
        id: `rem-meeting-${Date.now()}-${idx}`,
        title: t.title,
        time: t.time,
        category: t.category,
        priority: 'High',
        completed: false,
        createdAt: new Date().toISOString(),
        keywords: ['meeting', 'action'],
        matchedSponsor: matchedSp
      };
    });

    setReminders(prev => [...newItems, ...prev]);
  };

  // If activeTab is 'official_website', render the Standalone Official Website directly as a separate page
  if (activeTab === 'official_website') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">
        <OfficialAppManagementPortal
          sponsors={sponsors}
          onAddSponsor={handleAddSponsor}
          onUpdateSponsor={handleUpdateSponsor}
          onToggleSponsorStatus={handleToggleSponsorStatus}
          onLaunchApp={() => setActiveTab('assistant')}
          userPlan={userPlan}
          setUserPlan={setUserPlan}
          paymentConfig={paymentConfig}
          onUpdatePaymentConfig={setPaymentConfig}
          pricingTiers={pricingTiers}
          onUpdatePricingTiers={setPricingTiers}
          applications={applications}
          onAddApplication={handleAddApplication}
          onUpdateApplicationStatus={handleUpdateApplicationStatus}
          inquiries={inquiries}
          onAddInquiry={handleAddInquiry}
          onUpdateInquiryStatus={handleUpdateInquiryStatus}
          metrics={metrics}
          featureToggles={featureToggles}
          onToggleFeature={handleToggleFeature}
        />
        <BottomNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-cyan-500 selection:text-slate-950 pb-20">
      
      {/* Navigation Header for Web App Workspace */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userPlan={userPlan}
        setUserPlan={setUserPlan}
        userLocation={userLocation}
        setUserLocation={setUserLocation}
        onOpenPricing={() => setShowPricingModal(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        
        {/* VIEW 1: MAIN PAGE (Daily Briefing, Local Sponsor Portion, & Tasks with Minimized Voice Entry) */}
        {activeTab === 'assistant' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* 1. Daily Weather & Environment Briefing */}
            <DailyBriefingCard
              briefing={dailyBriefing}
              isLoading={isBriefingLoading}
              onRefresh={fetchBriefing}
              userLocation={userLocation}
              onOpenWeatherModal={() => setShowWeatherModal(true)}
              onOpenVoiceModal={() => setShowVoiceModal(true)}
              onClickPendingTasks={handleScrollToTasks}
              pendingCount={reminders.filter(r => !r.completed).length}
            />

            {/* 2. Local Sponsored Ad Spotlight & Business Partner Invitation */}
            <SponsorAdAndPartnerCard
              sponsors={sponsors}
              onOpenBusinessPortal={() => setActiveTab('business')}
              onClaimSponsorPerk={handleClaimSponsorPerk}
            />

            {/* 3. Daily Reminders & Task Data Entry with Minimized Microphone Beside Input */}
            <ReminderList
              reminders={reminders}
              onToggleComplete={handleToggleComplete}
              onDeleteReminder={handleDeleteReminder}
              onAddReminder={handleAddReminder}
              onClaimSponsorPerk={handleClaimSponsorPerk}
              onVoiceCommandSubmitted={handleVoiceCommandSubmitted}
              onOpenVoiceModal={() => setShowVoiceModal(true)}
            />
          </div>
        )}

        {/* VIEW 2: MEETING INTELLIGENCE PRO (Premium Audio Summarizer & Decision Helper) */}
        {activeTab === 'pro' && (
          <div className="animate-in fade-in duration-300">
            <MeetingIntelligencePro
              userPlan={userPlan}
              onOpenPricing={() => setShowPricingModal(true)}
              onPushActionItemsToReminders={handlePushActionItemsToReminders}
              sessions={proAudioSessions}
              activeSessionId={activeProAudioSessionId}
              onSelectSession={(id) => setActiveProAudioSessionId(id)}
              onSaveNewSession={handleSaveNewProAudioSession}
              onUpdateOwnerDecision={handleUpdateOwnerDecision}
              onDeleteSession={handleDeleteProAudioSession}
              onReplaceSession={handleReplaceProAudioSession}
            />
          </div>
        )}

        {/* VIEW 3: BUSINESS SPONSOR AD NETWORK PORTAL */}
        {activeTab === 'business' && (
          <div className="animate-in fade-in duration-300">
            <BusinessPartnerPortal
              sponsors={sponsors}
              onAddSponsor={handleAddSponsor}
              onUpdateSponsor={handleUpdateSponsor}
              onToggleSponsorStatus={handleToggleSponsorStatus}
              setUserPlan={setUserPlan}
              onLaunchProApp={() => setActiveTab('pro')}
            />
          </div>
        )}

      </main>



      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>TaTa (TalkTask) Personal Assistant & Sponsored Ad Network © 2026</p>
          <div className="flex items-center gap-4 text-slate-600">
            <span>Powered by Gemini AI</span>
            <span>•</span>
            <button
              id="footer-link-business-portal"
              onClick={() => setActiveTab('business')}
              className="text-slate-400 hover:text-emerald-400 transition-colors font-medium underline underline-offset-2"
            >
              Business Partner Portal
            </button>
          </div>
        </div>
      </footer>

      {/* Voice Assistant Orb Modal Popup (Draggable with Cursor) */}
      {showVoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <motion.div
            drag
            dragMomentum={false}
            whileDrag={{ cursor: 'grabbing' }}
            className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] overflow-y-auto cursor-grab active:cursor-grabbing"
          >
            {/* Drag Handle Banner */}
            <div className="bg-slate-950/60 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400 select-none">
              <span className="flex items-center gap-1.5 font-medium text-slate-300">
                <Move className="w-3.5 h-3.5 text-cyan-400" />
                Click & drag modal anywhere with your cursor
              </span>
              <span className="text-[10px] text-slate-500">Draggable Voice Popup</span>
            </div>

            {/* Modal Close Button */}
            <button
              id="btn-close-voice-modal"
              onClick={() => setShowVoiceModal(false)}
              className="absolute top-3 right-3 z-20 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors shadow-lg"
              title="Close Voice Assistant"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Voice Assistant Orb Component */}
            <div className="p-2 sm:p-4">
              <VoiceAssistantOrb
                onVoiceCommandSubmitted={handleVoiceCommandSubmitted}
                voiceState={voiceState}
                setVoiceState={setVoiceState}
              />
            </div>

          </motion.div>
        </div>
      )}

      {/* Weather Metrics Pop-up Modal (Draggable with Cursor) */}
      {showWeatherModal && (
        <WeatherModal
          briefing={dailyBriefing}
          userLocation={userLocation}
          onClose={() => setShowWeatherModal(false)}
        />
      )}

      {/* Pricing Comparison Modal */}
      {showPricingModal && (
        <PricingModal
          userPlan={userPlan}
          setUserPlan={setUserPlan}
          pricingTiers={pricingTiers}
          onClose={() => setShowPricingModal(false)}
          onSelectPartnerTab={() => setActiveTab('business')}
        />
      )}

      {/* Sponsor Store/Product Suggestion Pop-up Modal */}
      {matchedSponsorPopup && (
        <SponsorRecommendationModal
          sponsor={matchedSponsorPopup.sponsor}
          taskTitle={matchedSponsorPopup.taskTitle}
          onClose={() => setMatchedSponsorPopup(null)}
          onClaimSponsorPerk={handleClaimSponsorPerk}
        />
      )}

      {/* Mobile Fixed Bottom Navigation Bar */}
      <BottomNavbar activeTab={activeTab} setActiveTab={setActiveTab} />

    </div>
  );
}
