import { BoardService } from 'src/board/board.service';
import { ListService } from 'src/list/list.service';
import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Card } from './card.entity';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private cardRepository: Repository<Card>,
    private boardService: BoardService,
    private listService: ListService
  ) {}

  async createCard(listId: string, userId: string, data: any) {
    const board = await this.boardService.getBoardByListId(listId);
    const list = await this.listService.getListOrFail(listId);

    await this.boardService.checkBoardAccess(board.id, userId);

    const card = this.cardRepository.save({ ...data, list });

    return card;
  }
}
