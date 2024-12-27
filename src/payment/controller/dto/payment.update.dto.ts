import { PartialType } from '@nestjs/mapped-types';
import { CreatePaymentDTO } from './payment.create.dto';

export class UpdatePaymentDTO extends PartialType(CreatePaymentDTO) {}