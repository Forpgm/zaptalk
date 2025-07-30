import { createZodDto } from 'nestjs-zod';
import { registerSchema } from '../schema/register.schema';

export class RegisterDto extends createZodDto(registerSchema) {
  first_name: string;
  last_name: string;
  username: string;
  phone_number: string;
  emai: string;
  password: string;
}
