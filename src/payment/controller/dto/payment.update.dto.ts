import { PartialType } from '@nestjs/mapped-types';
import { CreatePaymentDTO } from './payment.create.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdatePaymentDTO extends PartialType(CreatePaymentDTO) {
}