import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { registerSchema, RegisterType } from './schema/register.schema';
import { ZodValidationPipe } from 'src/pipe/zodValidationPipe';
import { setAuthCookie } from 'src/utils/cookies';
import { Response } from 'express';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { MailService } from '../mail/mail.service';
import { AUTH_MESSAGES } from 'src/constants/messages';
import { EmailVerifyDto } from './dto/verify-email.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
  ) {}
  @Post('register')
  @ApiOperation({ summary: 'Sign up' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User signed up successfully',
    schema: {
      example: {
        statusCode: 201,
        message: 'Success',
        data: {
          message:"success"
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Invalid fields',
    schema: {
      example: {
        statusCode: 422,
        message: 'Validation failed',
        errors: [
          {
            field: 'username',
            message: 'Username has already existed. Please try again.',
          },
          {
            field: 'email',
            message: 'Email has already existed. Please try again.',
          },
          {
            field: 'phone_number',
            message: 'Phone number has already existed. Please try again.',
          },
        ],
      },
    },
  })
  @ApiBody({ type: RegisterDto })
  async register(
    @Body(new ZodValidationPipe(registerSchema))
    payload: RegisterType,
  ) {
    const { user, email_verify_token } =
      await this.authService.register(payload);
    // send email verify
    await this.mailService.sendEmailVerify(
      user.email,
      user.first_name,
      user.last_name,
      email_verify_token,
    );
    return {
      message: AUTH_MESSAGES.REGISTER_SUCCESSFULLY,
    };
  }

  @Post('verify-email')
  @ApiOperation({ summary: 'email verify' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Email verify successfully',
    schema: {
      example: {
        statusCode: 201,
        message: 'Success',
        data: {
          message: 'Email already verified.',
          access_token: 'sample.jwt.token.access',
          refresh_token: 'sample.jwt.token.refresh',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
    schema: {
      example: {
        statusCode: 401,
        message: 'invalid signature',
        errors: [],
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'User not found.',
        errors: [],
      },
    },
  })
  @ApiBody({ type: EmailVerifyDto })
  async verifyEmail(@Body() payload: EmailVerifyDto) {
    return this.authService.verifyEmail(payload);
  }
}
