import { Tour } from '../dao/tour.entity';
import {
  Expose,
  instanceToPlain,
  plainToInstance,
  Transform,
  Type,
} from 'class-transformer';
import { Activity, TourLocation, User } from './helper.vo';
import {
  IsArray,
  IsDateString,
  IsOptional,
  IsString,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { FieldValue } from 'firebase-admin/firestore';
import { IsNotEmptyString } from 'src/user-management/utils/is-not-empty-string.decorator';

/**
 * TourVO
 * - Value object for the Tour aggregate.
 * - Handles validation, transformation, and mapping to the Tour entity.
 */
export class TourVO {
  @Expose({ name: 'id' })
  @IsOptional()
  private _id: string;

  @Expose({ name: 'name' })
  @IsOptional()
  private _name: string;

  // High-level tour location
  @Expose({ name: 'location' })
  @IsOptional()
  private _location: TourLocation;

  // Base price for the tour
  @Expose({ name: 'price' })
  @IsOptional()
  private _price: number;

  // Date of the tour (string format, later converted to Date)
  @Expose({ name: 'date' })
  @IsDateString()
  @IsOptional()
  public _date: string;

  // URLs of images attached to the tour
  @Expose({ name: 'images' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  public _images: string[];

  // Duration in days
  @Expose({ name: 'durationDays' })
  @IsOptional()
  private _durationDays: number;

  // Discount percentage, unconstrained here (you could add Min/Max if needed)
  @Expose({ name: 'discount' })
  @IsOptional()
  private _discount: number;

  // Available seats count
  @Expose({ name: 'numberOfSeats' })
  @IsOptional()
  private _numberOfSeats: number;

  // Description / details of the tour
  @Expose({ name: 'description' })
  @IsOptional()
  private _description: string;

  // Availability flag
  @Expose({ name: 'isAvailable' })
  @IsOptional()
  private _isAvailable: boolean;

  // Guide identifier (e.g. user id); optional but must be a non-empty string if present
  @Expose({ name: 'guide' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  private _guide: string;

  // Activities are stored as a Map<index, Activity>
  // Transform block normalises input (plain object) into a Map.
  @Expose({ name: 'activities' })
  // 1.  Pass the value straight through. If it isn't a Map yet, normalise.
  @Transform(
    ({ value }) => {
      if (value instanceof Map) return value;
      if (value && typeof value === 'object') {
        return new Map(Object.entries(value).map(([k, v]) => [Number(k), v]));
      }
      return new Map<number, Activity>();
    },
    { toClassOnly: true },
  )
  @IsOptional()
  private _activities: Map<number, Activity>;
  // Unused field; can be used as a cache/placeholder if needed
  tourVo: {};

  // Getters
  // Getters (exposed for serialization and external usage)
  @Expose()
  get id(): string {
    return this._id;
  }

  @Expose()
  get name(): string {
    return this._name;
  }

  @Expose()
  get location(): TourLocation {
    return this._location;
  }

  @Expose()
  get price(): number {
    return this._price;
  }

  @Expose()
  get date(): string {
    return this._date;
  }

  @Expose()
  get images(): string[] {
    return this._images;
  }

  @Expose()
  get durationDays(): number {
    return this._durationDays;
  }

  @Expose()
  get discount(): number {
    return this._discount;
  }

  @Expose()
  get numberOfSeats(): number {
    return this._numberOfSeats;
  }

  @Expose()
  get description(): string {
    return this._description;
  }

  @Expose()
  get isAvailable(): boolean {
    return this._isAvailable;
  }

  @Expose()
  get guide(): string {
    return this._guide;
  }

  @Expose()
  get activities(): Map<number, Activity> {
    return this._activities;
  }

  // Setters
  set id(value: string) {
    this._id = value;
  }

  set name(value: string) {
    this._name = value;
  }

  set location(value: TourLocation) {
    this._location = value;
  }

  set price(value: number) {
    this._price = value;
  }

  set date(value: string) {
    this._date = value;
  }

  set images(value: string[]) {
    this._images = value;
  }

  set durationDays(value: number) {
    this._durationDays = value;
  }

  set discount(value: number) {
    this._discount = value;
  }

  set numberOfSeats(value: number) {
    this._numberOfSeats = value;
  }

  set description(value: string) {
    this._description = value;
  }

  set isAvailable(value: boolean) {
    this._isAvailable = value;
  }

  set guide(value: string) {
    this._guide = value;
  }

  set activities(value: Map<number, Activity>) {
    this._activities = value;
  }

  /**
   * Map this VO to a Tour persistence entity.
   * This is the main handoff point to the DAO layer.
   */
  toEntity(): Tour {
    let tour: Tour = new Tour(
      this._id,
      this._name,
      this._location,
      this._price,
      this._durationDays,
      this._discount,
      this._numberOfSeats,
      this._description,
      this._isAvailable,
      this._activities,
      this._date ? new Date(this._date) : undefined,
    );
    // Fields not passed through the constructor are set explicitly
    tour.guide = this._guide;
    tour.images = this._images;
    return tour;
  }

  /**
   * Convert VO into a plain serializable object.
   * Useful for returning from controllers or writing to Firestore.
   */
  toObject(): object {
    return instanceToPlain(this);
  }
}
