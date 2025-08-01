import { createZodDto } from 'nestjs-zod';
import { registerSchema } from '../schema/register.schema';

export class RegisterDto extends createZodDto(registerSchema) {}
