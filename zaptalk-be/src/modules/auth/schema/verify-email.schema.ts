import { AUTH_MESSAGES } from 'src/constants/messages';
import { z } from 'zod';

export const emailVerifySchema = z.object({
  email_verify_token: z.string({
    error: AUTH_MESSAGES.EMAIL_VERIFY_TOKEN_IS_INVALID,
  }),
});

export type emailVerifyType = z.infer<typeof emailVerifySchema>;
