import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

import {
  Body,
  Controller,
  Param,
  Post,
  Request,
  UseGuards
} from '@nestjs/common';

import { CardService } from './card.service';

@Controller('boards/:boardId/lists/:listId/cards')
export class CardController {
  constructor(private cardService: CardService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createCard(
    @Param('listId') listId: string,
    @Request() req: any,
    @Body() data: any
  ) {
    return await this.cardService.createCard(listId, req.user.sub, data);
  }
}
