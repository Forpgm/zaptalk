import { CHAT_MESSAGES } from 'src/constants/messages';
import { z } from 'zod';

export const deleteChatSchema = z.object({
  channelId: z.string({
    error: CHAT_MESSAGES.CHANNEL_ID_IS_REQUIRED,
  }),
});

export type deleteChatType = z.infer<typeof deleteChatSchema>;
