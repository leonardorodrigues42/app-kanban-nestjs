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

import { BoardService } from './board.service';
import { CreateBoardDTO } from './dto/CreateBoard.dto';

@ApiTags('boards')
@Controller('boards')
export class BoardController {
  constructor(private boardService: BoardService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async createBoard(@Body() data: CreateBoardDTO, @Request() req: any) {
    const board = await this.boardService.createBoard(data, req.user);
    return board;
  }

  @Get()
  @ApiResponse({ description: 'Retorna uma lista com todos os Quadros' })
  async listBoards() {
    return await this.boardService.listBoards();
  }

  @Get(':id')
  @ApiNotFoundResponse({ description: 'Quadro não encontrado' })
  @ApiResponse({ description: 'Retorna uma lista com todos os quadros' })
  async getBoard(@Param('id') id: string) {
    return await this.boardService.getBoard(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/users')
  @ApiResponse({
    description:
      'Retorna os usuários adicionado quadro e aqueles' +
      'que não foram adicionados por algum motivo'
  })
  @ApiBody({
    schema: {
      example: {
        emailList:
          '[user1@example.com, user2@mail.com, ...] ou "user1@example.com"'
      }
    }
  })
  async addUserInBoard(
    @Body('emailList') emailList: string[] | string,
    @Param('id') id: string,
    @Request() req: any
  ) {
    if (Array.isArray(emailList)) {
      return await this.boardService.addUserInBoard(id, req.user.id, [
        ...emailList
      ]);
    } else {
      return await this.boardService.addUserInBoard(id, req.user.id, [
        emailList
      ]);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiBody({
    schema: {
      example: {
        title: '?newtitle',
        backgroundImageUrl: 'https://newbackgroundimg.com'
      }
    }
  })
  @ApiResponse({
    description: 'Atualiza o quadro do id correspondente'
  })
  async updateBoard(
    @Param('id') id: string,
    @Body() data: Partial<CreateBoardDTO>,
    @Request() req: any
  ) {
    const updatedBoard = await this.boardService.updateBoard(
      id,
      req.user.sub,
      data
    );
    return {
      updated: {
        userId: id,
        fields: updatedBoard
      },
      message: 'Quadro atualizado'
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/users')
  @ApiResponse({
    description:
      'Remove os usuários adicionado quadro e aqueles' +
      'que não foram removidos por algum motivo'
  })
  @ApiBody({
    schema: {
      example: {
        emailList:
          '[user1@example.com, user2@mail.com, ...] ou "user1@example.com"'
      }
    }
  })
  async removeUserOfBoard(
    @Body('emailList') emailList: string[] | string,
    @Param('id') id: string,
    @Request() req: any
  ) {
    if (Array.isArray(emailList)) {
      return await this.boardService.removeUsersOfBoard(id, req.user.id, [
        ...emailList
      ]);
    } else {
      return await this.boardService.removeUsersOfBoard(id, req.user.id, [
        emailList
      ]);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiResponse({
    description: 'Deleta o quadro do id correspondente'
  })
  async deleteBoard(@Param('id') id: string, @Request() req: any) {
    const response = await this.boardService.deleteBoard(id, req.user.sub);
    return {
      status: 'ok',
      message: response
    };
  }
}
