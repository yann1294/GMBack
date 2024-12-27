import { IsString, IsNumber, IsIn, IsUUID, IsDateString, IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';

export class PaymentVO {
  @IsString()
  @IsOptional()
  @Expose({ name: 'id' })
  private _id: string;

  @IsString()
  @Expose({ name: 'gateway' })
  private _gateway: string;

  @IsString()
  @Expose({ name: 'paymentId' })
  private _paymentId: string;

  @IsNumber()
  @Expose({ name: 'amount' })
  private _amount: number;

  @IsString()
  @Expose({ name: 'currency' })
  private _currency: string;

  @IsString()
  @IsIn(['pending', 'completed', 'canceled', 'refunded', 'refund-in-progress'])
  @Expose({ name: 'status' })
  private _status: string;

  @IsString()
  @Expose({ name: 'bookingId' })
  private _bookingId: string;

  @IsString()
  @Expose({ name: 'userId' })
  private _userId: string;

  @IsDateString()
  @Expose({ name: 'createdAt' })
  private _createdAt: string;

  @IsDateString()
  @Expose({ name: 'updatedAt' })
  private _updatedAt: string;

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get gateway(): string {
    return this._gateway;
  }

  set gateway(value: string) {
    this._gateway = value;
  }

  get paymentId(): string {
    return this._paymentId;
  }

  set paymentId(value: string) {
    this._paymentId = value;
  }

  get amount(): number {
    return this._amount;
  }

  set amount(value: number) {
    this._amount = value;
  }

  get currency(): string {
    return this._currency;
  }

  set currency(value: string) {
    this._currency = value;
  }

  get status(): string {
    return this._status;
  }

  set status(value: string) {
    this._status = value;
  }

  get bookingId(): string {
    return this._bookingId;
  }

  set bookingId(value: string) {
    this._bookingId = value;
  }

  get userId(): string {
    return this._userId;
  }

  set userId(value: string) {
    this._userId = value;
  }

  get createdAt(): string {
    return this._createdAt;
  }

  set createdAt(value: string) {
    this._createdAt = value;
  }

  get updatedAt(): string {
    return this._updatedAt;
  }

  set updatedAt(value: string) {
    this._updatedAt = value;
  }
}