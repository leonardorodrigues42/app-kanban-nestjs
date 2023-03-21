import {
  IsString,
  IsUrl,
  MaxLength
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import {
  BoardAlreadyExistsValidator
} from '../validators/board-already-exists.validator';

export class CreateBoardDTO {
  @ApiProperty()
  @IsString()
  @BoardAlreadyExistsValidator({ message: 'Já existe um quadro com esse nome' })
  @MaxLength(60, { message: 'O título não pode ter mais de 60 caracteres' })
  title: string;

  @ApiProperty()
  @IsUrl()
  backgroundImageUrl: string;
}
