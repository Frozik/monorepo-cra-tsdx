import { NestFactory } from '@nestjs/core';
import * as fs from 'fs';

import { AppModule } from './app.module';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('./.cert/localhost-key.pem'),
    cert: fs.readFileSync('./.cert/localhost-cert.pem'),
  };

  const app = await NestFactory.create(AppModule, { httpsOptions });

  await app.listen(3000);
}

bootstrap();
