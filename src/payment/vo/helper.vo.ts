import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNumber,
  IsObject,
  IsString,
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

export class TourLocation implements ILocation {
  @IsString()
  public name: string;

  @IsString()
  public city: string;

  @IsString()
  public country: string;
}

export class Transportation {
  @IsDateString()
  arrivalTime: string;

  @IsDateString()
  departureTime: string;

  @IsString()
  type: string;
}

export class Accommodation implements IAccommodation {
  @IsString()
  type: string;

  @IsString()
  name: string;
}

export class Activity implements IActivity {
  @IsInt()
  id: number;

  @IsString()
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
  name: string;
}
