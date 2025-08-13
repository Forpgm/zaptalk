import { createZodDto } from 'nestjs-zod';
import { createChatSchema } from '../schema/create-chat.schema';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChatDto extends createZodDto(createChatSchema) {
  @ApiProperty({
    description: 'List of user IDs to be added to the chat',
    type: [String],
  })
  members: string[];
  @ApiProperty({
    description: 'Name of the chat room',
    type: String,
  })
  name: string;
  @ApiProperty({
    description: 'Thumbnail for the chat',
    type: String,
    required: false,
  })
  thumbnail?: string;
}
