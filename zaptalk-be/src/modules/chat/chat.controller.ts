import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { ChatService } from './chat.service';
import { GetCurrentUser } from 'src/decorators/get-current-user.decorator';
import { users } from 'generated/prisma';
import { CreateChatDto } from './dto/create-chat.dto';
import { ZodValidationPipe } from 'src/pipe/zodValidationPipe';
import { createChatSchema } from './schema/create-chat.schema';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SendTextDto } from './dto/send-text.dto';
import { sendTextSchema } from './schema/send-text.schema';
import { deleteChatDto } from './dto/delete-chat.dto';
import { deleteChatSchema } from './schema/delete-chat.schema';

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

  @ApiBody({ type: SendTextDto })
  @ApiOperation({ summary: 'user sends a message in a chat.' })
  @Post('/message')
  @UseGuards(AccessTokenGuard)
  async sendMessage(
    @GetCurrentUser() user: users,
    @Body(new ZodValidationPipe(sendTextSchema)) body: SendTextDto,
  ) {
    return await this.chatService.sendMessage(user.id, body);
  }
  @ApiBody({ type: deleteChatDto })
  @ApiOperation({ summary: 'user deletes a chat.' })
  @Delete('')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    schema: {
      example: {
        statusCode: 200,
        message: 'Success',
      },
    },
  })
  @UseGuards(AccessTokenGuard)
  async deleteChat(
    @GetCurrentUser() user: users,
    @Body(new ZodValidationPipe(deleteChatSchema)) body: deleteChatDto,
  ) {
    return await this.chatService.deleteChat(body);
  }
}
