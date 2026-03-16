import { Controller, Get, Param } from '@nestjs/common';
import { UserRole } from '@prisma/__generated__/enums';

import { Authorization } from '@/auth/decorators/auth.decorator';
import { Authorizated } from '@/auth/decorators/authorized.decorator';

import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Authorization()
  @Get('profile')
  public async findProfile(@Authorizated('id') userId: string) {
    return this.userService.findById(userId);
  }

  @Authorization(UserRole.ADMIN)
  @Get('id')
  public async findById(@Param('id') id: string) {
    return this.userService.findById(id);
  }
}
