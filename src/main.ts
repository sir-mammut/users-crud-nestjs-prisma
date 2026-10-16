import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule, ObserveInstrument } from './app.module.js';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });

  // All routes will be prefixed with /api
  app.setGlobalPrefix('api');

  // 1️⃣ GLOBAL VALIDATION PIPE
  // Automatically validates incoming requests against DTOs.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // Strip properties not in the DTO
      forbidNonWhitelisted: true, // Reject requests with unknown properties (400)
      transform: true,            // Auto-convert payloads to DTO instances (e.g., strings → numbers)
      transformOptions: {
        enableImplicitConversion: true, // Convert query params to their typed DTO properties
      },
    }),
  );

  // 2️⃣ GLOBAL SERIALIZER INTERCEPTOR
  // Honors @Exclude() decorators (like the one on UserResponse.password)
  // so the password is NEVER sent to the client.
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

    // ── Swagger / OpenAPI ──
    const swaggerConfig = new DocumentBuilder()
    .setTitle('Users CRUD API')
    .setDescription(
      'A REST API for managing users, built with NestJS, Prisma, and SQLite.',
    )
    .setVersion('1.0.0')
    .addTag('Users', 'User management endpoints')
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);

  // Swagger UI will be available at /api/docs
  SwaggerModule.setup('api/docs', app, documentFactory);
  
  // Allow frontend apps to call this API
  app.enableCors(); // Enable CORS for all routes

  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 API running at http://localhost:${process.env.PORT ?? 3000}/api`);
  console.log(`📚 Swagger docs at http://localhost:${process.env.PORT ?? 3000}/api/docs`);

}
await bootstrap();
