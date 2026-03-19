import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmationDto {
  @IsString({ message: 'Токен должнен быть строкой' })
  @IsNotEmpty({ message: 'Токен не может быть пустым' })
  token: string;
}
