import {
  IsString,
  IsUrl,
  MaxLength
} from 'class-validator';

import {
  BoardAlreadyExistsValidator
} from '../validators/board-already-exists.validator';

export class CreateBoardDTO {
  @IsString()
  @BoardAlreadyExistsValidator({ message: 'Já existe um quadro com esse nome' })
  @MaxLength(60, { message: 'O título não pode ter mais de 60 caracteres' })
  title: string;

  @IsUrl()
  backgroundImageUrl: string;
}
