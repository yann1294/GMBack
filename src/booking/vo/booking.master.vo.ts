import { Booking } from '../dao/booking.entity';
import { Expose, instanceToPlain, Type } from 'class-transformer';
import { IsIn, IsOptional, ValidateNested } from 'class-validator';
import { Tourist } from './helper.vo';

export class BookingVO {
  @Expose({ name: 'id' })
  @IsOptional()
  private _id: string;
  @Expose({ name: 'status' })
  @IsIn(["in-process", "full", "completed", "canceled"])
  @IsOptional()
  private _status: string;
  @Expose({ name: 'bookedOn' })
  @IsOptional()
  private _bookedOn: Date;
  @Expose({ name: 'tourist' })
  @IsOptional()
  @Type(() => Tourist)
  @ValidateNested()
  private _tourist: Map<string, Tourist>;
  @Expose({ name: 'tour' })
  @IsOptional()
  private _tour?: string;
  @Expose({ name: 'tourPackage' })
  @IsOptional()
  private _tourPackage?: string;

  @Expose()
  getId(): string {
    return this._id;
  }

  setId(id: string): void {
    this._id = id;
  }

  // Getter and Setter for status
  @Expose()
  getStatus(): string {
    return this._status;
  }

  setStatus(status: string): void {
    this._status = status;
  }

  // Getter and Setter for bookedOn
  @Expose()
  getBookedOn(): Date {
    return this._bookedOn;
  }

  setBookedOn(bookedOn: Date): void {
    this._bookedOn = bookedOn;
  }

  // Getter and Setter for tourist
  @Expose()
  getTourist(): Map<string, Tourist> {
    return this._tourist;
  }

  setTourist(tourist: Map<string, Tourist>): void {
    this._tourist = tourist;
  }

  // Getter and Setter for tour
  @Expose()
  getTour(): string {
    return this._tour;
  }

  setTour(tour: string): void {
    this._tour = tour;
  }

  // Getter and Setter for tourPackage
  @Expose()
  getTourPackage(): string {
    return this._tourPackage;
  }

  setTourPackage(tourPackage: string): void {
    this._tourPackage = tourPackage;
  }

  toEntity(): Booking {
    return new Booking(
      this._id,
      this._status,
      this._bookedOn === undefined ? this._bookedOn : new Date(this._bookedOn),
      this._tourist,
      this._tour === undefined ? 'package' : 'tour',
      this._tour ?? this._tourPackage,
    );
  }

  toObject(): object {
    return instanceToPlain(this);
  }
}
