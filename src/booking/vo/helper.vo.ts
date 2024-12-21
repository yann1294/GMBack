import { IsString, IsDateString, IsIn } from 'class-validator';
import { Timestamp } from 'firebase-admin/firestore';

export class Tourist {
  @IsDateString()
  bookedOn: string;

  @IsString()
  @IsIn(['completed', 'canceled'])
  bookingStatus: string

  @IsString()
  @IsIn(['pending', 'completed', 'canceled'])
  paymentStatus: string;

  toObject(): object {
    return {
      bookedOn: this.bookedOn === undefined ? this.bookedOn : Timestamp.fromDate(new Date(this.bookedOn)),
      bookingStatus: this.bookingStatus,
      paymentStatus: this.paymentStatus
    }
  }
}
