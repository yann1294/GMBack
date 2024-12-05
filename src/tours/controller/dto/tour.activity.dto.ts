import {
    IsString,
    ValidateNested,
    Min,
    IsInt, IsObject,
    IsOptional,
    IsDateString,
  } from 'class-validator';
import { Type } from 'class-transformer';
import { GMGeoPoint } from 'src/tours/vo/helper.vo';

class TransportationDTO {
    @IsDateString()
    @IsOptional()
    arrivalTime: Date;
  
    @IsDateString()
    @IsOptional()
    departureTime: Date;
  
    @IsString()
    @IsOptional()
    type: string;
  }
  
  class AccommodationDTO {
    @IsString()
    @IsOptional()
    type: string;
  
    @IsString()
    @IsOptional()
    name: string;
  }

  export class ActivityLocationDTO {
    @IsString()
    @IsOptional()
    name: string;
  
    @IsString()
    @IsOptional()
    city: string;
  
    @IsString()
    @IsOptional()
    country: string;
    
    @IsString()
    @IsOptional()    
    address: string;

    
    @IsObject()
    @IsOptional()
    @ValidateNested()
    @Type(() => GMGeoPoint)
    location: GMGeoPoint;
  }
  
export class ActivityDTO {
    @IsInt()
    @IsOptional()
    id: number;
  
    @IsString()
    @IsOptional()
    name: string;
  
    @IsInt()
    @Min(1)
    @IsOptional()
    durationHours: number;
  
    @IsObject()
    @ValidateNested()
    @IsOptional()
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
  