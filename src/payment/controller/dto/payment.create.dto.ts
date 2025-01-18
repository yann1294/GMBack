import { IsString, IsNotEmpty,  IsNumber, IsIn, IsUUID, IsDateString, IsOptional } from 'class-validator';

export class CreatePaymentDTO {
  @IsString()
  @IsNotEmpty()
  @IsIn(['stripe', 'paypal'])
  gateway: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  paymentId: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  resourceId: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  resourceType: string;

  @IsNumber()
  amount: number;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['pending', 'completed', 'canceled', 'refunded', 'refund-in-progress', 'in-progress'])
  @IsOptional()
  status: string = "in-progress";

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  bookingId: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  userId: string;

  @IsDateString()
  createdAt: string;

  @IsDateString()
  updatedAt: string;
}