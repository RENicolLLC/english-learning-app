export const supabase = {
  auth: {
    getSession: jest.fn().mockResolvedValue({ data: { session: null }, error: null }),
    signUp: jest.fn(),
    signInWithPassword: jest.fn(),
    signOut: jest.fn(),
    onAuthStateChange: jest.fn(() => ({
      data: { subscription: { unsubscribe: jest.fn() } }
    })),
    resetPasswordForEmail: jest.fn(),
    updateUser: jest.fn()
  },
  from: jest.fn(() => ({
    upsert: jest.fn(),
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  }))
};

export const authService = {
  signUp: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
  resetPassword: jest.fn(),
  updatePassword: jest.fn(),
  getCurrentUser: jest.fn(),
  getSession: jest.fn(),
  onAuthStateChange: jest.fn()
};

export const realtimeService = {
  subscribeToLeaderboard: jest.fn(),
  subscribeToUserProgress: jest.fn(),
  subscribeToAchievements: jest.fn()
};

export default {
  supabase,
  authService,
  realtimeService
}; 