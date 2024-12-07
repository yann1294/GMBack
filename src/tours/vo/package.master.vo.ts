import { Expose, instanceToPlain } from 'class-transformer';
import { PackageLocation, User } from './helper.vo';
import { IsArray, IsOptional, IsString, Max, Min } from 'class-validator';
import { Package } from '../dao/package.entity';
import { TourVO } from './tour.master.vo';

export class PackageVO {
  @Expose({ name: 'id' })
  @IsOptional()
  private _id: string;

  @Expose({ name: 'name' })
  @IsOptional()
  private _name: string;

  @Expose({ name: 'tours' })
  @IsString({each: true})
  @IsOptional()
  private _tours: string[];

  @Expose({ name: 'location' })
  @IsOptional()
  private _location: PackageLocation;

  @Expose({ name: 'price' })
  @IsOptional()
  private _price: number;

  @Expose({ name: 'durationDays' })
  @IsOptional()
  private _durationDays: number;

  @Expose({ name: 'discount' })
  @IsOptional()
  @Min(0)
  @Max(100)
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
  private _guide: string;

  @Expose({ name: 'images' })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  private _images: string[];

  @Expose({ name: 'date' })
  @IsOptional()
  private _date: string;

  // getters & setters
  @Expose()
  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  @Expose()
  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  @Expose()
  get tours(): string[] {
    return this._tours;
  }

  set tours(value: string[]) {
    this._tours = value;
  }

  @Expose()
  get location(): PackageLocation {
    return this._location;
  }

  set location(value: PackageLocation) {
    this._location = value;
  }

  @Expose()
  get price(): number {
    return this._price;
  }

  set price(value: number) {
    this._price = value;
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
  get guide(): string {
    return this._guide;
  }
  set guide(value: string) {
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

  @Expose()
  get date(): string {
    return this._date;
  }
  set date(value: string) {
    this._date = value;
  }

  toEntity(): Package {
    return new Package(
      this._id,
      this._name,
      this._location,
      this._price,
      this._durationDays,
      this._discount,
      this._numberOfSeats,
      this._description,
      this._isAvailable,
      this._date ? new Date(this._date) : undefined,
      this._guide,
      this._images,
      this._tours,
    );
  }
  //  TODO: add description
  toObject(): object {
    return instanceToPlain(this);
  }
}
