import {
  IsString,
  IsNotEmpty,
  ValidateNested,
  Min,
  IsInt,
  IsObject,
  IsDateString,
  IsOptional,
  IsNumberString,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { GMGeoPoint } from 'src/tours/vo/helper.vo';

/**
 * DTO for the transportation details of an activity.
 * Holds timing and type of transport between activities.
 */
class TransportationDTO {
  // Arrival time in ISO date format
  @IsDateString()
  arrivalTime: Date;

  // Departure time in ISO date format
  @IsDateString()
  departureTime: Date;

  // Transportation type (e.g. "bus", "car", "walk")
  @IsString()
  @IsNotEmpty()
  type: string;
}

/**
 * DTO for accommodation linked to an activity.
 */
class AccommodationDTO {
  // Accommodation type (e.g. "hotel", "guesthouse")
  @IsString()
  @IsNotEmpty()
  type: string;

  // Accommodation name
  @IsString()
  @IsNotEmpty()
  name: string;
}

/**
 * DTO for the location of an activity.
 * Includes nested GeoPoint (lat/lng) through GMGeoPoint.
 */
export class ActivityLocationDTO {
  // Location name (e.g. "Eiffel Tower")
  @IsString()
  @IsNotEmpty()
  name: string;

  // City of the activity
  @IsString()
  @IsNotEmpty()
  city: string;

  // Country of the activity
  @IsString()
  @IsNotEmpty()
  country: string;

  // Full address
  @IsString()
  @IsNotEmpty()
  address: string;

  // Geographical coordinates for the activity
  @IsObject()
  @ValidateNested()
  @Type(() => GMGeoPoint)
  location: GMGeoPoint;
}

/**
 * DTO representing a single activity within a tour.
 */
export class ActivityDTO {
  // Activity ID (index within the tour)
  @IsInt()
  id: number;

  // Activity name
  @IsString()
  @IsNotEmpty()
  name: string;

  // Duration of the activity in hours (must be >= 1)
  @IsInt()
  @Min(1)
  durationHours: number;

  // Nested location details for the activity
  @IsObject()
  @ValidateNested()
  @Type(() => ActivityLocationDTO)
  location: ActivityLocationDTO;

  // Optional transportation details
  @IsObject()
  @ValidateNested()
  @IsOptional()
  @Type(() => TransportationDTO)
  transportation: TransportationDTO;

  // Optional accommodation details
  @IsObject()
  @ValidateNested()
  @IsOptional()
  @Type(() => AccommodationDTO)
  accommodation: AccommodationDTO;
}

// TODO: Add activity description
