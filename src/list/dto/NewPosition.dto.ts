import {
  IsNumber,
  Min
} from 'class-validator';

export class NewPositionDTO {
  @IsNumber()
  @Min(1, { message: 'Somente numeros inteiros maior ou igual a 1' })
  newPosition: number;
}
