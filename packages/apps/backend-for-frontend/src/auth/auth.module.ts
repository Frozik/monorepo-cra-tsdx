import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { EnvironmentVariables } from '../configuration';
import { AuthController } from './auth.controller';
import { GoogleAuthGuard } from './google-auth.guard';
import { GoogleStrategy } from './google.strategy';
import { JwtStrategy } from './jwt.strategy';
import { MemorySessionStorageService } from './memory-session-storage.service';
import { MemoryUserStorageService } from './memory-user-storage.service';
import { SessionStorageService } from './session-storage.service';
import { SessionService } from './session.service';
import { UserStorageService } from './user-storage.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService<EnvironmentVariables>) => ({
        secretOrPrivateKey: configService.get<string>('JWT_TOKEN_SECRET'),
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
    GoogleStrategy,
    JwtStrategy,
    SessionService,
    {
      provide: SessionStorageService,
      useClass: MemorySessionStorageService
    },
    {
      provide: UserStorageService,
      useClass: MemoryUserStorageService
    }
  ],
})
export class AuthModule {}
