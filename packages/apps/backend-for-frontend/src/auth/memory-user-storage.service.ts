import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { Provider, User, UserGroups, UserId } from './contracts';
import { UserStorageService } from './user-storage.service';

@Injectable()
export class MemoryUserStorageService extends UserStorageService {
  private readonly users: Map<UserId, User> = new Map<UserId, User>();
  private readonly providerToUser: Map<string, UserId> = new Map<string, UserId>();

  constructor() {
    super();

    const frozikUserId = uuidv4();

    this.users.set(
      frozikUserId,
      {
        userId: frozikUserId,
        info: {
          login: '',
          firstName: '',
          lastName: ''
        },
        groups: [UserGroups.Administrator]
      }
    );

    this.providerToUser.set(
      `${Provider.Google}-${''}`,
      frozikUserId
    );
  }

  async getUser(userId: UserId): Promise<User> {
    return this.users.get(userId);
  }

  async getUserByProvider(provider: Provider, providerId: string): Promise<User> {
    const userId = this.providerToUser.get(`${provider}-${providerId}`);

    return this.users.get(userId);
  }
}
