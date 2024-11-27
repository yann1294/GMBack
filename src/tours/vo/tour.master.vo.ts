import { Tour } from '../entities/tour.entity';
import { Expose, Type } from 'class-transformer';
import { Activity, TourLocation, User } from './helper.vo';

export class TourVO {
  @Expose({ name: 'id' }) private _id: string;
  @Expose({ name: 'name' }) private _name: string;
  @Expose({ name: 'location' }) private _location: TourLocation;
  @Expose({ name: 'price' }) private _price: number;
  @Expose({ name: 'durationDays' }) private _durationDays: number;
  @Expose({ name: 'discount' }) private _discount: number;
  @Expose({ name: 'isAvailable' }) private _isAvailable: boolean;
  @Expose({ name: 'guide' }) private _guide: User;
  @Expose({ name: 'activities' })
  @Type(() => Activity)
  private _activities: Map<number, Activity>;

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
      this._isAvailable,
      this._guide,
      this._activities,
    );
  }
}
