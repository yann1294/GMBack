import { PartialType } from '@nestjs/mapped-types';
import {
  IsArray,
  IsDateString,
  IsOptional,
  IsString,
  IsNotEmpty,
} from 'class-validator';
import CreateBookingDTO from './booking.create.dto';

/**
 * UpdateBookingDTO
 * - DTO for updating an existing booking.
 * - Inherits all fields from CreateBookingDTO as optional,
 *   and adds a required id field to identify the booking.
 */
export default class UpdateBookingDTO extends PartialType(CreateBookingDTO) {
  // Unique booking id to update.
  @IsString()
  @IsNotEmpty()
  public id: string;
}
