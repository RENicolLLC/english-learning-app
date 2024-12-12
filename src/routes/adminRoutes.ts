import { Router } from 'express';
import { adminAuth } from '../middleware/adminAuth';
import { AuthService } from '../services/AuthService';
import { DatabaseService } from '../services/database';

const router = Router();
const authService = AuthService.getInstance();
const db = DatabaseService.getInstance();

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { username, password, bypassKey } = req.body;
    const token = await authService.adminLogin({ username, password, bypassKey });
    res.json({ token });
  } catch (error) {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Protected admin routes
router.use(adminAuth);

// Bypass user authentication for testing
router.post('/bypass-auth', (req, res) => {
  const { userId, level } = req.body;
  // Generate temporary user session
  res.json({
    token: 'temporary_user_token',
    userId,
    level,
    expiresIn: '24h'
  });
});

// Force level progression
router.post('/set-user-level', async (req, res) => {
  const { userId, level } = req.body;
  try {
    await db.updateUserLevel(userId, level);
    res.json({ success: true, message: `User level set to ${level}` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user level' });
  }
});

// Reset user progress
router.post('/reset-progress', async (req, res) => {
  const { userId } = req.body;
  try {
    await db.resetUserProgress(userId);
    res.json({ success: true, message: 'User progress reset' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset progress' });
  }
});

// Unlock all content
router.post('/unlock-content', async (req, res) => {
  const { userId } = req.body;
  try {
    await db.unlockAllContent(userId);
    res.json({ success: true, message: 'All content unlocked' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to unlock content' });
  }
});

// Admin Dashboard Data
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const [
      userStats,
      systemStats,
      recentActivity
    ] = await Promise.all([
      getUserStats(),
      getSystemStats(),
      getRecentActivity()
    ]);

    res.json({
      userStats,
      systemStats,
      recentActivity
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// User Management
router.get('/users', adminAuth, async (req, res) => {
  const { page = 1, limit = 20, search, language } = req.query;
  try {
    const users = await db.pool.query(`
      SELECT 
        u.user_id,
        u.email,
        u.name,
        u.native_language,
        up.current_level,
        us.tier as subscription_tier,
        COUNT(ua.activity_id) as total_activities
      FROM users u
      LEFT JOIN user_progress up ON u.user_id = up.user_id
      LEFT JOIN user_subscriptions us ON u.user_id = us.user_id
      LEFT JOIN user_activities ua ON u.user_id = ua.user_id
      WHERE ($1::text IS NULL OR u.name ILIKE $1 OR u.email ILIKE $1)
      AND ($2::text IS NULL OR u.native_language = $2)
      GROUP BY u.user_id, up.current_level, us.tier
      ORDER BY u.created_at DESC
      LIMIT $3 OFFSET $4
    `, [
      search ? `%${search}%` : null,
      language,
      limit,
      (page - 1) * Number(limit)
    ]);

    res.json(users.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Content Management
router.get('/content/stats', adminAuth, async (req, res) => {
  try {
    const stats = await db.pool.query(`
      SELECT 
        language_code,
        COUNT(DISTINCT translation_id) as translations_count,
        COUNT(DISTINCT idiom_id) as idioms_count,
        COUNT(DISTINCT pattern_id) as grammar_patterns_count
      FROM (
        SELECT language_code, translation_id, NULL as idiom_id, NULL as pattern_id
        FROM translations
        UNION ALL
        SELECT language_code, NULL, idiom_id, NULL
        FROM idioms_translations
        UNION ALL
        SELECT language_code, NULL, NULL, pattern_id
        FROM grammar_translations
      ) combined
      GROUP BY language_code
    `);

    res.json(stats.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch content stats' });
  }
});

// Performance Monitoring
router.get('/performance', adminAuth, async (req, res) => {
  const { timeframe = '24h' } = req.query;
  try {
    const metrics = await db.pool.query(`
      SELECT 
        date_trunc('hour', recorded_at) as time,
        COUNT(*) as total_activities,
        AVG(score) as avg_score,
        AVG(duration) as avg_duration
      FROM performance_metrics
      WHERE recorded_at > NOW() - interval '1 ${timeframe}'
      GROUP BY date_trunc('hour', recorded_at)
      ORDER BY time DESC
    `);

    res.json(metrics.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch performance metrics' });
  }
});

// System Management
router.post('/system/maintenance', adminAuth, async (req, res) => {
  const { action } = req.body;
  try {
    switch (action) {
      case 'vacuum':
        await db.pool.query('VACUUM ANALYZE');
        break;
      case 'clear_cache':
        await clearSystemCache();
        break;
      case 'reset_daily_limits':
        await resetDailyLimits();
        break;
      default:
        throw new Error('Invalid maintenance action');
    }
    res.json({ success: true, message: `${action} completed successfully` });
  } catch (error) {
    res.status(500).json({ error: `Failed to perform ${action}` });
  }
});

// Error Logging
router.get('/errors', adminAuth, async (req, res) => {
  const { days = 7 } = req.query;
  try {
    const errors = await db.pool.query(`
      SELECT 
        error_id,
        error_type,
        error_message,
        stack_trace,
        user_id,
        created_at,
        resolved
      FROM system_errors
      WHERE created_at > NOW() - interval '${days} days'
      ORDER BY created_at DESC
    `);

    res.json(errors.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch error logs' });
  }
});

// Helper functions
async function getUserStats() {
  const stats = await db.pool.query(`
    SELECT
      COUNT(DISTINCT u.user_id) as total_users,
      COUNT(DISTINCT CASE WHEN u.created_at > NOW() - interval '24 hours' THEN u.user_id END) as new_users_24h,
      AVG(up.current_level) as avg_level,
      COUNT(DISTINCT CASE WHEN us.tier = 'premium' THEN u.user_id END) as premium_users,
      COUNT(DISTINCT CASE WHEN us.tier = 'unlimited' THEN u.user_id END) as unlimited_users
    FROM users u
    LEFT JOIN user_progress up ON u.user_id = up.user_id
    LEFT JOIN user_subscriptions us ON u.user_id = us.user_id
  `);
  return stats.rows[0];
}

async function getSystemStats() {
  const stats = await db.pool.query(`
    SELECT
      (SELECT COUNT(*) FROM performance_metrics WHERE recorded_at > NOW() - interval '24 hours') as activities_24h,
      (SELECT AVG(score) FROM performance_metrics WHERE recorded_at > NOW() - interval '24 hours') as avg_score_24h,
      (SELECT COUNT(*) FROM system_errors WHERE created_at > NOW() - interval '24 hours') as errors_24h,
      pg_database_size(current_database()) as db_size
  `);
  return stats.rows[0];
}

async function getRecentActivity() {
  const activity = await db.pool.query(`
    SELECT *
    FROM (
      SELECT 'login' as type, created_at, user_id, NULL as details
      FROM user_sessions
      UNION ALL
      SELECT 'assessment' as type, completed_at, user_id, score as details
      FROM assessment_results
      UNION ALL
      SELECT 'error' as type, created_at, user_id, error_message as details
      FROM system_errors
    ) combined
    ORDER BY created_at DESC
    LIMIT 50
  `);
  return activity.rows;
}

async function clearSystemCache() {
  // Implementation for clearing system cache
}

async function resetDailyLimits() {
  await db.pool.query(`
    UPDATE user_daily_usage
    SET lessons_completed = 0, duration = 0
    WHERE date = CURRENT_DATE
  `);
}

export default router; 