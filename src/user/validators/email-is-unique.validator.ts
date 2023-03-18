import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';

import { Injectable } from '@nestjs/common';

import { UserService } from '../user.service';

@Injectable()
@ValidatorConstraint()
export class EmailIsUnique implements ValidatorConstraintInterface {
  constructor(private userService: UserService) {}
  async validate(value: any): Promise<boolean> {
    const findUser = await this.userService.emailAlreadyExists(value);
    return !!!findUser;
  }
}

export const EmailAlreadyExistsValidator = (
  validationOptions: ValidationOptions
) => {
  return (object: object, property: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: property,
      options: validationOptions,
      constraints: [],
      validator: EmailIsUnique
    });
  };
};
