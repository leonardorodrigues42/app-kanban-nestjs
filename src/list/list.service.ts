import { BoardService } from 'src/board/board.service';
import { Repository } from 'typeorm';

import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
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

    let newPosition = 1;
    if (board.lists.length > 0) {
      const lastList = board.lists[board.lists.length - 1];
      newPosition = lastList.position + 1;
    }

    const list = this.listRepository.create({
      ...listDTO,
      board,
      position: newPosition
    });

    await this.listRepository.save(list);
    return list;
  }

  async getBoardLists(boardId: string) {
    return (await this.boardService.getBoardOrFail(boardId)).lists;
  }

  async getListById(id: string) {
    return await this.getListOrFail(id);
  }

  async deleteList(listId: string, userId: string) {
    const list = await this.getListOrFail(listId);
    const board = await this.boardService.getBoardByListId(listId);
    await this.boardService.checkBoardAccess(board.id, userId);
    await this.listRepository.remove(list);

    const currentLists = await this.listRepository.find({
      where: { board: { id: board.id } },
      order: { position: 'ASC' }
    });

    currentLists.forEach((l, i) => {
      l.position = i + 1;
    });

    await this.listRepository.save(currentLists);
    return {
      status: 'ok',
      message: 'Lista removida',
      currentLists
    };
  }

  async updateList(listId: string, userId: string, data: CreateListDTO) {
    const list = await this.getListOrFail(listId);
    const board = await this.boardService.getBoardByListId(listId);
    await this.boardService.checkBoardAccess(board.id, userId);
    this.listRepository.update(listId, data);
    await this.listRepository.save(list);

    const currentLists = await this.listRepository.find({
      where: { board: { id: board.id } },
      order: { position: 'ASC' }
    });

    currentLists.forEach((l, i) => {
      l.position = i + 1;
    });

    return currentLists;
  }

  async moveList(listId: string, userId: string, newPosition: number) {
    const list = await this.getListOrFail(listId);
    const board = await this.boardService.getBoardByListId(listId);
    await this.boardService.checkBoardAccess(board.id, userId);

    const currentLists = await this.listRepository.find({
      where: { board: { id: board.id } },
      order: { position: 'ASC' }
    });

    if (newPosition < 0 || newPosition >= currentLists.length) {
      throw new BadRequestException(`Invalid position: ${newPosition}`);
    }
    currentLists.splice(list.position - 1, 1);
    currentLists.splice(newPosition - 1, 0, list);

    currentLists.forEach((l, i) => {
      l.position = i + 1;
    });
    await this.listRepository.save(currentLists);

    return currentLists;
  }

  async getListOrFail(id: string) {
    const list = await this.listRepository.findOneBy({ id });
    if (!list) {
      throw new NotFoundException('Lista não encontrada');
    }
    return list;
  }

  async findOneByName(name: string) {
    const list = await this.listRepository.findOneBy({ name });
    return list;
  }
}
