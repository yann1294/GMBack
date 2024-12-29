import { ClientOptions, Transport } from '@nestjs/microservices';

export const natsConfig: ClientOptions = {
  transport: Transport.NATS,
  options: {
    servers: ['nats://vps744712.ovh.net:4222'], // NATS server URL TODO: this can be put in the properties file
    // host: 'vps744712.ovh.net',
    // port: 4222,
  },
};
