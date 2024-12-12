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
  const exercises = [];
  
  switch (category) {
    case 'stress':
      exercises.push(
        {
          type: 'stress_pattern',
          words: ['hospital', 'emergency', 'medication', 'diagnosis', 'treatment'],
          instructions: 'Mark the stressed syllable in each word',
          difficulty: score < 0.7 ? 'easy' : 'normal'
        },
        {
          type: 'word_pairs',
          pairs: [
            ['REcord (n)', 'reCORD (v)'],
            ['CONduct (n)', 'conDUCT (v)'],
            ['PREsent (n)', 'preSENT (v)']
          ],
          instructions: 'Practice the stress difference in these word pairs'
        }
      );
      break;

    case 'intonation':
      exercises.push(
        {
          type: 'question_patterns',
          sentences: [
            'How are you feeling today?',
            'Does it hurt when you move?',
            'Have you taken any medication?'
          ],
          instructions: 'Practice the rising and falling intonation patterns'
        },
        {
          type: 'emotion_expression',
          phrases: [
            { text: 'I understand', emotion: 'empathy' },
            { text: 'That must be difficult', emotion: 'concern' },
            { text: 'You're making progress', emotion: 'encouragement' }
          ],
          instructions: 'Practice expressing different emotions through intonation'
        }
      );
      break;

    case 'rhythm':
      exercises.push(
        {
          type: 'sentence_rhythm',
          sentences: [
            'Take | the MED|i|cine | TWICE | a DAY',
            'TELL | me WHERE | it HURTS | the MOST',
            'I NEED | to CHECK | your BLOOD | pres|SURE'
          ],
          instructions: 'Practice the rhythm patterns marked with | symbols'
        },
        {
          type: 'rhythm_groups',
          groups: [
            'in the morning | after breakfast',
            'before going to bed | with water',
            'if symptoms persist | call your doctor'
          ],
          instructions: 'Practice connecting these rhythm groups smoothly'
        }
      );
      break;

    case 'consonants':
      exercises.push(
        {
          type: 'minimal_pairs',
          pairs: [
            ['pill', 'bill'],
            ['think', 'sink'],
            ['right', 'light']
          ],
          instructions: 'Practice distinguishing these similar consonant sounds'
        },
        {
          type: 'tongue_twisters',
          phrases: [
            'Peter Piper picked a peck of pickled peppers',
            'She sells seashells by the seashore',
            'Thirty-three thankful thoughts'
          ],
          instructions: 'Practice these tongue twisters slowly, then increase speed'
        }
      );
      break;

    case 'vowels':
      exercises.push(
        {
          type: 'vowel_contrast',
          pairs: [
            ['heat', 'hit'],
            ['pain', 'pen'],
            ['fool', 'full']
          ],
          instructions: 'Practice distinguishing these vowel sounds'
        },
        {
          type: 'vowel_sequences',
          words: [
            'examination',
            'medication',
            'respiratory',
            'evaluation',
            'therapeutic'
          ],
          instructions: 'Focus on the vowel sounds in these medical terms'
        }
      );
      break;
  }

  // Add difficulty-based variations
  if (score < 0.5) {
    exercises.forEach(exercise => {
      exercise.showIPA = true;
      exercise.playbackSpeed = 0.8;
      exercise.repetitions = 3;
    });
  }

  return exercises;
};

export default {
  generateDetailedFeedback,
  trackPronunciationProgress,
  generatePracticeExercises
}; 