import { UserJwtPayload } from 'src/interfaces/jwt-payload.interface';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Board } from './board.entity';
import { CreateBoardDTO } from './dto/CreateBoard.dto';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
    private userService: UsersService
  ) {}

  async createBoard(
    boardDTO: CreateBoardDTO,
    ownerData: UserJwtPayload
  ): Promise<Board> {
    const owner = await this.userService.getUserOrFail(ownerData.sub);
    const board = await this.boardRepository.save({ ...boardDTO, owner });
    return board;
  }

  async listBoards(): Promise<Board[]> {
    return await this.boardRepository.find();
  }

  async getBoard(boardId: string): Promise<Board> {
    return await this.getBoardOrFail(boardId);
  }

  async addUserInBoard(
    boardId: string,
    userId: string,
    emails: string[]
  ): Promise<object> {
    const board: Board = await this.getBoardOrFail(boardId);
    await this.requestUserIsOwner(userId, board);
    const aux = [];

    for (let email of emails) {
      const user = await this.userService.findOneByEmail(email);
      if (!user) {
        aux.push(email);
        continue;
      }
      if (board.users.some(u => u.id === user.id)) {
        aux.push(email);
        continue;
      }
      board.users = [...board.users, user];
    }

    await this.boardRepository.save(board);
    const addedUsers = emails.filter(email => !aux.includes(email));

    const dataForResponse = {};
    if (addedUsers.length > 0) {
      dataForResponse['added'] = `Usuários adicionados: ${addedUsers}`;
    }
    if (aux.length > 0) {
      dataForResponse['noAdded'] =
        `Os usuários a seguir não foram adicionados, por que não ` +
        `corresponderam a nenhum usuário cadastrado ou já fazem parte ` +
        `do quadro <${board.title}>: ${aux}`;
    }
    return dataForResponse;
  }

  async removeUsersOfBoard(
    boardId: string,
    userId: string,
    emails: string[]
  ): Promise<object> {
    const board: Board = await this.getBoardOrFail(boardId);
    await this.requestUserIsOwner(userId, board);
    const aux = [];

    for (let email of emails) {
      const user = await this.userService.findOneByEmail(email);
      if (!user) {
        aux.push(email);
        continue;
      }
      if (!board.users.some(u => u.id === user.id)) {
        aux.push(email);
        continue;
      }
      board.users = board.users.filter(user => user.email !== email);
    }

    await this.boardRepository.save(board);
    const removedUsers = emails.filter(email => !aux.includes(email));

    const dataForResponse = {};
    if (removedUsers.length > 0) {
      dataForResponse['removed'] = `Usuários removidos: ${removedUsers}`;
    }
    if (aux.length > 0) {
      dataForResponse['noRemoved'] =
        `Os usuários a seguir não foram removidos, por que não ` +
        `corresponderam a nenhum usuário cadastrado ou não fazem parte ` +
        `do quadro <${board.title}>: ${aux}`;
    }
    return dataForResponse;
  }

  async updateBoard(boardId: string, userId: string, data: Partial<Board>) {
    const board = await this.getBoardOrFail(boardId);
    await this.requestUserIsOwner(userId, board);

    const dataForUpdate = {};

    Object.entries(data).forEach(([key, value]) => {
      if (key === 'id' || key === 'owner' || key === 'users') {
        throw new BadRequestException('Alguma chave inserida é inválida');
      }
      dataForUpdate[key] = value;
    });

    await this.boardRepository.update(boardId, dataForUpdate);
    return dataForUpdate;
  }

  async deleteBoard(boardId: string, userId: string) {
    const board = await this.getBoardOrFail(boardId);
    await this.requestUserIsOwner(userId, board);
    await this.boardRepository.delete(board);

    return `O quadro ${board.title} foi deletado`;
  }

  async findOneByTitle(title: string) {
    const board = await this.boardRepository.findOneBy({ title });
    return board;
  }

  async getBoardOrFail(id: string): Promise<Board> {
    const board = await this.boardRepository.findOneBy({ id });
    if (!board) {
      throw new NotFoundException('Quadro não encontrado');
    }
    return board;
  }

  private async requestUserIsOwner(userId: string, board: Board) {
    const userRequest = await this.userService.getUserOrFail(userId);
    if (userRequest.id !== board.owner.id) {
      throw new UnauthorizedException(
        `Apenas o dono do Quadro <${board.title}> pode acessar esse recurso`
      );
    }
  }
}
