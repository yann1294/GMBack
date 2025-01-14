import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNumber,
  IsObject,
  IsString, IsNotEmpty, 
  Min,
  ValidateNested,
} from 'class-validator';

import { GeoPoint } from 'firebase-admin/firestore';
import {
  IAccommodation,
  IActivity,
  IActivityLocation,
  ILocation,
  IUser,
} from 'src/shared/types';

export class GMGeoPoint implements GeoPoint {
  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
  constructor(latitude: number, longitude: number) {
    this.latitude = latitude;
    this.longitude = longitude;
  }

  isEqual(other: GeoPoint): boolean {
    return this.latitude == other.latitude && this.longitude == other.longitude;
  }
}

export class ActivityLocation implements IActivityLocation {
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

export class TourLocation implements ILocation {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  public city: string;

  @IsString()
  @IsNotEmpty()
  public country: string;
}

export class Transportation {
  @IsDateString()
  arrivalTime: string;

  @IsDateString()
  departureTime: string;

  @IsString()
  @IsNotEmpty()
  type: string;
}

export class Accommodation implements IAccommodation {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}

export class Activity implements IActivity {
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
  @Type(() => ActivityLocation)
  location: ActivityLocation;

  @IsObject()
  @ValidateNested()
  @Type(() => Transportation)
  transportation: Transportation;

  @IsObject()
  @ValidateNested()
  @Type(() => Accommodation)
  accommodation: Accommodation;
}

export class User implements IUser {
  @IsString()
  @IsNotEmpty()
  name: string;
}
