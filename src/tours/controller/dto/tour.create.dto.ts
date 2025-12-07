import { Type } from 'class-transformer';
import {
  IsNumber,
  IsString,
  IsNotEmpty,
  ValidateNested,
  Min,
  Max,
  IsBoolean,
  IsObject,
  IsOptional,
  IsDateString,
  IsArray,
  Allow,
} from 'class-validator';
import { TourLocationDTO } from './tour.location.dto';
import { ActivityDTO } from './tour.activity.dto';

/**
 * DTO for creating a Tour.
 * Used by the create tour endpoint to validate incoming payloads.
 */
export class CreateTourDTO {
  // Tour display name
  @IsString()
  @IsNotEmpty()
  public readonly name: string;

  // Base price for the tour
  @IsNumber()
  public readonly price: number;

  // Date of the tour (ISO string enforced by IsDateString)
  @IsDateString()
  public date: Date;

  // Optional image URLs for the tour
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  public images: string[];

  // Duration of the tour in days (>= 0)
  @IsNumber()
  @Min(0)
  public readonly durationDays: number;

  // Discount in percentage (0–100)
  @IsNumber()
  @Min(0)
  @Max(100)
  public readonly discount: number;

  // Total number of seats available
  @IsNumber()
  public readonly numberOfSeats: number;

  // Short description of the tour
  @IsString()
  @IsNotEmpty()
  public readonly description: string;

  // Availability flag
  @IsBoolean()
  public readonly isAvailable: boolean;

  // Assigned guide identifier
  @IsString()
  @IsNotEmpty()
  public readonly guide: string;

  // Nested location object (city/country/etc.) validated via TourLocationDTO
  @ValidateNested()
  @Type(() => TourLocationDTO)
  location: TourLocationDTO;

  // Activities mapping: index -> ActivityDTO
  // Allow() is used to avoid strict validation on the map structure itself.
  @ValidateNested()
  @Type(() => ActivityDTO)
  @Allow() // Accepts whatever shape; transformation logic is handled elsewhere
  activities: Map<number, ActivityDTO>;
}
