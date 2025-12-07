import { Type } from 'class-transformer';
import {
  IsDateString,
  IsOptional,
  IsString,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { IsExclusiveFields } from 'src/booking/utils/exclusive-field-validator';
import { Tourist } from 'src/booking/vo/helper.vo';

/**
 * CreateBookingDTO
 * - DTO for creating a new booking.
 * - Validated by BookingValidationPipe before mapping to BookingVO.
 */
export default class CreateBookingDTO {
  // Booking status (e.g. "in-process", "completed", etc.)
  @IsString()
  @IsNotEmpty()
  public readonly status: string;

  // Date/time when the booking is created (ISO string).
  @IsDateString()
  public readonly bookedOn: string;

  // Map of tourists participating in this booking, keyed by user id.
  @Type(() => Tourist)
  @ValidateNested()
  public readonly tourist: Map<string, Tourist>;

  // ID of the booked tour (mutually exclusive with tourPackage).
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @IsExclusiveFields()
  public readonly tour?: string;

  // ID of the booked package (mutually exclusive with tour).
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @IsExclusiveFields()
  public readonly tourPackage?: string;
}
