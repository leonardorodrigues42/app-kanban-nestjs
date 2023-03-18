import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BoardController } from './board.controller';
import { Board } from './board.entity';
import { BoardService } from './board.service';
import { TitleIsUnique } from './validators/board-already-exists.validator';

@Module({
  controllers: [BoardController],
  imports: [UserModule, TypeOrmModule.forFeature([Board]), AuthModule],
  providers: [BoardService, TitleIsUnique],
  exports: [BoardService, TypeOrmModule]
})
export class BoardModule {}
