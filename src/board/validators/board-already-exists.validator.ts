import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';

import { Injectable } from '@nestjs/common';

import { BoardService } from '../board.service';

@Injectable()
@ValidatorConstraint()
export class TitleIsUnique implements ValidatorConstraintInterface {
  constructor(private boardService: BoardService) {}
  async validate(value: any): Promise<boolean> {
    const board = await this.boardService.findOneByTitle(value);
    return !!!board;
  }
}

export const BoardAlreadyExistsValidator = (
  validationOptions: ValidationOptions
) => {
  return (object: object, property: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: property,
      options: validationOptions,
      constraints: [],
      validator: TitleIsUnique
    });
  };
};
