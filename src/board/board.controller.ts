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

import { Board } from './board.entity';
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
  async listBoard() {
    return await this.boardService.listBoards();
  }

  @Get(':id')
  async getBoard(@Param('id') id: string) {
    return await this.boardService.getBoard(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async upadateBoard(
    @Param('id') id: string,
    @Body() data: Partial<Board>,
    @Request() req: any
  ) {
    const updatedBoard = await this.boardService.updateBoard(
      id,
      req.user.id,
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
  @Delete(':id')
  async deleteBoard(@Param('id') id: string, @Request() req: any) {
    const response = await this.boardService.deleteBoard(id, req.user.id);
    return {
      status: 'ok',
      message: response
    };
  }
}
