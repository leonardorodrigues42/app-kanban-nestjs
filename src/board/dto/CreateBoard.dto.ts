import {
  IsString,
  IsUrl,
  MaxLength
} from 'class-validator';

export class CreateBoardDTO {
  @IsString()
  @MaxLength(60, { message: 'O título não pode ter mais de 60 caracteres' })
  title: string;

  @IsUrl()
  backgroundImageUrl: string;
}
