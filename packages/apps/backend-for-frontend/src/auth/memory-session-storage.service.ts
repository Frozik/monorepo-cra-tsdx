import { Injectable } from '@nestjs/common';

import { RefreshToken, UserId } from './contracts';
import { SessionStorageService } from './session-storage.service';

@Injectable()
export class MemorySessionStorageService extends SessionStorageService {
  private readonly sessions: Map<RefreshToken, UserId> = new Map<RefreshToken, UserId>();

  async saveSession(userId: UserId, refreshToken: RefreshToken): Promise<void> {
    this.sessions.set(refreshToken, userId);
  }

  async getSession(refreshToken: RefreshToken): Promise<UserId> {
    return this.sessions.get(refreshToken);
  }
}
