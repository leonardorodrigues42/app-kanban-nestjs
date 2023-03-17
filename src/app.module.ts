import {
  ClassSerializerInterceptor,
  Module
} from '@nestjs/common';
import {
  ConfigModule,
  ConfigService
} from '@nestjs/config';
import {
  APP_FILTER,
  APP_INTERCEPTOR
} from '@nestjs/core';
import {
  TypeOrmModule,
  TypeOrmModuleOptions
} from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { Board } from './board/board.entity';
import { BoardModule } from './board/board.module';
import { BoardService } from './board/board.service';
import { HttpExceptionFilter } from './filters/http-exception-filter';
import { User } from './users/users.entity';
import { UserModule } from './users/users.module';
import { UsersService } from './users/users.service';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (
        configService: ConfigService
      ): Promise<TypeOrmModuleOptions> => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST'),
        port: configService.get<number>('POSTGRES_PORT'),
        database: configService.get<string>('POSTGRES_DB'),
        username: configService.get<string>('POSTGRES_USERNAME'),
        password: configService.get<string>('POSTGRES_PWD'),
        entities: [User, Board],
        synchronize: true
      }),
      inject: [ConfigService]
    }),
    UserModule,
    AuthModule,
    BoardModule
  ],
  providers: [
    UsersService,
    BoardService,
    AuthService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor
    }
  ]
})
export class AppModule {}
