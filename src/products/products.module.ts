import { UsersModule } from 'src/users/users.module';

import { Module } from '@nestjs/common';

import { ProductsController } from './products.controller';
import { ProductsRepository } from './products.repository';
import { UserExistsValidator } from './validators/userExists.validator';

@Module({
  imports: [UsersModule],
  controllers: [ProductsController],
  providers: [ProductsRepository, UserExistsValidator],
})
export class ProductsModule {}
