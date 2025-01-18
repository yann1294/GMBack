import { Module } from '@nestjs/common';
import { NatsService } from './nats.service';

@Module({
  imports: [],
  providers: [NatsService],
  exports: [NatsService],
})
export class NatsModule {}
