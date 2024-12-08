import { supabase } from '../auth/supabaseClient';

export const analyticsService = {
  // Track user activity
  trackActivity: async (userId, activityType, activityData) => {
    try {
      const { data, error } = await supabase
        .from('user_activities')
        .insert([
          {
            user_id: userId,
            activity_type: activityType,
            activity_data: activityData,
            timestamp: new Date().toISOString()
          }
        ]);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error tracking activity:', error);
      throw error;
    }
  },

  // Get user learning statistics
  getLearningStats: async (userId, timeRange = '7d') => {
    try {
      const { data, error } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', userId)
        .gte('timestamp', new Date(Date.now() - getDaysInMs(timeRange)))
        .order('timestamp', { ascending: false });

      if (error) throw error;

      return processLearningStats(data);
    } catch (error) {
      console.error('Error getting learning stats:', error);
      throw error;
    }
  },

  // Track exercise completion
  trackExerciseCompletion: async (userId, exerciseData) => {
    try {
      const { data, error } = await supabase
        .from('exercise_completions')
        .insert([
          {
            user_id: userId,
            exercise_type: exerciseData.type,
            score: exerciseData.score,
            time_spent: exerciseData.timeSpent,
            completed_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error tracking exercise completion:', error);
      throw error;
    }
  },

  // Get performance insights
  getPerformanceInsights: async (userId) => {
    try {
      // Get exercise completions
      const { data: exerciseData, error: exerciseError } = await supabase
        .from('exercise_completions')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false });

      if (exerciseError) throw exerciseError;

      // Get learning activities
      const { data: activityData, error: activityError } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false });

      if (activityError) throw activityError;

      return generateInsights(exerciseData, activityData);
    } catch (error) {
      console.error('Error getting performance insights:', error);
      throw error;
    }
  },

  // Track learning streak
  updateStreak: async (userId) => {
    try {
      // Get user's current streak
      const { data: streakData, error: streakError } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (streakError) throw streakError;

      const updatedStreak = calculateUpdatedStreak(streakData);

      // Update streak
      const { data, error } = await supabase
        .from('user_streaks')
        .upsert([
          {
            user_id: userId,
            current_streak: updatedStreak.current,
            longest_streak: updatedStreak.longest,
            last_activity_date: new Date().toISOString()
          }
        ]);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating streak:', error);
      throw error;
    }
  }
};

// Helper functions
const getDaysInMs = (timeRange) => {
  const days = parseInt(timeRange);
  return days * 24 * 60 * 60 * 1000;
};

const processLearningStats = (data) => {
  return {
    totalActivities: data.length,
    activityByType: data.reduce((acc, activity) => {
      acc[activity.activity_type] = (acc[activity.activity_type] || 0) + 1;
      return acc;
    }, {}),
    timeSpent: data.reduce((acc, activity) => acc + (activity.activity_data.timeSpent || 0), 0),
    averageScore: calculateAverageScore(data)
  };
};

const calculateAverageScore = (data) => {
  const scores = data.filter(activity => activity.activity_data.score !== undefined);
  if (scores.length === 0) return 0;
  return scores.reduce((acc, activity) => acc + activity.activity_data.score, 0) / scores.length;
};

const generateInsights = (exerciseData, activityData) => {
  return {
    strengths: identifyStrengths(exerciseData),
    weaknesses: identifyWeaknesses(exerciseData),
    recommendations: generateRecommendations(exerciseData, activityData),
    progress: calculateProgress(exerciseData)
  };
};

const calculateUpdatedStreak = (streakData) => {
  const today = new Date().toISOString().split('T')[0];
  const lastActivity = streakData?.last_activity_date?.split('T')[0];
  
  if (!lastActivity) {
    return { current: 1, longest: 1 };
  }

  const daysSinceLastActivity = Math.floor((new Date(today) - new Date(lastActivity)) / (1000 * 60 * 60 * 24));
  
  if (daysSinceLastActivity === 1) {
    const currentStreak = (streakData.current_streak || 0) + 1;
    return {
      current: currentStreak,
      longest: Math.max(currentStreak, streakData.longest_streak || 0)
    };
  }

  if (daysSinceLastActivity === 0) {
    return {
      current: streakData.current_streak,
      longest: streakData.longest_streak
    };
  }

  return { current: 1, longest: streakData.longest_streak || 1 };
};

const identifyStrengths = (exerciseData) => {
  const strengthThreshold = 0.8; // 80% success rate
  const exercisesByType = groupByExerciseType(exerciseData);
  
  return Object.entries(exercisesByType)
    .filter(([_, exercises]) => calculateSuccessRate(exercises) >= strengthThreshold)
    .map(([type]) => type);
};

const identifyWeaknesses = (exerciseData) => {
  const weaknessThreshold = 0.6; // 60% success rate
  const exercisesByType = groupByExerciseType(exerciseData);
  
  return Object.entries(exercisesByType)
    .filter(([_, exercises]) => calculateSuccessRate(exercises) < weaknessThreshold)
    .map(([type]) => type);
};

const groupByExerciseType = (exerciseData) => {
  return exerciseData.reduce((acc, exercise) => {
    acc[exercise.exercise_type] = acc[exercise.exercise_type] || [];
    acc[exercise.exercise_type].push(exercise);
    return acc;
  }, {});
};

const calculateSuccessRate = (exercises) => {
  if (exercises.length === 0) return 0;
  const totalScore = exercises.reduce((acc, exercise) => acc + exercise.score, 0);
  return totalScore / (exercises.length * 100); // Assuming score is out of 100
};

const calculateProgress = (exerciseData) => {
  const recentExercises = exerciseData.slice(0, 10); // Last 10 exercises
  const olderExercises = exerciseData.slice(10, 20); // Previous 10 exercises
  
  if (recentExercises.length === 0 || olderExercises.length === 0) return 0;
  
  const recentAverage = calculateAverageScore(recentExercises);
  const olderAverage = calculateAverageScore(olderExercises);
  
  return ((recentAverage - olderAverage) / olderAverage) * 100;
};

const generateRecommendations = (exerciseData, activityData) => {
  const weaknesses = identifyWeaknesses(exerciseData);
  const activityPatterns = analyzeActivityPatterns(activityData);
  
  return {
    focusAreas: weaknesses,
    suggestedActivities: generateSuggestedActivities(weaknesses, activityPatterns),
    timeRecommendations: generateTimeRecommendations(activityPatterns)
  };
};

const analyzeActivityPatterns = (activityData) => {
  return {
    preferredTimes: findPreferredTimes(activityData),
    averageSessionLength: calculateAverageSessionLength(activityData),
    mostProductiveDay: findMostProductiveDay(activityData)
  };
};

const findPreferredTimes = (activityData) => {
  // Implementation for finding preferred study times
  return ['morning', 'evening']; // Placeholder
};

const calculateAverageSessionLength = (activityData) => {
  // Implementation for calculating average session length
  return 30; // Placeholder: 30 minutes
};

const findMostProductiveDay = (activityData) => {
  // Implementation for finding most productive day
  return 'Monday'; // Placeholder
};

const generateSuggestedActivities = (weaknesses, patterns) => {
  // Implementation for generating personalized activity suggestions
  return weaknesses.map(weakness => ({
    type: weakness,
    suggestedExercises: ['exercise1', 'exercise2'],
    difficulty: 'intermediate'
  }));
};

const generateTimeRecommendations = (patterns) => {
  // Implementation for generating time management recommendations
  return {
    optimalTime: patterns.preferredTimes[0],
    sessionLength: patterns.averageSessionLength,
    frequency: 'daily'
  };
};

export default analyticsService; 