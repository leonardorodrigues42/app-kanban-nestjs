import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersController } from './users.controller';
import { User } from './users.entity';
import { UsersService } from './users.service';
import { EmailIsUnique } from './validators/emailIsUnique.validator';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, EmailIsUnique],
  exports: [UsersService, TypeOrmModule]
})
export class UsersModule {}
