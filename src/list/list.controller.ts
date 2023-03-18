import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

import {
  Body,
  Controller,
  Param,
  Post,
  Request,
  UseGuards
} from '@nestjs/common';

import { CreateListDTO } from './dto/CreateList.dto';
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
}
