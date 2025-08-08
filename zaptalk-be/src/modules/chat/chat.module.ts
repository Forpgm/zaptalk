import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [ChatService],
  controllers: [ChatController],
  exports: [ChatService],
  imports: [ConfigModule],
})
export class ChatModule {}
