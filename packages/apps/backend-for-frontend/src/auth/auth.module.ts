import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { EnvironmentVariables } from '../configuration';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './google-auth.guard';
import { GoogleStrategy } from './google.strategy';
import { JwtCookieAuthGuard } from './jwt-cookie-auth.guard';
import { JwtCookieStrategy } from './jwt-cookie.strategy';
import { JwtStrategy } from './jwt.strategy';
import { MemoryUserStorageService } from './memory-user-storage.service';
import { UserStorageService } from './user-storage.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService<EnvironmentVariables>) => ({
        secret: configService.get<string>('JWT_TOKEN_SECRET'),
        signOptions: {
            expiresIn: configService.get<string>('JWT_TOKEN_LIFETIME'),
        },
      }),
      inject: [ConfigService]
    }),
  ],
  controllers: [AuthController],
  providers: [
    GoogleAuthGuard,
    JwtCookieAuthGuard,
    GoogleStrategy,
    JwtStrategy,
    JwtCookieStrategy,
    AuthService,
    {
      provide: UserStorageService,
      useClass: MemoryUserStorageService
    }
  ],
})
export class AuthModule {}
