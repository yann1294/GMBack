import { IsString, IsDateString, IsIn, IsOptional } from 'class-validator';
import { Timestamp } from 'firebase-admin/firestore';

export class Tourist {
  @IsDateString()
  @IsOptional()
  bookedOn: string;

  @IsString()
  @IsIn(['completed', 'canceled'])
  @IsOptional()
  bookingStatus: string

  @IsString()
  @IsIn(['pending', 'completed', 'canceled'])
  @IsOptional()
  paymentStatus: string;

  toObject(): object {
    return {
      bookedOn: this.bookedOn === undefined ? this.bookedOn : Timestamp.fromDate(new Date(this.bookedOn)),
      bookingStatus: this.bookingStatus,
      paymentStatus: this.paymentStatus
    }
  }
}
