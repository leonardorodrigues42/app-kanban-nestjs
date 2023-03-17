import { hashSync } from 'bcrypt';
import { Repository } from 'typeorm';

import {
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateUserDTO } from './dto/CreateUser.dto';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  async createUser(userDTO: CreateUserDTO): Promise<User> {
    const user = this.usersRepository.create(userDTO);
    user.password = hashSync(userDTO.password, 10);
    await this.usersRepository.save(user);
    return user;
  }

  async listUsers(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async getUser(userId: string): Promise<User> {
    const user = await this.getUserOrFail(userId);
    return user;
  }

  async updateUser(userId: string, requestUserId: string, data: Partial<User>) {
    const user = await this.getUserOrFail(userId);
    await this.requestUserIsOwner(requestUserId, user);
    const dataForUpdate = {};

    Object.entries(data).forEach(([key, value]) => {
      if (key === 'id') {
        return;
      }
      dataForUpdate[key] = value;
    });

    await this.usersRepository.update(userId, dataForUpdate);
    return dataForUpdate;
  }

  async deleteUser(userId: string, requestUserId: string) {
    const user = await this.getUserOrFail(userId);
    await this.requestUserIsOwner(requestUserId, user);
    await this.usersRepository.remove(user);
    return `Usuário deletado`;
  }

  async emailAlreadyExists(email: string): Promise<boolean> {
    const user = await this.usersRepository.findOneBy({ email });
    if (user !== null) {
      return true;
    }
    return false;
  }

  async getUserOrFail(id: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException({
        message: 'Usuário não encontrado'
      });
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ email });
    return user;
  }

  private async requestUserIsOwner(userIdForDel: string, user: User) {
    if (user.id !== userIdForDel) {
      console.log(userIdForDel, user.id);
      throw new UnauthorizedException(
        `Somente o próprio usuário pode realizar essa operação`
      );
    }
  }
}
