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

import { BoardService } from './board.service';
import { CreateBoardDTO } from './dto/CreateBoard.dto';

@Controller('boards')
export class BoardController {
  constructor(private boardService: BoardService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createBoard(@Body() data: CreateBoardDTO, @Request() req: any) {
    const board = await this.boardService.createBoard(data, req.user);
    return board;
  }

  @Get()
  async listBoards() {
    return await this.boardService.listBoards();
  }

  @Get(':id')
  async getBoard(@Param('id') id: string) {
    return await this.boardService.getBoard(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/users')
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
  async deleteBoard(@Param('id') id: string, @Request() req: any) {
    const response = await this.boardService.deleteBoard(id, req.user.sub);
    return {
      status: 'ok',
      message: response
    };
  }
}
