import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { registerSchema, RegisterType } from './schema/register.schema';
import { ZodValidationPipe } from 'src/pipe/zodValidationPipe';
import { setAuthCookie } from 'src/utils/cookies';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  async register(
    @Body(new ZodValidationPipe(registerSchema))
    payload: RegisterType,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token, user } =
      await this.authService.register(payload);
    setAuthCookie(res, refresh_token);
    return { access_token, refresh_token, user };
  }
}
