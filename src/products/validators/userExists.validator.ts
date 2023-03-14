import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UserRepository } from 'src/users/users.repository';

import { Injectable } from '@nestjs/common';

@Injectable()
@ValidatorConstraint()
export class UserExistsValidator implements ValidatorConstraintInterface {
  constructor(private userRepository: UserRepository) {}
  async validate(value: any): Promise<boolean> {
    const users = await this.userRepository.list();
    const findUser = users.find((user) => user.id === value);
    return findUser !== undefined;
  }
}

export const UserExists = (validationOptions: ValidationOptions) => {
  return (object: object, property: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: property,
      options: validationOptions,
      constraints: [],
      validator: UserExistsValidator,
    });
  };
};
