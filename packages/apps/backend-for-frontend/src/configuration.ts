export interface EnvironmentVariables {
  JWT_TOKEN_SECRET: string;
  JWT_TOKEN_LIFETIME: string;

  AUTH_COOKIE_NAME: string;
  AUTH_COOKIE_LIFETIME_SECONDS: string;
  AUTH_TOKEN_SECRET: string;

  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CALLBACK_URL: string;
  GOOGLE_SCOPE: string;
}
