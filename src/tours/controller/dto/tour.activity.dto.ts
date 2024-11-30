import {
    IsString,
    ValidateNested,
    Min,
    IsInt, IsObject,
    IsDateString,
  } from 'class-validator';
import { Type } from 'class-transformer';
import { GMGeoPoint } from 'src/tours/vo/helper.vo';

class TransportationDTO {
    @IsDateString()
    arrivalTime: Date;
  
    @IsDateString()
    departureTime: Date;
  
    @IsString()
    type: string;
  }
  
  class AccommodationDTO {
    @IsString()
    type: string;
  
    @IsString()
    name: string;
  }

  export class ActivityLocationDTO {
    @IsString()
    name: string;
  
    @IsString()
    city: string;
  
    @IsString()
    country: string;
    
    @IsString()    
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
    @Type(() => TransportationDTO)
    transportation: TransportationDTO;
  
    @IsObject()
    @ValidateNested()
    @Type(() => AccommodationDTO)
    accommodation: AccommodationDTO;
  }
  