import { IsString, IsNumber, IsIn, IsUUID, IsDateString } from 'class-validator';

export class CreatePaymentDTO {
  @IsUUID()
  id: string;

  @IsString()
  gateway: string;

  @IsString()
  paymentId: string;

  @IsNumber()
  amount: number;

  @IsString()
  currency: string;

  @IsString()
  @IsIn(['pending', 'completed', 'canceled', 'refunded', 'refund-in-progress'])
  status: string;

  @IsString()
  bookingId: string;

  @IsString()
  userId: string;

  @IsDateString()
  createdAt: string;

  @IsDateString()
  updatedAt: string;
}