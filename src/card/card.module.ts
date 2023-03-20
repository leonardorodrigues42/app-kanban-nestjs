import { AuthModule } from 'src/auth/auth.module';
import { BoardModule } from 'src/board/board.module';
import { ListModule } from 'src/list/list.module';
import { UserModule } from 'src/user/user.module';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CardController } from './card.controller';
import { Card } from './card.entity';
import { CardService } from './card.service';

@Module({
  controllers: [CardController],
  imports: [
    TypeOrmModule.forFeature([Card]),
    AuthModule,
    BoardModule,
    UserModule,
    ListModule
  ],
  providers: [CardService],
  exports: [CardService, TypeOrmModule]
})
export class CardModule {}
