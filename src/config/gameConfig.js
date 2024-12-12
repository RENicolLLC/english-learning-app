export const gameConfig = {
  preferences: {
    // ... existing preferences ...
  },
  monthlyLeaderboard: {
    enabled: true,
    endTime: {
      timezone: 'America/Los_Angeles',
      hour: 23,
      minute: 59,
      lastDayOfMonth: true
    },
    levelGroups: {
      beginner: {
        name: 'Beginner League',
        levels: [1, 2, 3, 4],
        rewards: {
          1: {
            type: 'subscription',
            duration: 30,
            description: 'One Month Unlimited Access',
            icon: '🏆',
            startNextBillingCycle: true,
            bonusFeatures: ['premium_content']
          },
          2: {
            type: 'subscription',
            duration: 7,
            description: 'One Week Unlimited Access',
            icon: '🥈',
            startNextBillingCycle: true
          },
          3: {
            type: 'subscription',
            duration: 7,
            description: 'One Week Unlimited Access',
            icon: '🥉',
            startNextBillingCycle: true
          },
          4: {
            type: 'subscription',
            duration: 7,
            description: 'One Week Unlimited Access',
            icon: '🌟',
            startNextBillingCycle: true
          },
          5: {
            type: 'subscription',
            duration: 7,
            description: 'One Week Unlimited Access',
            icon: '⭐',
            startNextBillingCycle: true
          }
        }
      },
      intermediate: {
        name: 'Intermediate League',
        levels: [5, 6, 7, 8],
        rewards: {
          1: {
            type: 'subscription',
            duration: 30,
            description: 'One Month Unlimited Access + AI Tutor',
            icon: '🏆',
            startNextBillingCycle: true,
            bonusFeatures: ['premium_content', 'ai_tutor', 'priority_support']
          },
          2: {
            type: 'subscription',
            duration: 14, // Two weeks for intermediate
            description: 'Two Weeks Unlimited Access',
            icon: '🥈',
            startNextBillingCycle: true,
            bonusFeatures: ['premium_content']
          },
          3: {
            type: 'subscription',
            duration: 7,
            description: 'One Week Unlimited Access',
            icon: '🥉',
            startNextBillingCycle: true
          },
          4: {
            type: 'subscription',
            duration: 7,
            description: 'One Week Unlimited Access',
            icon: '🌟',
            startNextBillingCycle: true
          },
          5: {
            type: 'subscription',
            duration: 7,
            description: 'One Week Unlimited Access',
            icon: '⭐',
            startNextBillingCycle: true
          }
        }
      },
      advanced: {
        name: 'Advanced League',
        levels: [9, 10, 11, 12],
        rewards: {
          1: {
            type: 'subscription',
            duration: 30,
            description: 'One Month Unlimited Access + Full Package',
            icon: '👑',
            startNextBillingCycle: true,
            bonusFeatures: ['premium_content', 'ai_tutor', 'priority_support', 'native_sessions', 'certificate']
          },
          2: {
            type: 'subscription',
            duration: 21, // Three weeks for advanced
            description: 'Three Weeks Unlimited Access',
            icon: '🏅',
            startNextBillingCycle: true,
            bonusFeatures: ['premium_content', 'ai_tutor']
          },
          3: {
            type: 'subscription',
            duration: 7,
            description: 'One Week Unlimited Access',
            icon: '🥉',
            startNextBillingCycle: true
          },
          4: {
            type: 'subscription',
            duration: 7,
            description: 'One Week Unlimited Access',
            icon: '🌟',
            startNextBillingCycle: true
          },
          5: {
            type: 'subscription',
            duration: 7,
            description: 'One Week Unlimited Access',
            icon: '⭐',
            startNextBillingCycle: true
          }
        }
      }
    },
    specialEvents: {
      enabled: true,
      types: {
        weekendBoost: {
          name: 'Weekend Warriors',
          description: 'Double points on weekends',
          multiplier: 2.0,
          schedule: 'weekly'
        },
        holidayChallenge: {
          name: 'Holiday Sprint',
          description: 'Special holiday-themed challenges',
          bonusPoints: 500,
          schedule: 'monthly'
        },
        groupChallenge: {
          name: 'Team Challenge',
          description: 'Form teams and compete together',
          teamSize: [3, 5],
          schedule: 'monthly'
        }
      }
    },
    catchupMechanic: {
      enabled: true,
      boostTypes: {
        comebackBonus: {
          description: 'Bonus points for returning after inactivity',
          duration: 48, // hours
          multiplier: 1.5
        },
        underdog: {
          description: 'Point boost when far behind leaders',
          threshold: 1000, // points behind
          multiplier: 1.3
        }
      }
    },
    seasonalEvents: {
      spring: {
        theme: 'Spring Learning Festival',
        duration: 'March-May',
        specialRewards: ['spring_avatar_items', 'seasonal_certificates']
      },
      summer: {
        theme: 'Summer Language Olympics',
        duration: 'June-August',
        specialRewards: ['olympic_badges', 'summer_themes']
      },
      fall: {
        theme: 'Autumn Knowledge Harvest',
        duration: 'September-November',
        specialRewards: ['fall_collectibles', 'harvest_badges']
      },
      winter: {
        theme: 'Winter Language Games',
        duration: 'December-February',
        specialRewards: ['winter_profile_frames', 'holiday_items']
      }
    },
    achievements: {
      categories: {
        consistency: {
          name: 'Steady Learner',
          criteria: 'Practice every day for a month',
          bonusPoints: 300
        },
        improvement: {
          name: 'Fast Improver',
          criteria: 'Improve accuracy by 20% in a week',
          bonusPoints: 250
        },
        exploration: {
          name: 'Language Explorer',
          criteria: 'Try all learning features in a week',
          bonusPoints: 200
        }
      }
    },
    historicalScores: {
      monthly: {
        enabled: true,
        displayMonths: 12, // Show last 12 months
        categories: {
          overall: {
            name: 'Monthly Champions',
            description: 'Top performers for each month',
            displayTop: 10,
            sortBy: 'points'
          },
          byLeague: {
            name: 'League Champions',
            description: 'Top performers in each league',
            displayTop: 5,
            groupBy: 'league'
          },
          byCategory: {
            name: 'Category Leaders',
            description: 'Best performers in specific skills',
            categories: ['vocabulary', 'grammar', 'speaking', 'listening', 'writing', 'reading'],
            displayTop: 3
          }
        },
        hallOfFame: {
          enabled: true,
          criteria: {
            minPoints: 10000,
            minStreak: 25,
            minAccuracy: 0.9
          }
        }
      },
      yearly: {
        enabled: true,
        tracking: {
          startMonth: 1, // January
          endMonth: 12,  // December
          rollingYear: false // Calendar year instead of rolling 12 months
        },
        categories: {
          grandChampion: {
            name: 'Year Grand Champion',
            description: 'Best overall performer',
            rewards: {
              trophy: '👑',
              perks: ['lifetime_achievement_badge', 'special_profile_frame'],
              bonusFeatures: ['premium_lifetime_discount']
            }
          },
          leagueChampions: {
            name: 'Yearly League Champions',
            description: 'Best in each league for the year',
            displayTop: 3,
            rewards: {
              1: {
                trophy: '🏆',
                perks: ['champion_badge', 'exclusive_avatar'],
                bonusFeatures: ['premium_3_months']
              },
              2: {
                trophy: '🥈',
                perks: ['silver_badge'],
                bonusFeatures: ['premium_2_months']
              },
              3: {
                trophy: '🥉',
                perks: ['bronze_badge'],
                bonusFeatures: ['premium_1_month']
              }
            }
          },
          consistency: {
            name: 'Year-Round Achiever',
            description: 'Most consistent performer',
            criteria: {
              minMonthlyScore: 5000,
              minMonthsActive: 10
            },
            rewards: {
              trophy: '⭐',
              perks: ['consistency_badge']
            }
          }
        },
        statistics: {
          tracked: [
            'totalPoints',
            'averageMonthlyRank',
            'totalLearningTime',
            'skillsProgress',
            'streakStats',
            'challengesCompleted',
            'improvementRate'
          ],
          graphs: {
            enabled: true,
            types: [
              'monthlyProgress',
              'skillsRadar',
              'activityHeatmap',
              'rankingTrend'
            ]
          }
        },
        achievements: {
          perfectMonth: {
            name: 'Perfect Month',
            description: 'Top 10 in any month',
            icon: '🌟'
          },
          seasonMaster: {
            name: 'Season Master',
            description: 'Top 3 in three consecutive months',
            icon: '🎯'
          },
          yearLongStreak: {
            name: 'Iron Will',
            description: 'Maintain activity every week of the year',
            icon: '⚡'
          },
          allRounder: {
            name: 'Renaissance Learner',
            description: 'Excel in all learning categories',
            icon: '🎨'
          }
        }
      },
      display: {
        format: {
          showStats: true,
          showGraph: true,
          showAchievements: true,
          showProgress: true
        },
        filters: {
          byDate: true,
          byLeague: true,
          byCategory: true,
          byAchievement: true
        },
        sorting: {
          options: [
            'points',
            'streak',
            'accuracy',
            'improvement',
            'totalTime'
          ],
          defaultSort: 'points'
        }
      }
    }
  }
}; 