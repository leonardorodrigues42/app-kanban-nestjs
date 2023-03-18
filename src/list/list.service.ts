import { BoardService } from 'src/board/board.service';
import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateListDTO } from './dto/CreateList.dto';
import { List } from './list.entity';

@Injectable()
export class ListService {
  constructor(
    @InjectRepository(List)
    private listRepository: Repository<List>,
    private boardService: BoardService
  ) {}

  async createList(listDTO: CreateListDTO, boardId: string, userId: string) {
    const { board } = await this.boardService.checkBoardAccess(boardId, userId);

    const lists = await this.listRepository.find({
      where: { board },
      order: { position: 'ASC' }
    });

    let newPosition = 1;
    if (lists.length > 0) {
      const lastList = lists[lists.length - 1];
      newPosition = lastList.position + 1;
    }

    const list = await this.listRepository.save({
      ...listDTO,
      board,
      position: newPosition
    });
    return list;
  }

  async getListById(id: string) {}

  async findOneByName(name: string) {
    const list = await this.listRepository.findOneBy({ name });
    return list;
  }
}
