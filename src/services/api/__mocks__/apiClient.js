export const api = {
  auth: {
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
  },
  user: {
    getProfile: jest.fn(),
    updateProfile: jest.fn(),
    getProgress: jest.fn(),
    updateProgress: jest.fn(),
  },
  content: {
    getVocabulary: jest.fn(),
    getGrammar: jest.fn(),
    getSpeaking: jest.fn(),
    getWriting: jest.fn(),
  },
  assessment: {
    startTest: jest.fn(),
    submitAnswer: jest.fn(),
    getResults: jest.fn(),
  },
  progress: {
    getStats: jest.fn(),
    getAchievements: jest.fn(),
    updateStreak: jest.fn(),
  },
  community: {
    getPosts: jest.fn(),
    createPost: jest.fn(),
    getComments: jest.fn(),
    addComment: jest.fn(),
  },
};

export default api; 