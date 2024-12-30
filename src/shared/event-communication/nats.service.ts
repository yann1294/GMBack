import { Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class NatsService {
  sendDataToContainer(client: ClientProxy, subject: string, data: any) {
    return client.emit(subject, data);
  }

  requestResponseFromContainer(
    client: ClientProxy,
    subject: string,
    data: any,
  ) {
    return client.send(subject, data).toPromise();
  }
}
