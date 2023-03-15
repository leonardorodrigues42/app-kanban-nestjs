import { hashSync } from 'bcrypt';
import { Repository } from 'typeorm';

import {
  Injectable,
  NotFoundException,
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

  async save(userDTO: CreateUserDTO): Promise<User> {
    const user = this.usersRepository.create(userDTO)
    user.password = hashSync(userDTO.password, 10)
    await this.usersRepository.save(user)
    return user;
  }

  async list(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async getUser(id: string): Promise<User> {
    console.log(id)
    const user = await this.getUserOrFail(id['id'])
    return user
  }
  
  async updateUser(id: string, data: Partial<User>) {
    await this.getUserOrFail(id)    
    
    const dataForUpdate = {}
    
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'id' || key === 'id') {
        return;
      }
      dataForUpdate[key] = value;
    });

    await this.usersRepository.update(id, dataForUpdate)
    return dataForUpdate
  }

  async emailAlreadyExists(email: string) {
    const user = await this.usersRepository.findOneBy({email});
    if (user !== null) {
      return true;
    }

    return false;
  }

  async getUserOrFail(id: string) {
    const user = await this.usersRepository.findOneBy({id});
    if (user === null) {
      throw new NotFoundException({
        message: "O usuário não foi encontrádo"
      })
    }

    return user;
  }
}
