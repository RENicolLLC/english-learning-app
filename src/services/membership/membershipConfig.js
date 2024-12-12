export const membershipTiers = {
  BASIC: {
    id: 'basic',
    name: 'Basic',
    price: 9.99,
    features: {
      scenariosPerMonth: 50,
      aiConversationsPerDay: 10,
      pronunciationChecks: 20,
      savedVocabulary: 100,
      downloadableContent: false,
      culturalInsights: false,
      personalizedFeedback: false,
      communityAccess: 'read-only'
    },
    maxLevel: 4 // Up to Elementary School level
  },
  STANDARD: {
    id: 'standard',
    name: 'Standard',
    price: 19.99,
    features: {
      scenariosPerMonth: 200,
      aiConversationsPerDay: 30,
      pronunciationChecks: 100,
      savedVocabulary: 500,
      downloadableContent: true,
      culturalInsights: true,
      personalizedFeedback: false,
      communityAccess: 'limited'
    },
    maxLevel: 8 // Up to Middle School level
  },
  PREMIUM: {
    id: 'premium',
    name: 'Premium',
    price: 39.99,
    features: {
      scenariosPerMonth: 1000,
      aiConversationsPerDay: 100,
      pronunciationChecks: 500,
      savedVocabulary: 2000,
      downloadableContent: true,
      culturalInsights: true,
      personalizedFeedback: true,
      communityAccess: 'full'
    },
    maxLevel: 12 // Up to High School level
  },
  UNLIMITED: {
    id: 'unlimited',
    name: 'Unlimited',
    price: 69.99,
    features: {
      scenariosPerMonth: 'unlimited',
      aiConversationsPerDay: 'unlimited',
      pronunciationChecks: 'unlimited',
      savedVocabulary: 'unlimited',
      downloadableContent: true,
      culturalInsights: true,
      personalizedFeedback: true,
      communityAccess: 'priority'
    },
    maxLevel: 'unlimited' // All levels including College and Professional
  }
};

export const educationLevels = {
  ELEMENTARY: {
    levels: [1, 2, 3, 4],
    scenarios: {
      categories: [
        'Family Life',
        'School Basics',
        'Simple Shopping',
        'Making Friends',
        'Daily Routines'
      ],
      complexity: 'basic',
      vocabularyRange: 500,
      grammarFocus: ['Simple Present', 'Simple Past', 'Basic Questions']
    }
  },
  MIDDLE_SCHOOL: {
    levels: [5, 6, 7, 8],
    scenarios: {
      categories: [
        'School Life',
        'Hobbies & Sports',
        'Social Media',
        'Entertainment',
        'Local Community'
      ],
      complexity: 'intermediate',
      vocabularyRange: 1500,
      grammarFocus: ['Perfect Tenses', 'Conditionals', 'Passive Voice']
    }
  },
  HIGH_SCHOOL: {
    levels: [9, 10, 11, 12],
    scenarios: {
      categories: [
        'Academic Discussions',
        'Current Events',
        'Career Planning',
        'Technology',
        'Global Issues'
      ],
      complexity: 'advanced',
      vocabularyRange: 3000,
      grammarFocus: ['Advanced Tenses', 'Complex Sentences', 'Academic Writing']
    }
  },
  COLLEGE: {
    levels: ['College', 'Professional'],
    scenarios: {
      categories: [
        'Professional Communication',
        'Business English',
        'Academic Research',
        'Industry Specific',
        'Cultural Nuances'
      ],
      complexity: 'professional',
      vocabularyRange: 5000,
      grammarFocus: ['Professional Writing', 'Public Speaking', 'Research Papers']
    }
  }
};

export const scenarioCategories = {
  DAILY_LIFE: [
    'Morning Routine',
    'Family Meals',
    'House Chores',
    'Weekend Activities',
    'Personal Care'
  ],
  SOCIAL: [
    'Meeting Friends',
    'Social Media',
    'Party Planning',
    'Dating',
    'Group Activities'
  ],
  EDUCATION: [
    'Classroom Interactions',
    'Study Groups',
    'Teacher Meetings',
    'Library Usage',
    'Academic Projects'
  ],
  SHOPPING: [
    'Grocery Store',
    'Mall Shopping',
    'Online Shopping',
    'Returns & Exchanges',
    'Price Negotiations'
  ],
  TRAVEL: [
    'Airport Navigation',
    'Hotel Booking',
    'Tourist Attractions',
    'Public Transportation',
    'Restaurant Orders'
  ],
  WORK: [
    'Job Interviews',
    'Office Communication',
    'Email Writing',
    'Presentations',
    'Client Meetings'
  ],
  HEALTH: [
    'Doctor Visits',
    'Pharmacy Interactions',
    'Emergency Situations',
    'Fitness Classes',
    'Mental Health'
  ],
  ENTERTAINMENT: [
    'Movie Theater',
    'Concert Events',
    'Sports Games',
    'Restaurant Dining',
    'Cultural Festivals'
  ]
};

export const usageTracking = {
  trackUsage: (userId, feature, amount) => {
    // Implementation for tracking feature usage
    return {
      userId,
      feature,
      amount,
      timestamp: new Date(),
      remaining: calculateRemaining(userId, feature, amount)
    };
  },
  
  checkLimit: (userId, feature) => {
    // Implementation for checking if user has reached their limit
    return {
      hasReachedLimit: false,
      remaining: calculateRemaining(userId, feature, 0),
      resetDate: getNextResetDate()
    };
  },
  
  getRemainingUsage: (userId) => {
    // Implementation for getting all remaining usage for user
    return {
      scenariosPerMonth: 100,
      aiConversationsPerDay: 20,
      pronunciationChecks: 50
    };
  }
};

// Helper functions
const calculateRemaining = (userId, feature, amount) => {
  // Implementation for calculating remaining usage
  return 100; // Placeholder
};

const getNextResetDate = () => {
  // Implementation for getting next usage reset date
  return new Date();
};

export default {
  membershipTiers,
  educationLevels,
  scenarioCategories,
  usageTracking
}; 