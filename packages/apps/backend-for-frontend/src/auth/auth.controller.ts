import { Controller, Get, Req, Res, Response, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { SessionService } from './session.service';

@Controller('auth')
export class AuthController {
  constructor(private sessionService: SessionService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() request, @Res() response: Response) {
    if (!request?.user) {
      return;
    }

    const refreshToken = await this.sessionService.createSession(request.user);
    const accessToken = await this.sessionService.getAccessToken(request.user);

    response.headers.append(
      'Set-Cookie',
      await this.sessionService.createRefreshTokenCookie(refreshToken)
    );

    return { accessToken };
  }
}
