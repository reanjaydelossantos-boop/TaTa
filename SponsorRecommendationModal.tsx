import { BusinessSponsor, ReminderItem, MeetingAnalysis, PaymentGatewayConfig, PricingTierConfig, PartnershipApplication, BusinessInquiryForm, AppSystemMetrics, AppFeatureToggles } from '../types';

export const DEFAULT_PAYMENT_CONFIG: PaymentGatewayConfig = {
  stripeEnabled: true,
  stripePublishableKey: 'pk_live_51Mxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  stripeSecretKey: 'sk_live_51Mxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  paypalEnabled: true,
  paypalClientId: 'client_id_live_paypal_998877665544332211',
  currency: 'PHP',
  mode: 'live',
  autoPayouts: true,
  payoutInterval: 'daily',
  payoutAccount: 'GCash / BDO Connected Account ****4821',
  lastPayoutDate: '2026-07-25',
  totalVolumeProcessed: 489200.00
};

export const DEFAULT_PRICING_TIERS: PricingTierConfig = {
  freeMonthlyPrice: 0,
  freeTasksLimit: 50,
  proMonthlyPrice: 299,
  proAnnualPrice: 2990,
  partnerMonthlyPrice: 2999,
  partnerAnnualPrice: 29990
};

export const DEFAULT_PARTNERSHIP_APPLICATIONS: PartnershipApplication[] = [
  {
    id: 'app-001',
    businessName: 'GreenFit Wellness & Gym',
    contactName: 'Sarah Jenkins',
    contactEmail: 'sarah@greenfit.com',
    contactPhone: '+63 (917) 234-5678',
    category: 'Health & Fitness',
    offerTitle: 'Complimentary 7-Day Day Pass & ₱1,500 Membership Discount',
    offerDescription: 'Get access to all group classes and spa facilities when adding a fitness reminder.',
    promoCode: 'TATAFIT2026',
    targetKeywords: ['gym', 'workout', 'fitness', 'health', 'exercise', 'run', 'yoga'],
    discountPct: '20% OFF',
    locationName: 'BGC & Makati Central Plaza',
    proposedBudgetMonthly: 5000,
    status: 'pending',
    submittedAt: '2026-07-25T14:30:00Z',
    notes: 'High local foot traffic, interested in task-matched gym sponsor ads.'
  },
  {
    id: 'app-002',
    businessName: 'Urban Grind Cafe & Co-Working',
    contactName: 'Marcus Vance',
    contactEmail: 'marcus@urbangrind.ph',
    contactPhone: '+63 (918) 876-5432',
    category: 'Food & Beverage',
    offerTitle: 'Buy 1 Get 1 Specialty Coffee & Free High-Speed WiFi Pass',
    offerDescription: 'Show your work or meeting task on TaTa at checkout for BOGO coffee.',
    promoCode: 'URBANGRIND2026',
    targetKeywords: ['work', 'meeting', 'coffee', 'study', 'laptop', 'office'],
    discountPct: 'BOGO FREE',
    locationName: 'Ortigas Center & BGC Pier',
    proposedBudgetMonthly: 8000,
    status: 'approved',
    submittedAt: '2026-07-24T09:15:00Z',
    notes: 'Approved and issued partner access code BP-URBANGRIND-909.'
  }
];

export const DEFAULT_BUSINESS_INQUIRIES: BusinessInquiryForm[] = [
  {
    id: 'inq-101',
    formType: 'enterprise_license',
    senderName: 'David Sterling',
    senderEmail: 'david.sterling@acme-corp.com',
    companyName: 'Acme Enterprise Solutions',
    subject: 'Request for 250 Enterprise Pro Licenses & Custom API Integration',
    message: 'We are interested in deploying TaTa Pro Audio/Photo OCR and AI Decision Matrix across our executive sales team. Please send enterprise pricing and SSO options.',
    status: 'new',
    submittedAt: '2026-07-26T02:10:00Z'
  },
  {
    id: 'inq-102',
    formType: 'api_integration',
    senderName: 'Elena Rostova',
    senderEmail: 'elena@techpartner.io',
    companyName: 'TechPartner Systems',
    subject: 'API Gateway Partnership for Auto-Syncing Task Reminders',
    message: 'We would like to connect our project management software with TaTa Voice Assistant via webhooks.',
    status: 'contacted',
    submittedAt: '2026-07-23T11:45:00Z'
  }
];

export const DEFAULT_SYSTEM_METRICS: AppSystemMetrics = {
  activeUsersToday: 1420,
  overallTotalUsers: 24850,
  freeVersionUsers: 18620,
  proVersionUsers: 6230,
  totalVoiceRequests: 28490,
  totalPhotoOcrScans: 4810,
  activePartnerships: 12,
  monthlyRecurringRevenue: 624500.00,
  grossVolumeAllTime: 4248920.00,
  totalCouponsRedeemed: 3240
};

export const DEFAULT_FEATURE_TOGGLES: AppFeatureToggles = {
  photoOcrEnabled: true,
  voiceSynthEnabled: true,
  sponsorAdsEnabled: true,
  autoPopupsEnabled: true,
  aiDecisionMatrixEnabled: true
};


export const DEFAULT_SPONSORS: BusinessSponsor[] = [
  {
    id: 'spon-1',
    partnerCode: 'BP-ARTISAN-101',
    businessName: 'Artisan Roast & Bakery',
    logo: '☕',
    category: 'Food & Beverage',
    offerTitle: '15% Off Handcrafted Coffee & Pastries',
    offerDescription: 'Show this active daily reminder at checkout for 15% off any espresso drink or freshly baked croissant.',
    promoCode: 'AURA15COFFEE',
    targetKeywords: ['coffee', 'breakfast', 'morning', 'café', 'latte', 'snack', 'drink'],
    discountPct: '15% OFF',
    rating: 4.9,
    locationName: 'Makati High St, Branch #4',
    mapUrl: 'https://maps.google.com',
    impressions: 2450,
    clicks: 312,
    redemptions: 148,
    costPerRedemption: '₱15.00',
    active: true,
    contactEmail: 'contact@artisanroast.ph',
    partnerSince: 'Jan 2026'
  },
  {
    id: 'spon-2',
    partnerCode: 'BP-QUICKLUBE-202',
    businessName: 'QuickLube Express & Auto Care',
    logo: '🚗',
    category: 'Automotive',
    offerTitle: 'Free Tire Rotation & ₱500 Off Oil Service',
    offerDescription: 'Mention your Aura vehicle maintenance reminder to claim a complimentary 21-point vehicle checkup.',
    promoCode: 'AURADRIVE2026',
    targetKeywords: ['car', 'oil', 'drive', 'auto', 'vehicle', 'tire', 'service', 'mechanic'],
    discountPct: '₱500 OFF',
    rating: 4.8,
    locationName: 'Westside Auto Plaza',
    mapUrl: 'https://maps.google.com',
    impressions: 1890,
    clicks: 195,
    redemptions: 82,
    costPerRedemption: '₱60.00',
    active: true,
    contactEmail: 'service@quicklubeexpress.ph',
    partnerSince: 'Feb 2026'
  },
  {
    id: 'spon-3',
    partnerCode: 'BP-BISTRO-303',
    businessName: 'Bistro Green & Grill',
    logo: '🥗',
    category: 'Restaurants',
    offerTitle: 'Buy 1 Lunch Entree, Get 2nd Half Price',
    offerDescription: 'Valid for dine-in or takeaway during lunch hours (11:30 AM - 2:30 PM). Healthy organic options available.',
    promoCode: 'AURALUNCH50',
    targetKeywords: ['lunch', 'dinner', 'eat', 'restaurant', 'food', 'meal', 'salad', 'dine'],
    discountPct: '50% OFF 2ND',
    rating: 4.7,
    locationName: 'BGC Financial District, Plaza Level',
    mapUrl: 'https://maps.google.com',
    impressions: 3120,
    clicks: 480,
    redemptions: 210,
    costPerRedemption: '₱25.00',
    active: true,
    contactEmail: 'info@bistrogreen.ph',
    partnerSince: 'Mar 2026'
  },
  {
    id: 'spon-4',
    partnerCode: 'BP-PULSE-404',
    businessName: 'Pulse Fitness & Recovery',
    logo: '🏋️',
    category: 'Health & Fitness',
    offerTitle: 'Free Day Pass + Complimentary Protein Shake',
    offerDescription: 'Recharge your workout routine with full access to state-of-the-art gym equipment, sauna, and cryo therapy.',
    promoCode: 'AURAPULSEFREE',
    targetKeywords: ['gym', 'workout', 'fitness', 'exercise', 'run', 'health', 'training', 'yoga'],
    discountPct: 'FREE PASS',
    rating: 4.9,
    locationName: 'Metro Manila Health Hub',
    mapUrl: 'https://maps.google.com',
    impressions: 1420,
    clicks: 220,
    redemptions: 95,
    costPerRedemption: '₱40.00',
    active: true,
    contactEmail: 'membership@pulsefitness.ph',
    partnerSince: 'Apr 2026'
  },
  {
    id: 'spon-5',
    businessName: 'CoSpace Workspace & Boardrooms',
    logo: '🏢',
    category: 'Business & Office',
    offerTitle: '2 Free Hours Meeting Room Rental',
    offerDescription: 'Equipped with 4K display monitors, high-speed fiber Wi-Fi, and barista coffee station for team syncs.',
    promoCode: 'AURACOWORK',
    targetKeywords: ['meeting', 'office', 'work', 'presentation', 'conference', 'client', 'strategy'],
    discountPct: '2 HRS FREE',
    rating: 4.8,
    locationName: 'Innovation Tower, 12th Floor',
    mapUrl: 'https://maps.google.com',
    impressions: 1100,
    clicks: 160,
    redemptions: 44,
    costPerRedemption: '₱100.00',
    active: true,
  }
];

export const DEFAULT_REMINDERS: ReminderItem[] = [
  {
    id: 'rem-1',
    title: 'Grab morning coffee and review daily team sync agenda',
    time: 'Today at 08:30 AM',
    category: 'Work',
    priority: 'High',
    completed: false,
    createdAt: new Date().toISOString(),
    keywords: ['coffee', 'morning', 'work'],
    matchedSponsor: DEFAULT_SPONSORS[0]
  },
  {
    id: 'rem-2',
    title: 'Take car in for routine oil change and tire inspection',
    time: 'Today at 02:00 PM',
    category: 'Personal',
    priority: 'Medium',
    completed: false,
    createdAt: new Date().toISOString(),
    keywords: ['car', 'oil', 'auto'],
    matchedSponsor: DEFAULT_SPONSORS[1]
  },
  {
    id: 'rem-3',
    title: 'Team lunch meeting with client at Bistro Green',
    time: 'Today at 12:30 PM',
    category: 'Work',
    priority: 'High',
    completed: false,
    createdAt: new Date().toISOString(),
    keywords: ['lunch', 'eat', 'meeting'],
    matchedSponsor: DEFAULT_SPONSORS[2]
  },
  {
    id: 'rem-4',
    title: 'Evening gym session & cardio workout',
    time: 'Today at 06:15 PM',
    category: 'Health',
    priority: 'Medium',
    completed: false,
    createdAt: new Date().toISOString(),
    keywords: ['gym', 'workout', 'health'],
    matchedSponsor: DEFAULT_SPONSORS[3]
  }
];

export const SAMPLE_MEETING_ANALYSIS: MeetingAnalysis = {
  id: 'sample-meeting-1',
  createdAt: new Date().toISOString(),
  source: 'sample',
  meetingTitle: 'Q3 Product Strategy & Local Merchant Ad Network Sync',
  duration: '22 minutes',
  ownerDecision: {
    status: 'pending'
  },
  executiveSummary: 'The executive committee evaluated user adoption metrics for the voice-first daily personal assistant. High engagement on daily weather briefings led to a decision to expand local business sponsor integration into task reminders.',
  transcript: [
    {
      speaker: 'Samantha (VP Product)',
      text: 'Our free-tier users love setting voice reminders for morning coffee and appointments. However, we need a sustainable revenue stream without forcing intrusive banner ads.'
    },
    {
      speaker: 'Marcus (Head of Business Dev)',
      text: 'Local cafes, car repair shops, and fitness centers are eager to sponsor specific task keywords. When a user sets a reminder like "buy coffee", we can match a 15% discount coupon from a neighborhood vendor.'
    },
    {
      speaker: 'David (Lead Architect)',
      text: 'For Premium accounts, our audio-to-text meeting recorder uses Gemini to generate instant executive summaries, verbatim transcripts, and an interactive decision matrix.'
    },
    {
      speaker: 'Samantha (VP Product)',
      text: 'That decision engine is our biggest differentiator. Let us approve the rollout of native sponsor perks for free users and market the audio summarizer to business executives.'
    }
  ],
  keyDecisions: [
    'Approved Native Sponsored Reminders as the primary free-tier monetization engine.',
    'Priced Premium Tier at ₱299/mo including unlimited meeting audio processing & AI Decision Matrix.',
    'Targeting 500 local business partner accounts by end of quarter.'
  ],
  actionItems: [
    {
      task: 'Finalize Business Partner Self-Service Portal for sponsor campaign analytics',
      owner: 'Marcus',
      deadline: 'Tomorrow at 4:00 PM'
    },
    {
      task: 'Test Gemini voice command keyword matching engine for task creation',
      owner: 'David',
      deadline: 'Friday at 2:00 PM'
    },
    {
      task: 'Launch Q3 Premium marketing campaign focusing on executive audio decision support',
      owner: 'Samantha',
      deadline: 'Next Monday'
    }
  ],
  decisionMatrix: {
    coreQuestion: 'How should Aura balance free-tier voice user utility with local business monetization?',
    optionsEvaluated: [
      {
        option: 'Option 1: Task Keyword Sponsor Matching (Recommended)',
        pros: 'Delivers high contextual value with real monetary savings for users while rewarding local business sponsors with direct conversions.',
        cons: 'Requires precise keyword tag extraction.',
        riskLevel: 'Low',
        score: '9.4/10'
      },
      {
        option: 'Option 2: Paywall Voice Assistant behind Subscription',
        pros: 'Direct consumer recurring subscription revenue.',
        cons: 'Drastically reduces viral acquisition and limits total user base size.',
        riskLevel: 'High',
        score: '4.2/10'
      }
    ],
    recommendedChoice: 'Option 1: Task Keyword Sponsor Matching',
    rationale: 'Creates a win-win flywheel: free users receive automated local discounts on their daily tasks, local businesses gain high-intent customers, and Aura generates recurring sponsor ad revenues.'
  }
};
