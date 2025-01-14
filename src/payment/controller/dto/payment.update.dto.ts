import { PartialType } from '@nestjs/mapped-types';
import { CreatePaymentDTO } from './payment.create.dto';
import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class UpdatePaymentDTO extends PartialType(CreatePaymentDTO) {
    @IsString()
  @IsNotEmpty()
    public id: string
}