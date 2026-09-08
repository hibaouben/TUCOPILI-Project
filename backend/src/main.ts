import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:5173',
      process.env.FRONTEND_URL,
    ].filter(Boolean),
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('TUCOPILI CAFÉ API')
    .setDescription(
      'API REST for TUCOPILI CAFÉ management',
    )
    .setVersion('1.0')
    .addTag('Categories')
    .addTag('Products')
    .addTag('Orders')
    .addTag('Reservations')
    .addTag('Tables')
    .addTag('Reviews')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);


  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
  console.log('🚀 Starting server...');

await app.listen(process.env.PORT ?? 3000, '0.0.0.0');

console.log(`🚀 Server listening on port ${process.env.PORT ?? 3000}`);
}

bootstrap();