import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';

import { AccessToken, RefreshToken, User } from './contracts';
import { SessionStorageService } from './session-storage.service';
import { UserStorageService } from './user-storage.service';

@Injectable()
export class SessionService {
  constructor(
    private sessionStorageService: SessionStorageService,
    private userStorageService: UserStorageService,
    private jwtService: JwtService
  ) {}

  async buildRefreshToken(): Promise<RefreshToken> {
    return uuidv4();
  }

  async getAccessToken(user: User): Promise<AccessToken> {
    return this.jwtService.sign(user);
  }

  async createSession({ userId }: User): Promise<RefreshToken> {
    const refreshToken = await this.buildRefreshToken();

    await this.sessionStorageService.saveSession(userId, refreshToken);

    return refreshToken;
  }

  async createRefreshTokenCookie(refreshToken: RefreshToken): Promise<string> {
    return `RefreshToken=${refreshToken}; Expires=${new Date(Date.now() + 60 * 60 * 1000).toUTCString()}; Secure; HttpOnly`
  }

  async hasSession(refreshToken: RefreshToken): Promise<boolean> {
    return !!(await this.sessionStorageService.getSession(refreshToken));
  }

  async getUserByToken(refreshToken: RefreshToken): Promise<User> {
    const userId = await this.sessionStorageService.getSession(refreshToken);

    if (!userId) {
      return undefined;
    }

    return await this.userStorageService.getUser(userId);
  }
}
