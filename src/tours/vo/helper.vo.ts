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
  ITourLocation,
  IUser,
  ITransportation,
} from 'src/types';

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

  toString(): string {
    return `GeoPoint(latitude=${this.latitude}, longitude=${this.longitude})`;
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

  toString(): string {
    return `
    ActivityLocation(
      name=${this.name},
      city=${this.city},
      country=${this.country},
      address=${this.address},
      location=${this.location.toString()}
    )`;
  }
}

export class TourLocation implements ITourLocation {
  @IsString()
  name: string;

  @IsString()
  city: string;

  @IsString()
  country: string;
}

export class Transportation implements ITransportation {
  @IsDateString()
  arrivalTime: Date;

  @IsDateString()
  departureTime: Date;

  @IsString()
  type: string;

  toString(): string {
    return `
    Transportation(
      arrivalTime=${this.arrivalTime},
      departureTime=${this.departureTime},
      type=${this.type}
    )`;
  }
}

export class Accommodation implements IAccommodation {
  @IsString()
  type: string;

  @IsString()
  name: string;

  toString(): string {
    return `Accommodation(type='${this.type}', name='${this.name}')`;
  }
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

  toString() {
    return `
    Activity(
      id=${this.id},
      name=${this.name},
      durationHours=${this.durationHours},
      location=${this.location.toString()}
      transportation=${this.transportation.toString()},
      accommodation=${this.accommodation.toString()}
    )`;
  }
}

export class User implements IUser {
  @IsString()
  private _name: string;

  public get name(): string {
    return this._name;
  }
  public set name(value: string) {
    this._name = value;
  }
}
