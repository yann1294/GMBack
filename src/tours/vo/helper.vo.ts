import { Expose, Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNumber,
  IsObject,
  IsString,
  IsNotEmpty,
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
  ITransportation,
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

  toString(): string {
    return `GeoPoint(latitude=${this.latitude}, longitude=${this.longitude})`;
  }
}

export class ActivityLocation implements IActivityLocation {
  @Expose()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  city: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  country: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  address: string;

  @Expose()
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

export class TourLocation implements ILocation {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  toString(): string {
    return `
      TourLocation(
        name=${this.name}
        city=${this.city}
        country=${this.country}
      )
    `;
  }
}

export class PackageLocation implements ILocation {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  toString(): string {
    return `
      PackageLocation(
        name=${this.name}
        city=${this.city}
        country=${this.country}
      )
    `;
  }
}

export class Transportation implements ITransportation {
  @Expose()
  @IsDateString()
  arrivalTime: Date;

  @Expose()
  @IsDateString()
  departureTime: Date;

  @Expose()
  @IsString()
  @IsNotEmpty()
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
  @Expose()
  @IsString()
  @IsNotEmpty()
  type: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  name: string;

  toString(): string {
    return `Accommodation(type='${this.type}', name='${this.name}')`;
  }
}

export class Activity implements IActivity {
  @Expose()
  @IsInt()
  id: number;

  @Expose()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Expose()
  @IsInt()
  @Min(1)
  durationHours: number;

  @Expose()
  @IsObject()
  @ValidateNested()
  @Type(() => ActivityLocation)
  location: ActivityLocation;

  @Expose()
  @IsObject()
  @ValidateNested()
  @Type(() => Transportation)
  transportation: Transportation;

  @Expose()
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
  @IsNotEmpty()
  private _name: string;

  public get name(): string {
    return this._name;
  }
  public set name(value: string) {
    this._name = value;
  }
}
