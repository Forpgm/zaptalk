import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { registerSchema, RegisterType } from './schema/register.schema';
import { ZodValidationPipe } from 'src/pipe/zodValidationPipe';
import { setAuthCookie } from 'src/utils/cookies';
import { Response } from 'express';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
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
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token, user } =
      await this.authService.register(payload);
    setAuthCookie(res, refresh_token);
    return { access_token, refresh_token, user };
  }
}
