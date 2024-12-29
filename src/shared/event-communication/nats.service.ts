import { Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class NatsService {
  sendDataToContainer(client: ClientProxy, subject: string, data: any) {
    return client.emit(subject, data);
    // const result = client.send(subject, data);
    // console.log(
    //   'Reply returned from the consumer : ',
    //   result.subscribe((value) => console.log(value)),
    // );
  }

  requestResponseFromContainer(
    client: ClientProxy,
    subject: string,
    data: any,
  ) {
    return client.send(subject, data).toPromise();
  }
}
