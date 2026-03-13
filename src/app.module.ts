import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { IS_DEV_ENV } from './libs/common/utils/isDev';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ ignoreEnvFile: !IS_DEV_ENV, expandVariables: true, isGlobal: true }),
    PrismaModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
