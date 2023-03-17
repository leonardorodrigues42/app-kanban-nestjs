import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BoardController } from './board.controller';
import { Board } from './board.entity';
import { BoardService } from './board.service';

@Module({
  controllers: [BoardController],
  imports: [UsersModule, TypeOrmModule.forFeature([Board]), AuthModule],
  providers: [BoardService],
  exports: [BoardService, TypeOrmModule]
})
export class BoardModule {}
