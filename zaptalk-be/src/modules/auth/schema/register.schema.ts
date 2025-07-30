import { PHONE_REGEX } from 'src/constants/constant';
import { AUTH_MESSAGES } from 'src/constants/messages';
import { z } from 'zod';

export const registerSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(2, AUTH_MESSAGES.FIRST_NAME_MUST_BE_AT_LEAST_2_CHARACTERS)
    .max(30, AUTH_MESSAGES.FIRST_NAME_MUST_BE_AT_MOST_30_CHARACTERS)
    .nonempty(AUTH_MESSAGES.FIRST_NAME_IS_REQUIRED),
  last_name: z
    .string()
    .trim()
    .min(2, AUTH_MESSAGES.LAST_NAME_MUST_BE_AT_LEAST_2_CHARACTERS)
    .max(30, AUTH_MESSAGES.LAST_NAME_MUST_BE_AT_MOST_30_CHARACTERS)
    .nonempty(AUTH_MESSAGES.LAST_NAME_IS_REQUIRED),
  username: z.string(),
  email: z
    .email(AUTH_MESSAGES.EMAIL_MUST_BE_VALID)
    .nonempty(AUTH_MESSAGES.EMAIL_IS_REQUIRED),
  phone_number: z
    .string()
    .regex(PHONE_REGEX, {
      message: AUTH_MESSAGES.PHONE_NUMBER_MUST0_BE_VALID,
    })
    .nonempty(AUTH_MESSAGES.PHONE_NUMBER_IS_REQUIRED),
});
