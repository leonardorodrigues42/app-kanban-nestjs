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

import { CreateListDTO } from './dto/CreateList.dto';
import { NewPositionDTO } from './dto/NewPosition.dto';
import { ListService } from './list.service';

@ApiTags('lists')
@Controller('boards/:boardId/lists')
export class ListController {
  constructor(private listService: ListService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiResponse({
    description: 'Retorna a lista criada'
  })
  async createList(
    @Body() data: CreateListDTO,
    @Param('boardId') boardId: string,
    @Request() req: any
  ) {
    const list = await this.listService.createList(data, boardId, req.user.sub);
    return list;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiNotFoundResponse({ description: 'Não não encontrada' })
  @ApiResponse({
    description: 'Retorna a lista correspondente ao id'
  })
  async getListById(@Param('id') id: string) {
    return await this.listService.getListById(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiNotFoundResponse({ description: 'Quadro não encontrado' })
  @ApiResponse({
    description: 'Retorna todas as listas de quadro correspondente ao boardID'
  })
  @Get()
  async getBoardLists(@Param('boardId') boardId: string) {
    return await this.listService.getBoardLists(boardId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiNotFoundResponse({ description: 'Lista não encontrada' })
  @Delete(':id')
  async deleteList(@Param('id') id: string, @Request() req: any) {
    return await this.listService.deleteList(id, req.user.sub);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiResponse({
    description:
      'Atualiza o nome da lista e retorna todas as listas do quadro correspondente'
  })
  @ApiBody({
    schema: {
      example: {
        name: 'newname'
      }
    }
  })
  async updateList(
    @Param('id') id: string,
    @Request() req: any,
    @Body() data: CreateListDTO
  ) {
    return await this.listService.updateList(id, req.user.sub, data);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id')
  @ApiBody({
    schema: {
      example: {
        newPosition: 2
      }
    }
  })
  @ApiResponse({
    description:
      'Atualiza a poisição da lista no quadro e retorna todas as listas desse quadro'
  })
  async moveList(
    @Param('id') id: string,
    @Request() req: any,
    @Body() body: NewPositionDTO
  ) {
    return this.listService.moveList(id, req.user.sub, body.newPosition);
  }
}
