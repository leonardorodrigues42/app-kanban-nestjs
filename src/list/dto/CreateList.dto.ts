import { IsString } from 'class-validator';

import {
  ListAlreadyExistsValidator
} from '../validators/list-already-exists.validator';

export class CreateListDTO {
  @IsString()
  @ListAlreadyExistsValidator({
    message: 'Já existe uma lista com o nome informado'
  })
  name: string;
}
