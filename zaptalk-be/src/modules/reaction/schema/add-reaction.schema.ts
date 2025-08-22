import { REACTION_MESSAGES } from 'src/constants/messages';
import * as z from 'zod';

export const addReactionSchema = z.object({
  messageId: z
    .string({
      error: REACTION_MESSAGES.MESSAGE_ID_IS_REQUIRED,
    })
    .nonempty(),
  channelId: z
    .string({
      error: REACTION_MESSAGES.CHANNEL_ID_IS_REQUIRED,
    })
    .nonempty(),
  type: z.string({
    error: REACTION_MESSAGES.REACTION_TYPE_IS_REQUIRED,
  }),
});
export type addReactionType = z.infer<typeof addReactionSchema>;
