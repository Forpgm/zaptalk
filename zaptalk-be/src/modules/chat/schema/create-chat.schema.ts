import { CHAT_MESSAGES } from 'src/constants/messages';
import { z } from 'zod';

export const createChatSchema = z.object({
  members: z
    .array(
      z.string({
        error: CHAT_MESSAGES.MEMBERS_ARE_REQUIRED,
      }),
    )
    .min(2, {
      message: CHAT_MESSAGES.MIN_MEMBERS_REQUIRED,
    })
    .refine((members) => members.length <= 30, {
      message: CHAT_MESSAGES.MAX_MEMBERS_EXCEEDED,
    }),
  name: z.string({
    error: CHAT_MESSAGES.CHANNEL_NAME_IS_REQUIRED,
  }),
  thumbnail: z
    .url({
      message: CHAT_MESSAGES.THUMBNAIL_MUST_BE_VALID_URL,
    })
    .optional(),
});

export type createChatType = z.infer<typeof createChatSchema>;
