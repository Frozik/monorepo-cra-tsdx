import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { EnvironmentVariables } from '../configuration';
import { AccessToken, RefreshToken, RefreshTokenPayload, TokenType, User } from './contracts';
import { UserStorageService } from './user-storage.service';

@Injectable()
export class AuthService {
  private readonly authCookieSecret: string;
  private readonly authCookieLifetime: string;

  constructor(
    private userStorageService: UserStorageService,
    private jwtService: JwtService,
    configService: ConfigService<EnvironmentVariables>
  ) {
    this.authCookieLifetime = `${configService.get<string>('AUTH_COOKIE_LIFETIME_SECONDS')}s`;
    this.authCookieSecret = configService.get<string>('AUTH_TOKEN_SECRET');
  }

  async buildAccessToken(user: User): Promise<AccessToken> {
    return this.jwtService.sign(user);
  }

  async buildRefreshToken(user: User): Promise<RefreshToken> {
    const payload: RefreshTokenPayload = {
      type: TokenType.RefreshToken,
      userId: user.userId
    };

    return this.jwtService.sign(payload, {
      secret: this.authCookieSecret,
      expiresIn: this.authCookieLifetime
    });
  }

  async extractAccessToken(accessToken: AccessToken): Promise<User> {
    return this.jwtService.verifyAsync<User>(accessToken, {
      secret: this.authCookieSecret,
    });
  }

  async extractRefreshToken(refreshToken: RefreshToken): Promise<User> {
    const payload = await this.jwtService.verifyAsync<RefreshTokenPayload>(refreshToken, {
      secret: this.authCookieSecret,
    });

    if (!payload) {
      return undefined;
    }

    return await this.userStorageService.getUser(payload.userId);
  }
}
