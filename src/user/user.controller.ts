import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards
} from '@nestjs/common';

import { CreateUserDTO } from './dto/CreateUser.dto';
import { ListUserDTO } from './dto/ListUser.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async userCreate(@Body() userData: CreateUserDTO) {
    const user = await this.userService.createUser(userData);
    return user;
  }

  @Get()
  async listUsers() {
    const users = await this.userService.listUsers();
    const list = users.map(user => new ListUserDTO(user.id, user.name));
    return list;
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return await this.userService.getUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() data: Partial<CreateUserDTO>,
    @Request() req: any
  ) {
    const userUpdated = await this.userService.updateUser(
      id,
      req.user.sub,
      data
    );
    return {
      updated: {
        userId: id,
        fields: userUpdated
      },
      message: 'Usuário atualizado'
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUser(@Param('id') userId: string, @Request() req) {
    const response = await this.userService.deleteUser(userId, req.user.sub);
    return {
      status: 'ok',
      message: response
    };
  }
}
