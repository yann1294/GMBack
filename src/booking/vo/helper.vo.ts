import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsIn,
  IsOptional,
} from 'class-validator';
import { Timestamp } from 'firebase-admin/firestore';

/**
 * Tourist
 * - Represents booking subdocument information per tourist.
 * - Handles date + status conversion to Firestore-compatible types.
 */
export class Tourist {
  // When the tourist was booked (ISO string)
  @IsDateString()
  @IsOptional()
  bookedOn: string;

  // Booking lifecycle status (subset of allowed values)
  @IsString()
  @IsNotEmpty()
  @IsIn(['completed', 'canceled'])
  @IsOptional()
  bookingStatus: string;

  // Payment status for this tourist booking
  @IsString()
  @IsNotEmpty()
  @IsIn(['pending', 'completed', 'canceled'])
  @IsOptional()
  paymentStatus: string;

  /**
   * Convert Tourist VO to Firestore-ready object.
   * - Converts bookedOn to Timestamp if present.
   */
  toObject(): object {
    return {
      bookedOn:
        this.bookedOn === undefined
          ? this.bookedOn
          : Timestamp.fromDate(new Date(this.bookedOn)),
      bookingStatus: this.bookingStatus,
      paymentStatus: this.paymentStatus,
    };
  }
}
