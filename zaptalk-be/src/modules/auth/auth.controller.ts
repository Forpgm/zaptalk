import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { registerSchema, RegisterType } from './schema/register.schema';
import { ZodValidationPipe } from 'src/pipe/zodValidationPipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  async register(
    @Body(new ZodValidationPipe(registerSchema))
    payload: RegisterType,
  ) {
    return await this.authService.register(payload);
  }
}
