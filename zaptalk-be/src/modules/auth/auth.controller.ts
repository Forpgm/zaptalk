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
          access_token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhMzlkMTAyMy00ZDdkLTQzNmItOGMzZC0xZWFiOTczZmI2ZTYiLCJlbWFpbCI6InBobS5uaG1pbmhAZ21haWwuY29tIiwicm9sZSI6Ik1FTUJFUiIsInVzZXJuYW1lIjoibWluaG5lZiIsImlhdCI6MTc1NDA2MDMzNiwiZXhwIjoxNzU0MDYwMzk2fQ.6tuw-WfpCXOgf2iwEicm9MGszRZHbwvD3LLvS_vKASM',
          refresh_token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhMzlkMTAyMy00ZDdkLTQzNmItOGMzZC0xZWFiOTczZmI2ZTYiLCJlbWFpbCI6InBobS5uaG1pbmhAZ21haWwuY29tIiwicm9sZSI6Ik1FTUJFUiIsInVzZXJuYW1lIjoibWluaG5lZiIsImlhdCI6MTc1NDA2MDMzNiwiZXhwIjoxNzU2NjUyMzM2fQ.6d3njKsevERhj5Gn2FaG1iEeCl0toI27903r_ENnEDA',
          user: {
            id: 'a39d1023-4d7d-436b-8c3d-1eab973fb6e6',
            email: 'phm.nhminh@gmail.com',
            username: 'minhnef',
            first_name: 'Nhật Minh',
            last_name: 'Phạm',
            phone_number: '0949309135',
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
          access_token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2M2YzNmVlMi1mZTRlLTRlNGItOGY1Ni00N2ZiMmNiZTU0YmQiLCJlbWFpbCI6ImdpYW15NDQ1NUBnbWFpbC5jb20iLCJyb2xlIjoiTUVNQkVSIiwidXNlcm5hbWUiOiJnbXk0NDU1IiwiaWF0IjoxNzU0MTQ3OTA2LCJleHAiOjE3NTQxNDc5NjZ9.nPiMjeKnpHaAEt6ibgB4IQD4bysUwfwJG4faRKsgwqg',
          refresh_token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2M2YzNmVlMi1mZTRlLTRlNGItOGY1Ni00N2ZiMmNiZTU0YmQiLCJlbWFpbCI6ImdpYW15NDQ1NUBnbWFpbC5jb20iLCJyb2xlIjoiTUVNQkVSIiwidXNlcm5hbWUiOiJnbXk0NDU1IiwiaWF0IjoxNzU0MTQ3OTA2LCJleHAiOjE3NTY3Mzk5MDZ9.JDwUuihyeZy-kWbMKUN48HdNOSrl0UnLVruQ60cXaDM',
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
