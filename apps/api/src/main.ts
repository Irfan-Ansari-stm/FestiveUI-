import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load root .env
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.enableCors({
    origin: (process.env.CORS_ORIGINS || 'http://localhost:3000,http://127.0.0.1:3000').split(','),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false
    })
  );

  // Swagger Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('FestiveUI Enterprise REST API')
    .setDescription('Full developer REST API for festival UI components, animation editor runtime, marketplace, and licensing.')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`[FestiveUI API] REST Engine running on http://localhost:${port}/api/v1`);
  console.log(`[FestiveUI API] Swagger OpenAPI UI at http://localhost:${port}/api/docs`);
}

bootstrap();
