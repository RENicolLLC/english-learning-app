export interface LevelStructure {
  level: number;
  name: string;
  requirements: LevelRequirements;
  content: LevelContent;
  assessments: Assessment[];
}

interface LevelRequirements {
  previousLevel: number;
  minimumScore: number;
  completedScenarios: number;
  speakingProficiency: number;
}

interface LevelContent {
  grammar: GrammarTopic[];
  vocabulary: VocabularyTopic[];
  pronunciation: PronunciationFocus[];
  writing: WritingSkill[];
  reading: ReadingSkill[];
}

interface Assessment {
  type: 'quiz' | 'speaking' | 'writing' | 'comprehensive';
  passingScore: number;
  duration: number;
}

interface GrammarTopic {
  topic: string;
  complexity: number;
  rules?: string[];
  examples?: string[];
  exercises?: Exercise[];
}

interface VocabularyTopic {
  topic: string;
  words: number;
  categories?: string[];
  contextualUsage?: string[];
}

interface PronunciationFocus {
  focus: string;
  exercises: number;
  targetSounds?: string[];
  commonMistakes?: string[];
}

interface WritingSkill {
  skill: string;
  exercises: number;
  examples?: string[];
  templates?: string[];
}

interface ReadingSkill {
  skill: string;
  texts: number;
  complexity?: number;
  topics?: string[];
}

export const LEVEL_SYSTEM: LevelStructure[] = [
  {
    level: 1,
    name: "Beginner's Basics",
    requirements: {
      previousLevel: 0,
      minimumScore: 0,
      completedScenarios: 0,
      speakingProficiency: 0
    },
    content: {
      grammar: [
        { topic: 'Simple Present Tense', complexity: 1 },
        { topic: 'Basic Pronouns', complexity: 1 },
        { topic: 'Articles (a, an, the)', complexity: 1 }
      ],
      vocabulary: [
        { topic: 'Common Greetings', words: 50 },
        { topic: 'Numbers 1-100', words: 100 },
        { topic: 'Basic Colors', words: 20 }
      ],
      pronunciation: [
        { focus: 'Basic Vowel Sounds', exercises: 10 },
        { focus: 'Simple Consonants', exercises: 10 }
      ],
      writing: [
        { skill: 'Basic Sentences', exercises: 20 },
        { skill: 'Capital Letters', exercises: 10 }
      ],
      reading: [
        { skill: 'Simple Sentences', texts: 20 },
        { skill: 'Basic Instructions', texts: 15 }
      ]
    },
    assessments: [
      { type: 'quiz', passingScore: 70, duration: 30 },
      { type: 'speaking', passingScore: 60, duration: 15 }
    ]
  },
  {
    level: 2,
    name: "Basic Communication",
    requirements: {
      previousLevel: 1,
      minimumScore: 70,
      completedScenarios: 10,
      speakingProficiency: 65
    },
    content: {
      grammar: [
        { topic: 'Present Continuous', complexity: 1 },
        { topic: 'Simple Past Tense', complexity: 2 },
        { topic: 'Possessive Adjectives', complexity: 1 }
      ],
      vocabulary: [
        { topic: 'Family Members', words: 30 },
        { topic: 'Daily Activities', words: 50 },
        { topic: 'Time Expressions', words: 25 }
      ],
      pronunciation: [
        { focus: 'Word Stress', exercises: 15 },
        { focus: 'Linking Sounds', exercises: 10 }
      ],
      writing: [
        { skill: 'Simple Paragraphs', exercises: 15 },
        { skill: 'Personal Messages', exercises: 10 }
      ],
      reading: [
        { skill: 'Short Stories', texts: 10 },
        { skill: 'Simple Dialogues', texts: 15 }
      ]
    },
    assessments: [
      { type: 'quiz', passingScore: 75, duration: 45 },
      { type: 'speaking', passingScore: 65, duration: 20 },
      { type: 'writing', passingScore: 70, duration: 30 }
    ]
  },
  // Continue with levels 3-12...
]; 