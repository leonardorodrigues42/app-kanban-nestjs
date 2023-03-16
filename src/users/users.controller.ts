import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post
} from '@nestjs/common';

import { CreateUserDTO } from './dto/CreateUser.dto';
import { ListUserDTO } from './dto/ListUser.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async userCreate(@Body() userData: CreateUserDTO) {
    const user = await this.usersService.save(userData);

    return user;
  }

  @Get()
  async listUsers() {
    const users = await this.usersService.list();
    const list = users.map(user => new ListUserDTO(user.id, user.name));

    return list;
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return await this.usersService.getUser(id);
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() data: Partial<CreateUserDTO>
  ) {
    const userUpdated = await this.usersService.updateUser(id, data);
    return {
      updated: {
        userId: id,
        fields: userUpdated
      },
      message: 'Usuário atualizado'
    };
  }
}
