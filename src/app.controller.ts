import {
  Controller,
  Get,
  Post,
  Request,
  UseGuards
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiResponse
} from '@nestjs/swagger';

import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  @ApiResponse({
    status: 201,
    description: 'Retorna um token de autenticação'
  })
  @ApiBody({
    schema: { example: { email: 'user@example.com', password: 'password' } }
  })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiResponse({
    status: 200,
    description: 'Retorna o usuário logado'
  })
  getProfile(@Request() req) {
    return req.user;
  }
}
