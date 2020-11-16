import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';

import { EnvironmentVariables } from '../configuration';
import { Provider } from './contracts';
import { UserStorageService } from './user-storage.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private userStorageService: UserStorageService,
    configService: ConfigService<EnvironmentVariables>
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: configService.get<string>('GOOGLE_SCOPE').split(',')
    });
  }

  async validate(_accessToken: string, _refreshToken: string, profile: Profile) {
    if (!profile?.id) {
      throw new UnauthorizedException('User is not authorized');
    }

    const user =  await this.userStorageService.getUserByProvider(Provider.Google, profile.id);

    if (!user) {
      throw new UnauthorizedException('User is not linked');
    }

    return user;
  }
}
