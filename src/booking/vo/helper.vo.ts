import { IsString, IsDateString, IsIn } from 'class-validator';

export class Tourist {
  @IsDateString()
  bookedOn: string;

  @IsString()
  @IsIn(['completed', 'canceled'])
  bookingStatus: string

  @IsString()
  @IsIn(['pending', 'completed', 'canceled'])
  paymentStatus: string;
}
