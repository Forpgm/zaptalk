import { createZodDto } from 'nestjs-zod';
import { loginSchema } from '../schema/login.schema';

export class LoginDto extends createZodDto(loginSchema) {
  emailOrPhone: string;
  password: string;
}
