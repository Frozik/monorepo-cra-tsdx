import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { User } from './contracts';
import { GoogleAuthGuard } from './google-auth.guard';
import { SessionService } from './session.service';

@Controller('auth')
export class AuthController {
  constructor(private sessionService: SessionService) {}

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Req() request: Request) {
    if (!request.user) {
      return;
    }

    const accessToken = await this.sessionService.getAccessToken(request.user as User);

    return { accessToken, user: request.user };
  }
}
