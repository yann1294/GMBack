import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsIn,
  IsUUID,
  IsDateString,
  IsOptional,
  IsUrl,
  IsDefined,
  isDefined,
} from 'class-validator';

export class CreatePaymentDTO {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsIn(['stripe', 'paypal'])
  gateway: string;

  @IsString()
  @IsNotEmpty()
  sessionId?: string;

  @IsString()
  @IsNotEmpty()
  paymentId?: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  resourceId: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  resourceType: string;

  @Type(() => Number)
  @IsDefined()
  @IsNumber()
  amount: number;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsString()
  @IsNotEmpty()
  @IsIn([
    'pending',
    'completed',
    'canceled',
    'refunded',
    'refund-in-progress',
    'in-progress',
  ])
  status?: string = 'in-progress';

  @IsString()
  @IsNotEmpty()
  bookingId?: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsUrl()
  @IsNotEmpty()
  receipt?: string; // optional because at creation time, you often don’t have a real receipt URL yet.

  @IsDefined()
  @IsDateString()
  createdAt: string;

  @IsDefined()
  @IsDateString()
  updatedAt: string;
}
