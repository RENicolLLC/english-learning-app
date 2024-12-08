// Enhanced pronunciation feedback system
import { speechRecognitionService } from '../speech/speechRecognitionService';

// Detailed analysis categories
const analysisCategories = {
  stress: {
    name: 'Word Stress',
    weight: 0.3,
    levels: {
      excellent: { min: 0.9, message: "Perfect stress pattern" },
      good: { min: 0.7, message: "Good stress, minor adjustments needed" },
      fair: { min: 0.5, message: "Stress pattern needs work" },
      poor: { min: 0, message: "Incorrect stress pattern" }
    }
  },
  vowels: {
    name: 'Vowel Sounds',
    weight: 0.3,
    levels: {
      excellent: { min: 0.9, message: "Clear vowel sounds" },
      good: { min: 0.7, message: "Most vowels correct" },
      fair: { min: 0.5, message: "Some vowel sounds unclear" },
      poor: { min: 0, message: "Vowel sounds need significant work" }
    }
  },
  consonants: {
    name: 'Consonant Sounds',
    weight: 0.2,
    levels: {
      excellent: { min: 0.9, message: "Clear consonant articulation" },
      good: { min: 0.7, message: "Most consonants clear" },
      fair: { min: 0.5, message: "Some consonants unclear" },
      poor: { min: 0, message: "Consonant sounds need work" }
    }
  },
  rhythm: {
    name: 'Speech Rhythm',
    weight: 0.1,
    levels: {
      excellent: { min: 0.9, message: "Natural rhythm" },
      good: { min: 0.7, message: "Generally good rhythm" },
      fair: { min: 0.5, message: "Rhythm needs improvement" },
      poor: { min: 0, message: "Unnatural rhythm" }
    }
  },
  intonation: {
    name: 'Intonation',
    weight: 0.1,
    levels: {
      excellent: { min: 0.9, message: "Natural intonation" },
      good: { min: 0.7, message: "Good intonation pattern" },
      fair: { min: 0.5, message: "Intonation needs work" },
      poor: { min: 0, message: "Flat or incorrect intonation" }
    }
  }
};

// Language-specific feedback
const languageSpecificFeedback = {
  th: {
    stress: "Thai speakers often use equal stress on all syllables. Focus on emphasizing the correct syllable.",
    consonants: "Pay attention to final consonants, especially stops (p, t, k).",
    vowels: "English has more vowel distinctions than Thai. Focus on long vs. short vowels.",
    common: "Practice the 'r' and 'l' sounds, which can be challenging."
  },
  vi: {
    stress: "Vietnamese is tonal, but English uses stress. Focus on word stress patterns.",
    consonants: "Practice final consonant sounds, especially stops and clusters.",
    vowels: "Pay attention to the schwa sound in unstressed syllables.",
    common: "Work on consonant clusters at the beginning and end of words."
  },
  zh: {
    stress: "Chinese uses tones, but English uses stress. Focus on stressed syllables.",
    consonants: "Practice 'th' sounds and final consonants.",
    vowels: "Pay attention to vowel length and quality.",
    common: "Work on consonant clusters and word-final sounds."
  },
  ja: {
    stress: "Japanese is mora-timed, but English is stress-timed. Emphasize stressed syllables.",
    consonants: "Practice 'l' vs 'r' and consonant clusters.",
    vowels: "Avoid adding vowels between consonants.",
    common: "Focus on natural rhythm without equal timing for each syllable."
  }
};

// Detailed feedback generator
export const generateDetailedFeedback = (analysis, userLanguage) => {
  const feedback = {
    overallScore: 0,
    categoryScores: {},
    detailedFeedback: [],
    improvements: [],
    strengths: [],
    nextSteps: []
  };

  // Calculate category scores and overall score
  Object.entries(analysisCategories).forEach(([category, details]) => {
    const score = analysis[category] || 0;
    feedback.categoryScores[category] = score;
    feedback.overallScore += score * details.weight;

    // Get level-based feedback
    const level = Object.entries(details.levels)
      .reverse()
      .find(([_, levelDetails]) => score >= levelDetails.min)?.[0];

    const levelFeedback = details.levels[level].message;
    feedback.detailedFeedback.push({
      category: details.name,
      score,
      level,
      feedback: levelFeedback
    });

    // Categorize as strength or area for improvement
    if (score >= 0.7) {
      feedback.strengths.push({
        category: details.name,
        message: levelFeedback
      });
    } else if (score < 0.6) {
      feedback.improvements.push({
        category: details.name,
        message: levelFeedback,
        languageSpecific: userLanguage ? languageSpecificFeedback[userLanguage][category] : null
      });
    }
  });

  // Generate next steps based on improvements needed
  feedback.nextSteps = generateNextSteps(feedback.improvements, userLanguage);

  return feedback;
};

// Generate specific practice recommendations
const generateNextSteps = (improvements, userLanguage) => {
  const steps = [];

  improvements.forEach(improvement => {
    switch (improvement.category) {
      case 'Word Stress':
        steps.push({
          type: 'stress',
          exercises: [
            "Practice with stress marking exercises",
            "Record and compare stress patterns",
            "Use stress visualization tools"
          ],
          resources: [
            "Word stress patterns guide",
            "Stress practice recordings",
            "Rhythm exercises"
          ]
        });
        break;
      case 'Vowel Sounds':
        steps.push({
          type: 'vowels',
          exercises: [
            "Minimal pairs practice",
            "Mirror practice for mouth shape",
            "Vowel sound isolation exercises"
          ],
          resources: [
            "Vowel sound chart",
            "Pronunciation diagrams",
            "Audio examples"
          ]
        });
        break;
      // Add more categories as needed
    }
  });

  // Add language-specific recommendations
  if (userLanguage && languageSpecificFeedback[userLanguage]) {
    steps.push({
      type: 'language_specific',
      exercises: [
        languageSpecificFeedback[userLanguage].common,
        "Targeted practice for common issues",
        "Language-specific drills"
      ],
      resources: [
        "Contrastive analysis guide",
        "Language-specific exercises",
        "Common errors practice"
      ]
    });
  }

  return steps;
};

// Progress tracking
export const trackPronunciationProgress = (userId, term, feedback) => {
  return {
    userId,
    term,
    timestamp: new Date(),
    scores: feedback.categoryScores,
    overallScore: feedback.overallScore,
    improvements: feedback.improvements.map(i => i.category)
  };
};

// Generate practice exercises based on feedback
export const generatePracticeExercises = (feedback) => {
  const exercises = [];

  feedback.improvements.forEach(improvement => {
    const category = improvement.category.toLowerCase();
    exercises.push({
      category,
      type: 'focused_practice',
      exercises: generateCategoryExercises(category, improvement.score)
    });
  });

  return exercises;
};

const generateCategoryExercises = (category, score) => {
  // Implementation for generating specific exercises
  // This would be expanded based on category and score
  return [];
};

export default {
  generateDetailedFeedback,
  trackPronunciationProgress,
  generatePracticeExercises
}; 