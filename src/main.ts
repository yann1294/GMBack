import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import multipart from '@fastify/multipart';
import { natsConfig } from './shared/event-communication/nats.config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Create the NestJS application using the Fastify HTTP adapter
  // - NestFastifyApplication gives you Fastify-specific APIs if needed
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      // Expose the raw request body (useful for signature validation, webhooks, etc.)
      rawBody: true,
    },
  );

  // registering multipart
  // Register Fastify's multipart plugin to handle file uploads
  // (e.g., for uploading images, documents, etc.)
  app.register(multipart as any);

  // Enable Cross-Origin Resource Sharing (CORS) so the frontend (e.g. Next.js at :3000)
  // can call this backend API from a different origin
  app.enableCors({
    origin: 'http://localhost:3000', // Your frontend URL
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Register a global validation pipe
  // This automatically:
  // - Validates incoming DTOs using class-validator
  // - Transforms payloads into their DTO types (when enabled)
  // - Whitelists only expected fields and rejects unknown ones if configured
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove properties that are not in the DTO
      forbidNonWhitelisted: true, // Throw an error if unknown properties are sent
      skipMissingProperties: true, // Do not validate properties that are missing (for partial updates)
      transform: true, // Convert plain JSON to DTO instances and primitive types
    }),
  );

  // Attach a NATS-based microservice to the main HTTP app
  // natsConfig should define the NATS connection options & transport settings
  const mService = app.connectMicroservice(natsConfig);
  // Start all configured microservices (e.g. NATS listeners)
  await app.startAllMicroservices();
  // Start the main HTTP server, using the PORT env variable or fallback to 3001
  await app.listen(process.env.PORT ?? 3001);
}
// Entry point of the NestJS application
bootstrap();
