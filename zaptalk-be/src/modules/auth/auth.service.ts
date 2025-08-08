import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { AUTH_MESSAGES } from 'src/constants/messages';
import { comparePassword, hashPassword } from 'src/utils/bcrypt';
import { RegisterType } from './schema/register.schema';
import { ValidationException } from 'src/filters/validation.exception';
import { TokenService } from './token.service';
import { EmailVerifyDto } from './dto/verify-email.dto';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { EMAIL_REGEX, PHONE_REGEX } from 'src/constants/constant';
import { RedisService } from '../redis/redis.service';
import { v4 as uuidv4 } from 'uuid';
import { ChatService } from '../chat/chat.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly chatService: ChatService,
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
        user: {
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          avatar_url: user.avatar_url,
          username: user.username,
          phone_number: user.phone_number,
          role: user.role,
        },
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
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        avatar_url: user.avatar_url,
        username: user.username,
        phone_number: user.phone_number,
        dob: user.dob,
        role: user.role,
      },
    };
  }

  async login(payload: LoginDto) {
    const { emailOrPhone, password } = payload;
    const isPhone = !emailOrPhone.includes('@');

    if (!isPhone && !EMAIL_REGEX.test(emailOrPhone)) {
      throw new ValidationException([
        {
          field: 'emailOrPhone',
          message: AUTH_MESSAGES.EMAIL_MUST_BE_VALID,
        },
      ]);
    }

    if (isPhone && !PHONE_REGEX.test(emailOrPhone)) {
      if (!isPhone && !PHONE_REGEX.test(emailOrPhone)) {
        throw new ValidationException([
          {
            field: 'emailOrPhone',
            message: AUTH_MESSAGES.PHONE_NUMBER_MUST_BE_VALID,
          },
        ]);
      }
    }

    const existingUser = await this.prisma.users.findFirst({
      where: isPhone
        ? { phone_number: emailOrPhone, deleted_at: null }
        : { email: emailOrPhone.toLowerCase(), deleted_at: null },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        phone_number: true,
        dob: true,
        username: true,
        email: true,
        role: true,
        avatar_url: true,
        password: true,
      },
    });

    if (!existingUser) {
      throw new ValidationException([
        {
          field: 'emailOrPhone',
          message: AUTH_MESSAGES.EMAIL_OR_PASSWORD_IS_INCORRECT,
        },
      ]);
    }

    const isPasswordValid: boolean = await comparePassword(
      password,
      existingUser.password,
    );
    if (!isPasswordValid) {
      throw new ValidationException([
        {
          field: 'emailOrPhone',
          message: AUTH_MESSAGES.EMAIL_OR_PASSWORD_IS_INCORRECT,
        },
      ]);
    }

    const { access_token, refresh_token } =
      await this.tokenService.signAccessAndRefreshToken(
        existingUser.id,
        existingUser.email,
        existingUser.role,
        existingUser.username,
      );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: userPassword, ...userWithoutPassword } = existingUser;
    const session_id = uuidv4();
    await this.redisService.set(
      `refresh_token:${userWithoutPassword.id}:${session_id}`,
      refresh_token,
      7 * 24 * 60 * 60,
    );
    const stream_token = this.chatService.generateToken(userWithoutPassword.id);
    return {
      access_token,
      refresh_token,
      stream_token,
      user: userWithoutPassword,
      session_id,
    };
  }

  async refreshToken(currentRefreshToken: string, session_id: string) {
    const { sub } = await this.tokenService.verifyToken({
      token: currentRefreshToken,
      secretOrPublickey: this.configService.getOrThrow<string>(
        'REFRESH_TOKEN_SECRET',
      ),
    });
    const storedToken = await this.redisService.get(
      `refresh_token:${sub}:${session_id}`,
    );
    if (!storedToken || storedToken !== currentRefreshToken) {
      throw new UnauthorizedException('Invalid token.');
    }

    const existingUser = await this.prisma.users.findFirst({
      where: {
        id: sub,
        deleted_at: null,
        deleted_by: null,
      },
    });
    if (!existingUser) {
      throw new UnauthorizedException(AUTH_MESSAGES.USER_NOT_FOUND);
    }
    const { access_token, refresh_token: newRefreshToken } =
      await this.tokenService.signAccessAndRefreshToken(
        existingUser.username,
        existingUser.id,
        existingUser.email,
        existingUser.role,
      );
    await this.redisService.set(
      `refresh_token:${sub}:${session_id}`,
      newRefreshToken,
      7 * 24 * 60 * 60,
    );
    return { access_token, refresh_token: newRefreshToken };
  }
}
