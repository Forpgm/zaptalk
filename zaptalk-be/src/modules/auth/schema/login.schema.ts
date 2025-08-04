import { AUTH_MESSAGES } from 'src/constants/messages';
import { z } from 'zod';

export const loginSchema = z.object({
  emailOrPhone: z.string({
    error: AUTH_MESSAGES.EMAILORPHONE_IS_REQUIRED,
  }),
  password: z
    .string({
      error: AUTH_MESSAGES.PASSWORD_MUST_BE_STRING,
    })
    .refine((value: string) => value.length >= 6, {
      error: AUTH_MESSAGES.PASSWORD_MUST_BE_STRONG,
      abort: true,
    }),
});

export type loginType = z.infer<typeof loginSchema>;
