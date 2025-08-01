import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/database/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    PrismaModule,
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
