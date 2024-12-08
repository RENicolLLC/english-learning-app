import { speechRecognitionService } from '../speech/speechRecognitionService';

// Enhanced scoring configuration
export const scoringConfig = {
  // Main categories with weighted sub-components
  categories: {
    stress: {
      weight: 0.3,
      components: {
        syllableStress: 0.4,    // Individual syllable stress
        wordStress: 0.4,        // Word-level stress pattern
        sentenceStress: 0.2     // Sentence-level stress
      }
    },
    vowels: {
      weight: 0.3,
      components: {
        quality: 0.4,           // Vowel sound accuracy
        length: 0.3,            // Long/short distinction
        reduction: 0.3          // Schwa and reduction
      }
    },
    consonants: {
      weight: 0.2,
      components: {
        articulation: 0.4,      // Clear pronunciation
        clusters: 0.3,          // Consonant groups
        finals: 0.3             // Word-final sounds
      }
    },
    rhythm: {
      weight: 0.1,
      components: {
        timing: 0.5,            // Overall timing
        fluency: 0.5            // Smooth delivery
      }
    },
    intonation: {
      weight: 0.1,
      components: {
        pattern: 0.5,           // Rise/fall patterns
        expression: 0.5         // Natural expression
      }
    }
  },

  // Language-specific adjustments
  languageFactors: {
    th: {
      stress: {
        factor: 0.9,
        focus: ['wordStress', 'sentenceStress'],
        commonErrors: ['equal stress on all syllables']
      },
      consonants: {
        factor: 0.9,
        focus: ['finals', 'clusters'],
        commonErrors: ['final consonant omission']
      }
    },
    vi: {
      stress: {
        factor: 0.9,
        focus: ['wordStress'],
        commonErrors: ['tonal interference']
      },
      rhythm: {
        factor: 0.9,
        focus: ['timing'],
        commonErrors: ['syllable-timed rhythm']
      }
    },
    zh: {
      stress: {
        factor: 0.9,
        focus: ['wordStress', 'sentenceStress'],
        commonErrors: ['tonal interference']
      },
      rhythm: {
        factor: 0.85,
        focus: ['timing', 'fluency'],
        commonErrors: ['syllable-timed pattern']
      }
    },
    ja: {
      consonants: {
        factor: 0.9,
        focus: ['articulation'],
        commonErrors: ['l/r distinction']
      },
      rhythm: {
        factor: 0.85,
        focus: ['timing'],
        commonErrors: ['mora-timed pattern']
      }
    }
  }
};

// Enhanced scoring algorithm
export const calculateEnhancedScore = (recording, reference, options = {}) => {
  const {
    userLanguage = 'en',
    proficiencyLevel = 'intermediate',
    wordComplexity = 'medium'
  } = options;

  // Get raw analysis from speech recognition
  const analysis = speechRecognitionService.analyzeRecording(recording, reference);
  
  // Initialize scoring object
  const scores = {
    overall: 0,
    categories: {},
    details: {},
    recommendations: []
  };

  // Calculate detailed category scores
  Object.entries(scoringConfig.categories).forEach(([category, config]) => {
    const categoryScore = calculateCategoryScore(
      analysis[category],
      config,
      userLanguage,
      wordComplexity
    );
    scores.categories[category] = categoryScore;
  });

  // Apply language-specific adjustments
  applyLanguageAdjustments(scores, userLanguage);

  // Calculate final score
  scores.overall = calculateFinalScore(scores.categories);

  // Generate recommendations
  scores.recommendations = generateRecommendations(
    scores,
    userLanguage,
    proficiencyLevel
  );

  return scores;
};

// Helper functions
const calculateCategoryScore = (rawAnalysis, config, userLanguage, complexity) => {
  const score = {
    raw: 0,
    adjusted: 0,
    components: {},
    details: {}
  };

  // Calculate component scores
  Object.entries(config.components).forEach(([component, weight]) => {
    const componentScore = calculateComponentScore(
      rawAnalysis[component],
      userLanguage,
      complexity
    );
    score.components[component] = componentScore;
    score.raw += componentScore * weight;
  });

  // Apply complexity adjustment
  score.adjusted = applyComplexityAdjustment(score.raw, complexity);

  return score;
};

const calculateComponentScore = (rawScore, userLanguage, complexity) => {
  // Base calculation
  let score = rawScore;

  // Language-specific adjustments
  const languageAdjustment = getLanguageAdjustment(userLanguage);
  score *= languageAdjustment;

  // Complexity adjustments
  const complexityFactor = getComplexityFactor(complexity);
  score *= complexityFactor;

  return Math.min(1, Math.max(0, score));
};

const applyLanguageAdjustments = (scores, userLanguage) => {
  const factors = scoringConfig.languageFactors[userLanguage];
  if (!factors) return;

  Object.entries(factors).forEach(([category, adjustment]) => {
    if (scores.categories[category]) {
      scores.categories[category].adjusted *= adjustment.factor;
      scores.details[category] = {
        focus: adjustment.focus,
        commonErrors: adjustment.commonErrors
      };
    }
  });
};

const calculateFinalScore = (categories) => {
  let weightedSum = 0;
  let totalWeight = 0;

  Object.entries(categories).forEach(([_, data]) => {
    weightedSum += data.adjusted * data.weight;
    totalWeight += data.weight;
  });

  return weightedSum / totalWeight;
};

const generateRecommendations = (scores, userLanguage, level) => {
  const recommendations = [];

  // Add category-specific recommendations
  Object.entries(scores.categories).forEach(([category, data]) => {
    if (data.adjusted < 0.7) {
      const categoryRec = generateCategoryRecommendation(
        category,
        data,
        userLanguage,
        level
      );
      recommendations.push(categoryRec);
    }
  });

  // Add language-specific recommendations
  if (scoringConfig.languageFactors[userLanguage]) {
    const langRec = generateLanguageRecommendation(
      userLanguage,
      scores
    );
    recommendations.push(langRec);
  }

  return recommendations;
};

const getComplexityFactor = (complexity) => {
  const factors = {
    easy: 1.1,
    medium: 1.0,
    hard: 0.9
  };
  return factors[complexity] || 1.0;
};

const getLanguageAdjustment = (userLanguage) => {
  const adjustments = {
    th: 1.1,
    vi: 1.1,
    zh: 1.1,
    ja: 1.1
  };
  return adjustments[userLanguage] || 1.0;
};

export default {
  scoringConfig,
  calculateEnhancedScore
}; 