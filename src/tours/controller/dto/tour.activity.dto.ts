import {
  IsString, IsNotEmpty,
  ValidateNested,
  Min,
  IsInt, IsObject,
  IsDateString,
  IsOptional,
  IsNumberString,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { GMGeoPoint } from 'src/tours/vo/helper.vo';

class TransportationDTO {
  @IsDateString()
  arrivalTime: Date;

  @IsDateString()
  departureTime: Date;

  @IsString()
  @IsNotEmpty()
  type: string;
}

class AccommodationDTO {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}

export class ActivityLocationDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  address: string;


  @IsObject()
  @ValidateNested()
  @Type(() => GMGeoPoint)
  location: GMGeoPoint;
}

export class ActivityDTO {
  @IsInt()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @Min(1)
  durationHours: number;

  @IsObject()
  @ValidateNested()
  @Type(() => ActivityLocationDTO)
  location: ActivityLocationDTO;

  @IsObject()
  @ValidateNested()
  @IsOptional()
  @Type(() => TransportationDTO)
  transportation: TransportationDTO;

  @IsObject()
  @ValidateNested()
  @IsOptional()
  @Type(() => AccommodationDTO)
  accommodation: AccommodationDTO;
}

// TODO: Add activity description