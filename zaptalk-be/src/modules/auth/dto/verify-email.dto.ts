import { createZodDto } from 'nestjs-zod';
import { emailVerifySchema } from '../schema/verify-email.schema';

export class EmailVerifyDto extends createZodDto(emailVerifySchema) {}
