import axios from 'axios';
import { supabase } from '../auth/supabaseClient';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls
apiClient.interceptors.request.use(
  async (config) => {
    const session = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error status is 401 and there is no originalRequest._retry flag,
    // it means the token has expired and we need to refresh it
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data: { session }, error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError) throw refreshError;

        if (session?.access_token) {
          // Retry the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${session.access_token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Handle refresh token error or redirect to login
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const api = {
  // Auth endpoints
  auth: {
    login: (credentials) => apiClient.post('/auth/login', credentials),
    register: (userData) => apiClient.post('/auth/register', userData),
    logout: () => apiClient.post('/auth/logout'),
  },

  // User endpoints
  user: {
    getProfile: () => apiClient.get('/user/profile'),
    updateProfile: (data) => apiClient.put('/user/profile', data),
    getProgress: () => apiClient.get('/user/progress'),
    updateProgress: (data) => apiClient.put('/user/progress', data),
  },

  // Learning content endpoints
  content: {
    getVocabulary: (level) => apiClient.get(`/content/vocabulary/${level}`),
    getGrammar: (level) => apiClient.get(`/content/grammar/${level}`),
    getSpeaking: (level) => apiClient.get(`/content/speaking/${level}`),
    getWriting: (level) => apiClient.get(`/content/writing/${level}`),
  },

  // Assessment endpoints
  assessment: {
    startTest: (type) => apiClient.post('/assessment/start', { type }),
    submitAnswer: (testId, answer) => apiClient.post(`/assessment/${testId}/submit`, { answer }),
    getResults: (testId) => apiClient.get(`/assessment/${testId}/results`),
  },

  // Progress tracking endpoints
  progress: {
    getStats: () => apiClient.get('/progress/stats'),
    getAchievements: () => apiClient.get('/progress/achievements'),
    updateStreak: () => apiClient.post('/progress/streak'),
  },

  // Community endpoints
  community: {
    getPosts: () => apiClient.get('/community/posts'),
    createPost: (post) => apiClient.post('/community/posts', post),
    getComments: (postId) => apiClient.get(`/community/posts/${postId}/comments`),
    addComment: (postId, comment) => apiClient.post(`/community/posts/${postId}/comments`, comment),
  },
};

export default api; 