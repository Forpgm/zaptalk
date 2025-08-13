import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';
import { sendTextSchema } from '../schema/send-text.schema';

export class SendTextDto extends createZodDto(sendTextSchema) {
  @ApiProperty({
    description: 'Message to be sent',
    type: String,
  })
  message: string;
  @ApiProperty({
    description: 'Channel ID to send the message to',
    type: String,
  })
  channelId: string;
}
