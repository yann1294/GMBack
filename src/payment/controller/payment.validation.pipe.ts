import {
    ArgumentMetadata,
    BadRequestException,
    Injectable,
    PipeTransform,
  } from '@nestjs/common';
  import { plainToInstance } from 'class-transformer';
  import { validate } from 'class-validator';
  import { log } from 'console';
import { PaymentVO } from '../vo/payment.master.vo';
import { UpdatePaymentDTO } from './dto/payment.update.dto';
import { CreatePaymentDTO } from './dto/payment.create.dto';
  
  @Injectable()
  export class PaymentValidationPipe implements PipeTransform<any, Promise<PaymentVO>> {
    constructor(private readonly origin: string = 'default') { }
    async transform(value: any, metadata: ArgumentMetadata): Promise<PaymentVO> {
      log(metadata);
      // convert value to object
      value = JSON.parse(value);
      
      // checking if value if empty
      if (!value) {
        throw new BadRequestException('Request body cannot be empty');
      }
  
      // validate input data against PaymentDTO
      const paymentDto = this.origin == "update" ? plainToInstance(UpdatePaymentDTO, value) : plainToInstance(CreatePaymentDTO, value);
      const errors = await validate(paymentDto);
  
      // checking if there are any errors
      if (errors.length > 0) {
        throw new BadRequestException(errors);
      }
  
      // transform data into PaymentVO
      return plainToInstance(PaymentVO, value);
    }
  }