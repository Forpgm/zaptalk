import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { ChatService } from './chat.service';
import { GetCurrentUser } from 'src/decorators/get-current-user.decorator';
import { users } from 'generated/prisma';
import { CreateChatDto } from './dto/create-chat.dto';
import { ZodValidationPipe } from 'src/pipe/zodValidationPipe';
import { createChatSchema } from './dto/schema/create-chat.schema';
import { ApiBody } from '@nestjs/swagger';

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('')
  @UseGuards(AccessTokenGuard)
  async getAllChats(@GetCurrentUser() user: users) {
    return await this.chatService.getChannels(user.id);
  }

  @ApiBody({ type: CreateChatDto })
  @Post('')
  @UseGuards(AccessTokenGuard)
  async createChat(
    @GetCurrentUser() user: users,
    @Body(new ZodValidationPipe(createChatSchema)) body: CreateChatDto,
  ) {
    return await this.chatService.createChannel(user.id, body);
  }
}
