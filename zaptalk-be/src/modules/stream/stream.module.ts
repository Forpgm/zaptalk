// stream.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StreamChat } from 'stream-chat';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'STREAM_CLIENT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return StreamChat.getInstance(
          configService.getOrThrow<string>('API_KEY'),
          configService.getOrThrow<string>('API_SECRET'),
        );
      },
    },
  ],
  exports: ['STREAM_CLIENT'],
})
export class StreamModule {}
