import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';

import { EnvironmentVariables } from '../configuration';
import { RefreshToken, RefreshTokenPayload, User } from './contracts';
import { UserStorageService } from './user-storage.service';

@Injectable()
export class JwtCookieStrategy extends PassportStrategy(Strategy, 'jwt-cookie') {
  private readonly userStorageService: UserStorageService;

  constructor(
    userStorageService: UserStorageService,
    configService: ConfigService<EnvironmentVariables>
  ) {
    const authCookieName = configService.get<string>('AUTH_COOKIE_NAME');

    super({
      jwtFromRequest: (request: Request): RefreshToken => {
        return request.cookies[authCookieName];
      },
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_TOKEN_SECRET'),
    });

    this.userStorageService = userStorageService;
  }

  async validate(payload: RefreshTokenPayload) {
    console.log(payload);

    if (!payload || !payload.userId) {
      throw new UnauthorizedException('User not found');
    }

    console.log(await this.userStorageService.getUser(payload.userId));

    return await this.userStorageService.getUser(payload.userId);
  }
}
