import { RefreshToken, UserId } from "./contracts";

export abstract class SessionStorageService {
  abstract saveSession(userId: UserId, refreshToken: RefreshToken): Promise<void>;
  abstract getSession(refreshToken: RefreshToken): Promise<UserId>;
}
