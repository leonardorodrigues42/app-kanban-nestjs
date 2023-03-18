import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';

import { Injectable } from '@nestjs/common';

import { ListService } from '../list.service';

@Injectable()
@ValidatorConstraint()
export class NameIsUnique implements ValidatorConstraintInterface {
  constructor(private listService: ListService) {}
  async validate(value: any): Promise<boolean> {
    const board = await this.listService.findOneByName(value);
    return !!!board;
  }
}

export const ListAlreadyExistsValidator = (
  validationOptions: ValidationOptions
) => {
  return (object: object, property: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: property,
      options: validationOptions,
      constraints: [],
      validator: NameIsUnique
    });
  };
};
