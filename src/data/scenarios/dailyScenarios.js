// Daily life scenario database with structured conversation patterns
export const dailyScenarios = {
  shopping: {
    retail: [
      {
        id: 'shop_clothing',
        title: 'Shopping for Clothes',
        difficulty: 'beginner',
        context: 'At a clothing store',
        roles: ['customer', 'salesperson'],
        dialogues: [
          {
            situation: 'Finding the right size',
            conversation: [
              { role: 'customer', text: "Excuse me, do you have this shirt in medium?" },
              { role: 'salesperson', text: "Let me check. Yes, we have it in medium. Would you like to try it on?" },
              { role: 'customer', text: "Yes, please. Where are the fitting rooms?" },
              { role: 'salesperson', text: "Right this way. They're at the back of the store." }
            ],
            vocabulary: ['fitting room', 'size', 'try on', 'medium', 'shirt'],
            culturalNotes: 'In many stores, you can try clothes on before buying them.'
          },
          {
            situation: 'Asking about price and sales',
            conversation: [
              { role: 'customer', text: "How much is this jacket?" },
              { role: 'salesperson', text: "It's $79.99, but it's on sale for 30% off." },
              { role: 'customer', text: "Do you have any other colors?" },
              { role: 'salesperson', text: "Yes, we have it in black and navy blue." }
            ],
            vocabulary: ['sale', 'discount', 'price', 'color', 'jacket'],
            culturalNotes: 'Many stores have regular sales and seasonal discounts.'
          }
        ],
        commonPhrases: [
          "Do you have this in...?",
          "Where can I find...?",
          "Is this on sale?",
          "Can I try this on?",
          "Do you accept credit cards?"
        ],
        exercises: [
          {
            type: 'rolePlay',
            description: 'Practice asking about sizes and prices',
            scenarios: ['Finding a specific item', 'Asking about discounts']
          },
          {
            type: 'vocabulary',
            words: ['size', 'price', 'discount', 'sale', 'fitting room', 'cash register']
          }
        ]
      },
      {
        id: 'shop_grocery',
        title: 'Grocery Shopping',
        difficulty: 'beginner',
        context: 'At a supermarket',
        roles: ['customer', 'cashier'],
        dialogues: [
          {
            situation: 'Finding items',
            conversation: [
              { role: 'customer', text: "Excuse me, where can I find the fresh vegetables?" },
              { role: 'cashier', text: "They're in aisle 3, on the left side." },
              { role: 'customer', text: "Thank you. And do you have any organic options?" },
              { role: 'cashier', text: "Yes, the organic section is clearly marked with green labels." }
            ],
            vocabulary: ['aisle', 'organic', 'fresh', 'vegetables', 'section'],
            culturalNotes: 'Many supermarkets have specific sections for organic products.'
          },
          {
            situation: 'Checkout process',
            conversation: [
              { role: 'cashier', text: "Did you find everything okay?" },
              { role: 'customer', text: "Yes, thank you. Do you accept debit cards?" },
              { role: 'cashier', text: "Yes, we do. Would you like cash back?" },
              { role: 'customer', text: "No, thanks. Just the groceries please." }
            ],
            vocabulary: ['checkout', 'debit card', 'cash back', 'receipt', 'bag'],
            culturalNotes: 'Many stores offer cash back service with debit card purchases.'
          }
        ],
        commonPhrases: [
          "Where can I find...?",
          "Is this fresh?",
          "What aisle is... in?",
          "Paper or plastic?",
          "Would you like a bag?"
        ],
        exercises: [
          {
            type: 'rolePlay',
            description: 'Practice finding items and checking out',
            scenarios: ['Asking for help finding items', 'Checking out groceries']
          },
          {
            type: 'vocabulary',
            words: ['aisle', 'produce', 'dairy', 'checkout', 'cart', 'basket']
          }
        ]
      }
    ],
    services: [
      {
        id: 'service_bank',
        title: 'Banking Services',
        difficulty: 'intermediate',
        context: 'At a bank',
        roles: ['customer', 'bank teller'],
        dialogues: [
          {
            situation: 'Opening an account',
            conversation: [
              { role: 'customer', text: "Hi, I'd like to open a checking account." },
              { role: 'bank teller', text: "I can help you with that. Do you have a photo ID with you?" },
              { role: 'customer', text: "Yes, here's my driver's license." },
              { role: 'bank teller', text: "Great. What type of account are you interested in?" }
            ],
            vocabulary: ['checking account', 'savings account', 'deposit', 'withdraw', 'ID'],
            culturalNotes: 'Banks require official identification to open accounts.'
          }
        ],
        commonPhrases: [
          "I'd like to deposit this check",
          "Can I withdraw some money?",
          "What's my account balance?",
          "Is there a minimum balance requirement?",
          "What are the fees?"
        ]
      }
    ]
  },
  dining: {
    restaurant: [
      {
        id: 'dining_casual',
        title: 'Casual Restaurant',
        difficulty: 'beginner',
        context: 'At a casual dining restaurant',
        roles: ['customer', 'server'],
        dialogues: [
          {
            situation: 'Ordering food',
            conversation: [
              { role: 'server', text: "Welcome! Here are your menus. Can I get you something to drink?" },
              { role: 'customer', text: "Yes, I'll have an iced tea, please." },
              { role: 'server', text: "Are you ready to order or do you need a few minutes?" },
              { role: 'customer', text: "We need a few more minutes, please." }
            ],
            vocabulary: ['menu', 'order', 'appetizer', 'main course', 'dessert'],
            culturalNotes: 'Tipping is customary in many countries (15-20% in the US).'
          }
        ],
        commonPhrases: [
          "What's the special today?",
          "Can I have the check, please?",
          "Is this dish spicy?",
          "Could you recommend something?",
          "I'm allergic to..."
        ]
      }
    ]
  }
};

// Helper functions for scenario management
export const getScenarioById = (id) => {
  for (const category in dailyScenarios) {
    for (const subCategory in dailyScenarios[category]) {
      const scenario = dailyScenarios[category][subCategory].find(s => s.id === id);
      if (scenario) return scenario;
    }
  }
  return null;
};

export const getScenariosByDifficulty = (difficulty) => {
  const scenarios = [];
  for (const category in dailyScenarios) {
    for (const subCategory in dailyScenarios[category]) {
      scenarios.push(...dailyScenarios[category][subCategory].filter(s => s.difficulty === difficulty));
    }
  }
  return scenarios;
};

export const getRandomScenario = () => {
  const categories = Object.keys(dailyScenarios);
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  const subCategories = Object.keys(dailyScenarios[randomCategory]);
  const randomSubCategory = subCategories[Math.floor(Math.random() * subCategories.length)];
  const scenarios = dailyScenarios[randomCategory][randomSubCategory];
  return scenarios[Math.floor(Math.random() * scenarios.length)];
};

export const getAllCategories = () => {
  return Object.keys(dailyScenarios).map(category => ({
    name: category,
    subCategories: Object.keys(dailyScenarios[category])
  }));
}; 