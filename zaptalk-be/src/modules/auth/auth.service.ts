import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { AUTH_MESSAGES } from 'src/constants/messages';
import { hashPassword } from 'src/utils/bcrypt';
import { RegisterType } from './schema/register.schema';
import { ValidationException } from 'src/filters/validation.exception';
import { TokenService } from './token.service';
import { EmailVerifyDto } from './dto/verify-email.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
  ) {}

  async register(payload: RegisterType) {
    const { email, password, first_name, last_name, phone_number, username } =
      payload;
    const existingUser = await this.prisma.users.findFirst({
      where: {
        deleted_at: null,
        deleted_by: null,
        OR: [{ username }, { email }, { phone_number }],
      },
    });
    if (existingUser) {
      const errors: { field: string; message: string }[] = [];
      if (existingUser.username === username)
        errors.push({
          field: 'username',
          message: AUTH_MESSAGES.USERNAME_ALREADY_EXISTED,
        });
      if (existingUser.email === email)
        errors.push({
          field: 'email',
          message: AUTH_MESSAGES.EMAIL_ALREADY_EXISTED,
        });
      if (existingUser.phone_number === phone_number)
        errors.push({
          field: 'phone_number',
          message: AUTH_MESSAGES.PHONE_NUMBER_ALREADY_EXISTED,
        });

      throw new ValidationException(errors);
    }

    const user = await this.prisma.users.create({
      data: {
        email,
        first_name,
        last_name,
        username,
        password: await hashPassword(password),
        phone_number,
      },
    });

    const email_verify_token = await this.tokenService.signEmailVerifyToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      username: user.username,
    });
    await this.prisma.users.update({
      where: {
        id: user.id,
        deleted_at: null,
        deleted_by: null,
      },
      data: {
        email_verify_token,
      },
    });
    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        phone_number: user.phone_number,
        avatar_url: user.avatar_url,
      },
      email_verify_token,
    };
  }

  async verifyEmail(payload: EmailVerifyDto) {
    const { email_verify_token } = payload;

    // 1. decode token
    const decoded = await this.tokenService.verifyToken({
      token: email_verify_token as string,
      secretOrPublickey: this.configService.getOrThrow<string>(
        'EMAIL_VERIFY_TOKEN_SECRET',
      ),
    });

    // 2. find user
    const user = await this.prisma.users.findFirst({
      where: {
        id: decoded.sub,
        deleted_at: null,
        deleted_by: null,
      },
    });

    if (!user) {
      throw new NotFoundException(AUTH_MESSAGES.USER_NOT_FOUND);
    }

    // 3. Already verified
    if (!user.email_verify_token) {
      const { access_token, refresh_token } =
        await this.tokenService.signAccessAndRefreshToken(
          user.id,
          user.email,
          user.role,
          user.username,
        );

      return {
        message: AUTH_MESSAGES.EMAIL_ALREADY_VERIFIED,
        access_token,
        refresh_token,
      };
    }

    // 4. Token mismatch
    if (email_verify_token !== user.email_verify_token) {
      throw new UnauthorizedException(
        AUTH_MESSAGES.EMAIL_VERIFY_TOKEN_IS_INVALID,
      );
    }

    // 5. Update user & clear token
    await this.prisma.users.update({
      where: { id: user.id },
      data: {
        email_verify_token: '',
        is_verified: true,
      },
    });

    // 6. Generate token & return
    const { access_token, refresh_token } =
      await this.tokenService.signAccessAndRefreshToken(
        user.id,
        user.email,
        user.role,
        user.username,
      );

    return {
      message: AUTH_MESSAGES.EMAIL_VERIFIED_SUCCESSFULLY,
      access_token,
      refresh_token,
    };
  }
}
