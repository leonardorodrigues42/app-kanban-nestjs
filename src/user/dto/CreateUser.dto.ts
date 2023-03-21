import {
  IsEmail,
  IsUrl,
  MaxLength,
  MinLength
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import {
  EmailAlreadyExistsValidator
} from '../validators/email-is-unique.validator';

export class CreateUserDTO {
  @ApiProperty()
  @MinLength(3, { message: 'Nome precisa ter pelo menos 3 caractes' })
  @MaxLength(60, { message: 'Nome não pode ter mais de 60' })
  name: string;

  @ApiProperty()
  @IsEmail({}, { message: 'E-mail inválido' })
  @EmailAlreadyExistsValidator({
    message: 'Já existe um usuário com este e-mail'
  })
  email: string;

  @ApiProperty()
  @MinLength(6)
  @MaxLength(20)
  password: string;

  @ApiProperty()
  @IsUrl()
  photoUrl: string;
}
