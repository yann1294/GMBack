import { Tour } from '../dao/tour.entity';
import { Expose, instanceToPlain, Type } from 'class-transformer';
import { Activity, TourLocation, User } from './helper.vo';
import { IsOptional } from 'class-validator';
import { FieldValue } from 'firebase-admin/firestore';

export class TourVO {
  @Expose({ name: 'id' })
  @IsOptional()
  private _id: string;

  @Expose({ name: 'name' })
  @IsOptional()
  private _name: string;

  @Expose({ name: 'location' })
  @IsOptional()
  private _location: TourLocation;

  @Expose({ name: 'price' })
  @IsOptional()
  private _price: number;

  @Expose({ name: 'durationDays' })
  @IsOptional()
  private _durationDays: number;

  @Expose({ name: 'discount' })
  @IsOptional()
  private _discount: number;

  @Expose({ name: 'numberOfSeats' })
  @IsOptional()
  private _numberOfSeats: number;

  @Expose({ name: 'description' })
  @IsOptional()
  private _description: string;

  @Expose({ name: 'isAvailable' })
  @IsOptional()
  private _isAvailable: boolean;

  @Expose({ name: 'guide' })
  @IsOptional()
  private _guide: User;

  @Expose({ name: 'activities' })
  @Type(() => Activity)
  @IsOptional()
  private _activities: Map<number, Activity>;
  tourVo: {};

  // Getters
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
  get guide(): User {
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

  set guide(value: User) {
    this._guide = value;
  }

  set activities(value: Map<number, Activity>) {
    this._activities = value;
  }

  toEntity(): Tour {
    return new Tour(
      this._id,
      this._name,
      this._location,
      this._price,
      this._durationDays,
      this._discount,
      this._numberOfSeats,
      this._description,
      this._isAvailable,
      this._guide,
      this._activities,
    );
  }

  toObject(): object {
    return instanceToPlain(this);
  }
}
