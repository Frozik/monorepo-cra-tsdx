import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { User } from './contracts';
import { GoogleAuthGuard } from './google-auth.guard';
import { AuthService } from './auth.service';
import { JwtCookieAuthGuard } from './jwt-cookie-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Req() request: Request) {
    if (!request.user) {
      return;
    }

    const accessToken = await this.authService.buildAccessToken(request.user as User);

    return { accessToken, user: request.user };
  }

  @Get('refresh')
  @UseGuards(JwtCookieAuthGuard)
  async refresh(@Req() request: Request) {
    if (!request.user) {
      return;
    }

    const accessToken = await this.authService.buildAccessToken(request.user as User);

    return { accessToken, user: request.user };
  }

}
