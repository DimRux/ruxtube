import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '@prisma/__generated__/client';
import { UserRole } from '@prisma/__generated__/enums';
import { Request } from 'express';
import { Observable } from 'rxjs';

import { ROLES_KEY } from '../decorators/roles.decorator';

interface RequestWithUser extends Request {
  user?: User;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const request = context.switchToHttp().getRequest() as RequestWithUser;

    if (!roles) {
      return true;
    }

    if (!request.user) {
      throw new UnauthorizedException('Пользователь не авторизован.');
    }

    if (!roles.includes(request.user.role)) {
      throw new ForbiddenException('Недостаточно прав');
    }

    return true;
  }
}
