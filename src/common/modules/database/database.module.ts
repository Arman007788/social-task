import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { DbConfigService } from 'src/config/dbConfig.service';

@Global()
@Module({
  providers: [DatabaseService, DbConfigService],
  exports: [DatabaseService, DbConfigService],
})
export class DatabaseModule {}
