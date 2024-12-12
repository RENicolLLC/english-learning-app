// Mock user for testing
export const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  display_name: 'Test User',
  native_language: 'th',
  learning_level: 1,
  xp_points: 100,
  streak: 5,
  created_at: '2024-01-01T00:00:00Z',
  preferences: {
    daily_goal: 30,
    notifications_enabled: true,
    theme: 'light'
  }
};

// Mock auth context
export const mockAuthContext = {
  user: mockUser,
  loading: false,
  error: null,
  signIn: jest.fn(),
  signUp: jest.fn(),
  signOut: jest.fn(),
  resetPassword: jest.fn(),
  updateProfile: jest.fn(),
};

// Mock fetch responses
export const mockFetchResponses = {
  scenarios: {
    success: {
      scenarios: [
        {
          id: 'scenario-1',
          title: 'Test Scenario',
          category: 'EDUCATION',
          level: 1,
          content: {
            dialogue: [
              {
                speaker: 'Teacher',
                text: 'Hello class!',
                translations: { th: 'สวัสดีค่ะนักเรียน' }
              }
            ]
          }
        }
      ],
      progress: {}
    }
  },
  vocabulary: {
    success: {
      words: [
        {
          id: 'word-1',
          word: 'Hello',
          definition: 'A greeting',
          example: 'Hello, how are you?',
          phonetic: '/həˈləʊ/',
          translations: { th: 'สวัสดี' }
        }
      ],
      progress: {}
    }
  },
  grammar: {
    success: {
      exercises: [
        {
          id: 'exercise-1',
          question: 'Choose the correct form',
          options: ['am', 'is', 'are'],
          correctAnswer: 'is',
          explanation: 'Use "is" with singular subjects'
        }
      ],
      progress: {}
    }
  }
}; 