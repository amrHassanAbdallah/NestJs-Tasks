import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import * as config from 'config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const serverConfig = config.get('server');
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: serverConfig.allowed_origins });
  logger.log(`White listed origins ${JSON.stringify(serverConfig.allowed_origins)}`);
  const port = process.env.PORT || serverConfig.port;

  if (process.env.NODE_ENV === 'development') {
    const options = new DocumentBuilder()
      .setTitle('Task Endpoints')
      .setDescription('The cats API description')
      .setVersion('1.0')
      .addTag('tasks')
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);
  }


  await app.listen(port);
  logger.log(`App listening on port ${port}`);
}
bootstrap();
