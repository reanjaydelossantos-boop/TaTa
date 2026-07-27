export type UserPlan = 'free' | 'premium';

export type CategoryType = 'Work' | 'Personal' | 'Health' | 'Finance' | 'Shopping';
export type PriorityType = 'High' | 'Medium' | 'Low';

export interface BusinessSponsor {
  id: string;
  partnerCode?: string;
  businessName: string;
  logo: string;
  category: string;
  offerTitle: string;
  offerDescription: string;
  promoCode: string;
  targetKeywords: string[];
  discountPct?: string;
  rating: number;
  locationName: string;
  mapUrl: string;
  impressions: number;
  clicks: number;
  redemptions: number;
  costPerRedemption: string;
  active: boolean;
  contactEmail?: string;
  partnerSince?: string;
}

export interface ReminderItem {
  id: string;
  title: string;
  time: string;
  category: CategoryType;
  priority: PriorityType;
  completed: boolean;
  createdAt: string;
  keywords: string[];
  matchedSponsor?: BusinessSponsor;
}

export interface WeatherData {
  tempC: number;
  condition: string;
  humidity: number;
  uvIndex: number;
  aqi: number;
  aqiLevel: string;
  wind: string;
  advice: string;
}

export interface DailyBriefing {
  greeting: string;
  weather: WeatherData;
  summary: string;
  spokenBriefing: string;
}

export interface MeetingTranscriptItem {
  speaker: string;
  text: string;
}

export interface MeetingActionItem {
  task: string;
  owner: string;
  deadline: string;
}

export interface DecisionOption {
  option: string;
  pros: string;
  cons: string;
  riskLevel: string;
  score: string;
}

export interface DecisionMatrix {
  coreQuestion: string;
  optionsEvaluated: DecisionOption[];
  recommendedChoice: string;
  rationale: string;
}

export interface OwnerDecision {
  status: 'pending' | 'accepted' | 'custom';
  selectedOption?: string;
  ownerNotes?: string;
  decidedAt?: string;
}

export interface MeetingAnalysis {
  id?: string;
  createdAt?: string;
  source?: 'voice_assistant' | 'recorded_audio' | 'uploaded_file' | 'photo_ocr' | 'notes' | 'sample';
  audioUrl?: string;
  imageUrl?: string;
  meetingTitle: string;
  duration: string;
  executiveSummary: string;
  transcript: MeetingTranscriptItem[];
  keyDecisions: string[];
  actionItems: MeetingActionItem[];
  decisionMatrix: DecisionMatrix;
  ownerDecision?: OwnerDecision;
}

export interface VoiceAssistantState {
  isListening: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  lastTranscript: string;
  spokenReply: string;
}

export interface PaymentGatewayConfig {
  stripeEnabled: boolean;
  stripePublishableKey: string;
  stripeSecretKey: string;
  paypalEnabled: boolean;
  paypalClientId: string;
  currency: 'USD' | 'EUR' | 'GBP' | 'PHP' | 'JPY';
  mode: 'sandbox' | 'live';
  autoPayouts: boolean;
  payoutInterval: 'daily' | 'weekly' | 'monthly';
  payoutAccount: string;
  lastPayoutDate: string;
  totalVolumeProcessed: number;
}

export interface PricingTierConfig {
  freeMonthlyPrice: number;
  freeTasksLimit: number;
  proMonthlyPrice: number;
  proAnnualPrice: number;
  partnerMonthlyPrice: number;
  partnerAnnualPrice: number;
}

export interface PartnershipApplication {
  id: string;
  businessName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  category: string;
  offerTitle: string;
  offerDescription: string;
  promoCode: string;
  targetKeywords: string[];
  discountPct: string;
  locationName: string;
  proposedBudgetMonthly: number;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  submittedAt: string;
  notes?: string;
}

export interface BusinessInquiryForm {
  id: string;
  formType: 'enterprise_license' | 'api_integration' | 'general_inquiry' | 'support_ticket';
  senderName: string;
  senderEmail: string;
  companyName: string;
  subject: string;
  message: string;
  status: 'new' | 'contacted' | 'resolved';
  submittedAt: string;
}

export interface AppSystemMetrics {
  activeUsersToday: number;
  overallTotalUsers: number;
  freeVersionUsers: number;
  proVersionUsers: number;
  totalVoiceRequests: number;
  totalPhotoOcrScans: number;
  activePartnerships: number;
  monthlyRecurringRevenue: number;
  grossVolumeAllTime: number;
  totalCouponsRedeemed: number;
}

export interface AppFeatureToggles {
  photoOcrEnabled: boolean;
  voiceSynthEnabled: boolean;
  sponsorAdsEnabled: boolean;
  autoPopupsEnabled: boolean;
  aiDecisionMatrixEnabled: boolean;
}

