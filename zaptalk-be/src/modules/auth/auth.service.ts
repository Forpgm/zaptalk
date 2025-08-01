import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { AUTH_MESSAGES } from 'src/constants/messages';
import { hashPassword } from 'src/utils/bcrypt';
import { RegisterType } from './schema/register.schema';
import { ValidationException } from 'src/filters/validation.exception';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}
  async register(payload: RegisterType) {
    const { email, password, first_name, last_name, phone_number, username } =
      payload;
    const existingUsername = await this.prisma.users.findFirst({
      where: {
        username,
        deleted_at: null,
        deleted_by: null,
      },
    });
    const existingEmail = await this.prisma.users.findFirst({
      where: {
        email,
        deleted_at: null,
        deleted_by: null,
      },
    });
    const existingPhoneNumber = await this.prisma.users.findFirst({
      where: {
        phone_number,
        deleted_at: null,
        deleted_by: null,
      },
    });
    if (existingUsername) {
      throw new ValidationException([
        {
          field: 'username',
          message: AUTH_MESSAGES.USERNAME_ALREADY_EXISTED,
        },
      ]);
    }
    if (existingEmail) {
      throw new ValidationException([
        {
          field: 'email',
          message: AUTH_MESSAGES.EMAIL_ALREADY_EXISTED,
        },
      ]);
    }
    if (existingPhoneNumber) {
      throw new ValidationException([
        {
          field: 'phone_number',
          message: AUTH_MESSAGES.PHONE_NUMBER_ALREADY_EXISTED,
        },
      ]);
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
    return user;
  }
}
