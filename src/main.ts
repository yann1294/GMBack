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
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      rawBody: true,
    },
  );

  // registering multipart
  app.register(multipart as any);

  // enable cors
  app.enableCors({
    origin: 'http://localhost:3000', // Your frontend URL
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  //  enable global validation & transformation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip properties not in the DTO
      forbidNonWhitelisted: true, // throw on unknown properties
      transform: true, // auto-convert payloads to DTO types
    }),
  );

  // Configures  the message broker in the application (This is how it is done in Nestjs, via the microservice package)
  const mService = app.connectMicroservice(natsConfig);
  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
