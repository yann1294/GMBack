import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import multipart from '@fastify/multipart';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // registering multipart
  app.register(multipart as any);

  // enable cors
  app.enableCors();

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
