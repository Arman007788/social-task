import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Pool } from 'pg';
import { DbConfigService } from 'src/config/dbConfig.service';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;

  constructor(private dbConfigService: DbConfigService) {
    const dbConfig = this.dbConfigService.getDbConfig();
    this.pool = new Pool(dbConfig);
  }

  // start db connection
  async onModuleInit() {
    try {
      await this.pool.connect();
      console.log('Connected to PostgreSQL');
    } catch (error) {
      console.error('Database connection error:', error);
      throw error;
    }
  }

  // end db connection
  async onModuleDestroy() {
    await this.pool.end();
  }

  async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
    const client = await this.pool.connect();
    try {
      const { rows } = await client.query(sql, params);
      return rows;
    } catch (error) {
      console.error('Query Error:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}
