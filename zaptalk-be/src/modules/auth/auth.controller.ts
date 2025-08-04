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
import { LoginDto } from './dto/login.dto';
import { loginSchema } from './schema/login.schema';

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
          message: 'success',
        },
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
  async verifyEmail(
    @Body() payload: EmailVerifyDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, message, refresh_token, user } =
      await this.authService.verifyEmail(payload);
    setAuthCookie(res, refresh_token);
    return { access_token, refresh_token, message, user };
  }

  @Post('login')
  @ApiOperation({ summary: 'user signs into existing account.' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User logins successfully',
    schema: {
      example: {
        statusCode: 201,
        message: 'Success',
        data: {
          access_token: 'sample.jwt.token.access',
          refresh_token: 'sample.jwt.token.refresh',
          user: {
            id: 'f262cc3b-dbf2-4cdf-8b2b-4a3e676960b2',
            first_name: 'pham',
            last_name: 'my',
            phone_number: '0949309132',
            dob: null,
            username: 'forpgm',
            email: 'phm.giamy@gmail.com',
            role: 'MEMBER',
            avatar_url:
              'https://zaptalk.s3.us-east-1.amazonaws.com/avatar/default.jpg',
          },
        },
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
            field: 'emailOrPhone',
            message: 'Email or phone number is required.',
          },
        ],
      },
    },
  })
  @ApiBody({ type: LoginDto })
  async login(
    @Body(new ZodValidationPipe(loginSchema))
    payload: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token, user } =
      await this.authService.login(payload);
    setAuthCookie(res, refresh_token);
    return { access_token, refresh_token, user };
  }
}
