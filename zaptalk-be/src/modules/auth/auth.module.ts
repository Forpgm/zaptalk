import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/database/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TokenService } from './token.service';
import { MailModule } from '../mail/mail.module';
import { UsersModule } from '../users/users.module';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { RedisModule } from '../redis/redis.module';
import { ChatModule } from '../chat/chat.module';
@Module({
  controllers: [AuthController],
  providers: [AuthService, TokenService, AccessTokenStrategy],
  imports: [
    PrismaModule,
    ConfigModule,
    MailModule,
    UsersModule,
    RedisModule,
    ChatModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        ({
          secret: configService.getOrThrow<string>('ACCESS_TOKEN_SECRET'),
          signOptions: {
            expiresIn: configService.getOrThrow<string>(
              'ACCESS_TOKEN_EXPIRES_IN',
            ),
          },
        }) as const,
      inject: [ConfigService],
    }),
  ],
})
export class AuthModule {}
