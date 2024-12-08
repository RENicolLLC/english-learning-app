import { db } from '../firebase/firebaseConfig';
import { membershipTiers, educationLevels, scenarioCategories } from '../membership/membershipConfig';

export const scenarioService = {
  // Get scenarios based on user's level and membership
  getScenarios: async (userId, level, category, limit = 10) => {
    try {
      const userDoc = await db.collection('users').doc(userId).get();
      const { membershipTier } = userDoc.data();
      
      // Check if user has access to this level
      if (!canAccessLevel(membershipTier, level)) {
        throw new Error('Level not available in current membership tier');
      }

      const query = db.collection('scenarios')
        .where('level', '==', level)
        .where('category', '==', category)
        .limit(limit);

      const scenarios = await query.get();
      return scenarios.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching scenarios:', error);
      throw error;
    }
  },

  // Get a specific scenario with all its variations
  getScenarioById: async (scenarioId, nativeLanguage) => {
    try {
      const scenarioDoc = await db.collection('scenarios').doc(scenarioId).get();
      const scenario = scenarioDoc.data();

      // Get translations for user's native language
      const translationsDoc = await db.collection('translations')
        .doc(`${scenarioId}_${nativeLanguage}`)
        .get();

      return {
        ...scenario,
        translations: translationsDoc.data() || {}
      };
    } catch (error) {
      console.error('Error fetching scenario:', error);
      throw error;
    }
  },

  // Track user's progress in scenarios
  trackProgress: async (userId, scenarioId, performance) => {
    try {
      await db.collection('userProgress').add({
        userId,
        scenarioId,
        ...performance,
        timestamp: new Date()
      });

      // Update user's overall progress
      await updateUserProgress(userId, performance);
    } catch (error) {
      console.error('Error tracking progress:', error);
      throw error;
    }
  },

  // Get recommended scenarios based on user's progress
  getRecommendations: async (userId) => {
    try {
      const userProgress = await getUserProgress(userId);
      const recommendations = generateRecommendations(userProgress);
      return recommendations;
    } catch (error) {
      console.error('Error getting recommendations:', error);
      throw error;
    }
  },

  // Generate scenario variations
  generateVariations: async (scenarioId, difficulty = 'normal') => {
    try {
      const baseScenario = await db.collection('scenarios').doc(scenarioId).get();
      const variations = generateScenarioVariations(baseScenario.data(), difficulty);
      return variations;
    } catch (error) {
      console.error('Error generating variations:', error);
      throw error;
    }
  }
};

// Helper functions
const canAccessLevel = (membershipTier, level) => {
  const tier = membershipTiers[membershipTier.toUpperCase()];
  if (tier.maxLevel === 'unlimited') return true;
  return level <= tier.maxLevel;
};

const updateUserProgress = async (userId, performance) => {
  const userProgressRef = db.collection('users').doc(userId);
  await db.runTransaction(async (transaction) => {
    const doc = await transaction.get(userProgressRef);
    const currentProgress = doc.data().progress || {};

    const updatedProgress = calculateUpdatedProgress(currentProgress, performance);
    transaction.update(userProgressRef, { progress: updatedProgress });
  });
};

const getUserProgress = async (userId) => {
  const userDoc = await db.collection('users').doc(userId).get();
  return userDoc.data().progress || {};
};

const generateRecommendations = (userProgress) => {
  // Implementation for generating personalized recommendations
  return [];
};

const generateScenarioVariations = (baseScenario, difficulty) => {
  // Implementation for generating scenario variations
  return [];
};

// Scenario template structure
export const scenarioTemplate = {
  metadata: {
    id: '',
    title: '',
    category: '',
    level: 1,
    difficulty: 'normal',
    tags: [],
    prerequisites: []
  },
  content: {
    setup: {
      context: '',
      location: '',
      participants: [],
      objectives: []
    },
    dialogue: [
      {
        speaker: '',
        text: '',
        translations: {},
        audioUrl: '',
        notes: ''
      }
    ],
    variations: [
      {
        condition: '',
        alternativeDialogue: []
      }
    ],
    culturalNotes: {
      relevance: '',
      tips: [],
      commonMistakes: []
    },
    exercises: {
      vocabulary: [],
      grammar: [],
      pronunciation: [],
      comprehension: []
    },
    assessment: {
      criteria: [],
      rubric: {},
      passingScore: 0
    }
  },
  interactions: {
    userChoices: [],
    branchingPoints: [],
    consequences: []
  },
  resources: {
    images: [],
    audio: [],
    video: [],
    additionalReading: []
  }
};

export default scenarioService; 