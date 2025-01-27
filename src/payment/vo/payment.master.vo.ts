import { IsString, IsNotEmpty,  IsNumber, IsIn, IsUUID, IsDateString, IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';
import { Payment } from '../dao/payment.entity';

export class PaymentVO {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Expose({ name: 'id' })
  private _id: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Expose({ name: 'resourceId' })
  private _resourceId: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Expose({ name: 'resourceType' })
  private _resourceType: string;

  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'gateway' })
  @IsIn(['stripe', 'paypal'])
  private _gateway: string;

  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'paymentId' })
  private _paymentId: string;

  @IsNumber()
  @Expose({ name: 'amount' })
  private _amount: number;
  private _sessionId: string;

  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'currency' })
  private _currency: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['pending', 'completed', 'canceled', 'refunded', 'refund-in-progress', 'in-progress'])
  @Expose({ name: 'status' })
  private _status: string;

  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'bookingId' })
  private _bookingId: string;

  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'userId' })
  private _userId: string;

  @IsDateString()
  @Expose({ name: 'createdAt' })
  private _createdAt: string;
  private _receipt: string;

  @IsDateString()
  @Expose({ name: 'updatedAt' })
  private _updatedAt: string;

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get resourceId(): string {
    return this._resourceId;
  }

  set resourceId(value: string) {
    this.resourceId = value;
  }

  get resourceType(): string {
    return this._resourceType;
  }

  set resourceType(value: string) {
    this.resourceType = value;
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

  get receipt(): string {
    return this._receipt;
  }

  set receipt(value: string) {
    this._receipt = value;
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

  get sessionId(): string {
    return this._sessionId;
  }

  set sessionId(value: string) {
    this._sessionId = value;
  }

  toEntity(): Payment {
    return new Payment(
      this._id,
      this._sessionId,
      this._gateway,
      this._paymentId,
      this._resourceType,
      this._resourceId,
      this._amount,
      this._currency,
      this._status,
      this._bookingId,
      this._userId,
      this._receipt,
      this._createdAt,
      this._updatedAt
    );
  }
}