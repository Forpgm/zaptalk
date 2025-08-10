import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { users } from 'generated/prisma';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async searchUsers(query: string) {
    const users = this.prisma.users.findMany({
      where: {
        OR: [
          { username: { contains: query, mode: 'insensitive' } },
          { first_name: { contains: query, mode: 'insensitive' } },
          { last_name: { contains: query, mode: 'insensitive' } },
        ],
        deleted_at: null,
        deleted_by: null,
      },
    });
    return users.then((data: users[]) => {
      return data.map((user: users) => ({
        id: user.id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        avatar_url: user.avatar_url,
        dob: user.dob,
        email: user.email,
        phone_number: user.phone_number,
        role: user.role,
      }));
    });
  }

  async findOne(filter: Prisma.usersWhereUniqueInput) {
    return this.prisma.users.findUniqueOrThrow({
      where: filter,
    });
  }
}
