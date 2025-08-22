import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ConfigModule } from '@nestjs/config';
import { StreamModule } from '../stream/stream.module';

@Module({
  providers: [ChatService],
  controllers: [ChatController],
  exports: [ChatService],
  imports: [ConfigModule, StreamModule],
})
export class ChatModule {}
