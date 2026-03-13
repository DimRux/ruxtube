import { IsEmail, IsNotEmpty, IsString, MinLength, Validate } from 'class-validator';

import { IsPasswordMatchingConstaint } from '@/libs/common/decorators/isPasswordMatchingConstaint';

export class RegisterDto {
  @IsString({ message: 'Имя должно быть строкой' })
  @IsNotEmpty({ message: 'Имя обязательно для заполнения' })
  name: string;

  @IsString({ message: 'Email должнен быть строкой' })
  @IsEmail({}, { message: 'Некорректный формат email' })
  @IsNotEmpty({ message: 'Email обязателен для заполнения' })
  email: string;

  @IsString({ message: 'Пароль должнен быть строкой' })
  @IsNotEmpty({ message: 'Пароль обязательнен для заполнения' })
  @MinLength(6, { message: 'Пароль должен содержать минимум 6 символов' })
  password: string;

  @IsString({ message: 'Пароль подтверждения должнен быть строкой' })
  @IsNotEmpty({ message: 'Пароль подтверждения пароля не может быть пустым' })
  @MinLength(6, { message: 'Пароль подтверждения должен содержать минимум 6 символов' })
  @Validate(IsPasswordMatchingConstaint, { message: 'Пароли не совпадают' })
  passwordRepeat: string;
}
