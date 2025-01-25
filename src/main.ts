import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import multipart from '@fastify/multipart';
import { natsConfig } from './shared/event-communication/nats.config';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Enable raw body middleware for specific routes
  app.use(
    '/webhook/stripe',
    bodyParser.raw({ type: 'application/json' })
  );

  // registering multipart
  app.register(multipart as any);

  // enable cors
  app.enableCors();

  // Configures  the message broker in the application (This is how it is done in Nestjs, via the microservice package)
  const mService = app.connectMicroservice(natsConfig);
  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
