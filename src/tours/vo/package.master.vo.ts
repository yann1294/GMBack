import { Expose, instanceToPlain } from 'class-transformer';
import { PackageLocation, User } from './helper.vo';
import { IsOptional } from 'class-validator';
import { Package } from '../dao/package.entity';
import { TourVO } from './tour.master.vo';

export class PackageVO {
  @Expose({ name: 'id' })
  @IsOptional()
  private _id: string;

  @Expose({ name: 'packageName' })
  @IsOptional()
  private _packageName: string;

  @Expose({ name: 'tours' })
  @IsOptional()
  private _tours: TourVO[];

  @Expose({ name: 'packageLocation' })
  @IsOptional()
  private _packageLocation: PackageLocation;

  @Expose({ name: 'packagePrice' })
  @IsOptional()
  private _packagePrice: number;

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

  @Expose({ name: 'images' })
  @IsOptional()
  private _images: string[];

  // getters & setters
  @Expose()
  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  @Expose()
  get packageName(): string {
    return this._packageName;
  }

  set packageName(value: string) {
    this._packageName = value;
  }

  @Expose()
  get tours(): TourVO[] {
    return this._tours;
  }

  set tours(value: TourVO[]) {
    this._tours = value;
  }

  @Expose()
  get packageLocation(): PackageLocation {
    return this._packageLocation;
  }

  set packageLocation(value: PackageLocation) {
    this._packageLocation = value;
  }

  @Expose()
  get packagePrice(): number {
    return this._packagePrice;
  }

  set packagePrice(value: number) {
    this._packagePrice = value;
  }

  @Expose()
  get images(): string[] {
    return this._images;
  }

  set images(value: string[]) {
    this._images = value;
  }

  @Expose()
  get durationDays(): number {
    return this._durationDays;
  }
  set durationDays(value: number) {
    this._durationDays = value;
  }
  @Expose()
  get guide(): User {
    return this._guide;
  }
  set guide(value: User) {
    this._guide = value;
  }

  @Expose()
  get isAvailable(): boolean {
    return this._isAvailable;
  }
  set isAvailable(value: boolean) {
    this._isAvailable = value;
  }

  @Expose()
  get description(): string {
    return this._description;
  }
  set description(value: string) {
    this._description = value;
  }

  @Expose()
  get discount(): number {
    return this._discount;
  }
  set discount(value: number) {
    this._discount = value;
  }

  @Expose()
  get numberOfSeats(): number {
    return this._numberOfSeats;
  }
  set numberOfSeats(value: number) {
    this._numberOfSeats = value;
  }

  toEntity(): Package {
    return new Package(
      this._id,
      this._packageName,
      this._packageLocation,
      this._packagePrice,
      this._images,
      this._durationDays,
      this._discount,
      this._numberOfSeats,
      this._description,
      this._isAvailable,
      this._guide,
    );
  }
  //  TODO: add description
  toObject(): object {
    return instanceToPlain(this);
  }
}
