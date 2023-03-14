import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';

import { CreateUserDTO } from './dto/CreateUser.dto';
import { ListUserDTO } from './dto/ListUser.dto';
import { UserRepository } from './users.repository';

@Controller('users')
export class UsersController {
  constructor(private userRepository: UserRepository) {}

  @Post()
  async userCreate(@Body() userData: CreateUserDTO) {
    const user = await this.userRepository.save(userData);

    return user;
  }

  @Get()
  async listUsers() {
    const users = await this.userRepository.list();
    const list = users.map((user) => new ListUserDTO(user.id, user.name));

    return list;
  }

  @Get(':id')
  async getUser(@Param() id: string) {
    return this.userRepository.getUser(id);
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() data: Partial<CreateUserDTO>,
  ) {
    const userUpdated = await this.userRepository.updateUser(id, data);
    return {
      user: new ListUserDTO(userUpdated.id, userUpdated.name),
      message: 'Usuário atualizado',
    };
  }
}
