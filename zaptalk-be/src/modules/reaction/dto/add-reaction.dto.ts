import { createZodDto } from 'nestjs-zod';
import { ApiProperty } from '@nestjs/swagger';
import { addReactionSchema } from '../schema/add-reaction.schema';

export class AddReactionDto extends createZodDto(addReactionSchema) {
  @ApiProperty({
    description: 'Id of message',
    type: String,
  })
  messageId: string;
  @ApiProperty({
    description: 'Channel ID',
    type: String,
  })
  channelId: string;
  @ApiProperty({
    description: 'Reaction type',
    type: String,
  })
  type: string;
}
