import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import multipath from '@fastify/multipart';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // registering multipath
  app.register(multipath as any);

  // enable cors
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
