export interface ZernioProfile {
  _id: string;
  name: string;
  isDefault: boolean;
  color?: string;
  accountCount?: number;
}

export interface ZernioAccount {
  _id: string;
  platform: string;
  username: string;
  displayName: string;
  isActive: boolean;
  profileId: string | { _id: string; name: string };
  metadata?: Record<string, any>;
}

export interface OrganicPost {
  id: string;
  platform: 'twitter' | 'linkedin' | 'instagram' | 'tiktok' | 'facebook';
  author: string;
  handle: string;
  avatar: string;
  content: string;
  mediaUrl?: string;
  publishedAt: string;
  metrics: {
    likes: number;
    comments: number;
    shares: number;
    impressions: number;
  };
  baselineEngagement: number;
  currentVelocity: number;
  velocityMultiplier: number;
  isBreakout: boolean;
  boostStatus?: 'none' | 'boosting' | 'boosted';
  boostedAdId?: string;
}

export interface AdCreativeTransform {
  headline: string;
  primaryText: string;
  callToAction: 'LEARN_MORE' | 'SIGN_UP' | 'WHATSAPP_MESSAGE' | 'CONTACT_US' | 'SHOP_NOW';
  goal: 'engagement' | 'traffic' | 'conversions' | 'video_views' | 'lead_generation';
  targetNetwork: 'meta' | 'google' | 'tiktok' | 'x' | 'reddit';
  dailyBudget: number;
  durationDays: number;
  whatsappNumber?: string;
}

export interface BoostResponse {
  success: boolean;
  campaignId: string;
  adSetId: string;
  adId: string;
  platform: string;
  status: string;
  budgetDaily: number;
  estimatedReach: number;
  createdAt: string;
  livePayloadSent: Record<string, any>;
  rawResponse: Record<string, any>;
}

export interface TelegramChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  drafts?: {
    twitter: string;
    linkedin: string;
  };
  isAudio?: boolean;
  audioDuration?: string;
  buttons?: { id: string; label: string; action: 'publish' | 'schedule' | 'edit' }[];
  published?: boolean;
  publishedUrls?: {
    twitter?: string;
    linkedin?: string;
  };
}

export interface MetaAd {
  id: string;
  page_id: string;
  page_name: string;
  ad_creation_time?: string;
  ad_delivery_start_time?: string;
  ad_creative_bodies?: string[];
  ad_creative_link_titles?: string[];
  ad_creative_link_descriptions?: string[];
  ad_creative_link_captions?: string[];
  ad_snapshot_url?: string;
  ad_library_url?: string;
  publisher_platforms?: string[];
  languages?: string[];
}
