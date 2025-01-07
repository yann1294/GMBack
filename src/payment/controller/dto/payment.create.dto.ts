import { IsString, IsNumber, IsIn, IsUUID, IsDateString, IsOptional } from 'class-validator';

export class CreatePaymentDTO {
  @IsString()
  @IsIn(['stripe', 'paypal'])
  gateway: string;

  @IsString()
  @IsOptional()
  paymentId: string;

  @IsNumber()
  amount: number;

  @IsString()
  currency: string;

  @IsString()
  @IsIn(['pending', 'completed', 'canceled', 'refunded', 'refund-in-progress', 'in-progress'])
  @IsOptional()
  status: string = "in-progress";

  @IsString()
  @IsOptional()
  bookingId: string;

  @IsString()
  @IsOptional()
  userId: string;

  @IsDateString()
  createdAt: string;

  @IsDateString()
  updatedAt: string;
}