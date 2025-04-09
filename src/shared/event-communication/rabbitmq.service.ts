import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  constructor() {
    // Initialize RabbitMQ connection and setup listeners
  }

  private readonly logger = new Logger(RabbitMQService.name);
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  async onModuleInit() {
    await this.init();
  }

  private async init() {
    this.connection = await amqp.connect('amqp://vps744712.ovh.net:5672');
    this.channel = await this.connection.createChannel();
  }

  async sendMessage(queue: string, message: string) {
    await this.channel.assertQueue(queue, { durable: true });
    this.channel.sendToQueue(queue, Buffer.from(message));
  }

  async getSingleMessage(queue: string) {
    const msg = await this.channel.get(queue, { noAck: false });

    if (!msg) return;

    try {
      //const content = JSON.parse(msg.content.toString());
      const content = msg.content.toString();
      console.log('Processing message:', content);

      // Process the message
      //await this.processMessage(content);

      // Acknowledge after successful processing

      if (this.channel) {
        this.channel.ack(msg);
      } else {
        console.error('Channel close, cannot ack message');
      }
      return content;
    } catch (error) {
      console.error('Processing failed:', error);
      // Reject the message (don't requeue)
      if (this.channel) {
        this.channel.nack(msg, false, false);
      }
      //return null;
    }
    //}
    //return null; // No messages available
  }
  catch(error) {
    console.error('Error retrieving message:', error);
    throw error;
  }

  private async safeAck(msg: amqp.Message) {
    try {
      if (this.channel) {
        await this.channel.ack(msg);
      }
    } catch (error) {
      this.logger.warn(`Ack failed: ${error.message}`);
      // Don't throw - message might have already been acked
    }
  }

  private async safeNack(msg: amqp.Message, requeue: boolean) {
    try {
      if (this.channel) {
        await this.channel.nack(msg, false, requeue);
      }
    } catch (error) {
      this.logger.warn(`Nack failed: ${error.message}`);
      // Don't throw - message might have already been handled
    }
  }
}
