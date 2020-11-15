import { Provider, User, UserId } from "./contracts";

export abstract class UserStorageService {
  abstract getUser(userId: UserId): Promise<User>;

  abstract getUserByProvider(provider: Provider, providerId: string): Promise<User>;
}
