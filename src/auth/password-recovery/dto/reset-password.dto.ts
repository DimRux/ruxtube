import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail({}, { message: 'Введите корректный адрес email' })
  @IsNotEmpty({ message: 'Поле email обязателен для заполнения' })
  email: string;
}
