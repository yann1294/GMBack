import { Transport } from '@nestjs/microservices';

export const rabbitMqOptions = {
  transport: Transport.RMQ,
  options: {
    urls: ['amqp://vps744712.ovh.net:5672'],
    queue: 'cats_queue',
    queueOptions: {
      durable: true,
    },
  },
};

export const rabbitMqConfig = {
  transport: Transport.RMQ,
  options: {
    urls: [process.env.RABBITMQ_URL || 'amqp://vps744712.ovh.net:5672'],
    queue: 'users_queue',
    queueOptions: {
      durable: true,
      arguments: {
        'x-message-ttl': 60000, // Message TTL (1 minute)
        'x-dead-letter-exchange': 'dlx', // Dead letter exchange
      },
    },
    noAck: false,
    prefetchCount: 1, // Process one message at a time
  },
};
