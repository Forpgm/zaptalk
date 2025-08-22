import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './modules/mail/mail.module';
import { UsersModule } from './modules/users/users.module';
import { RedisModule } from './modules/redis/redis.module';
import { ConfigModule } from '@nestjs/config';
import { ChatModule } from './modules/chat/chat.module';
import { ReactionModule } from './modules/reaction/reaction.module';
import { StreamModule } from './modules/stream/stream.module';

@Module({
  imports: [
    AuthModule,
    MailModule,
    UsersModule,
    RedisModule,
    ConfigModule,
    ChatModule,
    ReactionModule,
    StreamModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
