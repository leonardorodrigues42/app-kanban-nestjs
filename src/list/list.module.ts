import { AuthModule } from 'src/auth/auth.module';
import { BoardModule } from 'src/board/board.module';
import { UserModule } from 'src/user/user.module';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ListController } from './list.controller';
import { List } from './list.entity';
import { ListService } from './list.service';
import { NameIsUnique } from './validators/list-already-exists.validator';

@Module({
  controllers: [ListController],
  imports: [
    TypeOrmModule.forFeature([List]),
    AuthModule,
    BoardModule,
    UserModule
  ],
  providers: [ListService, NameIsUnique],
  exports: [ListService, TypeOrmModule]
})
export class ListModule {}
