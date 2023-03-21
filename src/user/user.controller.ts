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
import {
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';

import { CreateUserDTO } from './dto/CreateUser.dto';
import { ListUserDTO } from './dto/ListUser.dto';
import { UserService } from './user.service';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Retorna o usuário criado'
  })
  async userCreate(@Body() userData: CreateUserDTO) {
    const user = await this.userService.createUser(userData);
    return user;
  }

  @Get()
  @ApiResponse({
    description: 'Retorna uma lista com todos os usuários'
  })
  async listUsers() {
    const users = await this.userService.listUsers();
    const list = users.map(user => new ListUserDTO(user.id, user.name));
    return list;
  }

  @Get(':id')
  @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
  @ApiResponse({
    description: 'Retorna o usuáruo do id correspondente'
  })
  async getUser(@Param('id') id: string) {
    return await this.userService.getUser(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiResponse({
    description: 'Retorna o id do usuário atualizado e os campos atualizados'
  })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
  @ApiBody({
    schema: {
      example: {
        email: '?newemail@example',
        password: '?newpassword',
        name: '?fixname',
        photoUrl: '?https://newpic.com'
      }
    }
  })
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

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiNotFoundResponse({ description: 'usuário não encontrado' })
  @Delete(':id')
  @ApiResponse({
    description: 'Deleta o usuário do id correspondente'
  })
  async deleteUser(@Param('id') userId: string, @Request() req) {
    const response = await this.userService.deleteUser(userId, req.user.sub);
    return {
      status: 'ok',
      message: response
    };
  }
}
