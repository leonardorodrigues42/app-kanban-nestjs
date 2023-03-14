import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

import { UserExists } from '../validators/userExists.validator';

export class CreateProductDTO {
  @IsUUID()
  @UserExists({ message: 'UserId não corresponde a nenhum usuário cadastrado' })
  userId: string;

  @IsNotEmpty()
  name: string;

  @IsNumber({ maxDecimalPlaces: 2, allowNaN: false, allowInfinity: false })
  @Min(1, { message: 'Nome do produto não pode ser vazio' })
  value: number;

  @IsNumber()
  @Min(0, { message: 'O valor precisa ser maior que zero' })
  quantity: number;

  @IsString()
  @IsNotEmpty({
    message:
      'Descrição do produto não pode ser vazia ou maior que 1000 caracteres',
  })
  @MaxLength(1000, {
    message:
      'A descrição do produto não pode ser vazia ou maior que 1000 caracteres',
  })
  description: string;

  @ValidateNested()
  @IsArray()
  @ArrayMinSize(3)
  @Type(() => CharacteristicsDTO)
  characteristics: CharacteristicsDTO[];

  @ValidateNested()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => ImagesDTO)
  images: ImagesDTO[];

  @IsString()
  @IsNotEmpty({ message: 'Categoria do produto não pode ser vazia' })
  category: string;
}

class CharacteristicsDTO {
  @IsString()
  @IsNotEmpty({ message: 'Nome da carasterística não pode ser vazio' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Descrição da característica não pode ser vazio' })
  description: string;
}

class ImagesDTO {
  @IsUrl()
  url: string;

  @IsString()
  @IsNotEmpty({ message: 'Descrição da imagem não pode ser vazia' })
  description: string;
}
