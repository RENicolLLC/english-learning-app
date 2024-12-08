// Scenario content structure and sample data
export const scenarioStructure = {
  metadata: {
    id: String,              // Unique identifier
    title: String,           // Scenario title
    category: String,        // From scenarioCategories
    level: Number,           // 1-12
    difficulty: String,      // 'easy', 'normal', 'hard'
    tags: Array,            // For search and filtering
    estimatedTime: Number,   // In minutes
    prerequisites: Array     // Required prior scenarios
  },
  content: {
    setup: {
      context: String,       // Background information
      location: String,      // Where the scenario takes place
      participants: Array,   // People involved
      objectives: Array      // Learning objectives
    },
    dialogue: [{
      speaker: String,       // Who is speaking
      text: String,         // What they say
      translations: Object,  // Translations in supported languages
      audioUrl: String,     // URL to audio file
      notes: String,        // Speaking notes/tips
      timing: Number        // Duration in seconds
    }],
    variations: [{
      condition: String,    // When to use this variation
      alternativeDialogue: Array,
      culturalContext: String
    }],
    culturalNotes: {
      relevance: String,    // Why this scenario is culturally important
      tips: Array,         // Cultural advice
      commonMistakes: Array // Typical errors to avoid
    },
    exercises: {
      vocabulary: [{
        term: String,
        definition: String,
        usage: String,
        translations: Object
      }],
      grammar: [{
        pattern: String,
        explanation: String,
        examples: Array
      }],
      pronunciation: [{
        word: String,
        phonetic: String,
        audioUrl: String,
        tips: String
      }],
      comprehension: [{
        question: String,
        options: Array,
        correctAnswer: String,
        explanation: String
      }]
    }
  },
  interactions: {
    userChoices: [{
      prompt: String,
      options: Array,
      consequences: Object
    }],
    branchingPoints: [{
      condition: String,
      nextScenarioId: String
    }]
  },
  resources: {
    images: Array,          // Related images
    audio: Array,           // Audio clips
    video: Array,           // Video resources
    additionalReading: Array // Extra materials
  }
};

// Sample scenario using the structure
export const sampleScenario = {
  metadata: {
    id: "cafe-order-basic-01",
    title: "Ordering Coffee at a Café",
    category: "DAILY_LIFE",
    level: 2,
    difficulty: "normal",
    tags: ["coffee", "café", "ordering", "beverages", "small talk"],
    estimatedTime: 15,
    prerequisites: ["basic-greetings-01"]
  },
  content: {
    setup: {
      context: "You need to order a coffee at a local café during morning rush hour.",
      location: "Urban coffee shop",
      participants: ["Customer (you)", "Barista", "Other customers"],
      objectives: [
        "Learn how to order beverages",
        "Practice polite requests",
        "Handle payment interactions",
        "Deal with busy environment"
      ]
    },
    dialogue: [
      {
        speaker: "Barista",
        text: "Good morning! What can I get for you today?",
        translations: {
          th: "สวัสดีค่ะ/ครับ! วันนี้รับอะไรดีคะ/ครับ?",
          vi: "Chào buổi sáng! Hôm nay bạn muốn dùng gì?",
          zh: "早上好！今天想喝点什么？",
          ja: "おはようございます！今日は何にしますか？"
        },
        audioUrl: "/audio/cafe-01-greeting.mp3",
        notes: "Friendly, welcoming tone. Common morning greeting.",
        timing: 3
      },
      {
        speaker: "Customer",
        text: "Hi, I'd like a medium latte, please.",
        translations: {
          th: "สวัสดีค่ะ/ครับ ขอลาเต้ขนาดกลางค่ะ/ครับ",
          vi: "Xin chào, cho tôi một ly latte cỡ vừa.",
          zh: "你好，我要一杯中杯拿铁咖啡。",
          ja: "こんにちは、ラテのミディアムサイズをお願いします。"
        },
        audioUrl: "/audio/cafe-01-order.mp3",
        notes: "Clear pronunciation of 'latte'. Use polite form with 'please'.",
        timing: 2
      }
    ],
    variations: [
      {
        condition: "If café is very busy",
        alternativeDialogue: [
          {
            speaker: "Barista",
            text: "Hi there! What would you like?",
            translations: {
              th: "สวัสดีค่ะ/ครับ! รับอะไรดีคะ/ครับ?",
              vi: "Xin chào! Bạn muốn gì?",
              zh: "嗨！需要什么？",
              ja: "はい、ご注文は？"
            }
          }
        ],
        culturalContext: "In busy situations, greetings become shorter but should remain polite"
      }
    ],
    culturalNotes: {
      relevance: "Coffee shop culture is an important part of daily life in many English-speaking countries",
      tips: [
        "Stand in line (queue) properly",
        "Have payment ready while waiting",
        "Move to the pickup area after ordering",
        "It's common to add 'please' and 'thank you'"
      ],
      commonMistakes: [
        "Forgetting to specify size",
        "Speaking too quietly in a noisy environment",
        "Not moving aside for other customers after ordering"
      ]
    },
    exercises: {
      vocabulary: [
        {
          term: "latte",
          definition: "Coffee drink made with espresso and steamed milk",
          usage: "I'd like a latte with an extra shot of espresso.",
          translations: {
            th: "ลาเต้",
            vi: "cà phê sữa",
            zh: "拿铁咖啡",
            ja: "ラテ"
          }
        },
        {
          term: "medium",
          definition: "Middle size option",
          usage: "A medium coffee contains 16 ounces.",
          translations: {
            th: "ขนาดกลาง",
            vi: "cỡ vừa",
            zh: "中杯",
            ja: "ミディアム"
          }
        }
      ],
      grammar: [
        {
          pattern: "I'd like + [article] + [item], please.",
          explanation: "Polite way to make a request or order",
          examples: [
            "I'd like a coffee, please.",
            "I'd like the chocolate muffin, please.",
            "I'd like some sugar, please."
          ]
        }
      ],
      pronunciation: [
        {
          word: "latte",
          phonetic: "ˈlɑːteɪ",
          audioUrl: "/audio/vocab-latte.mp3",
          tips: "Emphasize the 'lah' sound in the first syllable"
        }
      ],
      comprehension: [
        {
          question: "What is a polite way to order a drink?",
          options: [
            "Give me a coffee.",
            "I'd like a coffee, please.",
            "Coffee, now.",
            "Want coffee."
          ],
          correctAnswer: "I'd like a coffee, please.",
          explanation: "Using 'I'd like' and 'please' makes the request polite and appropriate."
        }
      ]
    }
  },
  interactions: {
    userChoices: [
      {
        prompt: "The barista asks if you want your latte hot or iced. What do you say?",
        options: [
          "Hot, please.",
          "Iced, please.",
          "What do you recommend?",
          "No preference."
        ],
        consequences: {
          followUpQuestions: {
            "Hot, please.": "Would you like any extra shots of espresso?",
            "Iced, please.": "Would you like light or extra ice?"
          }
        }
      }
    ],
    branchingPoints: [
      {
        condition: "User chooses iced drink",
        nextScenarioId: "cafe-order-iced-01"
      }
    ]
  },
  resources: {
    images: [
      {
        url: "/images/cafe-menu.jpg",
        description: "Coffee shop menu board",
        alt: "A typical coffee shop menu displaying various drink options and prices"
      }
    ],
    audio: [
      {
        url: "/audio/cafe-ambience.mp3",
        description: "Café background noise",
        duration: 30
      }
    ],
    video: [
      {
        url: "/videos/ordering-demo.mp4",
        description: "Demonstration of ordering process",
        duration: 60,
        captions: true
      }
    ],
    additionalReading: [
      {
        title: "Coffee Shop Etiquette Guide",
        url: "/guides/coffee-etiquette.pdf",
        type: "PDF"
      }
    ]
  }
};

export const createScenario = (template) => {
  // Validate required fields
  const requiredFields = ['metadata', 'content', 'interactions'];
  for (const field of requiredFields) {
    if (!template[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  // Generate unique ID if not provided
  if (!template.metadata.id) {
    template.metadata.id = generateUniqueId();
  }

  return {
    ...scenarioStructure,
    ...template,
    createdAt: new Date().toISOString(),
    version: '1.0'
  };
};

const generateUniqueId = () => {
  return `scenario-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export default {
  scenarioStructure,
  sampleScenario,
  createScenario
}; 