export type SubscriptionTier = 'basic' | 'premium' | 'unlimited';

export interface SubscriptionPlan {
  tier: SubscriptionTier;
  features: {
    dailyLessons: number;
    scenarioAccess: number;
    nativeSpeakerMinutes: number;
    aiTutorMinutes: number;
    downloadContent: boolean;
    groupClasses: boolean;
    personalTutor: boolean;
  };
  pricing: {
    monthly: number;
    yearly: number;
  };
}

export const SUBSCRIPTION_PLANS: Record<SubscriptionTier, SubscriptionPlan> = {
  basic: {
    tier: 'basic',
    features: {
      dailyLessons: 3,
      scenarioAccess: 50,
      nativeSpeakerMinutes: 15,
      aiTutorMinutes: 30,
      downloadContent: false,
      groupClasses: false,
      personalTutor: false
    },
    pricing: {
      monthly: 9.99,
      yearly: 99.99
    }
  },
  premium: {
    tier: 'premium',
    features: {
      dailyLessons: 10,
      scenarioAccess: 2000,
      nativeSpeakerMinutes: 60,
      aiTutorMinutes: 120,
      downloadContent: true,
      groupClasses: true,
      personalTutor: false
    },
    pricing: {
      monthly: 19.99,
      yearly: 199.99
    }
  },
  unlimited: {
    tier: 'unlimited',
    features: {
      dailyLessons: Infinity,
      scenarioAccess: 5000,
      nativeSpeakerMinutes: Infinity,
      aiTutorMinutes: Infinity,
      downloadContent: true,
      groupClasses: true,
      personalTutor: true
    },
    pricing: {
      monthly: 39.99,
      yearly: 399.99
    }
  }
}; 