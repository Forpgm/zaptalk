import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { AUTH_MESSAGES } from 'src/constants/messages';

export interface TokenPayload {
  sub: string;
  email: string;
  role: string;
  username: string;
}

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private async signToken(
    payload: TokenPayload,
    secretKey: string,
    expiresKey: string,
  ): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>(secretKey),
      expiresIn: this.configService.getOrThrow<string>(expiresKey),
    });
  }

  async signAccessToken(payload: TokenPayload): Promise<string> {
    return this.signToken(
      payload,
      'ACCESS_TOKEN_SECRET',
      'ACCESS_TOKEN_EXPIRES_IN',
    );
  }

  async signRefreshToken(payload: TokenPayload): Promise<string> {
    return this.signToken(
      payload,
      'REFRESH_TOKEN_SECRET',
      'REFRESH_TOKEN_EXPIRES_IN',
    );
  }

  async signAccessAndRefreshToken(
    userId: string,
    email: string,
    role: string,
    username: string,
  ): Promise<{
    access_token: string;
    refresh_token: string;
  }> {
    const payload: TokenPayload = { sub: userId, email, role, username };
    const [access_token, refresh_token] = await Promise.all([
      this.signAccessToken(payload),
      this.signRefreshToken(payload),
    ]);
    return { access_token, refresh_token };
  }

  async signEmailVerifyToken(payload: TokenPayload): Promise<string> {
    return this.signToken(
      payload,
      'EMAIL_VERIFY_TOKEN_SECRET',
      'EMAIL_VERIFY_TOKEN_EXPIRES_IN',
    );
  }

  verifyToken = async ({
    token,
    secretOrPublickey,
  }: {
    token: string;
    secretOrPublickey: string;
  }): Promise<TokenPayload> => {
    try {
      return await this.jwtService.verifyAsync<TokenPayload>(token, {
        secret: secretOrPublickey,
      });
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException(error.message);
      }
      throw new UnauthorizedException(
        AUTH_MESSAGES.EMAIL_VERIFY_TOKEN_IS_INVALID,
      );
    }
  };
}
