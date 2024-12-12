import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs/promises';

const execAsync = promisify(exec);

export class BackupManager {
  private backupDir: string;
  private dbConfig: {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
  };

  constructor(backupDir: string, dbConfig: any) {
    this.backupDir = backupDir;
    this.dbConfig = dbConfig;
  }

  async createBackup(): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `backup-${timestamp}.sql`;
    const filepath = path.join(this.backupDir, filename);

    const command = `PGPASSWORD=${this.dbConfig.password} pg_dump -h ${this.dbConfig.host} -p ${this.dbConfig.port} -U ${this.dbConfig.user} -F c -b -v -f ${filepath} ${this.dbConfig.database}`;

    try {
      await execAsync(command);
      return filepath;
    } catch (error) {
      throw new Error(`Backup failed: ${error.message}`);
    }
  }

  async restoreBackup(backupFile: string): Promise<void> {
    const command = `PGPASSWORD=${this.dbConfig.password} pg_restore -h ${this.dbConfig.host} -p ${this.dbConfig.port} -U ${this.dbConfig.user} -d ${this.dbConfig.database} -v ${backupFile}`;

    try {
      await execAsync(command);
    } catch (error) {
      throw new Error(`Restore failed: ${error.message}`);
    }
  }

  async listBackups(): Promise<string[]> {
    const files = await fs.readdir(this.backupDir);
    return files.filter(file => file.startsWith('backup-') && file.endsWith('.sql'));
  }

  async cleanOldBackups(keepDays: number): Promise<void> {
    const files = await this.listBackups();
    const now = new Date();

    for (const file of files) {
      const filepath = path.join(this.backupDir, file);
      const stats = await fs.stat(filepath);
      const daysOld = (now.getTime() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);

      if (daysOld > keepDays) {
        await fs.unlink(filepath);
      }
    }
  }
} 