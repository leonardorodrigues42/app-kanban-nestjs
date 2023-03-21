import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

import {
  Body,
  Controller,
  Param,
  Post,
  Request,
  UseGuards
} from '@nestjs/common';
import {
  ApiBody,
  ApiTags
} from '@nestjs/swagger';

import { CardService } from './card.service';

@ApiTags('cards')
@Controller('boards/:boardId/lists/:listId/cards')
export class CardController {
  constructor(private cardService: CardService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBody({
    schema: {
      example: {
        title: 'title example',
        description: 'description example',
        initDate: '27/03/2023',
        endDate: '27/04/2023'
      }
    }
  })
  async createCard(
    @Param('listId') listId: string,
    @Request() req: any,
    @Body() data: any
  ) {
    return await this.cardService.createCard(listId, req.user.sub, data);
  }
}
