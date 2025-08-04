import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(filter: Prisma.usersWhereUniqueInput) {
    return this.prisma.users.findUniqueOrThrow({
      where: filter,
    });
  }
}
