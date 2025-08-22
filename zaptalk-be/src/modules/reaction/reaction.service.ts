import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AddReactionDto } from './dto/add-reaction.dto';
import { users } from '@prisma/client';
import { StreamChat } from 'stream-chat';
import { REACTION_MESSAGES } from 'src/constants/messages';

@Injectable()
export class ReactionService {
  constructor(
    @Inject('STREAM_CLIENT') private readonly streamClient: StreamChat,
  ) {}
  async addReaction(body: AddReactionDto, user: users) {
    const existingMessage = await this.streamClient.getMessage(body.messageId);
    if (!existingMessage) {
      throw new NotFoundException(REACTION_MESSAGES.MESSAGE_NOT_FOUND);
    }

    const channel = this.streamClient.channel('messaging', body.channelId);

    return await channel.sendReaction(
      body.messageId,
      { type: 'love', user_id: user.id },
      { enforce_unique: true },
    );
  }
}
