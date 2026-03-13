import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/__generated__/client';
import { AuthMethod } from '@prisma/__generated__/enums';
import { verify } from 'argon2';
import { Request, Response } from 'express';

import { UserService } from '@/user/user.service';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  public constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  public async register(req: Request, dto: RegisterDto) {
    const isExists = await this.userService.findByEmail(dto.email);

    if (isExists) {
      throw new ConflictException('Регистрация не удалась. Такой email уже используется');
    }

    const newUser = await this.userService.create({
      email: dto.email,
      displayName: dto.name,
      password: dto.password,
      picture: '',
      method: AuthMethod.CREDENTIALS,
      isVerified: false,
    });

    return this.saveSession(req, newUser);
  }

  public async login(req: Request, dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);

    if (!user || !user.password) {
      throw new NotFoundException('Пользователь не найден');
    }

    const isValidPassword = await verify(user.password, dto.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Неверный пароль');
    }

    return this.saveSession(req, user);
  }

  public async logout(req: Request, res: Response): Promise<void> {
    return new Promise((resolve, reject) => {
      req.session.destroy((error) => {
        console.log(error);
        if (error) {
          return reject(new InternalServerErrorException('Не удалось завершить сессию'));
        }
        res.clearCookie(this.configService.getOrThrow<string>('SESSION_NAME'));
        resolve();
      });
    });
  }

  public async saveSession(req: Request, user: User) {
    return new Promise((resolve, reject) => {
      req.session.userId = user.id;
      req.session.save((error) => {
        console.log(error);
        if (error) {
          return reject(new InternalServerErrorException('Не удалось сохранить сессию'));
        }
        resolve({ user });
      });
    });
  }
}
