export enum Provider {
  Google = 'Google',
}

export enum UserGroups {
  User = 'User',
  Administrator = 'Administrator',
}

export interface UserInfo {
  login: string;

  firstName: string;
  lastName: string;
}

export type UserId = string;
export type RefreshToken = string;
export type AccessToken = string;

export interface User {
  userId: UserId;

  info: UserInfo;

  groups: UserGroups[];
}

export interface Session {
  user: User;

  refreshToken: string;
}
