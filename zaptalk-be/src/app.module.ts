import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './modules/mail/mail.module';

@Module({
  imports: [AuthModule, MailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
