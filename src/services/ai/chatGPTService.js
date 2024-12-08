import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, calls should be made through backend
});

export const chatGPTService = {
  // Interactive Conversation Practice
  conversationPractice: async (userMessage, level = 'intermediate', context = []) => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are a helpful English teacher having a conversation with a ${level}-level English learner. 
                     Adjust your vocabulary and grammar complexity accordingly. 
                     Correct any mistakes gently and provide explanations when needed.`
          },
          ...context,
          { role: "user", content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 150
      });

      return {
        reply: response.choices[0].message.content,
        corrections: extractCorrections(userMessage, response.choices[0].message.content)
      };
    } catch (error) {
      console.error('Error in conversation practice:', error);
      throw error;
    }
  },

  // Grammar Explanation
  explainGrammar: async (grammarConcept) => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert English teacher. Explain grammar concepts clearly with examples."
          },
          {
            role: "user",
            content: `Explain this English grammar concept: ${grammarConcept}`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      return {
        explanation: response.choices[0].message.content,
        examples: extractExamples(response.choices[0].message.content)
      };
    } catch (error) {
      console.error('Error explaining grammar:', error);
      throw error;
    }
  },

  // Vocabulary Enhancement
  enhanceVocabulary: async (word, context = 'general') => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a vocabulary expert. Provide comprehensive word explanations with usage examples."
          },
          {
            role: "user",
            content: `Explain the word "${word}" in the context of ${context}. Include definition, synonyms, antonyms, and example sentences.`
          }
        ],
        temperature: 0.7,
        max_tokens: 300
      });

      return parseVocabularyResponse(response.choices[0].message.content);
    } catch (error) {
      console.error('Error enhancing vocabulary:', error);
      throw error;
    }
  },

  // Writing Feedback
  provideWritingFeedback: async (text, type = 'general') => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are an expert English writing teacher. Analyze the following ${type} text and provide detailed feedback on:
                     1. Grammar and syntax
                     2. Vocabulary usage
                     3. Style and tone
                     4. Structure and coherence
                     5. Specific suggestions for improvement`
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      return parseWritingFeedback(response.choices[0].message.content);
    } catch (error) {
      console.error('Error providing writing feedback:', error);
      throw error;
    }
  },

  // Personalized Exercise Generation
  generateExercises: async (topic, level, learningStyle) => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `Create personalized English exercises for a ${level}-level learner with ${learningStyle} learning style.`
          },
          {
            role: "user",
            content: `Generate exercises for: ${topic}`
          }
        ],
        temperature: 0.8,
        max_tokens: 1000
      });

      return parseExercises(response.choices[0].message.content);
    } catch (error) {
      console.error('Error generating exercises:', error);
      throw error;
    }
  },

  // Idiom and Cultural Context Explanation
  explainIdiomAndCulture: async (phrase) => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Explain English idioms and their cultural context, including origin, usage, and similar expressions."
          },
          {
            role: "user",
            content: `Explain this phrase: "${phrase}"`
          }
        ],
        temperature: 0.7,
        max_tokens: 400
      });

      return parseCulturalExplanation(response.choices[0].message.content);
    } catch (error) {
      console.error('Error explaining idiom:', error);
      throw error;
    }
  }
};

// Helper functions for parsing responses
const extractCorrections = (original, response) => {
  // Implementation to extract corrections from the response
  return {
    corrections: [],
    suggestions: []
  };
};

const extractExamples = (response) => {
  // Implementation to extract examples from the response
  return [];
};

const parseVocabularyResponse = (response) => {
  return {
    definition: '',
    synonyms: [],
    antonyms: [],
    examples: [],
    usage_notes: ''
  };
};

const parseWritingFeedback = (response) => {
  return {
    grammar: [],
    vocabulary: [],
    style: [],
    structure: [],
    suggestions: []
  };
};

const parseExercises = (response) => {
  return {
    exercises: [],
    difficulty: '',
    estimated_time: '',
    learning_objectives: []
  };
};

const parseCulturalExplanation = (response) => {
  return {
    meaning: '',
    origin: '',
    cultural_context: '',
    similar_expressions: [],
    usage_examples: []
  };
};

export default chatGPTService; 