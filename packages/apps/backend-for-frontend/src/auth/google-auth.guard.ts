import { ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { EnvironmentVariables } from 'src/configuration';

import { User } from './contracts';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  private readonly authCookieName: string;
  private readonly authCookieLifetime: number;

  constructor(
    private authService: AuthService,
    configService: ConfigService<EnvironmentVariables>
  ) {
    super();

    this.authCookieName = configService.get<string>('AUTH_COOKIE_NAME');
    this.authCookieLifetime = parseInt(configService.get<string>('AUTH_COOKIE_LIFETIME_SECONDS'), 10) * 1000;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActivate = await super.canActivate(context) as boolean;

    if (!canActivate) {
      return false;
    }

    const request = context.switchToHttp().getRequest() as Request;
    const user = request.user as User;

    if (!user) {
      return false;
    }

    const response = context.switchToHttp().getResponse() as Response;

    const refreshToken = await this.authService.buildRefreshToken(user);

    response.cookie(
      this.authCookieName,
      refreshToken,
      {
        maxAge: this.authCookieLifetime,
        secure: true,
        httpOnly: true
      }
    );

    return true;
  }
}
