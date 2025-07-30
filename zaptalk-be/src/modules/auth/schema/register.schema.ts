import { PHONE_REGEX } from 'src/constants/constant';
import { AUTH_MESSAGES } from 'src/constants/messages';
import { z } from 'zod';

export const registerSchema = z.object({
  first_name: z
    .string({ error: AUTH_MESSAGES.FIRST_NAME_MUST_BE_STRING })
    .trim()
    .min(2, {
      error: AUTH_MESSAGES.FIRST_NAME_MUST_BE_AT_LEAST_2_CHARACTERS,
    })
    .max(30, {
      error: AUTH_MESSAGES.FIRST_NAME_MUST_BE_AT_MOST_30_CHARACTERS,
    }),
  last_name: z
    .string({ error: AUTH_MESSAGES.LAST_NAME_MUST_BE_STRING })
    .trim()
    .min(2, AUTH_MESSAGES.LAST_NAME_MUST_BE_AT_LEAST_2_CHARACTERS)
    .max(30, AUTH_MESSAGES.LAST_NAME_MUST_BE_AT_MOST_30_CHARACTERS),
  username: z
    .string({ error: AUTH_MESSAGES.USERAME_MUST_BE_STRING })
    .min(3, { error: AUTH_MESSAGES.USERNAME_MUST_BE_AT_LEAST_3_CHARACTERS })
    .max(20, { error: AUTH_MESSAGES.USERNAME_MUST_BE_AT_MOST_20_CHARACTERS })
    .regex(/^[a-zA-Z0-9_]+$/, {
      error: AUTH_MESSAGES.USERNAME_IS_INVALID,
    }),
  email: z.email(AUTH_MESSAGES.EMAIL_MUST_BE_VALID),
  phone_number: z
    .string({
      error: AUTH_MESSAGES.PHONE_NUMBER_IS_REQUIRED,
    })
    .regex(PHONE_REGEX, {
      message: AUTH_MESSAGES.PHONE_NUMBER_MUST0_BE_VALID,
    }),
  password: z
    .string({ error: AUTH_MESSAGES.PASSWORD_IS_REQUIRED })
    .refine((value: string) => value.length >= 6, {
      error: AUTH_MESSAGES.PASSWORD_MUST_BE_STRONG,
      abort: true,
    }),
});

export type RegisterType = z.infer<typeof registerSchema>;
