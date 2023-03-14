import { v4 as uuid } from 'uuid';

import { Injectable } from '@nestjs/common';

import { CreateUserDTO } from './dto/CreateUser.dto';
import { UserEntity } from './users.entity';

@Injectable()
export class UserRepository {
  private users: UserEntity[] = [];

  async save(userDTO: CreateUserDTO) {
    const user = new UserEntity();
    user.id = uuid();
    user.name = userDTO.name;
    user.email = userDTO.email;
    user.password = userDTO.password;
    this.users.push(user);
    return user;
  }

  async list() {
    return this.users;
  }

  async getUser(id: string) {
    const user = this.users.find((user) => user.id === id);
  }

  async emailAlreadyExists(email: string) {
    const user = this.users.find((user) => user.email === email);

    if (user !== undefined) {
      return true;
    }

    return false;
  }

  async updateUser(id: string, data: Partial<UserEntity>) {
    const user = this.users.find((user) => user.id === id);

    if (!user) {
      throw new Error('Esse usuário não existe');
    }

    Object.entries(data).forEach(([key, value]) => {
      if (key === 'id') {
        return;
      }
      user[key] = value;
    });
    return user;
  }
}
