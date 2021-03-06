import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: ['.env.development.local'],
      isGlobal: true,
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
