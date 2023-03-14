import { Module } from '@nestjs/common';

import { UsersController } from './users.controller';
import { UserRepository } from './users.repository';
import { EmailIsUnique } from './validators/emailIsUnique.validator';

@Module({
  controllers: [UsersController],
  providers: [UserRepository, EmailIsUnique],
  exports: [UserRepository],
})
export class UsersModule {}
