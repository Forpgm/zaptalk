import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Channel, ChannelData, StreamChat } from 'stream-chat';
import { v4 as uuidv4 } from 'uuid';
import { CreateChatDto } from './dto/create-chat.dto';
import { SendTextDto } from './dto/send-text.dto';
import { users } from '@prisma/client';

@Injectable()
export class ChatService {
  private readonly serverClient: StreamChat;
  constructor(private readonly configService: ConfigService) {
    this.serverClient = StreamChat.getInstance(
      this.configService.getOrThrow<string>('API_KEY'),
      this.configService.getOrThrow<string>('API_SECRET'),
    );
  }

  generateToken(userId: string): string {
    return this.serverClient.createToken(userId);
  }

  async getChannels(user_id: string) {
    const filter = { type: 'messaging', members: { $in: [user_id] } };
    const sort = [{ last_message_at: -1 }];

    const channels = await this.serverClient.queryChannels(filter, sort, {
      watch: true,
      state: true,
    });

    return channels.map((channel: Channel) => ({
      id: channel.id,
      members: channel.data?.members,
      created_by: channel.data?.created_by || '',
      last_message_at: channel.data?.last_message_at || '',
      channelName:
        channel.data &&
        'name' in channel.data &&
        typeof channel.data.name === 'string'
          ? channel.data.name
          : null,
    }));
  }

  async getChannelMessages(channelId: string) {
    const channel = this.serverClient.channel('messaging', channelId);
    const messages = await channel.query({ messages: { limit: 50 } });
    return messages;
  }

  async createChannel(created_by_id: string, body: CreateChatDto) {
    const { members, name, thumbnail } = body;
    const uniqueUserIds = Array.from(new Set([...members, created_by_id]));
    for (const userId of uniqueUserIds) {
      await this.serverClient.upsertUser({ id: userId });
    }
    const channelId = uuidv4();
    const channel = this.serverClient.channel('messaging', channelId, {
      members,
      created_by_id,
      name,
      image: thumbnail,
    } as ChannelData);
    await channel.create();
    return {
      channelId: channel.data?.id,
      channelType: channel.data?.type,
      channelName:
        channel.data &&
        'name' in channel.data &&
        typeof channel.data.name === 'string'
          ? channel.data.name
          : null,
      members: channel.data?.members || [],
      createdById: channel.data?.created_by || '',
    };
  }

  async sendMessage(user_id: string, body: SendTextDto) {
    const channel = this.serverClient.channel('messaging', body.channelId);
    const message = await channel.sendMessage({
      text: body.message,
      user_id,
    });
    return message;
  }
}
