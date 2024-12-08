import OpenAI from 'openai';
import { getLanguagePair } from '../i18n/languageConfig';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const bilingualChatService = {
  // Bilingual conversation practice
  conversationPractice: async (userMessage, nativeLanguage, level, context = []) => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are a bilingual English teacher who is fluent in both English and ${nativeLanguage}. 
                     Respond to the student in both English and their native language.
                     Format your responses as follows:
                     🇬🇧 [English response]
                     ${getLanguageEmoji(nativeLanguage)} [Native language response]
                     
                     If the student makes any mistakes, provide corrections in both languages.
                     Adjust your language complexity according to their level: ${level}`
          },
          ...context,
          { role: "user", content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      return {
        reply: response.choices[0].message.content,
        corrections: await generateBilingualCorrections(userMessage, nativeLanguage)
      };
    } catch (error) {
      console.error('Error in bilingual conversation:', error);
      throw error;
    }
  },

  // Translate and explain idioms
  explainIdiom: async (phrase, nativeLanguage) => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `Explain this English idiom in both English and ${nativeLanguage}. 
                     Include: meaning, literal translation, cultural context, and similar expressions in both languages.`
          },
          {
            role: "user",
            content: phrase
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      return parseBilingualResponse(response.choices[0].message.content, nativeLanguage);
    } catch (error) {
      console.error('Error explaining idiom:', error);
      throw error;
    }
  },

  // Grammar explanation in both languages
  explainGrammar: async (concept, nativeLanguage) => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `Explain this English grammar concept in both English and ${nativeLanguage}. 
                     Include: explanation, examples, common mistakes, and comparison with ${nativeLanguage} grammar if relevant.`
          },
          {
            role: "user",
            content: concept
          }
        ],
        temperature: 0.7,
        max_tokens: 800
      });

      return parseBilingualGrammarExplanation(response.choices[0].message.content);
    } catch (error) {
      console.error('Error explaining grammar:', error);
      throw error;
    }
  },

  // Vocabulary with native language context
  explainVocabulary: async (word, nativeLanguage, context = 'general') => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `Explain this English word in both English and ${nativeLanguage}. 
                     Include: definition, pronunciation, examples, synonyms, antonyms, and cultural usage notes.
                     Also provide similar expressions or words in ${nativeLanguage}.`
          },
          {
            role: "user",
            content: `Explain the word "${word}" in the context of ${context}`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      return parseBilingualVocabulary(response.choices[0].message.content);
    } catch (error) {
      console.error('Error explaining vocabulary:', error);
      throw error;
    }
  }
};

// Helper functions
const getLanguageEmoji = (language) => {
  const emojiMap = {
    th: '🇹🇭',
    vi: '🇻🇳',
    zh: '🇨🇳',
    ja: '🇯🇵',
    ko: '🇰🇷'
  };
  return emojiMap[language] || '🌏';
};

const generateBilingualCorrections = async (text, nativeLanguage) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `Analyze this text for errors and provide corrections in both English and ${nativeLanguage}.
                   Format: 
                   1. Original: [text]
                   2. Correction: [correction]
                   3. Explanation (English): [explanation]
                   4. Explanation (${nativeLanguage}): [native explanation]`
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.7,
      max_tokens: 300
    });

    return parseCorrections(response.choices[0].message.content);
  } catch (error) {
    console.error('Error generating corrections:', error);
    return { corrections: [], suggestions: [] };
  }
};

const parseBilingualResponse = (response, nativeLanguage) => {
  // Implementation to parse bilingual responses
  return {
    english: '',
    native: '',
    examples: {
      english: [],
      native: []
    }
  };
};

const parseBilingualGrammarExplanation = (response) => {
  // Implementation to parse grammar explanations
  return {
    explanation: {
      english: '',
      native: ''
    },
    examples: {
      english: [],
      native: []
    },
    commonMistakes: []
  };
};

const parseBilingualVocabulary = (response) => {
  // Implementation to parse vocabulary explanations
  return {
    definition: {
      english: '',
      native: ''
    },
    examples: {
      english: [],
      native: []
    },
    synonyms: {
      english: [],
      native: []
    },
    usage: {
      english: '',
      native: ''
    }
  };
};

const parseCorrections = (response) => {
  // Implementation to parse corrections
  return {
    corrections: [],
    explanations: {
      english: [],
      native: []
    }
  };
};

export default bilingualChatService; 