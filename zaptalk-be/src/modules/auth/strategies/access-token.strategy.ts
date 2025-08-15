import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from '../token.service';
import { UsersService } from 'src/modules/users/users.service';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  JwtStrategy,
  'access-token',
) {
  constructor(
    private configService: ConfigService,
    private userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow<string>('ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(payload: TokenPayload) {
    const user = await this.userService.findOne({ id: payload.sub });
    if (!user) {
      throw new UnauthorizedException('Invalid Access Token.');
    }
    return user;
  }
}
