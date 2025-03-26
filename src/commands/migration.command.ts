import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import * as path from 'path';
import * as fs from 'fs';
import { DbConfigService } from 'src/config/dbConfig.service';
import { Command } from 'nestjs-command';
import { DESCRIBE, MIGRATION_RUN } from 'src/common/constants/command.constant';

@Injectable()
export class MigrationCommand {
  private pool: Pool;

  constructor(private dbConfigService: DbConfigService) {
    const dbConfig = this.dbConfigService.getDbConfig();
    this.pool = new Pool(dbConfig);
  }

  @Command({
    command: MIGRATION_RUN,
    describe: DESCRIBE,
  })
  async runMigration() {
    try {
      // Ensure migrations table exists
      await this.ensureMigrationsTable();

      // find all migrations files
      const migrationPath = path.resolve(__dirname, '..', 'migrations');
      const files = fs.readdirSync(migrationPath);

      // Fetch already applied migrations
      const appliedMigrations = await this.getAppliedMigrations();

      for (const file of files) {
        const filePath = path.resolve(migrationPath, file);

        // Skip migration if already applied
        if (appliedMigrations.includes(file)) {
          console.log(`Skipping already applied migration: ${file}`);
          continue;
        }

        const sql = fs.readFileSync(filePath, 'utf-8');

        try {
          await this.executeMigration(sql);
          await this.recordMigration(file);
          console.log(`Migration executed successfully: ${file}`);
        } catch (error) {
          console.error(`Error running migration: ${file}`, error);
        }
      }
    } catch (error) {
      console.error('Migration failed', error);
    } finally {
      // Ensure the process exits after migration is complete
      console.log('Migration process completed.');
      process.exit(0); // Exit the process after running migrations
    }
  }

  private async ensureMigrationsTable() {
    const client = await this.pool.connect();
    try {
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS migrations (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;
      await client.query(createTableQuery);
      console.log('Migrations table is ready.');
    } catch (error) {
      console.error('Error creating migrations table', error);
      throw error;
    } finally {
      client.release();
    }
  }

  private async getAppliedMigrations(): Promise<string[]> {
    const client = await this.pool.connect();
    try {
      const result = await client.query('SELECT name FROM migrations');
      return result.rows.map((row) => row.name);
    } finally {
      client.release();
    }
  }

  private async recordMigration(migrationName: string) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('INSERT INTO migrations (name) VALUES ($1)', [
        migrationName,
      ]);
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  private async executeMigration(sql: string) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(sql);
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}
