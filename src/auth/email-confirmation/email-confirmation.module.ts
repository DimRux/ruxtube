import { forwardRef, Module } from '@nestjs/common';

import { MailModule } from '@/libs/mail/mail.module';

import { AuthModule } from '../auth.module';

import { EmailConfirmationController } from './email-confirmation.controller';
import { EmailConfirmationService } from './email-confirmation.service';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [MailModule, UserModule, forwardRef(() => AuthModule)],
  controllers: [EmailConfirmationController],
  providers: [EmailConfirmationService],
  exports: [EmailConfirmationService],
})
export class EmailConfirmationModule {}
