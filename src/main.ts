import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
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
  await app.listen(process.env.PORT ?? 3000);
  console.log('🚀 API running at http://localhost:3000/api');
}
await bootstrap();
