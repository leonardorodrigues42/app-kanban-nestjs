import { AuthModule } from 'src/auth/auth.module';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';
import { EmailIsUnique } from './validators/email-is-unique.validator';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, EmailIsUnique],
  exports: [UserService, TypeOrmModule]
})
export class UserModule {}
