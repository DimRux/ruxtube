import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { RegisterDto } from '@/auth/dto/register.dto';

@ValidatorConstraint({ name: 'IsPasswordMatchingConstaint', async: false })
export class IsPasswordMatchingConstaint implements ValidatorConstraintInterface {
  public validate(
    passwordRepeat: string,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> | boolean {
    const obj = validationArguments?.object as RegisterDto;
    return obj.password === passwordRepeat;
  }

  public defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Пароли не совпадают';
  }
}
