import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';

import { Provider } from './contracts';
import { UserStorageService } from './user-storage.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private userStorageService: UserStorageService) {
    super({
      clientID: '546212190722-ojble8169jr3vn6sbpba7sl80ct1h8i5.apps.googleusercontent.com',
      clientSecret: 'czKWCdKX59hbauVh9aJpaK1O',
      callbackURL: 'https://localhost:3000/auth/google/callback',
      scope: ['profile']
    });
  }

  async validate(_accessToken: string, _refreshToken: string, profile: Profile) {
    if (!profile?.id) {
      throw new UnauthorizedException(
        'JWT does not possess the required scope (`openid profile email`).',
      );
    }

    return await this.userStorageService.getUserByProvider(Provider.Google, profile.id);
  }
}
