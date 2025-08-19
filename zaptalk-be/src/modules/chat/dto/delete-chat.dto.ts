import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';
import { deleteChatSchema } from '../schema/delete-chat.schema';

export class deleteChatDto extends createZodDto(deleteChatSchema) {
  message: string;
  @ApiProperty({
    description: 'Channel ID to send the message to',
    type: String,
  })
  channelId: string;
}
