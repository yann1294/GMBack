import { ClientProxy, EventPattern, Payload } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';


@Controller()
export class UsersMessageBrokerController {
  private client: ClientProxy;
  private subject: string = 'guide.admin';


  @EventPattern('guide.admin')
  handleDataFromGuide(@Payload() data: any) {
    console.log('Received message from guide : ', data);
  }
}