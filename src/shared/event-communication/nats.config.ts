import { ClientOptions, Transport } from '@nestjs/microservices';

export const natsConfig: ClientOptions = {
  transport: Transport.NATS,
  options: {
    //TODO: this can be added in the properties file
    servers: ['nats://vps744712.ovh.net:4222'], // NATS server URL
  },
};
