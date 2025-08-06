import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './modules/mail/mail.module';
import { UsersModule } from './modules/users/users.module';
import { RedisModule } from './modules/redis/redis.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [AuthModule, MailModule, UsersModule, RedisModule, ConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
