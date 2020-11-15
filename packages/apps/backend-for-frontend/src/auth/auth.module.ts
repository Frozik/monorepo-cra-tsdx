import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
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
    JwtModule.register({
      secret: 'jwtConstants.secret',
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [
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
