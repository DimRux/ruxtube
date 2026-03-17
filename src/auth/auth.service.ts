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

import { PrismaService } from '@/prisma/prisma.service';
import { UserService } from '@/user/user.service';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ProviderService } from './provider/provider.service';

@Injectable()
export class AuthService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly providerSrvice: ProviderService,
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

  public async extractProfileFromCode(req: Request, provider: string, code: string) {
    const providerInstance = this.providerSrvice.findByService(provider);
    if (!providerInstance) {
      throw new InternalServerErrorException('Не удалось авторизоваться');
    }
    const profile = await providerInstance.findUserByCode(code);

    const account = await this.prismaService.account.findFirst({
      where: {
        id: profile.id,
        provider: profile.provider,
      },
    });

    let user = account?.userId ? await this.userService.findById(account.userId) : null;

    if (user) {
      return this.saveSession(req, user);
    }

    user = await this.userService.create({
      email: profile.email,
      displayName: profile.name,
      password: '',
      picture: profile.picture,
      method: AuthMethod[profile.provider.toUpperCase()],
      isVerified: true,
    });

    if (!account) {
      await this.prismaService.account.create({
        data: {
          userId: user.id,
          type: 'oauth',
          provider: profile.provider,
          accessToken: profile.access_token,
          refreshToken: profile.refresh_token,
          expiresAt: profile.expires_at ?? 0,
        },
      });
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
