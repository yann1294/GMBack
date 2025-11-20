import { Booking } from '../dao/booking.entity';
import { Expose, instanceToPlain, Type } from 'class-transformer';
import { IsIn, IsOptional, ValidateNested } from 'class-validator';
import { Tourist } from './helper.vo';
import { BookingStatus, status } from '../utils/consts.utils';

/**
 * BookingVO
 * - Value Object for booking operations at the boundary (controller/service).
 * - Handles validation and conversion to Booking entity.
 */
export class BookingVO {
  @Expose({ name: 'id' })
  @IsOptional()
  private _id: string;
  @Expose({ name: 'status' })
  @IsIn(status)
  @IsOptional()
  private _status: string;
  @Expose({ name: 'bookedOn' })
  @IsOptional()
  private _bookedOn: Date;
  // Map keyed by tourist id → Tourist
  @Expose({ name: 'tourist' })
  @IsOptional()
  @Type(() => Tourist)
  @ValidateNested()
  private _tourist: Map<string, Tourist>;
  // If present, booking is for a single tour
  @Expose({ name: 'tour' })
  @IsOptional()
  private _tour?: string;
  // If present, booking is for a package
  @Expose({ name: 'tourPackage' })
  @IsOptional()
  private _tourPackage?: string;
  // Getters / setters expose the internal fields in a controlled way
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

  /**
   * Convert VO → Booking entity.
   * - Derives booking type from whether tour or tourPackage is set.
   * - Chooses appropriate resource id (tour or package).
   */
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
  /**
   * Convert VO to a plain JS object (for logging or serialization).
   */
  toObject(): object {
    return instanceToPlain(this);
  }
}
