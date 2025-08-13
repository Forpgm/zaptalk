import { CHAT_MESSAGES } from 'src/constants/messages';
import { z } from 'zod';

export const sendTextSchema = z.object({
  channelId: z.string({
    error: CHAT_MESSAGES.CHANNEL_ID_IS_REQUIRED,
  }),
  message: z.string({
    error: CHAT_MESSAGES.MESSAGE_IS_REQUIRED,
  }),
});

export type sendTextType = z.infer<typeof sendTextSchema>;
