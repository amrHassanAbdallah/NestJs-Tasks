import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import * as config from 'config';

async function bootstrap() {
  const serverConfig = config.get('server');
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: serverConfig.allowed_origins});
  logger.log(`White listed origins ${JSON.stringify(serverConfig.allowed_origins)}`);
  const port = process.env.PORT || serverConfig.port;
  await app.listen(port);
  logger.log(`App listening on port ${port}`);
}
bootstrap();
