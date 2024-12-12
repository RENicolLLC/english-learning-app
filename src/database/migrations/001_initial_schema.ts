import { Migration } from './Migration';
import { DatabaseService } from '../../services/database';

export class InitialSchemaMigration implements Migration {
  version = 1;
  private db = DatabaseService.getInstance();

  async up(): Promise<void> {
    // Implementation of schema.sql
    await this.db.pool.query(`
      -- Users table
      CREATE TABLE users (
        user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        native_language VARCHAR(10) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        last_login TIMESTAMP WITH TIME ZONE
      );
      -- ... rest of schema.sql ...
    `);
  }

  async down(): Promise<void> {
    await this.db.pool.query(`
      DROP TABLE IF EXISTS user_content_access;
      DROP TABLE IF EXISTS performance_metrics;
      DROP TABLE IF EXISTS user_scenario_progress;
      DROP TABLE IF EXISTS user_daily_usage;
      DROP TABLE IF EXISTS user_subscriptions;
      DROP TABLE IF EXISTS user_progress;
      DROP TABLE IF EXISTS users;
    `);
  }
} 