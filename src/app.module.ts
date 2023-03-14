import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { ProductsModule } from './products/products.module';
import { ProductsRepository } from './products/products.repository';
import { HttpExceptionFilter } from './users/filters/http-exception-filter';
import { UsersModule } from './users/users.module';
import { UserRepository } from './users/users.repository';

@Module({
  imports: [UsersModule, ProductsModule],
  providers: [
    UserRepository,
    ProductsRepository,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
