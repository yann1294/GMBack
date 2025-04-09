import { ClientProxy, EventPattern, Payload } from '@nestjs/microservices';
import { Controller, Get } from '@nestjs/common';
import { RabbitMQService } from 'src/shared/event-communication/rabbitmq.service';

@Controller('messages')
export class UsersMessageBrokerController {
  private client: ClientProxy;
  private subject: string = 'guide.admin';
  private queue: string = 'this_is_a_test';

  constructor(private rabbitMQService: RabbitMQService) {}

  @Get('next')
  async getNextMessage() {
    return this.rabbitMQService.getSingleMessage(this.queue);
  }

  @EventPattern('guide.admin')
  handleDataFromGuide(@Payload() data: any) {
    console.log('Received message from guide : ', data);
  }
}
