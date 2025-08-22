import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { registerSchema, RegisterType } from './schema/register.schema';
import { ZodValidationPipe } from 'src/pipe/zodValidationPipe';
import { setAuthCookie } from 'src/utils/cookies';
import { Request, Response } from 'express';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { MailService } from '../mail/mail.service';
import { AUTH_MESSAGES, SUCCESS_MESSAGES } from 'src/constants/messages';
import { EmailVerifyDto } from './dto/verify-email.dto';
import { LoginDto } from './dto/login.dto';
import { loginSchema } from './schema/login.schema';
import { AccessTokenGuard } from './guards/access-token.guard';

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
    const {
      access_token,
      message,
      refresh_token,
      user,
      stream_token,
      session_id,
    } = await this.authService.verifyEmail(payload);
    setAuthCookie(res, refresh_token);
    return {
      access_token,
      refresh_token,
      stream_token,
      session_id,
      message,
      user,
    };
  }

  @Post('login')
  @ApiOperation({ summary: 'user signs into existing account.' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User logins successfully',
    schema: {
      example: {
        statusCode: 201,
        message: 'Login Successfully',
        data: {
          access_token: 'sample.jwt.token.access',
          refresh_token: 'sample.jwt.token.refresh',
          stream_token: 'xyz.stream_token',
          user: {
            id: 'e05dd8a6-560a-443d-b826-95c4940cxxx',
            first_name: 'Minh Anh',
            last_name: 'Phạm',
            phone_number: '0949309xxx',
            dob: null,
            username: 'pma',
            email: 'giamyxxxgmail.com',
            role: 'MEMBER',
            avatar_url:
              'https://zaptalk.s3.us-east-1.amazonaws.com/avatar/default.jpg',
          },
          session_id: '540b179b-80ff-48a0-99e8-57c492c8fzzz',
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
    const { access_token, refresh_token, stream_token, user, session_id } =
      await this.authService.login(payload);
    setAuthCookie(res, refresh_token);
    return {
      message: SUCCESS_MESSAGES.LOGIN_SUCCESSFULLY,
      data: { access_token, refresh_token, stream_token, user, session_id },
    };
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'user grants for access' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        session_id: {
          type: 'string',
          example: 'c34d1470-cfe6-4404-acf3-6087c968exxx',
        },
      },
      required: ['session_id'],
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
    schema: {
      example: {
        statusCode: 401,
        message: 'User not found.',
        errors: [],
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Success',
    schema: {
      example: {
        statusCode: 201,
        message: 'Success',
        data: {
          access_token: 'sample.jwt.token.access',
          refresh_token: 'sample.jwt.token.refresh',
        },
      },
    },
  })
  async refreshToken(
    @Body() body: { session_id: string },
    @Req() req: Request & { cookies: { refresh_token?: string } },
    @Res({ passthrough: true }) res: Response,
  ) {
    const cookies = req.cookies as { refresh_token?: string };
    const refreshToken = cookies.refresh_token;

    if (!refreshToken) {
      throw new UnauthorizedException(AUTH_MESSAGES.REFRESH_TOKEN_IS_REQUIRED);
    }

    const { access_token, refresh_token } = await this.authService.refreshToken(
      refreshToken,
      body.session_id,
    );
    setAuthCookie(res, refresh_token);
    return { access_token, refresh_token };
  }

  @ApiOperation({ summary: 'user sends a message in a chat.' })
  @Post('/logout')
  @UseGuards(AccessTokenGuard)
  async logout(
    @Body() body: { session_id: string },
    @Req() req: Request & { cookies: { refresh_token?: string } },
  ) {
    const cookies = req.cookies as { refresh_token?: string };
    const refreshToken = cookies.refresh_token;

    if (!refreshToken) {
      throw new UnauthorizedException(AUTH_MESSAGES.REFRESH_TOKEN_IS_REQUIRED);
    }

    await this.authService.logout(refreshToken, body.session_id);
    return { message: 'Logout successful' };
  }
}
