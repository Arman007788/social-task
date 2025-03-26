import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';
import { UserRepository } from './repository/user.repository';
import { RelationRepository } from './repository/relation.repository';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository, RelationRepository],
  exports: [UserService],
})
export class UserModule {}
