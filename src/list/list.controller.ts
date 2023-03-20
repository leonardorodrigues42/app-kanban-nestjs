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

import { CreateListDTO } from './dto/CreateList.dto';
import { NewPositionDTO } from './dto/NewPosition.dto';
import { ListService } from './list.service';

@Controller('boards/:boardId/lists')
export class ListController {
  constructor(private listService: ListService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createList(
    @Body() data: CreateListDTO,
    @Param('boardId') boardId: string,
    @Request() req: any
  ) {
    const list = await this.listService.createList(data, boardId, req.user.sub);
    return list;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getListById(@Param('id') id: string) {
    return await this.listService.getListById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getBoardLists(@Param('boardId') boardId: string) {
    return await this.listService.getBoardLists(boardId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteList(@Param('id') id: string, @Request() req: any) {
    return await this.listService.deleteList(id, req.user.sub);
  }
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateList(
    @Param('id') id: string,
    @Request() req: any,
    @Body() data: CreateListDTO
  ) {
    return await this.listService.updateList(id, req.user.sub, data);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id')
  async moveList(
    @Param('id') id: string,
    @Request() req: any,
    @Body() body: NewPositionDTO
  ) {
    return this.listService.moveList(id, req.user.sub, body.newPosition);
  }
}
