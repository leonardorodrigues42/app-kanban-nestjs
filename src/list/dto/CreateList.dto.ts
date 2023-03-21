import { IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import {
  ListAlreadyExistsValidator
} from '../validators/list-already-exists.validator';

export class CreateListDTO {
  @ApiProperty()
  @IsString()
  @ListAlreadyExistsValidator({
    message: 'Já existe uma lista com o nome informado'
  })
  name: string;
}
