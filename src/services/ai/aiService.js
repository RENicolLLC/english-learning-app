import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, calls should be made through backend
});

export const aiService = {
  // Writing feedback
  getWritingFeedback: async (text) => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert English teacher providing detailed feedback on writing."
          },
          {
            role: "user",
            content: `Please analyze this text and provide feedback on grammar, vocabulary, and style: "${text}"`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error getting writing feedback:', error);
      throw error;
    }
  },

  // Speaking pronunciation feedback
  getPronunciationFeedback: async (audioTranscript, userAudio) => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert in English pronunciation providing detailed feedback."
          },
          {
            role: "user",
            content: `Compare this transcript "${audioTranscript}" with the correct pronunciation and provide feedback.`
          }
        ],
        temperature: 0.7,
        max_tokens: 300
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error getting pronunciation feedback:', error);
      throw error;
    }
  },

  // Generate personalized exercises
  generateExercises: async (level, topic, previousPerformance) => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an AI tutor creating personalized English exercises."
          },
          {
            role: "user",
            content: `Create exercises for level ${level} focusing on ${topic}. Previous performance: ${JSON.stringify(previousPerformance)}`
          }
        ],
        temperature: 0.8,
        max_tokens: 1000
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Error generating exercises:', error);
      throw error;
    }
  },

  // Generate conversation practice
  generateConversationResponse: async (userInput, context) => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are a helpful conversation partner practicing English. Context: ${context}`
          },
          {
            role: "user",
            content: userInput
          }
        ],
        temperature: 0.9,
        max_tokens: 150
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error generating conversation response:', error);
      throw error;
    }
  },

  // Analyze user's learning patterns
  analyzeLearningPatterns: async (userData) => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an AI analyzing English learning patterns and providing recommendations."
          },
          {
            role: "user",
            content: `Analyze this learning data and provide recommendations: ${JSON.stringify(userData)}`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Error analyzing learning patterns:', error);
      throw error;
    }
  }
};

export default aiService; 