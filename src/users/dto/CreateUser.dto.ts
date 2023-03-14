import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

import { EmailAlreadyExistsValidator } from '../validators/emailIsUnique.validator';

export class CreateUserDTO {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @EmailAlreadyExistsValidator({
    message: 'Já existe um usuário com este e-mail',
  })
  email: string;

  @MinLength(6)
  password: string;
}
