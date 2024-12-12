import { Migration } from './migrations/Migration';
import { DatabaseService } from '../services/database';

export class MigrationManager {
  private db = DatabaseService.getInstance();
  private migrations: Migration[] = [];

  constructor(migrations: Migration[]) {
    this.migrations = migrations.sort((a, b) => a.version - b.version);
  }

  async getCurrentVersion(): Promise<number> {
    const result = await this.db.pool.query(
      'SELECT version FROM schema_versions ORDER BY version DESC LIMIT 1'
    );
    return result.rows[0]?.version || 0;
  }

  async migrate(targetVersion?: number): Promise<void> {
    const currentVersion = await this.getCurrentVersion();
    const target = targetVersion || Math.max(...this.migrations.map(m => m.version));

    if (currentVersion < target) {
      // Migrate up
      for (const migration of this.migrations) {
        if (migration.version > currentVersion && migration.version <= target) {
          await this.db.pool.query('BEGIN');
          try {
            await migration.up();
            await this.updateVersion(migration.version);
            await this.db.pool.query('COMMIT');
            console.log(`Migrated to version ${migration.version}`);
          } catch (error) {
            await this.db.pool.query('ROLLBACK');
            throw error;
          }
        }
      }
    } else if (currentVersion > target) {
      // Migrate down
      for (const migration of [...this.migrations].reverse()) {
        if (migration.version <= currentVersion && migration.version > target) {
          await this.db.pool.query('BEGIN');
          try {
            await migration.down();
            await this.updateVersion(migration.version - 1);
            await this.db.pool.query('COMMIT');
            console.log(`Rolled back version ${migration.version}`);
          } catch (error) {
            await this.db.pool.query('ROLLBACK');
            throw error;
          }
        }
      }
    }
  }

  private async updateVersion(version: number): Promise<void> {
    await this.db.pool.query(
      'INSERT INTO schema_versions (version, updated_at) VALUES ($1, NOW())',
      [version]
    );
  }
} 