import { scenarioCategories, getDifficultyLevel } from './scenarioCategories';

// Template patterns for different types of interactions
const conversationPatterns = {
  greeting: [
    "Hello/Hi/Good morning/Good afternoon/Good evening",
    "Welcome/Nice to meet you/How can I help you?",
    "Hi there/Excuse me/Pardon me"
  ],
  question: [
    "Could you...?/Would you...?/Can you...?",
    "Where is...?/How do I...?/What is...?",
    "When does...?/How much is...?/Do you have...?"
  ],
  response: [
    "Yes, of course/No, sorry/Let me check",
    "It's.../You can.../I'll help you",
    "Here you go/This way/Right here"
  ],
  gratitude: [
    "Thank you/Thanks a lot/I appreciate it",
    "You're welcome/No problem/My pleasure",
    "Have a good day/See you later/Goodbye"
  ]
};

// Common phrases for different situations
const commonPhrases = {
  shopping: {
    asking: [
      "How much does this cost?",
      "Do you have this in a different size/color?",
      "Where can I find...?",
      "Is this on sale?",
      "Can I try this on?"
    ],
    responding: [
      "It's [price] dollars",
      "Let me check for you",
      "It's in aisle [number]",
      "Yes, it's [percent] off",
      "The fitting rooms are over there"
    ]
  },
  dining: {
    asking: [
      "Can I see the menu?",
      "What's today's special?",
      "Could I order...?",
      "Is this dish spicy?",
      "Can I have the check?"
    ],
    responding: [
      "Here's your menu",
      "Today we have...",
      "Of course, would you like...",
      "Yes/No, it's...",
      "I'll bring it right away"
    ]
  }
  // Add more categories as needed
};

// Vocabulary sets for different scenarios
const vocabularySets = {
  shopping: {
    nouns: ['price', 'size', 'color', 'sale', 'discount', 'receipt', 'cash', 'card'],
    verbs: ['buy', 'pay', 'try on', 'look for', 'choose', 'return'],
    adjectives: ['expensive', 'cheap', 'large', 'small', 'available', 'sold out']
  },
  dining: {
    nouns: ['menu', 'table', 'order', 'bill', 'tip', 'waiter', 'dish', 'drink'],
    verbs: ['order', 'eat', 'drink', 'serve', 'recommend', 'pay'],
    adjectives: ['delicious', 'spicy', 'sweet', 'hot', 'cold', 'fresh']
  }
  // Add more categories
};

// Cultural notes for different contexts
const culturalNotes = {
  shopping: [
    "It's common to try clothes on before buying in most stores",
    "Many stores have regular sales and seasonal discounts",
    "Credit cards are widely accepted",
    "Some stores offer price matching with competitors"
  ],
  dining: [
    "Tipping is customary in many countries (15-20% in the US)",
    "It's normal to ask for recommendations from the server",
    "You usually need to ask for the check in many countries",
    "Water is often served automatically in restaurants"
  ]
  // Add more categories
};

// Generate a complete scenario
export const generateScenario = (category, subCategory, situation) => {
  const difficulty = getDifficultyLevel({ category, subCategory, situation });
  
  // Generate unique ID
  const id = `${category}_${subCategory}_${situation}_${Date.now()}`.toLowerCase().replace(/\s+/g, '_');

  return {
    id,
    title: `${situation} at ${subCategory}`,
    difficulty,
    context: `You are at a ${subCategory} in a ${category} situation`,
    roles: ['customer', 'staff'],
    dialogues: generateDialogues(category, subCategory, situation),
    vocabulary: generateVocabulary(category),
    commonPhrases: generateCommonPhrases(category),
    culturalNotes: generateCulturalNotes(category),
    exercises: generateExercises(category, difficulty)
  };
};

// Generate dialogues for a scenario
const generateDialogues = (category, subCategory, situation) => {
  const patterns = conversationPatterns;
  const dialogues = [];

  // Basic interaction
  dialogues.push({
    situation: 'Initial Contact',
    conversation: [
      { role: 'staff', text: getRandomPattern(patterns.greeting) },
      { role: 'customer', text: getRandomPattern(patterns.greeting) }
    ]
  });

  // Main interaction
  dialogues.push({
    situation: 'Main Interaction',
    conversation: [
      { role: 'customer', text: getRandomPattern(patterns.question) },
      { role: 'staff', text: getRandomPattern(patterns.response) }
    ]
  });

  // Closing interaction
  dialogues.push({
    situation: 'Closing',
    conversation: [
      { role: 'customer', text: getRandomPattern(patterns.gratitude) },
      { role: 'staff', text: getRandomPattern(patterns.gratitude) }
    ]
  });

  return dialogues;
};

// Generate vocabulary for a scenario
const generateVocabulary = (category) => {
  const vocabSet = vocabularySets[category] || vocabularySets.general;
  return {
    nouns: getRandomElements(vocabSet.nouns, 5),
    verbs: getRandomElements(vocabSet.verbs, 3),
    adjectives: getRandomElements(vocabSet.adjectives, 3)
  };
};

// Generate common phrases for a scenario
const generateCommonPhrases = (category) => {
  const phrases = commonPhrases[category] || commonPhrases.general;
  return {
    asking: getRandomElements(phrases.asking, 3),
    responding: getRandomElements(phrases.responding, 3)
  };
};

// Generate cultural notes for a scenario
const generateCulturalNotes = (category) => {
  const notes = culturalNotes[category] || culturalNotes.general;
  return getRandomElements(notes, 2);
};

// Generate exercises for a scenario
const generateExercises = (category, difficulty) => {
  return [
    {
      type: 'rolePlay',
      description: `Practice ${category} dialogue with a partner`,
      difficulty: difficulty
    },
    {
      type: 'vocabulary',
      description: 'Learn and practice key words and phrases',
      difficulty: difficulty
    },
    {
      type: 'listening',
      description: 'Listen and respond to common phrases',
      difficulty: difficulty
    }
  ];
};

// Utility function to get random elements from an array
const getRandomElements = (array, count) => {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Utility function to get random pattern
const getRandomPattern = (patterns) => {
  const pattern = patterns[Math.floor(Math.random() * patterns.length)];
  return pattern.split('/')[Math.floor(Math.random() * pattern.split('/').length)];
};

// Generate multiple scenarios for a category
export const generateScenariosForCategory = (category, count = 10) => {
  const scenarios = [];
  const subCategories = Object.keys(scenarioCategories[category]);
  
  for (let i = 0; i < count; i++) {
    const subCategory = subCategories[Math.floor(Math.random() * subCategories.length)];
    const situations = scenarioCategories[category][subCategory];
    const situation = situations[Math.floor(Math.random() * situations.length)];
    
    scenarios.push(generateScenario(category, subCategory, situation));
  }
  
  return scenarios;
};

// Generate all scenarios for the application
export const generateAllScenarios = () => {
  const allScenarios = {};
  
  Object.keys(scenarioCategories).forEach(category => {
    allScenarios[category] = generateScenariosForCategory(category, 500); // 500 scenarios per category
  });
  
  return allScenarios;
}; 